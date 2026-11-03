/* Sends mandir notifications through OneSignal. Run by .github/workflows/notify.yml (see README part 5.35).
   - When js/data.js changes: a new karyakram (of the current month), a new yojana, a new sandesh (announcement).
   - Reminders, at the time set in SITE.notify.auto.time (India time): on the day of a karyakram / Bhaktamar path,
     some days before it (daysBefore), and a list of the month's karyakram on monthStartDay.
     Bhaktamar reminders carry the date and the punyarjak families from the Google Sheet.
   - By hand: "Run workflow" on GitHub with your own title and message.
   Every automatic notification has a fixed id (OneSignal idempotency_key, earlier called external_id), so even if GitHub runs twice nothing is sent twice.
   It needs the GitHub secret ONESIGNAL_REST_API_KEY and SITE.notify.appId in js/data.js. */
"use strict";
var fs = require("fs"), vm = require("vm"), cp = require("child_process"), crypto = require("crypto");

var EVENT = process.env.EVENT_NAME || "", BEFORE = process.env.BEFORE || "", KEY = (process.env.ONESIGNAL_REST_API_KEY || "").trim();
var DRY = process.env.DRY_RUN === "1", AUTH = "Key";
var REPO = process.env.GITHUB_REPOSITORY || "owner/repo";
var SITE_URL = (process.env.SITE_URL || ("https://" + REPO.split("/")[0].toLowerCase() + ".github.io/" + REPO.split("/")[1] + "/")).replace(/\/?$/, "/");

function load(code) {
  var ctx = { window: {}, console: console }; ctx.window.window = ctx.window;
  try { vm.runInNewContext(code, ctx, { timeout: 2000 }); } catch (e) { console.log("Could not read data.js:", e.message); return null; }
  return ctx.window;
}
function L(v, l) { if (v == null) return ""; if (typeof v === "string") return v; return v[l] || v.hi || v.en || ""; }
function vis(a) { return (a || []).filter(function (x) { return x && !x.hidden; }); }
function pad(n) { return (n < 10 ? "0" : "") + n; }
var now = process.env.NOW_IST ? new Date(process.env.NOW_IST + "Z") : new Date(Date.now() + 5.5 * 3600 * 1000);   /* India time (NOW_IST only for testing) */
var TODAY = now.getUTCFullYear() + "-" + pad(now.getUTCMonth() + 1) + "-" + pad(now.getUTCDate()), THIS_MONTH = TODAY.slice(0, 7);
function niceDate(iso, l) {
  var d = new Date(iso + "T00:00:00Z"); if (isNaN(d)) return iso;
  return d.toLocaleDateString(l === "en" ? "en-IN" : "hi-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
}
function evKey(e, l) { return (e.date || "") + "|" + L(e.title, l); }
function yoKey(y) { return y.id || L(y.title, "hi") || L(y.title, "en"); }
/* visible entries that are real (not a SAMPLE template or an untouched spare card) */
function placeholder(x) {
  var s = [L(x.title, "hi"), L(x.title, "en"), L(x.short, "en"), L(x.text, "en")].join(" ");
  return /SAMPLE/.test(s) || /Write a one-line summary/i.test(s) || /^(Yojana|योजना)\s*\d+$/.test(L(x.title, "en").trim());
}
function real(a) { return vis(a).filter(function (x) { return !placeholder(x); }); }
function short(s, n) { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
function both(fn) { return { hi: fn("hi"), en: fn("en") }; }

/* a fixed UUID made from the notification's own key, so OneSignal drops a repeat of the same notification */
function uuidFor(key) {
  var h = crypto.createHash("sha1").update("nemidham|" + APP_ID + "|" + key).digest("hex");
  return h.slice(0, 8) + "-" + h.slice(8, 12) + "-5" + h.slice(13, 16) + "-" + ((parseInt(h.charAt(16), 16) & 3) | 8).toString(16) + h.slice(17, 20) + "-" + h.slice(20, 32);
}
/* a picture for the notification: a full https:// link, or a file of this website such as images/yojana/x.jpg */
function imageUrl(v) {
  v = String(v || "").trim(); if (!v) return "";
  if (/^https:\/\//i.test(v)) return v;
  if (/^http:\/\//i.test(v)) return "";   /* phones show only https pictures */
  return SITE_URL + v.replace(/^\.?\//, "");
}
/* the page link of a notification gets ?src=notify, so the app shows its opening animation */
function openUrl(u) { var h = u.indexOf("#"), base = h >= 0 ? u.slice(0, h) : u, hash = h >= 0 ? u.slice(h) : ""; return base + (base.indexOf("?") >= 0 ? "&" : "?") + "src=notify" + hash; }
function send(n) {
  var body = { app_id: APP_ID, target_channel: "push", included_segments: ["Total Subscriptions"],
    priority: 10,   /* "high": phones show it at once instead of holding it to save battery */
    headings: { en: n.title.en || n.title.hi, hi: n.title.hi || n.title.en },
    contents: { en: n.text.en || n.text.hi, hi: n.text.hi || n.text.en },
    url: openUrl(SITE_URL + (n.page || "")), chrome_web_icon: SITE_URL + "images/icon-192.png", firefox_icon: SITE_URL + "images/icon-192.png",
    chrome_web_badge: SITE_URL + "images/notify-badge.png" };   /* small white mandir shape in the phone's top bar (instead of a bell) */
  var img = imageUrl(n.image); if (img) { body.chrome_web_image = img; }   /* large picture inside the notification */
  if (n.key) body.idempotency_key = uuidFor(n.key);   /* OneSignal keeps it 30 days; the same id again = not sent again */
  console.log("Notification:", JSON.stringify({ title: body.headings, text: body.contents, url: body.url, image: body.chrome_web_image || "" }));
  if (DRY) return Promise.resolve();
  /* new OneSignal keys (os_v2_...) use "Key", older keys "Basic": the other one is tried when the first is refused (same as the Sheet's script) */
  function post(b, kind) {
    kind = kind || (/^os_v2_/.test(KEY) ? "Key" : AUTH);
    return fetch("https://api.onesignal.com/notifications", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": kind + " " + KEY }, body: JSON.stringify(b) })
      .then(function (r) { return r.text().then(function (t) { return { ok: r.ok, status: r.status, text: t }; }); })
      .then(function (r) {
        if ((r.status === 401 || r.status === 403) && /access denied|authorization|api key/i.test(r.text) && !/^os_v2_/.test(KEY) && kind === AUTH) {
          var other = AUTH === "Key" ? "Basic" : "Key";
          return post(b, other).then(function (r2) { if (r2.ok) AUTH = other; return r2.ok ? r2 : r; });
        }
        return r;
      });
  }
  return post(body).then(function (r) {
    if (!r.ok && /segment/i.test(r.text)) { body.included_segments = ["Subscribed Users"]; return post(body); }   /* older OneSignal apps use this name */
    return r;
  }).then(function (r) {
    /* a repeat normally gets the first answer back (ok); only a clear "already sent" error is skipped, any other error fails the run */
    if (!r.ok && body.idempotency_key && (r.status === 409 || /duplicate|already (been )?(sent|exists|used)/i.test(r.text))) { console.log("Already sent earlier (same notification), skipped."); return; }
    console.log("OneSignal answered:", r.status, r.text.slice(0, 300)); if (!r.ok) process.exitCode = 1;
  });
}

/* ---------- Bhaktamar path dates from the Google Sheet ---------- */
var MON_EN = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
var MON_HI = [["जनवरी"], ["फरवरी"], ["मार्च"], ["अप्रैल", "अप्रेल"], ["मई"], ["जून"], ["जुलाई"], ["अगस्त"], ["सितंबर", "सितम्बर"], ["अक्टूबर", "अक्तूबर"], ["नवंबर", "नवम्बर"], ["दिसंबर", "दिसम्बर"]];
function hiNorm(s) { return String(s).replace(/[़]/g, ""); }
function monthNum(v) {
  v = String(v || "").trim().toLowerCase().replace(/[.,]/g, ""); if (!v) return 0;
  if (/^\d{1,2}$/.test(v)) { var n = +v; return n >= 1 && n <= 12 ? n : 0; }
  if (/^[a-z]+$/.test(v)) return v.length >= 3 ? MON_EN.indexOf(v.slice(0, 3)) + 1 : 0;
  var h = hiNorm(v);
  for (var i = 0; i < 12; i++) for (var k = 0; k < MON_HI[i].length; k++) { var w = hiNorm(MON_HI[i][k]); if (h === w || (h.length >= 3 && w.indexOf(h) === 0)) return i + 1; }
  return 0;
}
function parseCSV(text) {
  var rows = [], row = [], cur = "", q = false, i, c; text = String(text || "").replace(/^\uFEFF/, "");
  for (i = 0; i < text.length; i++) {
    c = text.charAt(i);
    if (q) { if (c === '"') { if (text.charAt(i + 1) === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true; else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text.charAt(i + 1) === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
/* the same date rules as the website (js/main.js): normDate, rowYM, bhEntryDate, 2nd Sunday when no date is written */
function normDate(v) {
  v = String(v == null ? "" : v).trim(); var y, m, d, mt;
  if ((mt = v.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/))) { y = +mt[1]; m = +mt[2]; d = +mt[3]; }
  else if ((mt = v.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/))) { d = +mt[1]; m = +mt[2]; y = +mt[3]; }
  else return "";
  var t = new Date(Date.UTC(y, m - 1, d));
  if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) return "";
  return y + "-" + pad(m) + "-" + pad(d);
}
function rowYM(r) {
  var mc = String(r.month || r.mahina || "").trim(), yc = String(r.year || r.saal || "").trim(), mt, y = 0, m = 0;
  if ((mt = mc.match(/(\d{4})/))) { y = +mt[1]; mc = mc.replace(mt[1], " ").replace(/[-\/]/g, " ").trim(); }
  m = monthNum(mc.split(/\s+/)[0]) || monthNum(mc);
  if (!m && (mt = String(r.month || "").match(/^\d{1,2}[-\/](\d{4})$/))) { m = +String(r.month).split(/[-\/]/)[0]; y = +mt[1]; }
  if (!y && /^\d{4}$/.test(yc)) y = +yc;
  if (m) return (y || +TODAY.slice(0, 4)) + "-" + pad(m);
  var d = normDate(r.date);
  return d ? d.slice(0, 7) : "";
}
function secondSunday(y, m) { var d = new Date(Date.UTC(y, m - 1, 1)); return (7 - d.getUTCDay()) % 7 + 1 + 7; }
function bhDate(r) {
  var ym = rowYM(r); if (!ym) return "";
  var v = String(r.date == null ? "" : r.date).trim(), y = +ym.slice(0, 4), m = +ym.slice(5, 7), d;
  if (/^\d{1,2}$/.test(v)) { d = +v; return d >= 1 && new Date(Date.UTC(y, m - 1, d)).getUTCMonth() === m - 1 ? ym + "-" + pad(d) : ym + "-" + pad(secondSunday(y, m)); }
  return normDate(v) || ym + "-" + pad(secondSunday(y, m));
}
/* Bhaktamar dates with their punyarjak families: [{ date: "YYYY-MM-DD", names: { hi: [..], en: [..] } }] sorted by date */
function bhaktamarDates(site, url, local) {
  if (site.bhaktamarKaryakram === false) return Promise.resolve([]);
  function dates(rows) {
    var out = {};
    rows.forEach(function (r) {
      var d = bhDate(r); if (!d) return;
      var g = out[d] = out[d] || { date: d, names: { hi: [], en: [] } };
      var hi = r.name_hi || r.name || r.name_en || "", en = r.name_en || r.name || r.name_hi || "";
      if (hi) g.names.hi.push(hi); if (en) g.names.en.push(en);
    });
    return Object.keys(out).sort().map(function (k) { return out[k]; });
  }
  if (!url) return Promise.resolve(dates(vis(local).map(function (b) { return { month: b.month, year: b.year, date: b.date, name_hi: L(b.name, "hi"), name_en: L(b.name, "en") }; })));
  function fallback(why) { console.log("Could not read the Bhaktamar Google Sheet (" + why + "). Using window.BHAKTAMBAR from data.js instead."); return bhaktamarDates(site, "", local); }
  return fetch(url).then(function (r) { if (!r.ok) throw new Error("status " + r.status); return r.text(); }).then(function (t) {
    if (/^\s*<(!doctype|html)/i.test(t)) return fallback("not a published CSV link");
    var rows = parseCSV(t).filter(function (r) { return r.some(function (x) { return String(x).trim() !== ""; }); }); if (!rows.length) return [];
    var head = rows[0].map(function (h) { return String(h).trim().toLowerCase().replace(/\s+/g, "_"); });
    return dates(rows.slice(1).map(function (cells) {
      var r = {}; head.forEach(function (h, i) { if (h) r[h] = String(cells[i] == null ? "" : cells[i]).trim(); }); return r;
    }).filter(function (r) { return r.name_hi || r.name_en || r.name; }));
  }).catch(function (e) { return fallback(e && e.message); });
}


/* ---------- website content tabs of the Google Sheet (README part 5.37) ---------- */
function clean(v) { return String(v == null ? "" : v).replace(/[\u200B-\u200D\u2060\uFEFF]/g, "").replace(/\r/g, "").trim(); }
function isYes(v) { return /^(yes|y|haan|han|ha|true|1|✓|✔|हाँ|हां|हा)$/i.test(clean(v)); }
function tx(r, base) { var hi = clean(r[base + "_hi"]), en = clean(r[base + "_en"]), one = clean(r[base]); if (!hi && !en) hi = en = one; return { hi: hi || en, en: en || hi }; }
function sheetDate(v) {
  v = clean(v); var d = normDate(v), mt;
  if (d) return d;
  if ((mt = v.match(/^(\d{1,2})\s*[ -]?\s*([^\s\d,.-]+)[\s,.-]*(\d{4})$/))) { var m = monthNum(mt[2]); if (m) return normDate(mt[3] + "-" + m + "-" + mt[1]); }
  return "";
}
/* rows of one published tab: [{ header: value }], or null when it cannot be read */
function sheetRows(url) {
  if (!url) return Promise.resolve(null);
  return fetch(url).then(function (r) { return r.ok ? r.text() : null; }).then(function (t) {
    if (t == null || /^\s*<(!doctype|html)/i.test(t)) { console.log("Could not read a Sheet tab:", url.slice(0, 90)); return null; }
    var rows = parseCSV(t).filter(function (r) { return r.some(function (x) { return String(x).trim() !== ""; }); }); if (!rows.length) return [];
    var head = rows[0].map(function (h) { return String(h).trim().toLowerCase().replace(/\s+/g, "_"); });
    /* the Sheet's own "notification" tick box columns are not content: left out, and a row with nothing else is skipped */
    return rows.slice(1).map(function (cells) { var o = {}, any = false; head.forEach(function (h, i) { if (h && !/^notification/.test(h)) { o[h] = String(cells[i] == null ? "" : cells[i]); if (o[h].trim()) any = true; } }); return any ? o : null; }).filter(Boolean);
  }).catch(function (e) { console.log("Could not read a Sheet tab:", e && e.message); return null; });
}
/* a picture name from the Sheet: "photo.jpg" alone means images/photo.jpg (the same rule as the website) */
function sheetImg(v) { v = clean(v); return !v || /^(https?:)?\/\//i.test(v) || v.indexOf("/") >= 0 ? v : "images/" + v; }
function sheetEvent(r) {
  var e = { id: clean(r.id), hidden: isYes(r.hidden), date: sheetDate(r.date), endDate: sheetDate(r.end_date), time: tx(r, "time"), place: tx(r, "place"), type: tx(r, "type"), title: tx(r, "title"), text: tx(r, "text"), image: sheetImg(r.image) };
  if (!e.endDate) delete e.endDate;
  return e.date && (e.title.hi || e.title.en) ? e : null;
}
function mergeById(base, rows) {
  var out = base.slice(), idx = {};
  out.forEach(function (x, i) { if (x && x.id) idx[x.id] = i; });
  rows.forEach(function (x) { if (x.id && idx[x.id] != null) out[idx[x.id]] = x; else out.push(x); });
  return out;
}
/* karyakram of data.js and of the Sheet together (for reminders) */
function allEvents() {
  return sheetRows(W.SHEETS && W.SHEETS.karyakram).then(function (rows) {
    var list = rows ? mergeById(vis(W.EVENTS), rows.map(sheetEvent).filter(Boolean)) : vis(W.EVENTS);
    return real(list).filter(function (e) { return e.date; });
  });
}

/* ---------- main ---------- */
var W = load(fs.readFileSync("js/data.js", "utf8"));
if (!W) process.exit(0);
var NC, AUTO, APP_ID, CFG, MAX_PER_RUN;
/* The Google Sheet's "Website Settings" tab (window.SHEETS.settings) may change the notification settings:
   an empty value keeps what data.js says (the same rule as the website). */
function applySheetSettings() {
  var url = W.SHEETS && W.SHEETS.settings;
  if (!url) return Promise.resolve();
  return sheetRows(url).then(function (rows) {
    if (!rows) return;
    var kv = {}; rows.forEach(function (r) { var k = clean(r.key).toLowerCase(); if (k) kv[k] = clean(r.value); });
    W.SITE = W.SITE || {}; var n = W.SITE.notify = W.SITE.notify || {}, a = n.auto = n.auto || {};
    function val(k) { return kv[k] != null && kv[k] !== "" ? (kv[k] === "-" ? "" : kv[k]) : null; }
    function flag(k) { var v = val(k); return v == null ? null : isYes(v) ? true : /^(no|n|nahi|nahin|false|0|नहीं|ना)$/i.test(v) ? false : null; }
    [["notify_new_karyakram", "newKaryakram"], ["notify_new_karyakram_only_this_month", "newKaryakramOnlyThisMonth"], ["notify_new_yojana", "newYojana"],
     ["notify_new_sandesh", "newSandesh"], ["notify_new_bhaktamar", "newBhaktamar"], ["notify_on_the_day", "onTheDay"], ["notify_month_start", "monthStart"],
     ["notify_bhaktamar", "bhaktamar"], ["notify_bhaktamar_names", "bhaktamarNames"], ["notify_jain_calendar", "jainCalendar"]].forEach(function (x) { var f = flag(x[0]); if (f != null) a[x[1]] = f; });
    var v;
    if ((v = val("notify_time")) != null) a.time = v.replace(".", ":");
    if ((v = val("notify_days_before")) != null) a.daysBefore = v.split(/[,\s]+/).filter(Boolean).map(Number);
    if ((v = val("notify_month_start_day")) != null) a.monthStartDay = +v;
    if ((v = val("notify_max_per_run")) != null) a.maxPerRun = +v;
    var f = flag("bhaktamar_on_karyakram"); if (f != null) W.SITE.bhaktamarKaryakram = f;
    console.log("Read the Website Settings tab of the Google Sheet.");
  }).catch(function (e) { console.log("Could not read the Website Settings tab:", e && e.message); });
}
function setup() {
  NC = (W.SITE && W.SITE.notify) || {}; AUTO = NC.auto || {}; APP_ID = String(NC.appId || "").trim();
  /* settings from SITE.notify.auto (js/data.js, or the Sheet's Website Settings tab), with safe defaults */
  CFG = {
    time: /^([01]?\d|2[0-3]):[0-5]\d$/.test(String(AUTO.time || "").trim()) ? String(AUTO.time).trim() : "06:30",
    onTheDay: AUTO.onTheDay !== false && AUTO.dailyReminder !== false,
    daysBefore: (Array.isArray(AUTO.daysBefore) ? AUTO.daysBefore : AUTO.daysBefore == null ? [7] : [AUTO.daysBefore]).map(Number).filter(function (n, i, a) { return n > 0 && n < 100 && n % 1 === 0 && a.indexOf(n) === i; }),
    monthStart: AUTO.monthStart !== false,
    monthStartDay: +AUTO.monthStartDay >= 1 && +AUTO.monthStartDay <= 28 ? +AUTO.monthStartDay : 1,
    bhaktamar: AUTO.bhaktamar !== false,
    bhaktamarNames: AUTO.bhaktamarNames !== false,
    jainCalendar: AUTO.jainCalendar !== false,   /* on the day: ashtami, chaturdashi, parv, kalyanak from the "Jain Calendar" tab */
    onlyThisMonth: AUTO.newKaryakramOnlyThisMonth !== false,
    maxPerRun: +AUTO.maxPerRun > 0 ? +AUTO.maxPerRun : 3
  };
  MAX_PER_RUN = CFG.maxPerRun;
  if (AUTO.time && String(AUTO.time).trim() !== CFG.time) console.log("notify.auto.time \"" + AUTO.time + "\" is not a valid HH:MM time, using " + CFG.time + ".");
  if (!APP_ID || (!KEY && !DRY)) { console.log("Notifications are not set up yet (SITE.notify.appId or the ONESIGNAL_REST_API_KEY secret is empty). Nothing sent."); return false; }
  return true;
}
var BH_TITLE = { hi: "मासिक भक्तामर पाठ", en: "Monthly Bhaktamar Path" };

function onChange() {
  var old = null;
  if (BEFORE && !/^0+$/.test(BEFORE)) { try { old = load(cp.execSync("git show " + BEFORE + ":js/data.js", { encoding: "utf8", maxBuffer: 20e6 })); } catch (e) { old = null; } }
  if (!old) { console.log("No earlier version of data.js to compare with. Nothing sent."); return Promise.resolve(); }
  var list = [];
  /* An entry counts as new only if it was not there before. Fixing a spelling, changing the date or text of an
     existing entry, or un-hiding a SAMPLE / spare card that still has its sample text, does not send anything. */
  if (AUTO.newKaryakram !== false) {
    var oldE = real(old.EVENTS), newE = real(W.EVENTS), had = {}, nowKeys = {}, moved = {}, oldOn = {}, newOn = {};
    oldE.forEach(function (e) { had[evKey(e, "hi")] = had[evKey(e, "en")] = 1; oldOn[e.date] = (oldOn[e.date] || 0) + 1; });
    newE.forEach(function (e) { nowKeys[evKey(e, "hi")] = nowKeys[evKey(e, "en")] = 1; newOn[e.date] = (newOn[e.date] || 0) + 1; });
    oldE.forEach(function (e) { if (!nowKeys[evKey(e, "hi")] && !nowKeys[evKey(e, "en")]) { moved[L(e.title, "hi")] = moved[L(e.title, "en")] = 1; } });
    newE.forEach(function (e) {
      if (!e.date || had[evKey(e, "hi")] || had[evKey(e, "en")]) return;
      if (moved[L(e.title, "hi")] || moved[L(e.title, "en")] || (newOn[e.date] || 0) <= (oldOn[e.date] || 0)) return;   /* date changed / title corrected */
      if ((e.endDate || e.date) < TODAY) return;   /* not past ones */
      if (CFG.onlyThisMonth && e.date.slice(0, 7) !== THIS_MONTH) return;   /* later months get their reminders (month start, days before, on the day) */
      list.push({ key: "new-ev|" + evKey(e, "hi"), image: e.image, page: "karyakram.html", title: { hi: "नया विशेष कार्यक्रम", en: "New special karyakram" },
        text: both(function (l) { return short(L(e.title, l) + " • " + niceDate(e.date, l) + (L(e.time, l) ? ", " + L(e.time, l) : ""), 170); }) });
    });
  }
  if (AUTO.newYojana !== false) {
    var hy = {}; real(old.YOJANA).forEach(function (y) { hy[yoKey(y)] = 1; if (!y.id) { hy[L(y.title, "hi")] = hy[L(y.title, "en")] = 1; } });
    real(W.YOJANA).forEach(function (y) {
      if (hy[yoKey(y)] || (!y.id && (hy[L(y.title, "hi")] || hy[L(y.title, "en")]))) return;
      list.push({ key: "new-yo|" + yoKey(y), image: y.image || (y.photos || [])[0], page: "yojana.html", title: { hi: "नई योजना: " + L(y.title, "hi"), en: "New yojana: " + L(y.title, "en") },
        text: both(function (l) { return short(L(y.short, l) || L(y.summary, l) || L(y.title, l), 170); }) });
    });
  }
  if (AUTO.newSandesh !== false) {
    var ha = {}; real(old.ANNOUNCEMENTS).forEach(function (a) { ["hi", "en"].forEach(function (l) { if (L(a.title, l)) ha["t" + L(a.title, l)] = 1; if (L(a.text, l)) ha["x" + L(a.text, l)] = 1; }); });
    real(W.ANNOUNCEMENTS).forEach(function (a) {
      if (["hi", "en"].some(function (l) { return (L(a.title, l) && ha["t" + L(a.title, l)]) || (L(a.text, l) && ha["x" + L(a.text, l)]); })) return;
      list.push({ key: "new-an|" + (a.date || "") + "|" + L(a.title, "hi"), image: a.image, page: "announcements.html", title: both(function (l) { return short(L(a.title, l), 60); }), text: both(function (l) { return short(L(a.text, l) || L(a.title, l), 170); }) });
    });
  }
  if (!list.length) { console.log("Nothing new to announce."); return Promise.resolve(); }
  if (list.length > MAX_PER_RUN) {
    var titles = list.map(function (n) { return n.title; });
    list = [{ key: "new-many|" + list.map(function (n) { return n.key; }).join("~"), page: "index.html", title: { hi: "मंदिर की नई जानकारी", en: "New at the mandir" },
      text: both(function (l) { return short(titles.map(function (x) { return x[l]; }).join(" • "), 170); }) }];
  }
  return list.reduce(function (p, n) { return p.then(function () { return send(n); }); }, Promise.resolve());
}

/* today's Jain calendar items: js/jain-calendar.js (calculated) + the Sheet tab (a row with the same id, or date + name, changes it;
   hidden = yes hides it; other rows are added) */
function jainToday(rows) {
  var out = [], J = null;
  try { J = load(fs.readFileSync("js/jain-calendar.js", "utf8")); J = J && J.JAIN_PANCHANG; } catch (e) { J = null; }
  (J && J.events || []).forEach(function (e) { if (e[0] === TODAY) out.push({ id: e[2], date: e[0], type: e[1], title: { hi: e[3], en: e[4] }, note: { hi: e[5], en: e[6] } }); });
  (rows || []).forEach(function (r) {
    var id = clean(r.id), d = sheetDate(r.date), t = tx(r, "title"), nt = tx(r, "note"), hid = isYes(r.hidden);
    var x = out.filter(function (c) { return (id && c.id === id) || (d && d === c.date && t.hi && (c.title.hi === t.hi || (t.en && c.title.en === t.en))); })[0]
      || (d && /^(tithi|तिथि)/i.test(clean(r.type)) ? out.filter(function (c) { return c.date === d && c.type === "tithi"; })[0] : null);
    if (!x && id && J) { (J.events || []).forEach(function (e) { if (e[2] === id && d === TODAY) x = { id: id, date: TODAY, type: e[1], title: { hi: e[3], en: e[4] }, note: { hi: e[5], en: e[6] } }; }); if (x) out.push(x); }
    if (x) { if (hid) x.hidden = true; if (d) x.date = d; if (t.hi) x.title = t; if (nt.hi) x.note = nt; return; }
    if (d === TODAY && t.hi && !hid && !placeholder({ title: t })) out.push({ id: id, date: d, type: clean(r.type), title: t, note: nt });
  });
  /* order: kalyanak and parv first, then ashtami / chaturdashi, then vrat */
  var rank = { kalyanak: 0, parv: 1, tithi: 2, vrat: 3 };
  return out.filter(function (c) { return !c.hidden && c.date === TODAY; }).sort(function (a, b) { return (rank[a.type] == null ? 1 : rank[a.type]) - (rank[b.type] == null ? 1 : rank[b.type]); });
}
function addDays(iso, n) { var d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function famLine(g, l) { var n = g.names[l]; return CFG.bhaktamarNames && n && n.length ? (l === "en" ? "Punyarjak famil" + (n.length > 1 ? "ies" : "y") + ": " : "पुण्यार्जक परिवार: ") + n.join(l === "en" ? "; " : "; ") : ""; }
/* is it reminder time now? From the set time until 3 hours later (GitHub's timer can run late); repeats are dropped by the fixed id.
   The window stops at midnight (a late time like "23:30" only gets the runs before 12 at night), so "Today" never means the wrong day. */
/* Reminder time = from the set time until the end of the day. GitHub's timer sometimes skips runs for hours,
   so the first run after the set time sends the day's reminders; the state file remembers that today's are done
   (and OneSignal's fixed ids stop any repeat). */
function reminderTime() {
  var p = CFG.time.split(":"), target = +p[0] * 60 + +p[1], nowMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  return nowMin >= target && nowMin < 23 * 60;
}
function remDone() { var st = readState() || {}; return st._remDone === TODAY; }
function markRemDone() { var st = readState() || {}; if (st._remDone !== TODAY) { st._remDone = TODAY; writeState(st); } }
function onSchedule(force) {
  if (!force && !reminderTime()) { console.log("Not reminder time (set time " + CFG.time + " India time, until 11 at night). Nothing sent."); return Promise.resolve(); }
  if (!force && remDone()) { console.log("Today's reminders were already sent."); return Promise.resolve(); }
  var evs = [];
  var bhP = CFG.bhaktamar ? bhaktamarDates(W.SITE || {}, W.SHEETS && W.SHEETS.bhaktamar, W.BHAKTAMBAR) : Promise.resolve([]);
  var jcP = CFG.onTheDay && CFG.jainCalendar && W.SHEETS && W.SHEETS.calendar ? sheetRows(W.SHEETS.calendar) : Promise.resolve([]), jc = [];
  return allEvents().then(function (list) { evs = list; return jcP; }).then(function (rows) { jc = rows || []; return bhP; }).then(function (bh) {
    var jobs = [];
    function evMeta(e, l) { return [niceDate(e.date, l), L(e.time, l), L(e.place, l)].filter(Boolean).join(", "); }
    function dayJobs(day, n) {   /* n = 0 on the day, else days before */
      function head(t, l) { return n === 0 ? (l === "en" ? "Today: " : "आज: ") + t : n === 1 ? (l === "en" ? "Tomorrow: " : "कल: ") + t : (l === "en" ? "In " + n + " days: " : n + " दिन बाद: ") + t; }
      evs.filter(function (e) { return e.date === day; }).forEach(function (e) {
        jobs.push({ key: "rem|" + n + "|" + day + "|" + L(e.title, "hi"), image: e.image, page: n === 0 ? "daily.html" : "karyakram.html",
          title: both(function (l) { return short(head(L(e.title, l), l), 70); }), text: both(function (l) { return short(evMeta(e, l) + (L(e.text, l) ? " • " + L(e.text, l) : ""), 170); }) });
      });
      bh.filter(function (g) { return g.date === day; }).forEach(function (g) {
        jobs.push({ key: "rem-bh|" + n + "|" + day, page: n === 0 ? "daily.html" : "karyakram.html",
          title: both(function (l) { return head(BH_TITLE[l], l); }),
          text: both(function (l) { return short([niceDate(day, l), famLine(g, l)].filter(Boolean).join(" • "), 170); }) });
      });
    }
    if (CFG.onTheDay) dayJobs(TODAY, 0);
    /* Jain calendar on the day (ashtami / chaturdashi / parv / kalyanak / vrat): the calculated calendar (js/jain-calendar.js)
       with the Sheet tab "Jain Calendar" over it (same rules as the website); skipped when a special karyakram of the same name
       is today. Several items on one day = one notification. */
    if (CFG.onTheDay && CFG.jainCalendar) {
      var today = jainToday(jc).filter(function (c) { return !evs.some(function (e) { return e.date === TODAY && (L(e.title, "hi") === c.title.hi || L(e.title, "en") === c.title.en); }); });
      if (today.length) {
        var first = today[0], more = today.slice(1);
        jobs.push({ key: "rem-jc|" + TODAY + "|" + today.map(function (c) { return c.title.hi; }).join("~"), page: "calendar.html?date=" + TODAY,
          title: both(function (l) { return short((l === "en" ? "Today: " : "आज: ") + first.title[l], 70); }),
          text: both(function (l) { return short([niceDate(TODAY, l)].concat(more.map(function (c) { return c.title[l]; })).concat(first.note[l] && !more.length ? [first.note[l]] : []).filter(Boolean).join(" • "), 170); }) });
      }
    }
    CFG.daysBefore.forEach(function (n) { dayJobs(addDays(TODAY, n), n); });
    if (CFG.monthStart && +TODAY.slice(8) === CFG.monthStartDay) {
      var month = evs.filter(function (e) { return e.date.slice(0, 7) === THIS_MONTH && e.date >= TODAY; }).map(function (e) { return { d: e.date, t: both(function (l) { return L(e.title, l); }) }; });
      bh.filter(function (g) { return g.date.slice(0, 7) === THIS_MONTH && g.date >= TODAY; }).forEach(function (g) { month.push({ d: g.date, t: BH_TITLE }); });
      month.sort(function (a, b) { return a.d < b.d ? -1 : 1; });
      if (month.length) jobs.push({ key: "month|" + THIS_MONTH, page: "karyakram.html", title: { hi: "इस महीने के विशेष कार्यक्रम", en: "This month's special karyakram" },
        text: both(function (l) { return short(month.map(function (x) { return x.t[l] + " (" + +x.d.slice(8) + ")"; }).join(" • "), 170); }) });
    }
    if (!jobs.length) { console.log("No reminder due today."); if (!force) markRemDone(); return; }
    if (jobs.length > MAX_PER_RUN) {   /* too many at once: one notification with all of them */
      var all = jobs; jobs = [{ key: "rem-many|" + TODAY + "|" + all.map(function (n) { return n.key; }).join("~"), page: "karyakram.html",
        title: { hi: "आने वाले विशेष कार्यक्रम", en: "Coming special karyakram" }, text: both(function (l) { return short(all.map(function (n) { return n.title[l]; }).join(" • "), 170); }) }];
    }
    return jobs.reduce(function (p, n) { return p.then(function () { return send(n); }); }, Promise.resolve()).then(function () { if (!force && !process.exitCode) markRemDone(); });
  });
}


/* ---------- new rows in the Sheet: notify within minutes (every GitHub run checks) ----------
   What was seen last time is kept in .notify-state/sheet-seen.json (saved between runs by GitHub's cache).
   A row counts as new only if the number of rows in its tab went up (so correcting a spelling or a date sends nothing);
   when rows were changed and added in the same run, the last unseen rows (new rows usually go at the bottom) are the new ones.
   The first run only remembers what is there. Hidden rows are not remembered, so un-hiding a row announces it. */
var STATE_FILE = ".notify-state/sheet-seen.json";
function readState() { try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch (e) { return null; } }
function writeState(st) {
  fs.mkdirSync(".notify-state", { recursive: true }); var txt = JSON.stringify(st);
  var old = ""; try { old = fs.readFileSync(STATE_FILE, "utf8"); } catch (e) {}
  if (txt !== old) { fs.writeFileSync(STATE_FILE, txt); if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "changed=true\n"); }
}
function bhRowsForPoll(rows) {
  return (rows || []).map(function (r) {
    var nm = tx(r, "name"); if (!nm.hi && !nm.en) return null;
    var d = bhDate(r); if (!d) return null;
    return { k: "sheet-new|bhaktamar|" + clean(r.year) + "|" + clean(r.month) + "|" + clean(r.date) + "|" + nm.hi, g: "all", date: d, names: nm };
  }).filter(Boolean);
}
function sheetPoll() {
  var SH = W.SHEETS || {}, tabs = ["karyakram", "suchnayein", "yojana", "bhaktamar"];
  if (!tabs.some(function (t) { return SH[t]; })) return Promise.resolve();
  if ((W.SITE || {}).bhaktamarKaryakram === false) tabs = tabs.filter(function (t) { return t !== "bhaktamar"; });
  return Promise.all(tabs.map(function (t) { return sheetRows(SH[t]); })).then(function (res) {
    var prev = readState() || {}, next = { _remDone: prev._remDone }, jobs = [];
    tabs.forEach(function (t, i) {
      var rows = res[i];
      if (rows == null || (!rows.length && prev[t] && prev[t].length)) { if (prev[t]) next[t] = prev[t]; return; }   /* could not read (or Google gave an empty tab for a moment): keep what we had */
      var cur = [];
      if (t === "karyakram") rows.forEach(function (r) { var e = sheetEvent(r); if (e && !e.hidden && !placeholder(e)) cur.push({ k: "sheet-new|karyakram|" + (e.id || e.date + "|" + e.title.hi), g: "all", e: e }); });
      if (t === "suchnayein") rows.forEach(function (r) { var a = { id: clean(r.id), date: sheetDate(r.date), title: tx(r, "title"), text: tx(r, "text"), image: sheetImg(r.image) };
        if (isYes(r.hidden) || (!a.title.hi && !a.text.hi) || placeholder(a)) return; cur.push({ k: "sheet-new|suchnayein|" + (a.id || a.date + "|" + a.title.hi), g: "all", a: a }); });
      if (t === "yojana") rows.forEach(function (r) { var y = { id: clean(r.id), title: tx(r, "title"), short: tx(r, "short"), photos: clean(r.photos) };
        if (isYes(r.hidden) || !y.title.hi || placeholder(y)) return; cur.push({ k: "sheet-new|yojana|" + (y.id || y.title.hi), g: "all", y: y }); });
      if (t === "bhaktamar") cur = bhRowsForPoll(rows);
      next[t] = cur.map(function (c) { return { k: c.k, g: c.g }; });
      if (!prev[t]) { console.log("Sheet tab " + t + ": first look, " + cur.length + " rows remembered (nothing sent)."); return; }
      var seen = {}, groupsPrev = {};
      prev[t].forEach(function (p) { seen[p.k] = 1; (groupsPrev[p.g] = groupsPrev[p.g] || []).push(p.k); });
      var nowKeys = {}; cur.forEach(function (c) { nowKeys[c.k] = 1; });
      var byGroup = {};
      cur.forEach(function (c) { if (!seen[c.k]) (byGroup[c.g] = byGroup[c.g] || []).push(c); });
      Object.keys(byGroup).forEach(function (g) {
        var gone = (groupsPrev[g] || []).filter(function (k) { return !nowKeys[k]; }).length;   /* rows of this group that changed */
        var fresh = byGroup[g].slice(Math.min(gone, byGroup[g].length));
        fresh.forEach(function (c) {
          if (t === "karyakram") {
            var e = c.e; if (AUTO.newKaryakram === false || (e.endDate || e.date) < TODAY || (CFG.onlyThisMonth && e.date.slice(0, 7) !== THIS_MONTH)) return;
            jobs.push({ key: c.k, image: e.image, page: "karyakram.html", title: { hi: "नया विशेष कार्यक्रम", en: "New special karyakram" },
              text: both(function (l) { return short(L(e.title, l) + " • " + niceDate(e.date, l) + (L(e.time, l) ? ", " + L(e.time, l) : ""), 170); }) });
          } else if (t === "suchnayein") {
            var a = c.a; if (AUTO.newSandesh === false) return;
            jobs.push({ key: c.k, image: a.image, page: "announcements.html", title: both(function (l) { return short(L(a.title, l) || (l === "en" ? "Message from the mandir" : "मंदिर का संदेश"), 60); }), text: both(function (l) { return short(L(a.text, l) || L(a.title, l), 170); }) });
          } else if (t === "yojana") {
            var y = c.y; if (AUTO.newYojana === false) return;
            jobs.push({ key: c.k, image: sheetImg(y.photos.split(/[,\n]/)[0]), page: "yojana.html", title: { hi: "नई योजना: " + y.title.hi, en: "New yojana: " + y.title.en }, text: both(function (l) { return short(L(y.short, l) || L(y.title, l), 170); }) });
          } else if (t === "bhaktamar") {
            if (AUTO.newBhaktamar === false || c.date < TODAY || (CFG.onlyThisMonth && c.date.slice(0, 7) !== THIS_MONTH)) return;
            jobs.push({ key: c.k, page: "karyakram.html", title: BH_TITLE, text: both(function (l) { return short(niceDate(c.date, l) + " • " + (l === "en" ? "Punyarjak family: " : "पुण्यार्जक परिवार: ") + c.names[l], 170); }) });
          }
        });
      });
    });
    writeState(next);
    if (!jobs.length) { console.log("No new rows to announce in the Sheet."); return; }
    if (jobs.length > MAX_PER_RUN) {
      var all = jobs; jobs = [{ key: "sheet-many|" + all.map(function (n) { return n.key; }).join("~"), page: "index.html", title: { hi: "मंदिर की नई जानकारी", en: "New at the mandir" },
        text: both(function (l) { return short(all.map(function (n) { return n.title[l]; }).join(" • "), 170); }) }];
    }
    return jobs.reduce(function (p, n) { return p.then(function () { return send(n); }); }, Promise.resolve());
  });
}

function onHand() {
  var t = (process.env.IN_TITLE || "").trim(), m = (process.env.IN_MESSAGE || "").trim(), page = (process.env.IN_PAGE || "").trim();
  if (!t || !m) { console.log("Please write a title and a message."); process.exitCode = 1; return Promise.resolve(); }
  page = page.replace(/^https?:\/\/[^/]+\/[^/]+\//, "").replace(/^\//, "");
  return send({ page: page, image: process.env.IN_IMAGE || "", title: { hi: t, en: t }, text: { hi: m, en: m } });
}

applySheetSettings().then(function () { if (!setup()) return; return (EVENT === "push" ? onChange() : EVENT === "schedule" ? onSchedule().then(sheetPoll) : EVENT === "workflow_dispatch" ? (process.env.IN_MODE === "today" ? onSchedule(true) : process.env.IN_MODE === "timer" ? onSchedule().then(sheetPoll) : onHand()) : Promise.resolve()); })
  .catch(function (e) { console.log("Error:", e && e.message); process.exitCode = 1; });
