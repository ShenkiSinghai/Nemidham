"""Makes js/jain-calendar.js: the Jain calendar (tithi of every day, kalyanak, parv, vrat, panchak) calculated for
the mandir's place. Run by the GitHub workflow "Jain Calendar" on the 1st of every month (and by hand any time):
it always holds last year, this year and next year, so a new year appears by itself.
  python3 .github/jain-calendar/generate.py            (from the repository folder)
  python3 .github/jain-calendar/generate.py 2026 2027  (only these years)
How it works: the tithi at sunrise (udaya tithi) is found from the real positions of the Sun and the Moon
(Astronomy Engine, MIT licence); months are named the North-Indian (purnimant) way, as Jain panchangs do.
Kalyanak dates come from their tithi (kalyanak-tithi.json); parv / vrat from rules.py. The website's Google Sheet
tab "Jain Calendar" can still hide, change or add any item (README)."""
import os, sys, json, datetime as dt
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import cal, rules as R, engine as E

ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
cfg = json.load(open(os.path.join(HERE, "config.json"), encoding="utf-8"))
krules = []
for r in json.load(open(os.path.join(HERE, "kalyanak-tithi.json"), encoding="utf-8")):
    hi, en = R.TIR[r["tirthankar"]]
    krules.append({"slug": r["tirthankar"], "k": r["kalyanak"], "pm": r["month"], "paksha": r["paksha"], "tn": r["tithi"], "tir_hi": hi, "tir_en": en})

if len(sys.argv) >= 3: y0, y1 = int(sys.argv[1]), int(sys.argv[2])
else:
    y = dt.datetime.now(dt.timezone.utc).year
    y0, y1 = max(int(cfg.get("firstYear", y - 1)), y - 1), y + 1

res = cal.make(cfg["latitude"], cfg["longitude"], y0, y1, krules, R.PARV)
pm_names = {"hi": E.MONTH_HI, "en": E.MONTH_EN}
days = []
for x in res["daily"]:
    pre = 1 if x["m_hi"].startswith("प्रथम") else 2 if x["m_hi"].startswith("द्वितीय") else 0
    m = E.MONTH_EN.index(x["m_en"].replace("Pratham ", "").replace("Dwitiya ", ""))
    end = x["end_full"]; e = ""
    if end:
        e = end[11:16] if end[:10] == x["d"] else "+" + end[11:16]
    kk = []
    for k in x.get("ks", []):
        pk = 1 if k.startswith("कृष्ण") else 0
        nm = k.split(" ", 1)[1]
        tn = 15 if nm in ("पूर्णिमा", "अमावस्या") else E.TITHI_HI.index(nm) + 1
        kk.append(pk * 15 + tn)
    days.append([m + 12 * pre, 1 if x["p"] == "K" else 0, x["t"], e, E.NAK_EN.index(x["nk_en"]), x["sr"], x["ss"], 1 if x["vr"] else 0, kk])
out = {"v": 1, "made": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d"), "place": cfg.get("place", {}), "from": res["from"], "to": res["to"],
       "months": pm_names, "nak": {"hi": E.NAK_HI, "en": E.NAK_EN}, "tithi": {"hi": E.TITHI_HI, "en": E.TITHI_EN},
       "days": days, "panchak": res["panchak"],
       "events": [[e["date"], e["type"], e["id"], e["title_hi"], e["title_en"], e["note_hi"], e["note_en"]] for e in res["events"]]}
txt = ("/* Jain calendar, made by .github/jain-calendar/generate.py (do not edit by hand: it is made again every month).\n"
       "   To hide / change / add an item use the Google Sheet tab \"Jain Calendar\" (README). */\n"
       "window.JAIN_PANCHANG = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
p = os.path.join(ROOT, "js", "jain-calendar.js")
old = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
strip = lambda s: s.split('"made":"', 1)[0] + s.split('"made":"', 1)[-1][10:] if '"made":"' in s else s
if strip(old) == strip(txt): print("js/jain-calendar.js: no change (%s to %s)" % (res["from"], res["to"]))
else:
    open(p, "w", encoding="utf-8").write(txt)
    print("js/jain-calendar.js written: %s to %s, %d days, %d items, %d KB" % (res["from"], res["to"], len(days), len(out["events"]), len(txt.encode()) // 1024))
