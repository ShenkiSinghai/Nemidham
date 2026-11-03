"""Makes the Jain calendar files (tithi of every day, kalyanak, parv, vrat, panchak). Nothing is copied from any panchang:
everything is calculated (see "How it works" below).
  python3 .github/jain-calendar/generate.py         js/jain-calendar.js (last year, this year, next year) + js/jain-today.js
  python3 .github/jain-calendar/generate.py --all   the same + one file per year data/jain-calendar/YYYY.json (firstYear .. lastYear)
The GitHub workflow "Jain Calendar" runs the first on the 1st of every month (so a new year appears by itself) and --all
when these rules change.
How it works: the tithi at sunrise (udaya tithi) of the reference place (config.json: tithiPlace, a North-Indian place, as
Digambar panchangs are made there) is found from the real positions of the Sun and the Moon (Astronomy Engine, MIT licence).
Months are purnimant (North-Indian); in an adhik maas year the months are "pratham / dwitiya" and kalyanak / parv fall in the
nija month. Nakshatra and panchak use the Moon's sidereal position (Lahiri ayanamsa). Sunrise / sunset shown are of the mandir.
Kalyanak dates come from their tithi (kalyanak-tithi.json); parv / vrat from rules.py; fixed corrections from overrides.json.
The website's Google Sheet tab "Jain Calendar" can still hide, change or add any item (README part 5.40)."""
import os, sys, json, datetime as dt
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import cal, rules as R, engine as E

ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
cfg = json.load(open(os.path.join(HERE, "config.json"), encoding="utf-8"))
TLAT, TLON = cfg.get("tithiLatitude", cfg["latitude"]), cfg.get("tithiLongitude", cfg["longitude"])
DISP = (cfg["latitude"], cfg["longitude"]) if (TLAT, TLON) != (cfg["latitude"], cfg["longitude"]) else None
krules = []
for r in json.load(open(os.path.join(HERE, "kalyanak-tithi.json"), encoding="utf-8")):
    hi, en = R.TIR[r["tirthankar"]]
    krules.append({"slug": r["tirthankar"], "k": r["kalyanak"], "pm": r["month"], "paksha": r["paksha"], "tn": r["tithi"], "tir_hi": hi, "tir_en": en})
OVR = []
op = os.path.join(HERE, "overrides.json")
if os.path.exists(op): OVR = [o for o in json.load(open(op, encoding="utf-8")) if isinstance(o, dict) and not o.get("_help")]
NOW = dt.datetime.now(dt.timezone.utc)


def overrides(evs, y0, y1):
    """fixed corrections (same rules as the Sheet tab): id, or date + title_hi, finds the item; hidden hides it; other fields
    change it; an entry with a new id and a date adds an item"""
    for o in OVR:
        hit = [e for e in evs if (o.get("id") and e["id"] == o["id"]) or (o.get("match_date") and e["date"] == o["match_date"] and e["title_hi"] == o.get("match_title_hi"))]
        if hit:
            for e in hit:
                if o.get("hidden"): e["hidden"] = True
                for k in ("date", "type", "title_hi", "title_en", "note_hi", "note_en"):
                    if o.get(k): e[k] = o[k]
        elif o.get("id") and o.get("date") and str(y0) <= o["date"][:4] <= str(y1) and o.get("title_hi"):
            evs.append({"date": o["date"], "type": o.get("type", "other"), "id": o["id"], "title_hi": o["title_hi"], "title_en": o.get("title_en", o["title_hi"]), "note_hi": o.get("note_hi", ""), "note_en": o.get("note_en", "")})
    evs[:] = [e for e in evs if not e.get("hidden")]
    evs.sort(key=lambda e: e["date"])
    return evs


def calc(y0, y1):
    res = cal.make(TLAT, TLON, y0, y1, krules, R.PARV, disp=DISP)
    days = []
    for x in res["daily"]:
        pre = 1 if x["m_hi"].startswith("प्रथम") else 2 if x["m_hi"].startswith("द्वितीय") else 0
        m = E.MONTH_EN.index(x["m_en"].replace("Pratham ", "").replace("Dwitiya ", ""))
        end = x["end_full"]; e = ""
        if end: e = end[11:16] if end[:10] == x["d"] else "+" + end[11:16]
        kk = []
        for k in x.get("ks", []):
            pk = 1 if k.startswith("कृष्ण") else 0
            nm = k.split(" ", 1)[1]
            kk.append(pk * 15 + (15 if nm in ("पूर्णिमा", "अमावस्या") else E.TITHI_HI.index(nm) + 1))
        days.append([m + 12 * pre, 1 if x["p"] == "K" else 0, x["t"], e, E.NAK_EN.index(x["nk_en"]), x["sr"], x["ss"], 1 if x["vr"] else 0, kk])
    evs = overrides(res["events"], y0, y1)
    return res, days, evs


def pack(res, days, evs, names=True):
    o = {"v": 2, "place": cfg.get("place", {}), "tithiPlace": cfg.get("tithiPlace", cfg.get("place", {})), "from": res["from"], "to": res["to"],
         "days": days, "panchak": res["panchak"], "events": [[e["date"], e["type"], e["id"], e["title_hi"], e["title_en"], e["note_hi"], e["note_en"]] for e in evs]}
    if names: o.update({"months": {"hi": E.MONTH_HI, "en": E.MONTH_EN}, "nak": {"hi": E.NAK_HI, "en": E.NAK_EN}, "tithi": {"hi": E.TITHI_HI, "en": E.TITHI_EN}})
    return o


def write(rel, txt):
    p = os.path.join(ROOT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    old = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
    if old == txt: return False
    open(p, "w", encoding="utf-8").write(txt); return True


HEAD = ("/* Jain calendar, made by .github/jain-calendar/generate.py (calculated, not copied from any panchang; do not edit by hand:\n"
        "   it is made again every month). To hide / change / add an item use the Google Sheet tab \"Jain Calendar\" (README part 5.40). */\n")
y = NOW.year
first, last = int(cfg.get("firstYear", y - 1)), int(cfg.get("lastYear", y + 1))
y0, y1 = max(first, y - 1), y + 1
res, days, evs = calc(y0, y1)
ch = write("js/jain-calendar.js", HEAD + "window.JAIN_PANCHANG = " + json.dumps(pack(res, days, evs), ensure_ascii=False, separators=(",", ":")) + ";\n")
print("js/jain-calendar.js: %s (%s to %s, %d items)" % ("written" if ch else "no change", res["from"], res["to"], len(evs)))

# small file for every page: the tithi of each day from last week to about 5 months ahead (made again every month) (the "today" line) + the day's main items
start = (NOW + dt.timedelta(hours=5.5)).date() - dt.timedelta(days=7)
i0 = (start - dt.date.fromisoformat(res["from"])).days
rows = [[d[0], d[1], d[2]] for d in days[max(0, i0): i0 + 150]]
d0 = (dt.date.fromisoformat(res["from"]) + dt.timedelta(days=max(0, i0))).isoformat()
d1 = (dt.date.fromisoformat(d0) + dt.timedelta(days=len(rows) - 1)).isoformat()
ev = {}
for e in evs:
    if d0 <= e["date"] <= d1 and e["type"] in ("kalyanak", "parv"): ev.setdefault(e["date"], []).append([e["type"], e["title_hi"], e["title_en"]])
today = {"d0": d0, "rows": rows, "ev": ev, "months": {"hi": E.MONTH_HI, "en": E.MONTH_EN}, "tithi": {"hi": E.TITHI_HI, "en": E.TITHI_EN}}
ch = write("js/jain-today.js", "/* Today's tithi (made by .github/jain-calendar/generate.py every month; do not edit by hand) */\nwindow.JAIN_TODAY = " + json.dumps(today, ensure_ascii=False, separators=(",", ":")) + ";\n")
print("js/jain-today.js: %s (%s to %s)" % ("written" if ch else "no change", d0, d1))

if "--all" in sys.argv:
    n = 0
    for yy in range(first, last + 1):
        r2, d2, e2 = calc(yy, yy)
        if write("data/jain-calendar/%d.json" % yy, json.dumps(pack(r2, d2, e2, names=False), ensure_ascii=False, separators=(",", ":")) + "\n"): n += 1
    print("data/jain-calendar: %d to %d, %d files written" % (first, last, n))
