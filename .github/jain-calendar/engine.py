"""Jain panchang engine: tithi at local sunrise (udaya tithi), amant month names, adhik maas, nakshatra, panchak,
Rohini, sunrise/sunset. Astronomy: Astronomy Engine (MIT, Don Cross). Ayanamsa: Lahiri (approx, linear)."""
import sys, json, math, datetime as dt
sys.path.insert(0, __import__("os").path.dirname(__file__))
import astronomy as A

IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
TITHI_HI = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी"]
TITHI_EN = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi"]
MONTH_HI = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"]
MONTH_EN = ["Chaitra", "Vaishakh", "Jyeshtha", "Ashadh", "Shravan", "Bhadrapad", "Ashwin", "Kartik", "Margashirsh", "Paush", "Magh", "Phalgun"]
NAK_HI = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद", "उत्तरा भाद्रपद", "रेवती"]
NAK_EN = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"]


def ayanamsa(t):   # Lahiri: 23.8531 deg at J2000, ~50.29"/year
    return 23.8531 + (t.ut / 365.25) * (50.29 / 3600.0)


def to_ist(t): return t.Utc().replace(tzinfo=dt.timezone.utc).astimezone(IST)
def atime(d): return A.Time.Make(d.year, d.month, d.day, d.hour, d.minute, d.second + d.microsecond / 1e6)
def ist_to_time(d): return atime(d.astimezone(dt.timezone.utc))


def sun_sid(t): return (A.SunPosition(t).elon - ayanamsa(t)) % 360
def moon_sid(t): return (A.EclipticGeoMoon(t).lon - ayanamsa(t)) % 360
def phase(t): return A.MoonPhase(t)   # moon - sun (tropical difference = sidereal difference)


def tithi_no(t): return int(phase(t) // 12) + 1   # 1..30 (1-15 shukla, 16-30 krishna; 30 = amavasya)


def next_phase_cross(target, t):
    r = A.SearchMoonPhase(target % 360, t, 3.0)
    return r


def new_moons(start, end):
    out = []; t = start.AddDays(-35)
    while True:
        r = A.SearchMoonPhase(0, t, 40)
        if r is None or r.ut > end.AddDays(35).ut: break
        out.append(r); t = r.AddDays(1)
    return out


def build(lat, lon, d0, d1, place, disp=None):
    """tithi at sunrise of (lat, lon); sunrise / sunset shown for disp = (lat, lon) of the mandir (default: the same place)"""
    obs = A.Observer(lat, lon, 0); dob = A.Observer(disp[0], disp[1], 0) if disp else obs
    t_start = ist_to_time(dt.datetime(d0.year, d0.month, d0.day, tzinfo=IST)); t_end = ist_to_time(dt.datetime(d1.year, d1.month, d1.day, tzinfo=IST))
    # lunar months (amant): new moon to new moon; name by sidereal sign of the Sun at the starting new moon
    nms = new_moons(t_start, t_end); months = []
    for a, b in zip(nms, nms[1:]):
        ra = int(sun_sid(a) // 30); rb = int(sun_sid(b) // 30)
        idx = (ra + 1) % 12; adhik = ra == rb
        months.append({"start": a, "end": b, "idx": idx, "adhik": adhik})
    days = []; d = d0
    while d <= d1:
        mid = ist_to_time(dt.datetime(d.year, d.month, d.day, 0, 0, tzinfo=IST))
        sr = A.SearchRiseSet(A.Body.Sun, obs, A.Direction.Rise, mid, 1.0)
        dsr = A.SearchRiseSet(A.Body.Sun, dob, A.Direction.Rise, mid, 1.0) if disp else sr
        ss = A.SearchRiseSet(A.Body.Sun, dob, A.Direction.Set, dsr, 1.0)
        tn = tithi_no(sr); ph = phase(sr)
        end = next_phase_cross(tn * 12, sr)   # when this tithi ends
        msid = moon_sid(sr); nak = int(msid // (360 / 27))
        nak_end = None
        mi = next((i for i, x in enumerate(months) if x["start"].ut <= sr.ut < x["end"].ut), None); m = months[mi] if mi is not None else None
        nxt = months[mi + 1] if mi is not None and mi + 1 < len(months) else None
        days.append({"date": d.isoformat(), "sunrise": to_ist(dsr).strftime("%H:%M"), "sunset": to_ist(ss).strftime("%H:%M"),
                     "tithi": tn, "tithi_end": to_ist(end).strftime("%Y-%m-%d %H:%M") if end else "", "phase": round(ph, 3),
                     "nak": nak, "moon_sid": round(msid, 3), "month": m["idx"] if m else None, "adhik": m["adhik"] if m else False, "next_adhik": nxt["adhik"] if nxt else False,
                     "_sr": sr.ut})
        d += dt.timedelta(days=1)
    # kshaya / vriddhi
    for i in range(1, len(days)):
        a, b = days[i - 1]["tithi"], days[i]["tithi"]
        step = (b - a) % 30
        days[i]["vriddhi"] = step == 0
        days[i]["kshaya_before"] = [(a % 30) + 1] if step == 2 else ([] if step < 2 else [((a + k - 1) % 30) + 1 for k in range(1, step)])
    # panchak periods (moon sidereal 296.667 - 360)
    return {"place": place, "lat": lat, "lon": lon, "days": days,
            "months": [{"start": to_ist(x["start"]).isoformat(), "end": to_ist(x["end"]).isoformat(), "name": MONTH_EN[x["idx"]], "adhik": x["adhik"]} for x in months]}


def panchak_periods(d0, d1):
    """start/end times when the Moon enters sidereal 300 (Kumbha = Dhanishtha 3rd pada) and leaves 360 (Revati end)"""
    out = []; t = ist_to_time(dt.datetime(d0.year, d0.month, d0.day, tzinfo=IST)).AddDays(-30); tend = ist_to_time(dt.datetime(d1.year, d1.month, d1.day, tzinfo=IST)).AddDays(2)
    def find(target, t0):   # moon sidereal longitude crossing target after t0 (moon moves ~13 deg/day)
        lo = t0
        while True:
            hi = lo.AddDays(0.25)
            a = (moon_sid(lo) - target) % 360; b = (moon_sid(hi) - target) % 360
            if a > 300 and b < 60: break
            lo = hi
            if lo.ut - t0.ut > 30: return None
        for _ in range(40):
            mid = A.Time((lo.ut + hi.ut) / 2)
            if (moon_sid(mid) - target) % 360 > 180: lo = mid
            else: hi = mid
        return hi
    while t.ut < tend.ut:
        s = find(300.0, t)
        if not s: break
        e = find(0.0, s)
        out.append((to_ist(s), to_ist(e))); t = e.AddDays(1)
    return [(a, b) for a, b in out if b.date() >= d0 and a.date() <= d1]


