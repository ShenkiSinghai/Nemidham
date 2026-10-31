/* Sends mandir notifications through OneSignal. Run by .github/workflows/notify.yml (see README part 5.35).
   - When js/data.js changes: a new karyakram of the current month, a new yojana, a new sandesh (announcement).
   - Every morning: the day's special karyakram (and Bhaktamar path from the Google Sheet).
   - On the 1st of every month: the karyakram of the new month.
   - By hand: "Run workflow" on GitHub with your own title and message.
   It needs the GitHub secret ONESIGNAL_REST_API_KEY and SITE.notify.appId in js/data.js. */
"use strict";
var fs = require("fs"), vm = require("vm"), cp = require("child_process");

var EVENT = process.env.EVENT_NAME || "", BEFORE = process.env.BEFORE || "", KEY = (process.env.ONESIGNAL_REST_API_KEY || "").trim();
var DRY = process.env.DRY_RUN === "1";
var REPO = process.env.GITHUB_REPOSITORY || "owner/repo";
var SITE_URL = (process.env.SITE_URL || ("https://" + REPO.split("/")[0].toLowerCase() + ".github.io/" + REPO.split("/")[1] + "/")).replace(/\/?$/, "/");
var MAX_PER_RUN = 3;

function load(code) {
  var ctx = { window: {}, console: console }; ctx.window.window = ctx.window;
  try { vm.runInNewContext(code, ctx, { timeout: 2000 }); } catch (e) { console.log("Could not read data.js:", e.message); return null; }
  return ctx.window;
}
function L(v, l) { if (v == null) return ""; if (typeof v === "string") return v; return v[l] || v.hi || v.en || ""; }
function vis(a) { return (a || []).filter(function (x) { return x && !x.hidden; }); }
function pad(n) { return (n < 10 ? "0" : "") + n; }
var now = new Date(Date.now() + 5.5 * 3600 * 1000);   /* India time */
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

function send(n) {
  var body = { app_id: APP_ID, target_channel: "push", included_segments: ["Total Subscriptions"],
    headings: { en: n.title.en || n.title.hi, hi: n.title.hi || n.title.en },
    contents: { en: n.text.en || n.text.hi, hi: n.text.hi || n.text.en },
    url: SITE_URL + (n.page || ""), chrome_web_icon: SITE_URL + "images/icon-192.png", firefox_icon: SITE_URL + "images/icon-192.png" };
  console.log("Notification:", JSON.stringify({ title: body.headings, text: body.contents, url: body.url }));
  if (DRY) return Promise.resolve();
  function post(b) {
    return fetch("https://api.onesignal.com/notifications", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Key " + KEY }, body: JSON.stringify(b) })
      .then(function (r) { return r.text().then(function (t) { return { ok: r.ok, status: r.status, text: t }; }); });
  }
  return post(body).then(function (r) {
    if (!r.ok && /segment/i.test(r.text)) { body.included_segments = ["Subscribed Users"]; return post(body); }   /* older OneSignal apps use this name */
    return r;
  }).then(function (r) { console.log("OneSignal answered:", r.status, r.text.slice(0, 300)); if (!r.ok) process.exitCode = 1; });
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
function bhaktamarDates(site, url, local) {
  if (site.bhaktamarKaryakram === false) return Promise.resolve([]);
  function dates(rows) { var out = {}; rows.forEach(function (r) { var d = bhDate(r); if (d) out[d] = 1; }); return Object.keys(out).sort(); }
  if (!url) return Promise.resolve(dates(vis(local).map(function (b) { return { month: b.month, year: b.year, date: b.date }; })));
  return fetch(url).then(function (r) { return r.ok ? r.text() : ""; }).then(function (t) {
    if (/^\s*<(!doctype|html)/i.test(t)) return [];
    var rows = parseCSV(t).filter(function (r) { return r.some(function (x) { return String(x).trim() !== ""; }); }); if (!rows.length) return [];
    var head = rows[0].map(function (h) { return String(h).trim().toLowerCase().replace(/\s+/g, "_"); });
    return dates(rows.slice(1).map(function (cells) {
      var r = {}; head.forEach(function (h, i) { if (h) r[h] = String(cells[i] == null ? "" : cells[i]).trim(); }); return r;
    }).filter(function (r) { return r.name_hi || r.name_en || r.name; }));
  }).catch(function () { return []; });
}

/* ---------- main ---------- */
var W = load(fs.readFileSync("js/data.js", "utf8"));
if (!W) process.exit(0);
var NC = (W.SITE && W.SITE.notify) || {}, AUTO = NC.auto || {}, APP_ID = String(NC.appId || "").trim();
if (!APP_ID || (!KEY && !DRY)) { console.log("Notifications are not set up yet (SITE.notify.appId or the ONESIGNAL_REST_API_KEY secret is empty). Nothing sent."); process.exit(0); }
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
      if (e.date.slice(0, 7) !== THIS_MONTH || (e.endDate || e.date) < TODAY) return;   /* only this month's, not past ones */
      list.push({ page: "karyakram.html", title: { hi: "नया विशेष कार्यक्रम", en: "New special karyakram" },
        text: both(function (l) { return short(L(e.title, l) + " • " + niceDate(e.date, l) + (L(e.time, l) ? ", " + L(e.time, l) : ""), 170); }) });
    });
  }
  if (AUTO.newYojana !== false) {
    var hy = {}; real(old.YOJANA).forEach(function (y) { hy[yoKey(y)] = 1; if (!y.id) { hy[L(y.title, "hi")] = hy[L(y.title, "en")] = 1; } });
    real(W.YOJANA).forEach(function (y) {
      if (hy[yoKey(y)] || (!y.id && (hy[L(y.title, "hi")] || hy[L(y.title, "en")]))) return;
      list.push({ page: "yojana.html", title: { hi: "नई योजना: " + L(y.title, "hi"), en: "New yojana: " + L(y.title, "en") },
        text: both(function (l) { return short(L(y.short, l) || L(y.summary, l) || L(y.title, l), 170); }) });
    });
  }
  if (AUTO.newSandesh !== false) {
    var ha = {}; real(old.ANNOUNCEMENTS).forEach(function (a) { ["hi", "en"].forEach(function (l) { if (L(a.title, l)) ha["t" + L(a.title, l)] = 1; if (L(a.text, l)) ha["x" + L(a.text, l)] = 1; }); });
    real(W.ANNOUNCEMENTS).forEach(function (a) {
      if (["hi", "en"].some(function (l) { return (L(a.title, l) && ha["t" + L(a.title, l)]) || (L(a.text, l) && ha["x" + L(a.text, l)]); })) return;
      list.push({ page: "announcements.html", title: both(function (l) { return short(L(a.title, l), 60); }), text: both(function (l) { return short(L(a.text, l) || L(a.title, l), 170); }) });
    });
  }
  if (!list.length) { console.log("Nothing new to announce."); return Promise.resolve(); }
  if (list.length > MAX_PER_RUN) {
    var titles = list.map(function (n) { return n.title; });
    list = [{ page: "index.html", title: { hi: "मंदिर की नई जानकारी", en: "New at the mandir" },
      text: both(function (l) { return short(titles.map(function (x) { return x[l]; }).join(" • "), 170); }) }];
  }
  return list.reduce(function (p, n) { return p.then(function () { return send(n); }); }, Promise.resolve());
}

function onSchedule() {
  var evs = vis(W.EVENTS).filter(function (e) { return e.date; });
  return bhaktamarDates(W.SITE || {}, W.SHEETS && W.SHEETS.bhaktamar, W.BHAKTAMBAR).then(function (bh) {
    var jobs = [];
    if (AUTO.dailyReminder !== false) {
      var today = evs.filter(function (e) { return e.date <= TODAY && (e.endDate || e.date) >= TODAY; }).map(function (e) { return both(function (l) { return L(e.title, l) + (L(e.time, l) ? " (" + L(e.time, l) + ")" : ""); }); });
      if (bh.indexOf(TODAY) >= 0) today.push(BH_TITLE);
      if (today.length) jobs.push({ page: "daily.html", title: { hi: "आज का विशेष कार्यक्रम", en: "Today's special karyakram" },
        text: both(function (l) { return short(today.map(function (x) { return x[l]; }).join(" • "), 170); }) });
    }
    if (AUTO.monthStart !== false && TODAY.slice(8) === "01") {
      var month = evs.filter(function (e) { return e.date.slice(0, 7) === THIS_MONTH; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; })
        .map(function (e) { return both(function (l) { return L(e.title, l) + " (" + +e.date.slice(8) + ")"; }); });
      bh.filter(function (d) { return d.slice(0, 7) === THIS_MONTH; }).forEach(function (d) { month.push({ hi: BH_TITLE.hi + " (" + +d.slice(8) + ")", en: BH_TITLE.en + " (" + +d.slice(8) + ")" }); });
      if (month.length) jobs.push({ page: "karyakram.html", title: { hi: "इस महीने के विशेष कार्यक्रम", en: "This month's special karyakram" },
        text: both(function (l) { return short(month.map(function (x) { return x[l]; }).join(" • "), 170); }) });
    }
    if (!jobs.length) console.log("No special karyakram today.");
    return jobs.reduce(function (p, n) { return p.then(function () { return send(n); }); }, Promise.resolve());
  });
}

function onHand() {
  var t = (process.env.IN_TITLE || "").trim(), m = (process.env.IN_MESSAGE || "").trim(), page = (process.env.IN_PAGE || "").trim();
  if (!t || !m) { console.log("Please write a title and a message."); process.exitCode = 1; return Promise.resolve(); }
  page = page.replace(/^https?:\/\/[^/]+\/[^/]+\//, "").replace(/^\//, "");
  return send({ page: page, title: { hi: t, en: t }, text: { hi: m, en: m } });
}

(EVENT === "push" ? onChange() : EVENT === "schedule" ? onSchedule() : EVENT === "workflow_dispatch" ? (process.env.IN_MODE === "today" ? onSchedule() : onHand()) : Promise.resolve())
  .catch(function (e) { console.log("Error:", e && e.message); process.exitCode = 1; });
