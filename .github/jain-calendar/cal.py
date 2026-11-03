"""Jain calendar from tithi rules. cal.make(lat, lon, year_from, year_to, kalyanak_rules, parv_rules) -> dict"""
import datetime as dt, collections
import engine as E

KN_HI = {"garbh": "गर्भ", "janm": "जन्म", "tap": "तप", "gyan": "ज्ञान", "moksh": "मोक्ष"}
KN_EN = {"garbh": "Garbh", "janm": "Janm", "tap": "Tap", "gyan": "Gyan", "moksh": "Moksh"}
MONTH_HI, MONTH_EN = E.MONTH_HI, E.MONTH_EN


def prepare(lat, lon, d0, d1, place="", disp=None):
    P = E.build(lat, lon, d0 - dt.timedelta(days=40), d1 + dt.timedelta(days=40), place, disp)
    days = P["days"]
    for x in days:
        t = x["tithi"]; m = x["month"]; k = t > 15
        x["pm"] = (m + 1) % 12 if (k and not x["adhik"]) else m           # purnimant month
        # adhik (pratham) block = krishna before an adhik amant month + the adhik shukla; the nija block follows
        x["padhik"] = (k and not x["adhik"] and x["next_adhik"]) or (not k and x["adhik"])
        x["paksha"] = "K" if k else "S"; x["tn"] = t - 15 if k else t
    for i in range(1, len(days)):
        step = (days[i]["tithi"] - days[i - 1]["tithi"]) % 30
        days[i]["vriddhi"] = step == 0
        days[i - 1]["kshaya"] = [((days[i - 1]["tithi"] + j - 1) % 30) + 1 for j in range(1, step)] if step >= 2 else []
    days[-1].setdefault("kshaya", [])
    # month block names (pratham / dvitiya in an adhik year)
    return P


def tithi_days(days, pm, paksha, tn, nija=True):
    """dates whose udaya tithi is (pm, paksha, tn); a kshaya tithi falls on the day it begins (the day that 'hosts' it)"""
    want = tn if paksha == "S" else tn + 15
    out = []
    for i, x in enumerate(days):
        if x.get("vriddhi"): continue                                  # a repeated tithi is kept on its first day
        if x["tithi"] == want and x["pm"] == pm and (x["padhik"] != nija): out.append(x["date"])
        elif want in x.get("kshaya", []):
            nx = days[i + 1] if i + 1 < len(days) else x
            # month of the kshaya tithi: the following day's month unless the tithi is the last of its paksha block
            ref = nx if (want <= 15) == (nx["tithi"] <= 15) else x
            if ref["pm"] == pm and (ref["padhik"] != nija): out.append(x["date"])
    return out


def ev(date, typ, eid, hi, en, note_hi="", note_en=""):
    return {"date": date, "type": typ, "id": eid, "title_hi": hi, "title_en": en, "note_hi": note_hi, "note_en": note_en}


def make(lat, lon, y_from, y_to, krules, prules, place="", disp=None):
    d0, d1 = dt.date(y_from, 1, 1), dt.date(y_to, 12, 31)
    P = prepare(lat, lon, d0, d1, place, disp); days = P["days"]
    lo, hi_ = d0.isoformat(), d1.isoformat()
    inr = lambda d: lo <= d <= hi_
    evs = []
    for x in days:
        if not inr(x["date"]): continue
        ts = [x["tithi"]] + x.get("kshaya", [])
        for t in ts:
            if t in (8, 14, 23, 29):
                pk_hi, pk_en = ("शुक्ल", "Shukla") if t <= 15 else ("कृष्ण", "Krishna")
                n = (t - 1) % 15
                evs.append(ev(x["date"], "tithi", "t-%s-%d" % (x["date"], t), "%s %s" % (pk_hi, E.TITHI_HI[n]), "%s %s" % (pk_en, E.TITHI_EN[n]),
                              "पर्व तिथि" + (" (क्षय तिथि, इसी दिन)" if t != x["tithi"] else ""), "Parv tithi" + (" (kshaya: kept on this day)" if t != x["tithi"] else "")))
        if E.NAK_EN[x["nak"]] == "Rohini":
            prev = next((y for y in days if y["date"] == (dt.date.fromisoformat(x["date"]) - dt.timedelta(days=1)).isoformat()), None)
            if not prev or E.NAK_EN[prev["nak"]] != "Rohini":
                evs.append(ev(x["date"], "vrat", "rohini-%s" % x["date"], "रोहिणी व्रत", "Rohini Vrat"))
    for r in krules:
        for d in tithi_days(days, r["pm"], r["paksha"], r["tn"]):
            if inr(d):
                evs.append(ev(d, "kalyanak", "%s-%s-%s" % (r["slug"], r["k"], d[:4]), "भगवान %s %s कल्याणक" % (r["tir_hi"], KN_HI[r["k"]]),
                              "Bhagwan %s %s Kalyanak" % (r["tir_en"], KN_EN[r["k"]])))
    for r in prules:
        for d in tithi_days(days, r["pm"], r["paksha"], r["tn"]):
            if inr(d):
                n = r.get("days", 1)
                evs.append(ev(d, r["type"], "%s-%s" % (r["id"], d[:4]), r["hi"] + (" प्रारंभ" if n > 1 else ""), r["en"] + (" begins" if n > 1 else ""),
                              ("%d दिन" % n) if n > 1 else "", ("%d days" % n) if n > 1 else ""))
    evs.sort(key=lambda e: (e["date"], ["parv", "kalyanak", "tithi", "vrat"].index(e["type"]) if e["type"] in ("parv", "kalyanak", "tithi", "vrat") else 9))
    seen = collections.Counter()   # a tithi can come twice in one calendar year (early Jan + late Dec): the 2nd gets "-2"
    for e in evs:
        seen[e["id"]] += 1
        if seen[e["id"]] > 1: e["id"] += "-%d" % seen[e["id"]]
    # daily rows with block names (pratham / dvitiya)
    daily = []; blk = None; prevname = None; blocks = []
    for x in days:
        if x["paksha"] == "K" and x["tn"] == 1 and not x.get("vriddhi"):
            blocks.append([x["date"], MONTH_EN[x["pm"]]])
    bname = {}
    for i, (d, nm) in enumerate(blocks):
        pre = ""
        if i + 1 < len(blocks) and blocks[i + 1][1] == nm: pre = "1"
        elif i > 0 and blocks[i - 1][1] == nm: pre = "2"
        bname[d] = pre
    cur = ""
    for x in days:
        if x["date"] in bname: cur = bname[x["date"]]
        if not inr(x["date"]): continue
        t = x["tithi"]; tn = x["tn"]
        nm_hi = "पूर्णिमा" if t == 15 else "अमावस्या" if t == 30 else E.TITHI_HI[tn - 1]
        nm_en = "Purnima" if t == 15 else "Amavasya" if t == 30 else E.TITHI_EN[tn - 1]
        pre_hi = {"1": "प्रथम ", "2": "द्वितीय "}.get(cur, ""); pre_en = {"1": "Pratham ", "2": "Dwitiya "}.get(cur, "")
        daily.append({"d": x["date"], "m_hi": pre_hi + MONTH_HI[x["pm"]], "m_en": pre_en + MONTH_EN[x["pm"]], "p": x["paksha"], "t": tn,
                      "t_hi": nm_hi, "t_en": nm_en, "end": x["tithi_end"][11:16] if x["tithi_end"][:10] == x["date"] else ("कल " + x["tithi_end"][11:16] if x["tithi_end"] else ""),
                      "end_full": x["tithi_end"], "nk_hi": E.NAK_HI[x["nak"]], "nk_en": E.NAK_EN[x["nak"]], "sr": x["sunrise"], "ss": x["sunset"],
                      "vr": bool(x.get("vriddhi")), "ks": [("%s %s" % ("शुक्ल" if k <= 15 else "कृष्ण", "पूर्णिमा" if k == 15 else "अमावस्या" if k == 30 else E.TITHI_HI[(k - 1) % 15])) for k in x.get("kshaya", [])]})
    pan = [[a.strftime("%Y-%m-%d %H:%M"), b.strftime("%Y-%m-%d %H:%M")] for a, b in E.panchak_periods(d0, d1)]
    return {"place": place, "lat": lat, "lon": lon, "from": lo, "to": hi_, "events": evs, "daily": daily, "panchak": pan, "_days": days}
