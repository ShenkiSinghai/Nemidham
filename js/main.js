/* Builds the menu, footer and every page from js/data.js and js/i18n.js.
   Hindi is the default language; the visitor can switch to English.
   You normally never need to edit this file. */
(function () {
  "use strict";

  var S = window.SITE || {};
  var UIX = window.UI || {};
  var page = document.body.getAttribute("data-page") || "";
  var tz = S.timezone || "Asia/Kolkata";
  var lang = initLang();
  var timer = null;
  var globalBound = false;
  var firstRender = true;

  /* ---------- language ---------- */
  function initLang() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    if (q === "hi" || q === "en") { saveLang(q); return q; }
    try { var v = localStorage.getItem("nj-lang"); if (v === "hi" || v === "en") return v; } catch (e) {}
    return "hi";
  }
  function saveLang(l) { try { localStorage.setItem("nj-lang", l); } catch (e) {} }

  /* UI word: t("key", {name: "x"}) */
  function t(key, vars) {
    var s = (UIX[lang] || {})[key];
    if (s == null) s = (UIX.en || {})[key];
    if (s == null) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  /* Content text: a plain string, or { hi: "...", en: "..." } */
  function L(v) {
    if (v && typeof v === "object" && !Array.isArray(v) && ("hi" in v || "en" in v)) {
      var x = v[lang];
      if (x == null || x === "") x = v.en || v.hi || "";
      return x;
    }
    return v == null ? "" : v;
  }
  function loc() { return lang === "hi" ? "hi-IN" : "en-IN"; }

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function put(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; return el; }
  /* A Home-page block that shows only PINNED items: when there is nothing to show, the whole
     section (heading and "see all" link too) is left out instead of showing an empty box. */
  function putHome(id, html) {
    var el = put(id, html), sec = el && el.closest ? el.closest("section") : null;
    if (sec) sec.hidden = !html;
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function todayISO() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  }
  function nowMinutes() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    var get = function (ty) { return parseInt(parts.filter(function (p) { return p.type === ty; })[0].value, 10); };
    return get("hour") * 60 + get("minute");
  }
  function toMin(hhmm) { var p = String(hhmm).split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function fmtTime(hhmm) {
    var m = toMin(hhmm), h = Math.floor(m / 60), mm = m % 60;
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    var clock = h12 + ":" + pad2(mm);
    if (lang === "hi") {
      var part = h < 4 ? "रात" : h < 12 ? "सुबह" : h < 16 ? "दोपहर" : h < 20 ? "शाम" : "रात";
      return part + " " + clock;
    }
    return clock + " " + (h >= 12 ? "PM" : "AM");
  }
  function parseDate(iso) { return new Date(iso + "T00:00:00"); }
  function longDate(iso) { return parseDate(iso).toLocaleDateString(loc(), { day: "numeric", month: "long", year: "numeric" }); }
  function fullDate(iso) { return parseDate(iso).toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
  function rangeText(a, b) {
    try {
      return new Intl.DateTimeFormat(loc(), { day: "numeric", month: "long", year: "numeric" }).formatRange(parseDate(a), parseDate(b));
    } catch (e) { return longDate(a) + " – " + longDate(b); }
  }
  function dateBadge(iso) {
    var d = parseDate(iso);
    return '<div class="date" aria-hidden="true"><b>' + d.getDate() + "</b><span>" + esc(d.toLocaleDateString(loc(), { month: "short" })) + "</span></div>";
  }
  function initials(name) {
    var n = String(name).replace(/^(sample|shri|smt|dr|श्री|श्रीमती|डॉ)\.?\s+/i, "");
    return n.split(/\s+/).slice(0, 2).map(function (w) { return Array.from(w)[0] || ""; }).join("").toUpperCase();
  }
  function telHref(p) { return "tel:" + String(p).replace(/[^\d+]/g, ""); }
  function vis(list) { return (list || []).filter(function (x) { return !x.hidden; }); }
  function showTimings() { return S.showTimings !== false && S.timings; }

  var SOCIAL = [
    ["whatsappGroup", "social.whatsapp", "wa"],
    ["facebook", "social.facebook", "fb"],
    ["instagram", "social.instagram", "ig"],
    ["youtube", "social.youtube", "yt"]
  ];
  /* Always lists all four platforms. url is "" when not filled in yet; the caller
     should then show the icon greyed out and not clickable. */
  function socialList() {
    var s = S.social || {};
    return SOCIAL.map(function (x) { return { url: s[x[0]] || "", label: t(x[1]), icon: x[2] }; });
  }
  var ICON_SVG = {
    wa: '<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.355-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.593 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.339-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>',
    fb: '<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>',
    ig: '<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.203.166 1.485.275.374.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>',
    yt: '<path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>'
  };
  function socialIconsHtml(cls) {
    return socialList().map(function (s) {
      var svg = '<svg viewBox="0 0 16 16" aria-hidden="true">' + (ICON_SVG[s.icon] || "") + "</svg>";
      return s.url
        ? '<a class="' + cls + " " + cls + "-" + s.icon + '" href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '">' + svg + "</a>"
        : '<span class="' + cls + " " + cls + "-" + s.icon + ' off" aria-hidden="true" title="' + esc(s.label) + '">' + svg + "</span>";
    }).join("");
  }

  /* ---------- menu ---------- */
  var NAV = [
    { k: "nav.home", href: "index.html", p: "home" },
    { k: "nav.yojana", href: "yojana.html", p: "yojana" },
    { k: "nav.karyakram", id: "kar", kids: [
      { k: "nav.daily", href: "daily.html", p: "daily" },
      { k: "nav.special", href: "karyakram.html", p: "karyakram" },
      { k: "nav.calendar", href: "calendar.html", p: "calendar" },
      { k: "nav.announcements", href: "announcements.html", p: "announcements" }
    ] },
    { k: "nav.gallery", id: "gal", href: "gallery.html", p: "gallery", kids: [
      { k: "nav.photos", href: "gallery.html?type=photos" },
      { k: "nav.videos", href: "gallery.html?type=videos" }
    ] },
    { k: "nav.about", id: "abt", kids: [
      { k: "nav.about_mandir", href: "about.html", p: "about" },
      { k: "nav.timeline", href: "timeline.html", p: "timeline" },
      { k: "nav.team", href: "team.html", p: "team" },
      { k: "nav.dharmshala", soon: true }
    ] },
    { k: "nav.visit", id: "vis", href: "visit.html", p: "visit", kids: [
      { k: "v.tab_timings", href: "visit.html#timings" },
      { k: "v.tab_reach", href: "visit.html#reach" },
      { k: "v.tab_fac", href: "visit.html#facilities" },
      { k: "v.tab_dress", href: "visit.html#rules" },
      { k: "nav.nearby", href: "nearby.html", p: "nearby" }
    ] },
    { k: "nav.daan", href: "daan.html", p: "daan" }
  ];


  /* The "Activities" menu is built from window.ACTIVITIES in data.js (so new items can be added there
     without touching code). If that list is empty or missing, the whole menu item is left out. */
  function activityId() {
    var b = document.body && document.body.getAttribute("data-activity");
    if (b) return b;
    try { return new URLSearchParams(location.search).get("id") || ""; } catch (e) { return ""; }
  }
  /* data.js can hide menu items:  SITE.hideMenu: ["timeline", "daily", ...]  (page ids), and the grey "soon" Dharmshala line with SITE.dharmshalaSoon: false */
  function menuBase() {
    var hide = S.hideMenu || [];
    function keep(n) { return !(n.p && hide.indexOf(n.p) >= 0) && !(n.soon && S.dharmshalaSoon === false); }
    return NAV.filter(keep).map(function (n) {
      if (!n.kids) return n;
      var kids = n.kids.filter(keep);
      return kids.length ? Object.assign({}, n, { kids: kids }) : null;
    }).filter(Boolean);
  }
  function navList() {
    var acts = vis(window.ACTIVITIES), base = menuBase();
    if (!acts.length) return base;
    var kids = acts.map(function (a) {
      return { label: L(a.title), href: a.page || ("activity.html?id=" + encodeURIComponent(a.id)), p: "activity", q: a.id, tag: a.comingSoon !== false };
    });
    var out = base.slice(), at = 0;
    out.forEach(function (n, i) { if (n.p === "gallery") at = i + 1; });
    out.splice(at, 0, { k: "nav.activities", id: "act", kids: kids });
    return out;
  }
  function navLink(n) {
    var cur = n.p === page && (!n.q || n.q === activityId());
    return '<a href="' + n.href + '"' + (cur ? ' aria-current="page"' : "") + (n.cls ? ' class="' + n.cls + '"' : "") + ">" +
      esc(n.label || t(n.k)) + (n.tag ? "<small>" + esc(t("act.soon")) + "</small>" : "") + "</a>";
  }
  function navItem(n) {
    if (!n.kids) return "<li>" + navLink(n) + "</li>";
    var current = n.p === page || n.kids.some(function (c) { return c.p === page; });
    return '<li class="has-sub' + (current ? " current" : "") + '"><button type="button" class="sub-toggle"' + (n.href ? ' data-href="' + esc(n.href) + '"' : "") + ' aria-expanded="false" aria-controls="sub-' + n.id + '">' +
      esc(n.label || t(n.k)) + '<span class="caret" aria-hidden="true"></span></button><ul class="sub" id="sub-' + n.id + '">' +
      n.kids.map(function (c) {
        return c.soon
          ? '<li><span class="soon-item">' + esc(t(c.k)) + "<small>" + esc(t("soon")) + "</small></span></li>"
          : "<li>" + navLink(c) + "</li>";
      }).join("") + "</ul></li>";
  }

  function closeSubs() {
    $$(".has-sub.open").forEach(function (li) {
      li.classList.remove("open");
      var b = $(".sub-toggle", li); if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  /* ---------- appearance: light/dark theme + high contrast ---------- */
  function isDark() { return document.documentElement.getAttribute("data-theme") === "dark"; }
  function isHiCon() { return document.documentElement.getAttribute("data-contrast") === "high"; }
  function applyTheme(mode) {
    if (mode === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("nj-theme", mode); } catch (e) {}
  }
  function applyContrast(hi) {
    if (hi) document.documentElement.setAttribute("data-contrast", "high");
    else document.documentElement.removeAttribute("data-contrast");
    try { localStorage.setItem("nj-contrast", hi ? "high" : "normal"); } catch (e) {}
  }
  /* A "sliders" icon (three bars, each crossed by one small toggle knob) rather than a gear —
     closer to GitHub's own accessibility/appearance icon and clearer at this small size. */
  var APPEARANCE_ICON =
    '<svg viewBox="0 0 20 20" aria-hidden="true" stroke-width="1.6" stroke-linecap="round">' +
    '<line x1="3" y1="5" x2="17" y2="5"></line><circle cx="8" cy="5" r="2.1" style="fill:var(--surface)"></circle>' +
    '<line x1="3" y1="10" x2="17" y2="10"></line><circle cx="13" cy="10" r="2.1" style="fill:var(--surface)"></circle>' +
    '<line x1="3" y1="15" x2="17" y2="15"></line><circle cx="7" cy="15" r="2.1" style="fill:var(--surface)"></circle>' +
    "</svg>";
  var LANG_ICON = '<svg class="lang-ico" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8"></circle><ellipse cx="10" cy="10" rx="3.6" ry="8"></ellipse><line x1="2" y1="10" x2="18" y2="10"></line></svg>';
  function appearanceHtml() {
    return '<div class="appearance">' +
      '<button class="appearance-btn" type="button" title="' + esc(t("theme.appearance")) + '" aria-label="' + esc(t("theme.appearance")) + '" aria-haspopup="true" aria-expanded="false">' + APPEARANCE_ICON + "</button>" +
      '<div class="appearance-menu" hidden>' +
      '<p class="am-h">' + esc(t("theme.theme")) + '</p>' +
      '<div class="am-row">' +
      '<button class="am-opt" type="button" data-set="theme-light" aria-pressed="' + (!isDark()) + '">' + esc(t("theme.light")) + "</button>" +
      '<button class="am-opt" type="button" data-set="theme-dark" aria-pressed="' + isDark() + '">' + esc(t("theme.dark")) + "</button>" +
      "</div>" +
      '<p class="am-h">' + esc(t("theme.contrast")) + '</p>' +
      '<div class="am-row">' +
      '<button class="am-opt" type="button" data-set="contrast-normal" aria-pressed="' + (!isHiCon()) + '">' + esc(t("theme.normal")) + "</button>" +
      '<button class="am-opt" type="button" data-set="contrast-high" aria-pressed="' + isHiCon() + '">' + esc(t("theme.high")) + "</button>" +
      "</div></div></div>";
  }

  function isHomePage() { return (document.body.getAttribute("data-page") || "") === "home"; }
  function buildHeader() {
    put("site-header",
      '<header class="site"><div class="wrap bar">' +
      '<a class="brand" href="index.html">' + (S.logo ? '<img class="mark" src="' + esc(S.logo) + '" alt="">' : '<span class="mark" aria-hidden="true">ने</span>') + '' +
      ('<span class="brand-text"><strong>' + esc(L(S.name)) + "</strong><small>" + esc(L(S.place)) + "</small></span>") + "</a>" +
      '<nav id="nav" aria-label="' + esc(t("menu")) + '"><ul>' + navList().map(navItem).join("") + "</ul></nav>" +
      '<div class="bar-right"><button class="lang" type="button" lang="' + esc(t("lang.code")) + '" aria-label="' + esc(t("lang.aria")) + '">' + LANG_ICON + '<span class="lang-full">' + esc(t("lang.btn")) + '</span><span class="lang-short" aria-hidden="true">' + esc(t("lang.short")) + "</span></button>" + appearanceHtml() +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav"><span class="sr">' + esc(t("menu")) + "</span><i></i></button></div>" +
      "</div></header>");

    var hdr = $("header.site"), btn = $(".nav-toggle", hdr);
    var apWrap = $(".appearance", hdr), apBtn = $(".appearance-btn", hdr), apMenu = $(".appearance-menu", hdr);
    apBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = apMenu.hasAttribute("hidden");
      if (open) { apMenu.removeAttribute("hidden"); apBtn.setAttribute("aria-expanded", "true"); }
      else { apMenu.setAttribute("hidden", ""); apBtn.setAttribute("aria-expanded", "false"); }
    });
    $$(".am-opt", apMenu).forEach(function (b) {
      b.addEventListener("click", function () {
        var set = b.getAttribute("data-set");
        if (set === "theme-light") applyTheme("light");
        else if (set === "theme-dark") applyTheme("dark");
        else if (set === "contrast-normal") applyContrast(false);
        else if (set === "contrast-high") applyContrast(true);
        $$(".am-opt", apMenu).forEach(function (x) {
          var k = x.getAttribute("data-set");
          if (k.indexOf("theme-") === 0) x.setAttribute("aria-pressed", String(k === "theme-" + (isDark() ? "dark" : "light")));
          else x.setAttribute("aria-pressed", String(k === "contrast-" + (isHiCon() ? "high" : "normal")));
        });
      });
    });
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = hdr.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".sub-toggle", hdr).forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var go = b.getAttribute("data-href");
        if (go && !hdr.classList.contains("compact") && window.matchMedia("(min-width: 1180px) and (hover: hover)").matches) { location.href = go; return; }
        var li = b.parentNode, willOpen = !li.classList.contains("open");
        closeSubs();
        if (willOpen) { li.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
      });
    });
    $(".lang", hdr).addEventListener("click", function () {
      lang = t("lang.code");
      saveLang(lang);
      render();
      var nb = $(".lang"); if (nb) nb.focus();
    });

    fitHeader();
    scrolledOn = false; scrollTick = false;
    markScrolled();
    if (!globalBound) {
      globalBound = true;
      window.addEventListener("scroll", markScrolled, { passive: true });
      var fitT; window.addEventListener("resize", function () { clearTimeout(fitT); fitT = setTimeout(fitHeader, 120); });
      if (document.fonts) {
        if (document.fonts.ready) document.fonts.ready.then(fitHeader);
        if (document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", fitHeader);
      }
      window.addEventListener("load", function () { fitHeader(); setTimeout(fitHeader, 700); setTimeout(fitHeader, 2500); markScrolled(); setTimeout(markScrolled, 400); setTimeout(markScrolled, 1500); });
      /* Re-check the bar state whenever the layout settles (fonts, images, phone address bar hiding/showing, rotating): otherwise,
         without any scroll, it could stay in a wrong "scrolled" state from an early measurement. */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(markScrolled);
      ["resize", "orientationchange", "pageshow", "touchend"].forEach(function (ev) { window.addEventListener(ev, function () { setTimeout(markScrolled, 60); }, { passive: true }); });
      document.addEventListener("visibilitychange", function () { if (!document.hidden) markScrolled(); });
      if ("ResizeObserver" in window) { var ro = new ResizeObserver(function () { markScrolled(); }); var hr = document.getElementById("hero"); if (hr) ro.observe(hr); }
      document.addEventListener("click", function (e) {
        if (!e.target.closest || !e.target.closest(".has-sub")) closeSubs();
        if (!e.target.closest || !e.target.closest(".appearance")) {
          var m = $(".appearance-menu"); if (m) m.setAttribute("hidden", "");
          var ab = $(".appearance-btn"); if (ab) ab.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        closeSubs();
        var m = $(".appearance-menu"); if (m) m.setAttribute("hidden", "");
        var ab = $(".appearance-btn"); if (ab) ab.setAttribute("aria-expanded", "false");
        var h = $("header.site");
        if (h && h.classList.contains("open")) { h.classList.remove("open"); var b = $(".nav-toggle", h); b.setAttribute("aria-expanded", "false"); b.focus(); }
      });
    }
  }

  /* On a wide screen the full menu is shown in one row. If the mandir name would get too squeezed
     (long English name, big browser zoom, wide fonts), switch to the hamburger menu instead of overlapping. */
  var scrolledOn = false, scrollTick = false;
  /* Header states:
     - inner pages: turns ivory a little after you start scrolling.
     - Home: stays fully transparent (and without the mandir name, because the big banner already shows it)
       until the name in the banner has scrolled away (then the name appears in the bar) and
       until the WHOLE banner has scrolled past (only then the bar turns solid). */
  function markScrolled() {
    if (scrollTick) return;
    scrollTick = true;
    window.requestAnimationFrame(function () {
      scrollTick = false;
      var h = $("header.site"); if (!h) return;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var want;
      if (isHomePage() && y < 60) {
        /* at the very top of Home the bar is always see-through and nameless */
        document.body.classList.remove("name-in-bar");
        want = false;
      } else if (isHomePage()) {
        var top = document.getElementById("site-top"), hero = document.getElementById("hero");
        var hb = top ? top.getBoundingClientRect().bottom : 120;
        var place = document.getElementById("hero-place");
        var nameGone = place ? place.getBoundingClientRect().bottom < hb - 6 : y > 300;
        document.body.classList.toggle("name-in-bar", nameGone);
        var heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        want = scrolledOn ? heroBottom < hb + 30 : heroBottom < hb + 2;
      } else {
        want = scrolledOn ? y > 12 : y > 70;
      }
      if (want !== scrolledOn) { scrolledOn = want; h.classList.toggle("scrolled", want); }
    });
  }
  /* The same decision on every page. Full menu if it fits in one row; if not, first a "tight" version
     (smaller menu letters, short name), and only if even that does not fit, the hamburger menu. */
  function fitHeader() {
    var hdr = $("header.site"); if (!hdr) return;
    hdr.classList.remove("compact", "tight");
    if (!window.matchMedia("(min-width: 1180px)").matches) return;
    var bar = $(".bar", hdr), ul = $("nav#nav > ul", hdr), right = $(".bar-right", hdr), mark = $(".mark", hdr);
    if (!bar || !ul) return;
    var cs = getComputedStyle(bar);
    function fits(reserve) {
      var avail = bar.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var need = (mark ? mark.getBoundingClientRect().width : 0) + reserve + ul.scrollWidth + (right ? right.getBoundingClientRect().width : 0) + 3 * (parseFloat(cs.columnGap) || 14);
      return need <= avail;
    }
    if (fits(200)) return;
    hdr.classList.add("tight");
    if (fits(150)) return;
    hdr.classList.remove("tight");
    hdr.classList.add("compact");
  }

  function ensureTop() {
    if (document.getElementById("site-top")) return;
    var b = document.getElementById("site-banner"), h = document.getElementById("site-header");
    if (!b || !h) return;
    var top = document.createElement("div");
    top.id = "site-top";
    b.parentNode.insertBefore(top, b);
    top.appendChild(b);
    top.appendChild(h);
  }

  function buildBanner() {
    var host = document.getElementById("site-banner");
    if (!host) return;
    var B = window.BANNER || {}, dismissed = false;
    try { dismissed = sessionStorage.getItem("nj-banner") === "1"; } catch (e) {}
    if (!B.enabled || dismissed || !L(B.text)) { host.innerHTML = ""; return; }
    host.innerHTML = '<div class="topbar"><div class="wrap topbar-in"><p><span class="tb-text">' + esc(L(B.text)) + "</span>" +
      (B.link ? '<a href="' + esc(B.link) + '">' + esc(L(B.linkText) || t("banner.more")) + "</a>" : "") +
      '</p><button type="button" class="topbar-x" aria-label="' + esc(t("lb.close")) + '">&times;</button></div></div>';
    $(".topbar-x", host).addEventListener("click", function () {
      try { sessionStorage.setItem("nj-banner", "1"); } catch (e) {}
      host.innerHTML = "";
    });
  }

  /* ---------- footer ---------- */
  var ANALYTICS_LOADED = false;
  function loadAnalytics() {
    if (ANALYTICS_LOADED) return;
    var id = String((S.analyticsId || "")).trim();
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;
    ANALYTICS_LOADED = true;
    var s1 = document.createElement("script");
    s1.async = true; s1.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s1);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("js", new Date()); gtag("config", id);
    window.gtag = gtag;
  }
  var GC_LOADED = false;
  function gcCode() { return String(S.goatcounter || "").trim().replace(/[^a-z0-9-]/gi, ""); }
  /* GoatCounter (goatcounter.com) tracks the visit; this is what makes the count in the footer go up.
     It only loads if SITE.goatcounter has a code in js/data.js. */
  function loadGoatCounter() {
    if (GC_LOADED) return;
    var code = gcCode();
    if (!code) return;
    GC_LOADED = true;
    var s = document.createElement("script");
    s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + code + ".goatcounter.com/count");
    document.head.appendChild(s);
  }
  /* The little public number shown in the footer. It reads the count GoatCounter already has;
     it can take up to a few hours after a visit for the number to update. We fetch the plain
     number ourselves (instead of GoatCounter's own picture-badge) so it reads clearly against
     the dark footer, in the site's own text style. */
  function counterHtml() {
    var code = gcCode();
    if (!code) return "";
    return '<p class="foot-count" id="foot-count">' + esc(t("f.visitors")) + ': <strong id="gc-count">…</strong></p>';
  }
  function fetchVisitorCount() {
    var code = gcCode(), el = document.getElementById("gc-count");
    if (!code || !el) return;
    fetch("https://" + code + ".goatcounter.com/counter/TOTAL.json")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { if (d && d.count) el.textContent = d.count; else throw 0; })
      .catch(function () { var p = document.getElementById("foot-count"); if (p) p.remove(); });
  }
  function buildFooter() {
    loadAnalytics();
    loadGoatCounter();
    var nameNow = String(L(S.name));
    var addr = (L(S.addressLines) || []).filter(function (a) { return String(L(a)).indexOf(nameNow) !== 0; }).map(function (a) { return esc(L(a)); }).join("<br>");
    var links = "";
    if (S.phone) links += '<li><a href="' + telHref(S.phone) + '">' + esc(S.phone) + "</a></li>";
    if (S.email) links += '<li><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></li>";
    var cred = S.credit && S.credit.name ? '<a class="foot-credit" href="' + esc(S.credit.url || "#") + '" target="_blank" rel="noopener">' + esc(t("f.by", { name: S.credit.name })) + "</a>" : "";
    put("site-footer",
      '<footer class="site"><div class="wrap"><div class="foot-grid">' +
      '<div><p class="foot-name">' + esc(L(S.name)) + "</p><p class=\"foot-addr\">" + addr + "</p></div>" +
      '<div class="foot-right"><ul class="foot-links">' + links + '</ul><span class="foot-follow"><span class="foot-follow-h">' + esc(t("v.follow")) + '</span><span class="foot-social">' + socialIconsHtml("ficon") + "</span></span>" +
      '<button type="button" class="btn install-btn install-foot" hidden>' + esc(t("app.btn")) + "</button></div></div>" +
      '<div class="foot-bottom"><p class="legal">' + esc(t("f.legal", { year: new Date().getFullYear(), name: L(S.name), place: L(S.place) })) + "</p>" +
      '<div class="foot-meta"><div class="foot-sub">' + counterHtml() + cred + "</div></div></div></div></footer>");
    fetchVisitorCount();
    syncFollowWidth();
    refreshInstall();
  }

  /* "Follow us" row gets exactly the width of the visitor/credit row below, so left and right edges line up. */
  function syncFollowWidth() {
    var sub = document.querySelector(".foot-sub"), fol = document.querySelector(".foot-follow");
    if (!sub || !fol) return;
    function sync() {
      fol.style.width = window.matchMedia("(max-width: 680px)").matches ? "" : sub.getBoundingClientRect().width + "px";
    }
    sync();
    if (window.ResizeObserver) new ResizeObserver(sync).observe(sub);
    window.addEventListener("resize", sync);
  }

  /* ---------- static texts ---------- */
  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    var nm = L(S.name) + ", " + L(S.place);
    document.title = page === "home" ? nm : t("p." + page + ".h1") + " · " + nm;
  }

  /* ---------- home: hero ---------- */
  function renderHero() {
    var h1 = document.getElementById("hero-name"); if (!h1) return;
    h1.textContent = L(S.name);
    var pl = document.getElementById("hero-place"); if (pl) pl.textContent = L(S.place);
    var sub = document.getElementById("hero-sub");
    if (sub) { var inv = S.heroInvocation ? L(S.heroInvocation) : (lang === "hi" ? "॥ जय जिनेन्द्र ॥" : "|| Jai Jinendra ||"); sub.textContent = inv; sub.hidden = !inv; }
    var lead = document.getElementById("hero-lead"); if (lead) lead.textContent = L(S.heroLine || S.tagline);
    var cta = document.getElementById("hero-ctas");
    if (cta) {
      var btns = (S.heroButtons && S.heroButtons.length) ? S.heroButtons : [
        { href: "daan.html", label: { hi: t("nav.daan"), en: t("nav.daan") }, style: "gold" },
        { href: "daily.html", label: { hi: t("hero.cta_time"), en: t("hero.cta_time") }, style: "ghost" }];
      cta.innerHTML = btns.filter(function (b) { return b && b.href; }).map(function (b) {
        return '<a class="btn ' + (b.style === "ghost" ? "btn-ghost" : "btn-gold") + '" href="' + esc(b.href) + '">' + esc(L(b.label)) + ' <span class="arrow">&rarr;</span></a>';
      }).join("");
    }
    var sc = document.getElementById("hero-scroll-t"); if (sc) sc.textContent = t("hero.scroll");
    /* Bhagwan ki murti: the photo from SITE.murti. The golden placeholder stays until the picture really loads. */
    var fig = document.getElementById("hero-murti"), img = document.getElementById("hero-murti-img");
    if (fig && img && S.murti) {
      img.onload = function () { fig.classList.add("ok"); };
      img.onerror = function () { fig.classList.remove("ok"); fig.classList.add("fail"); img.removeAttribute("src"); };
      /* the built-in smaller copy (neminath-520.webp) is used only for the default photo; a different photo in SITE.murti is shown as it is */
      if (img.getAttribute("src") !== S.murti) { img.removeAttribute("srcset"); img.src = S.murti; }
      if (img.complete && img.naturalWidth) fig.classList.add("ok");
    }
    /* Namokar mantra marquee: the line is written twice so the loop never shows a gap. */
    var tr = document.getElementById("mantra-track");
    if (tr) {
      var lines = (S.mantraLines && S.mantraLines.length ? S.mantraLines : ["णमो अरिहंताणं"]);
      var once = lines.map(function (x) { return "<span>" + esc(x) + '</span><i aria-hidden="true">❁</i>'; }).join("");
      tr.innerHTML = once + once + once + once;
    }
    startPetals();
    setupMantraAudio();
  }

  /* Namokar mantra audio on the Home page. ON by default; a small button lets a visitor switch it off (remembered on that device).
     Browsers do not allow sound before the visitor touches the page, so it starts at the first tap / click / key press. */
  var audioState = null;
  function setupMantraAudio() {
    var A = S.audio;
    if (!A || !A.enabled || !A.file || audioState) return;
    var off = false; try { off = localStorage.getItem("nemi-audio") === "off"; } catch (e) {}
    var au = new Audio(); au.loop = true; au.preload = "none"; au.volume = A.volume > 0 && A.volume <= 1 ? A.volume : 0.6;
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "audio-btn"; btn.hidden = true;
    audioState = { au: au, btn: btn };
    function label() {
      var playing = !au.paused;
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      btn.innerHTML = '<span aria-hidden="true">' + (playing ? "🔊" : "🔇") + "</span><b>" + esc(t(playing ? "audio.stop" : "audio.play")) + "</b>";
    }
    function start() { var p = au.play(); if (p && p.then) p.then(label, function () { label(); armFirstTouch(); }); }
    var armed = false;
    function armFirstTouch() {
      if (armed || off) return; armed = true;
      var evs = ["pointerdown", "click", "keydown", "touchend"];
      function go() { evs.forEach(function (e) { document.removeEventListener(e, go, true); }); armed = false; if (!off && au.paused) start(); }
      evs.forEach(function (e) { document.addEventListener(e, go, true); });
    }
    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (au.paused) { off = false; try { localStorage.removeItem("nemi-audio"); } catch (e) {} start(); }
      else { off = true; au.pause(); try { localStorage.setItem("nemi-audio", "off"); } catch (e) {} label(); }
    });
    au.addEventListener("pause", label); au.addEventListener("play", label);
    /* the button shows only if the audio file really exists */
    fetch(A.file, { method: "HEAD", cache: "no-store" }).then(function (r) {
      if (!r.ok) throw 0;
      au.src = A.file; document.body.appendChild(btn); btn.hidden = false; label();
      if (!off) { start(); armFirstTouch(); }
    }).catch(function () {});
  }

  /* Floating petals and small lotus flowers in the Home hero (drawn on a canvas). They drift down slowly,
     sway and turn. Stops when the hero is off-screen or the tab is hidden, and is skipped for people who
     asked their device for less motion. */
  var petalState = null;
  function startPetals() {
    var cv = document.getElementById("hero-petals"); if (!cv || !cv.getContext) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (petalState || S.heroPetals === false) return;
    var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), items = [], visible = true, raf = 0;
    var COLS = ["#E07A3C", "#F2B48A", "#E8D5A0", "#E8A0B4", "#FFD9A0", "#C9A961"];
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = W < 700 ? 14 : 28; items = [];
      for (var i = 0; i < n; i++) items.push(mk(true, i));
    }
    function mk(initial, i) {
      return { x: Math.random() * W, y: initial ? Math.random() * H : -20, s: 7 + Math.random() * 11, vy: .22 + Math.random() * .5,
        a: Math.random() * 6.28, va: (Math.random() - .5) * .02, ph: Math.random() * 6.28, sw: 14 + Math.random() * 30,
        c: COLS[Math.floor(Math.random() * COLS.length)], al: .45 + Math.random() * .4, flower: i % 7 === 0 };
    }
    function petal(s) {
      ctx.beginPath(); ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * .75, -s * .5, s * .6, s * .6, 0, s);
      ctx.bezierCurveTo(-s * .6, s * .6, -s * .75, -s * .5, 0, -s); ctx.fill();
    }
    function draw(p) {
      ctx.save(); ctx.translate(p.x + Math.sin(p.ph) * p.sw, p.y); ctx.rotate(p.a); ctx.globalAlpha = p.al; ctx.fillStyle = p.c;
      if (p.flower) { for (var k = 0; k < 6; k++) { ctx.save(); ctx.rotate(k * 1.047); ctx.translate(0, -p.s * .6); petal(p.s * .62); ctx.restore(); } ctx.fillStyle = "#FFF4D0"; ctx.beginPath(); ctx.arc(0, 0, p.s * .22, 0, 6.28); ctx.fill(); }
      else { ctx.scale(.62, 1); petal(p.s); }
      ctx.restore();
    }
    /* on phones the petals are drawn 30 times a second (moving twice as far each time), which looks the same but needs half the work */
    var odd = false;
    function tick() {
      raf = 0; if (!visible || document.hidden) return;
      var k = W < 700 ? 2 : 1;
      if (k === 2) { odd = !odd; if (odd) { raf = requestAnimationFrame(tick); return; } }
      ctx.clearRect(0, 0, W, H);
      items.forEach(function (p, i) {
        p.y += p.vy * k; p.ph += .012 * k; p.a += p.va * k;
        if (p.y > H + 24) items[i] = mk(false, i);
        draw(p);
      });
      raf = requestAnimationFrame(tick);
    }
    function kick() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); }
    size(); kick();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 200); });
    document.addEventListener("visibilitychange", kick);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; kick(); }).observe(cv);
    petalState = { ok: true };
  }

  function statusModel() {
    var T = S.timings, now = nowMinutes();
    var items = [["tm.open", T.open], ["tm.abhishek", T.abhishek], ["tm.aarti", T.aarti], ["tm.close", T.close]];
    var isOpen = now >= toMin(T.open) && now < toMin(T.close);
    var nextIdx = -1, i;
    for (i = 0; i < items.length; i++) { if (toMin(items[i][1]) > now) { nextIdx = i; break; } }
    var title, sub;
    if (isOpen) {
      title = t("status.open");
      sub = nextIdx === items.length - 1 ? t("status.closesAt", { time: fmtTime(T.close) }) : t("status.next", { what: t(items[nextIdx][0]), time: fmtTime(items[nextIdx][1]) });
    } else if (now < toMin(T.open)) {
      title = t("status.closed"); sub = t("status.opensAt", { time: fmtTime(T.open) });
    } else {
      title = t("status.closedToday"); sub = t("status.opensTomorrow", { time: fmtTime(T.open) });
    }
    return { items: items, nextIdx: nextIdx, isOpen: isOpen, title: title, sub: sub, now: now };
  }
  function renderPanel() {
    if (!showTimings()) { put("hero-panel", ""); return; }
    var m = statusModel();
    var rows = m.items.map(function (it, idx) {
      var cls = idx === m.nextIdx ? "next" : (toMin(it[1]) <= m.now ? "done" : "");
      return '<li class="' + cls + '">' + (cls === "next" ? '<span data-nx="' + esc(t("tm.nextlabel")) + '">' : "<span>") + esc(t(it[0])) + "</span><time>" + esc(fmtTime(it[1])) + "</time></li>";
    }).join("");
    put("hero-panel",
      '<div class="panel"><p class="status ' + (m.isOpen ? "is-open" : "") + '"><span class="dot" aria-hidden="true"></span><strong>' + esc(m.title) + "</strong></p>" +
      '<p class="status-sub">' + esc(m.sub) + '</p><ol class="timeline">' + rows + "</ol>" +
      '<p class="panel-note">' + esc(L(S.timingsNote) || t("tm.note")) + "</p></div>");
  }

  /* ---------- announcements ---------- */
  function sortedAnnouncements() {
    return vis(window.ANNOUNCEMENTS).slice().sort(function (a, b) {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return (a.date || "") < (b.date || "") ? 1 : -1;
    });
  }
  function noticeCard(a) {
    return '<article class="notice' + (a.pinned ? " pinned" : "") + '"><h3>' + esc(L(a.title)) + '</h3>' + (a.date ? '<p class="when">' + esc(longDate(a.date)) + "</p>" : "") + "<p>" + esc(L(a.text)) + "</p></article>";
  }
  /* Home shows only the pinned ("highlighted") announcements, so day-to-day notices don't
     clutter the home page. Everything (pinned or not) is always on the full Announcements page.
     If nothing is pinned, the announcements section is left out of Home. */
  function renderAnnouncements() {
    var list = sortedAnnouncements().filter(function (a) { return a.pinned; });
    putHome("announcements", list.length ? '<div class="notices">' + list.map(noticeCard).join("") + "</div>" : "");
  }
  function renderAnnouncementsPage() {
    var host = document.getElementById("announcements-list"); if (!host) return;
    var all = sortedAnnouncements();
    host.innerHTML = all.length ? '<div class="notices">' + all.map(noticeCard).join("") + "</div>" : '<p class="empty">' + esc(t("empty.notices")) + "</p>";
  }

  /* ---------- yojana ---------- */
  /* Photos on yojanayen and timeline entries: write  photo: "images/x.jpg"  or  photos: ["images/a.jpg", "images/b.jpg"]
     (or objects  { src: "...", caption: { hi: "", en: "" } } ). Clicking a picture opens it big (with next/previous). */
  var picGroups = [];
  function photoList(x) {
    var out = [];
    function add(p) { if (!p) return; if (typeof p === "string") { if (p.trim()) out.push({ src: p.trim(), caption: "" }); } else if (p.src) out.push({ src: p.src, caption: p.caption || "" }); }
    add(x.photo); (x.photos || []).forEach(add);
    return out;
  }
  function picsHtml(list, cls, alt) {
    if (!list.length) return "";
    var g = picGroups.push(list) - 1;
    return '<div class="pics ' + (cls || "") + ' n' + Math.min(list.length, 4) + '">' + list.map(function (p, i) {
      return '<button class="pic-btn" type="button" data-g="' + g + '" data-i="' + i + '" aria-label="' + esc(t("g.open", { n: i + 1 })) + '"><img loading="lazy" alt="' + esc(L(p.caption) || alt || "") + '" src="' + esc(p.src) + '" onerror="var b=this.parentNode;b.remove()"></button>';
    }).join("") + "</div>";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".pic-btn"); if (!b) return;
    var list = picGroups[parseInt(b.getAttribute("data-g"), 10)]; if (!list) return;
    openLightbox(list, parseInt(b.getAttribute("data-i"), 10));
  });

  function yojanaCard(y, compact) {
    var st = y.status || "active";
    var chip = '<span class="chip chip-' + esc(st) + '">' + esc(t("st." + st)) + "</span>";
    if (compact) {
      var cp = photoList(y)[0];
      return '<article class="yojana compact">' + (cp ? '<a class="ycover" href="yojana.html#' + esc(y.id) + '" tabindex="-1" aria-hidden="true"><img loading="lazy" alt="" src="' + esc(cp.src) + '" onerror="this.parentNode.remove()"></a>' : "") + '<div class="yhead"><h3><a href="yojana.html#' + esc(y.id) + '">' + esc(L(y.title)) + "</a></h3>" + chip + "</div><p>" + esc(L(y.short)) + "</p></article>";
    }
    var det = (y.details || []).filter(function (d) { return L(d); }).map(function (d) { return "<li>" + esc(L(d)) + "</li>"; }).join("");
    var money = "";
    if (y.target) money += "<div><dt>" + esc(t("y.target")) + "</dt><dd>" + esc(y.target) + "</dd></div>";
    if (y.raised) money += "<div><dt>" + esc(t("y.raised")) + "</dt><dd>" + esc(y.raised) + "</dd></div>";
    /* No per-card "give daan / contact" buttons any more: those are common, at the top of the page.
       A card only gets a form button when it has formUrl (a Google Form link) in data.js. */
    var btn = /^https?:\/\//i.test(String(y.formUrl || "").trim())
      ? '<a class="btn btn-primary" href="' + esc(String(y.formUrl).trim()) + '" target="_blank" rel="noopener">' + esc(L(y.formText) || yojanaText("formText", "y.form")) + "</a>" : "";
    var link2 = "";   // the old per-card "link" button is gone: contact and daan buttons are common, at the top of the page
    return '<article class="yojana" id="' + esc(y.id) + '"><div class="yhead"><h3>' + esc(L(y.title)) + "</h3>" + chip + "</div>" + picsHtml(photoList(y), "ypics", L(y.title)) + "<p>" + esc(L(y.summary || y.short)) + "</p>" +
      (det ? "<ul>" + det + "</ul>" : "") + (money ? '<dl class="rows">' + money + "</dl>" : "") + (btn || link2 ? '<div class="btn-row">' + btn + link2 + "</div>" : "") + "</article>";
  }
  /* Common wording on the Yojana page: window.YOJANA_PAGE in data.js can override it; otherwise i18n.js has the default. */
  function yojanaText(key, i18nKey) { return L((window.YOJANA_PAGE || {})[key]) || t(i18nKey); }
  function renderYojanaPage() {
    var host = document.getElementById("yojana-list"); if (!host) return;
    var all = vis(window.YOJANA);
    var now = all.filter(function (y) { return y.status !== "soon"; });
    var later = all.filter(function (y) { return y.status === "soon"; });
    host.innerHTML = '<p class="measure">' + esc(t("y.intro")) + "</p>" +
      '<div class="btn-row y-common"><a class="btn btn-line" href="team.html">' + esc(yojanaText("contactText", "y.common_contact")) + '</a>' +
      '<a class="btn btn-primary" href="daan.html">' + esc(yojanaText("daanText", "y.common_daan")) + "</a></div>" +
      (now.length ? '<section><h2>' + esc(t("y.now")) + '</h2><div class="ylist">' + now.map(function (y) { return yojanaCard(y); }).join("") + "</div></section>" : "") +
      (later.length ? '<section><h2>' + esc(t("y.later")) + '</h2><div class="ylist">' + later.map(function (y) { return yojanaCard(y); }).join("") + "</div></section>" : "");
  }
  function renderHomeYojana() {
    var all = vis(window.YOJANA).filter(function (y) { return y.pinned; });
    putHome("home-yojana", all.length ? '<p class="home-hint"><span aria-hidden="true">ℹ</span> ' + esc(t("home.yojana_hint")) + '</p><div class="cards three">' + all.map(function (y) { return yojanaCard(y, true); }).join("") + "</div>" : "");
  }

  /* ---------- activities (menu: Nemidham Cricket Club, Trekking, ...) ----------
     Each activity has its own page (kids-club.html, trekking.html, ...). The page reads its block in
     window.ACTIVITIES (data.js): poster picture, quick facts, text, sections, contact people, form link. */
  var ACT_COLORS = { orange: 1, blue: 1, purple: 1, green: 1, pink: 1, gold: 1, teal: 1 };
  function actList(items) {
    var li = vis(items).filter(function (x) { return L(x); }).map(function (x) {
      var ic = x.icon ? '<span class="li-ic" aria-hidden="true">' + esc(x.icon) + "</span>" : "";
      var tm = L(x.time) ? '<span class="li-tm">' + esc(L(x.time)) + "</span>" : "";
      return '<li class="' + (x.icon ? "has-ic" : "") + (tm ? " has-tm" : "") + '">' + ic + tm + "<span>" + esc(L(x)) + "</span></li>";
    }).join("");
    return li ? "<ul>" + li + "</ul>" : "";
  }
  function actParas(items) {
    return vis(items).filter(function (x) { return L(x); }).map(function (x) { return "<p>" + esc(L(x)) + "</p>"; }).join("");
  }
  function renderActivityPage() {
    var host = document.getElementById("activity"); if (!host) return;
    var id = activityId();
    var a = vis(window.ACTIVITIES).filter(function (x) { return x.id === id; })[0];
    if (!a) { host.innerHTML = '<p class="empty">' + esc(t("act.none")) + "</p>"; return; }
    setHead(L(a.title), L(a.short));
    var soon = a.comingSoon !== false;
    var paras = actParas(a.paragraphs), list = actList(a.list);
    var decor = String(a.decor || "").split(/\s+/).filter(Boolean).map(function (e, k) {
      return '<span style="animation-delay:' + (k * 0.25) + 's">' + esc(e) + "</span>";
    }).join("");
    var facts = vis(a.info).filter(function (i) { return L(i.value); }).map(function (i) {
      return '<div class="act-fact"><span class="ic" aria-hidden="true">' + esc(i.icon || "✨") + "</span><div><dt>" + esc(L(i.label)) + "</dt><dd>" + esc(L(i.value)) + "</dd></div></div>";
    }).join("");
    function secHtml(sc) {
      var body = actParas(sc.paragraphs) + actList(sc.list);
      if (!body && !L(sc.title)) return "";
      var c = ACT_COLORS[sc.color] ? sc.color : "gold";
      return '<section class="card act-sec c-' + c + (sc.wide ? " wide" : "") + '">' +
        (L(sc.title) ? "<h2>" + (sc.icon ? '<span class="ic" aria-hidden="true">' + esc(sc.icon) + "</span>" : "") + "<span>" + esc(L(sc.title)) + "</span></h2>" : "") +
        (L(sc.sub) ? '<p class="sub-line">' + esc(L(sc.sub)) + "</p>" : "") + body + "</section>";
    }
    var allSecs = vis(a.sections);
    var secs = allSecs.map(secHtml).join("");
    var people = vis(a.contacts).filter(function (c) { return L(c.name) || c.phone; }).map(function (c) {
      return "<li><span class=\"act-pn\">" + esc(L(c.name)) + (L(c.role) ? "<small>" + esc(L(c.role)) + "</small>" : "") + "</span>" +
        (c.phone ? '<a class="call-btn" href="' + telHref(c.phone) + '"><span aria-hidden="true">📞</span> ' + esc(c.phone) + "</a>" : "") + "</li>";
    }).join("");
    var formOk = /^https?:\/\//i.test(a.formUrl || "");
    var contact = '<section class="card act-sec act-contact c-green"><h2><span class="ic" aria-hidden="true">🎉</span><span>' + esc(L(a.contactTitle) || t("act.contact_h")) + "</span></h2>" +
      (L(a.contactNote) ? "<p>" + esc(L(a.contactNote)) + "</p>" : "") +
      (people ? '<ul class="act-people">' + people + "</ul>" : "") +
      '<div class="btn-row">' +
      (formOk ? '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + esc(a.formUrl) + '">' + esc(L(a.formText) || yojanaText("formText", "y.form")) + "</a>" : "") +
      (people ? "" : '<a class="btn btn-line" href="team.html">' + esc(L(a.contactText) || t("y.common_contact")) + "</a>") +
      "</div></section>";
    var poster = a.poster ? '<figure class="act-poster"><a href="' + esc(a.poster) + '" target="_blank" rel="noopener"><img src="' + esc(a.poster) + '" alt="' + esc(L(a.title)) + '"></a>' +
      "<figcaption>" + esc(t("act.poster_hint")) + "</figcaption></figure>" : "";
    var empty = !paras && !list && !facts && !secs;
    var head = (soon ? '<span class="chip chip-soon">' + esc(t("act.soon")) + "</span>" : "") +
      (decor ? '<div class="act-decor" aria-hidden="true">' + decor + "</div>" : "") +
      (L(a.banner) ? '<p class="act-ribbon">' + esc(L(a.banner)) + "</p>" : "") +
      (soon && empty ? '<p class="act-soon-text">' + esc(t("act.soon_text")) + "</p>" : "") +
      (facts ? '<dl class="act-facts">' + facts + "</dl>" : "") +
      (paras || list ? '<div class="card act-sec c-gold act-intro">' + paras + list + "</div>" : "");
    host.innerHTML = '<div class="act-page-wrap">' +
      (poster ? '<div class="act-top has-poster">' + poster + '<div class="act-head">' + head + "</div></div>" : '<div class="act-head">' + head + "</div>") +
      (secs ? '<div class="act-secs">' + secs + "</div>" : "") + contact + "</div>";
  }

  /* ---------- karyakram + calendar ---------- */
  /* Bhaktamar month card: month name badge, then each date with its punyarjak families */
  /* punyarjak families: one family -> one line; more than one -> a numbered list so they never look like one family */
  function famHtml(names) {
    var list = (names && L(names) || []).filter(Boolean);
    if (list.length < 2) return "<p>" + esc(t("bh.fam")) + ": " + esc(list[0] || "") + "</p>";
    return '<div class="bh-fl">' + esc(t("bh.fams")) + ':</div><ol class="bh-flist">' + list.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ol>";
  }
  function bhCard(e, past) {
    var today = todayISO();
    if (e.groups.length === 1) {   /* only one date in the month: a normal-looking karyakram card */
      var g = e.groups[0], meta = [fullDate(g.date), L(e.time), L(e.place)].filter(Boolean).map(esc).join(", ");
      return '<article class="event' + (past ? " past" : "") + '">' + dateBadge(g.date) + "<div>" + '<span class="tag">' + esc(L(e.type)) + "</span><h3>" + esc(L(e.title)) + '</h3><p class="meta">' + meta + "</p>" +
        famHtml(g.names) + "</div></article>";
    }
    /* more than one date: month-name badge, then every date with its families */
    var ymd = new Date(e.ym + "-01T00:00:00");
    var days = e.groups.map(function (g) {
      return '<div class="bh-dline' + (g.date < today ? " done" : "") + '"><b>' + esc(fullDate(g.date)) + "</b>" + (L(e.time) ? ", " + esc(L(e.time)) : "") + famHtml(g.names) + "</div>";
    }).join("");
    return '<article class="event event-bh' + (past ? " past" : "") + '"><div class="date mo" aria-hidden="true"><b>' + esc(ymd.toLocaleDateString(loc(), { month: "short" })) + "</b></div><div>" +
      '<span class="tag">' + esc(L(e.type)) + "</span><h3>" + esc(L(e.title)) + '</h3><p class="meta">' + esc(L(e.place)) + "</p>" + days + "</div></article>";
  }
  function eventCard(e, past) {
    if (e.bh) return bhCard(e, past);
    var when = e.endDate && e.endDate !== e.date ? rangeText(e.date, e.endDate) : fullDate(e.date);
    var meta = [when, L(e.time), L(e.place)].filter(Boolean).map(esc).join(", ");
    return '<article class="event' + (past ? " past" : "") + '">' + dateBadge(e.date) + "<div>" +
      (L(e.type) ? '<span class="tag">' + esc(L(e.type)) + "</span>" : "") +
      "<h3>" + esc(L(e.title)) + '</h3><p class="meta">' + meta + "</p>" + (e.fams ? famHtml(e.fams) : L(e.text) ? "<p>" + esc(L(e.text)) + "</p>" : "") + "</div></article>";
  }
  function splitByDate(list, endKey) {
    var today = todayISO();
    var up = list.filter(function (e) { return (e[endKey] || e.date) >= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var past = list.filter(function (e) { return (e[endKey] || e.date) < today; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return { up: up, past: past };
  }
  function tabsHtml() {
    return '<div class="tabs" role="group" aria-label="' + esc(t("tabs.aria")) + '"><button class="tab" type="button" data-tab="upcoming" aria-pressed="true">' + esc(t("tab.upcoming")) +
      '</button><button class="tab" type="button" data-tab="past" aria-pressed="false">' + esc(t("tab.past")) + "</button></div>";
  }
  function wireTabs(host, show) {
    $$(".tab", host).forEach(function (b) {
      b.addEventListener("click", function () {
        var which = b.getAttribute("data-tab");
        $$(".tab", host).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        show(which);
      });
    });
    show("upcoming");
  }
  function renderHomeEvents() {
    var evs = vis(window.EVENTS).filter(function (e) { return e.pinned; });
    var up = splitByDate(evs, "endDate").up.slice(0, 3);
    putHome("home-events", up.length ? '<div class="events">' + up.map(function (e) { return eventCard(e, false); }).join("") + "</div>" : "");
  }
  /* Karyakram older than this many days quietly drop off the "past" list too, so it doesn't
     keep growing forever. Change the number if you'd rather keep them longer. */
  function recentEnough(e, key) {
    var yy = +todayISO().slice(0, 4), yearDays = (yy % 4 === 0 && yy % 100 !== 0) || yy % 400 === 0 ? 366 : 365;
    var days = (S.karyakramPastDays == null || S.karyakramPastDays === "year") ? yearDays : Number(S.karyakramPastDays);
    if (!(days >= 0)) return true;
    var cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
    return new Date((e[key] || e.date) + "T00:00:00") >= cutoff;
  }
  function renderKaryakram() {
    var host = document.getElementById("events"); if (!host) return;
    host.innerHTML = '<p><a class="more" href="calendar.html">' + esc(t("nav.calendar")) + '</a></p>' + tabsHtml() + '<div id="events-list" aria-live="polite"></div>';
    var list = $("#events-list", host), auto = [], which0 = "upcoming";
    function paint(which) {
      which0 = which;
      var sp = splitByDate(vis(window.EVENTS).concat(auto).filter(function (e) { return recentEnough(e, "endDate"); }), "endDate");
      var items = which === "past" ? sp.past : sp.up;
      list.innerHTML = items.length ? '<div class="events">' + items.map(function (e) { return eventCard(e, which === "past"); }).join("") + "</div>"
        : '<p class="empty">' + esc(t(which === "past" ? "empty.past" : "empty.events")) + "</p>";
    }
    wireTabs(host, paint);
    /* Bhaktamar path months from the Daan Sheet also appear here as karyakram (see README) */
    bhaktamarEvents().then(function (evs) { if (evs.length) { auto = evs; paint(which0); } });
  }
  function calCard(c, past) {
    var type = c.type || "other";
    return '<article class="event' + (past ? " past" : "") + '">' + dateBadge(c.date) + "<div>" +
      '<span class="tag tag-' + esc(type) + '">' + esc(t("cal." + type)) + "</span>" +
      "<h3>" + esc(L(c.title)) + '</h3><p class="meta">' + esc(fullDate(c.date)) + "</p>" + (L(c.note) ? "<p>" + esc(L(c.note)) + "</p>" : "") + "</div></article>";
  }
  function renderCalendar() {
    var host = document.getElementById("calendar"); if (!host) return;
    var sp = splitByDate(vis(window.CALENDAR), "date");
    host.innerHTML = tabsHtml() + '<div id="cal-list" aria-live="polite"></div><p class="fine">' + esc(t("cal.note")) + "</p>";
    var list = $("#cal-list", host);
    wireTabs(host, function (which) {
      var items = which === "past" ? sp.past : sp.up;
      list.innerHTML = items.length ? '<div class="events">' + items.map(function (c) { return calCard(c, which === "past"); }).join("") + "</div>"
        : '<p class="empty">' + esc(t(which === "past" ? "empty.cal.past" : "empty.cal.up")) + "</p>";
    });
  }

  /* ---------- gallery ---------- */
  var IMG_RE = /\.(jpe?g|png|gif|webp|avif|svg)$/i, VID_RE = /\.(mp4|webm|ogv|m4v|mov)$/i;

  function galleryList(kind) {
    var G = window.GALLERY || {};
    var oldestFirst = S.albumOrder === "oldest";
    return vis(G[kind]).slice().sort(function (a, b) {
      if ((a.date || "") === (b.date || "")) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return ((a.date || "") < (b.date || "")) === oldestFirst ? -1 : 1;
    });
  }
  function fileUrl(folder, name) {
    var base = String(folder || "").replace(/^\/+|\/+$/g, "");
    var f = String(name).split("/").map(encodeURIComponent).join("/");
    return (base ? base.split("/").map(encodeURIComponent).join("/") + "/" : "") + f;
  }
  function ghInfo() {
    var g = S.github || {};
    if (g.user && g.repo) return g;
    var mt = location.hostname.match(/^([^.]+)\.github\.io$/i);
    if (!mt) return null;
    var seg = location.pathname.split("/").filter(Boolean)[0];
    return { user: mt[1], repo: seg && !/\.html?$/i.test(seg) ? seg : mt[1] + ".github.io" };
  }
  /* The site cannot see inside a folder by itself, so it asks GitHub for the file names. */
  function listFolder(folder, cb) {
    var key = "nj-gh:" + folder;
    try { var c = sessionStorage.getItem(key); if (c) { var o = JSON.parse(c); if (Date.now() - o.t < 600000) { cb(null, o.names); return; } } } catch (e) {}
    var g = ghInfo();
    if (!g || !window.fetch) { cb("nogithub"); return; }
    var url = "https://api.github.com/repos/" + encodeURIComponent(g.user) + "/" + encodeURIComponent(g.repo) + "/contents/" +
      String(folder).replace(/^\/+|\/+$/g, "").split("/").map(encodeURIComponent).join("/");
    fetch(url, { headers: { Accept: "application/vnd.github+json" } }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    }).then(function (list) {
      var names = list.filter(function (x) { return x.type === "file"; }).map(function (x) { return x.name; })
        .sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); });
      try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), names: names })); } catch (e) {}
      cb(null, names);
    }).catch(function (e) { cb(String(e)); });
  }
  function norm(f) { return typeof f === "string" ? { file: f } : f; }
  function usesAuto(a, hasExplicit) { return a.auto === true || (!hasExplicit && a.auto !== false && !!a.folder); }

  /* cb(err, [{src, caption}]) */
  function albumPhotos(a, cb) {
    var explicit = (a.files || []).map(norm).filter(function (f) { return f.file; });
    var out = explicit.map(function (f) { return { src: fileUrl(a.folder, f.file), caption: f.caption, _n: f.file }; });
    if (!usesAuto(a, explicit.length)) { cb(null, out); return; }
    listFolder(a.folder, function (err, names) {
      if (err) { cb(out.length ? null : err, out); return; }
      var have = {}; explicit.forEach(function (f) { have[f.file] = true; });
      names.filter(function (n) { return IMG_RE.test(n) && !have[n]; }).forEach(function (n) { out.push({ src: fileUrl(a.folder, n), caption: "" }); });
      cb(null, out);
    });
  }
  /* cb(err, [{youtube|src, title}]) */
  function albumVideos(a, cb) {
    var items = (a.items || []).map(function (v) {
      if (v.file) return { src: fileUrl(a.folder, v.file), title: v.title, _n: v.file };
      return v;
    });
    if (!a.folder || !usesAuto(a, items.length)) { cb(null, items); return; }
    listFolder(a.folder, function (err, names) {
      if (err) { cb(items.length ? null : err, items); return; }
      var have = {}; items.forEach(function (v) { if (v._n) have[v._n] = true; });
      names.filter(function (n) { return VID_RE.test(n) && !have[n]; }).forEach(function (n) { items.push({ src: fileUrl(a.folder, n), title: "" }); });
      cb(null, items);
    });
  }

  function ytEmbed(v) {
    v = String(v || "").trim();
    var list = (v.match(/[?&]list=([\w-]+)/) || [])[1];
    var id = (v.match(/(?:[?&]v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || [])[1];
    if (!id && /^[\w-]{11}$/.test(v)) id = v;
    var base = "https://www.youtube-nocookie.com/embed/";
    if (id) return base + id + (list ? "?list=" + list : "");
    if (list) return base + "videoseries?list=" + list;
    if (/^UC[\w-]{22}$/.test(v)) return base + "videoseries?list=UU" + v.slice(2);
    if (/^(PL|UU|OL|FL|RD)[\w-]+$/.test(v)) return base + "videoseries?list=" + v;
    return "";
  }
  function ytId(v) {
    var id = (String(v || "").match(/(?:[?&]v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || [])[1];
    return id || (/^[\w-]{11}$/.test(String(v || "").trim()) ? String(v).trim() : "");
  }
  function videoBlock(v) {
    var ttl = L(v.title) || t("g.videos_main");
    var emb = v.youtube ? ytEmbed(v.youtube) : "";
    var inner = emb
      ? '<iframe src="' + esc(emb) + '" title="' + esc(ttl) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'
      : (v.src ? '<video controls preload="metadata" playsinline src="' + esc(v.src) + '"></video>' : "");
    return '<div><div class="video">' + inner + "</div>" + (L(v.title) ? '<p class="vcap">' + esc(L(v.title)) + "</p>" : "") + "</div>";
  }

  function openLightbox(photos, start) {
    var idx = start, dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", t("lb.label"));
    dlg.innerHTML = '<div class="lb"><button class="x" type="button" aria-label="' + esc(t("lb.close")) + '">&times;</button>' +
      '<button class="prev" type="button" aria-label="' + esc(t("lb.prev")) + '">&#8249;</button>' +
      '<button class="next" type="button" aria-label="' + esc(t("lb.next")) + '">&#8250;</button>' +
      '<div style="text-align:center"><img alt=""><p></p></div></div>';
    document.body.appendChild(dlg);
    var img = $("img", dlg), cap = $("p", dlg);
    function draw() {
      var p = photos[idx], c = L(p.caption);
      img.src = p.src; img.alt = c;
      cap.textContent = (c ? c + " (" : "(") + (idx + 1) + " / " + photos.length + ")";
    }
    function step(n) { idx = (idx + n + photos.length) % photos.length; draw(); }
    $(".x", dlg).addEventListener("click", function () { dlg.close(); });
    $(".prev", dlg).addEventListener("click", function () { step(-1); });
    $(".next", dlg).addEventListener("click", function () { step(1); });
    dlg.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { dlg.remove(); });
    draw();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }

  function albumCover(a, kind) {
    if (a.cover) return a.cover;
    if (kind === "photos") {
      var f = (a.files || []).map(norm)[0];
      return f && f.file ? fileUrl(a.folder, f.file) : "";
    }
    var y = (a.items || []).filter(function (v) { return v.youtube && ytId(v.youtube); })[0];
    return y ? "https://i.ytimg.com/vi/" + ytId(y.youtube) + "/hqdefault.jpg" : "";
  }
  function countText(a, kind) {
    if (kind === "photos") { var n = (a.files || []).length; return n ? t("g.photos", { n: n }) : ""; }
    var v = (a.items || []).length; return v ? t("g.videos", { n: v }) : "";
  }
  function thumbHtml(src) { return src ? '<img class="thumb" loading="lazy" alt="" src="' + esc(src) + '" onerror="this.removeAttribute(\'src\')">' : '<span class="thumb"></span>'; }
  /* Albums that only name a folder (no files: line) have no cover or photo count in the data file.
     Read the folder once (cached) and fill the cover picture and the count in afterwards. */
  function fillAutoAlbums(list, host) {
    list.forEach(function (a) {
      if ((a.files && a.files.length) || !a.folder) return;
      albumPhotos(a, function (err, photos) {
        if (!photos || !photos.length) return;
        var card = null, els = host.querySelectorAll("a.album[data-aid]");
        for (var i = 0; i < els.length; i++) if (els[i].getAttribute("data-aid") === a.id) card = els[i];
        if (!card) return;
        var th = card.querySelector(".thumb");
        if (th && th.tagName !== "IMG") {
          var img = document.createElement("img");
          img.className = "thumb"; img.alt = ""; img.loading = "lazy";
          img.src = a.cover || photos[0].src;
          th.parentNode.replaceChild(img, th);
        }
        var meta = card.querySelector(".meta");
        if (meta) {
          meta.textContent = [longDate(a.date), t("g.photos", { n: photos.length })].filter(Boolean).join(" · ");
        }
      });
    });
  }
  function setHead(title, lead) {
    var h1 = $(".page-head h1"), p = $(".page-head p");
    if (h1) h1.textContent = title;
    if (p) p.textContent = lead;
    document.title = title + " · " + L(S.name) + ", " + L(S.place);
  }

  function channelBlock() {
    var cid = String(S.youtubeChannelId || "").trim();
    if (!/^UC[\w-]{22}$/.test(cid)) return "";
    return '<section class="chan"><h2>' + esc(t("g.channel")) + '</h2><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=UU' + esc(cid.slice(2)) +
      '" title="' + esc(t("g.channel")) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div></section>';
  }

  function renderGallery() {
    var host = document.getElementById("gallery"); if (!host) return;
    var type = null, id = null;
    try { var qs = new URLSearchParams(location.search); type = qs.get("type"); id = qs.get("album"); } catch (e) {}
    if (type !== "photos" && type !== "videos") {
      type = null;
      if (id) { type = galleryList("photos").some(function (a) { return a.id === id; }) ? "photos" : (galleryList("videos").some(function (a) { return a.id === id; }) ? "videos" : null); }
    }

    /* level 1: the two main albums */
    if (!type) {
      var ph = galleryList("photos"), vd = galleryList("videos");
      function kindCard(kind, list) {
        var first = list.filter(function (a) { return albumCover(a, kind); })[0];
        return '<a class="album kind" href="gallery.html?type=' + kind + '">' + thumbHtml(first ? albumCover(first, kind) : "") +
          '<div class="info"><h3>' + esc(t("g." + kind + "_main")) + '</h3><p class="meta">' + esc(t("g." + kind + "_sub")) + " &middot; " + esc(t("g.n_albums", { n: list.length })) + "</p></div></a>";
      }
      host.innerHTML = '<div class="albums two">' + kindCard("photos", ph) + kindCard("videos", vd) + "</div>" + channelBlock();
      var firstAuto = ph.filter(function (a) { return a.folder && !albumCover(a, "photos"); })[0];
      if (firstAuto && !ph.some(function (a) { return albumCover(a, "photos"); })) {
        albumPhotos(firstAuto, function (err, photos) {
          var th = host.querySelector('a.kind[href$="photos"] .thumb');
          if (!photos || !photos.length || !th || th.tagName === "IMG") return;
          var img = document.createElement("img");
          img.className = "thumb"; img.alt = ""; img.loading = "lazy"; img.src = firstAuto.cover || photos[0].src;
          th.parentNode.replaceChild(img, th);
        });
      }
      return;
    }

    var list = galleryList(type);
    var album = id ? list.filter(function (a) { return a.id === id; })[0] : null;

    /* level 2: occasion albums of one kind */
    if (!album) {
      setHead(t("g." + type + "_main"), t("g." + type + "_sub"));
      host.innerHTML = '<a class="back" href="gallery.html">' + esc(t("g.back_gallery")) + "</a>" + (list.length
        ? '<div class="albums">' + list.map(function (a) {
          var meta = [longDate(a.date), countText(a, type)].filter(Boolean).join(" · ");
          return '<a class="album" data-aid="' + esc(a.id) + '" href="gallery.html?type=' + type + "&album=" + encodeURIComponent(a.id) + '">' + thumbHtml(albumCover(a, type)) +
            '<div class="info"><h3>' + esc(L(a.title)) + '</h3><p class="meta">' + esc(meta) + "</p></div></a>";
        }).join("") + "</div>"
        : '<p class="empty">' + esc(t(type === "photos" ? "empty.albums" : "g.none_videos")) + "</p>") + (type === "videos" ? channelBlock() : "");
      if (type === "photos") fillAutoAlbums(list, host);
      return;
    }

    /* level 3: one album */
    setHead(L(album.title), [longDate(album.date), L(album.description)].filter(Boolean).join(". "));
    var back = '<a class="back" href="gallery.html?type=' + type + '">' + esc(t("g.back_" + type)) + "</a>";
    host.innerHTML = back + '<p class="fine">' + esc(t("g.loading")) + "</p>";
    if (type === "photos") {
      albumPhotos(album, function (err, photos) {
        if (!photos.length) { host.innerHTML = back + '<p class="empty">' + esc(t(err ? "g.loadfail" : "empty.album")) + "</p>"; return; }
        host.innerHTML = back + '<div class="photos">' + photos.map(function (p, i) {
          return '<button class="photo" type="button" data-i="' + i + '" aria-label="' + esc(t("g.open", { n: i + 1 })) + '"><img loading="lazy" alt="' + esc(L(p.caption) || L(album.title)) + '" src="' + esc(p.src) + '"></button>';
        }).join("") + "</div>";
        $$(".photo", host).forEach(function (b) {
          b.addEventListener("click", function () { openLightbox(photos, parseInt(b.getAttribute("data-i"), 10)); });
        });
      });
    } else {
      albumVideos(album, function (err, items) {
        host.innerHTML = back + (items.length ? '<div class="videos">' + items.map(videoBlock).join("") + "</div>" : '<p class="empty">' + esc(t(err ? "g.loadfail" : "empty.album")) + "</p>");
      });
    }
  }

  function shuffle(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* Collects photos for the Home slideshow: every visible photo album, or just one
     (SITE.slideshow.source set to an album id) if you want the strip to only ever
     pull from that album. cb(photos) */
  function allPhotos(cb) {
    var SS = S.slideshow || {};
    var albums = galleryList("photos").filter(function (x) { return (x.files || []).length || x.folder; });
    if (SS.source && SS.source !== "all") albums = albums.filter(function (a) { return a.id === SS.source; });
    if (!albums.length) { cb([]); return; }
    var out = [], left = albums.length;
    albums.forEach(function (a) {
      albumPhotos(a, function (err, photos) {
        (photos || []).forEach(function (p) { out.push({ src: p.src, caption: p.caption, albumId: a.id, albumTitle: a.title }); });
        if (--left === 0) cb(out);
      });
    });
  }
  var slideTimer = null;
  /* A horizontal strip that shows several photos at once, scrolls itself slowly, and can
     also be dragged/scrolled or stepped with the two arrow buttons. */
  function renderHomeGallery() {
    var sec = document.getElementById("home-gallery-section");
    var SS = S.slideshow || {};
    if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
    if (SS.enabled === false) { if (sec) sec.hidden = true; return; }
    allPhotos(function (photos) {
      if (!photos.length) { if (sec) sec.hidden = true; return; }
      if (sec) sec.hidden = false;
      var cap = document.getElementById("home-gallery-title");
      var pick = (SS.shuffle === true ? shuffle(photos) : photos).slice(0, (SS.count === 0 || SS.count === "all") ? undefined : (SS.count || 14));
      if (cap) cap.textContent = pick.length === 1 ? ": " + L(pick[0].albumTitle) : "";

      put("home-gallery",
        '<div class="ss-wrap">' +
        '<button class="ss-nav ss-prev" type="button" aria-label="' + esc(t("lb.prev")) + '">&#8249;</button>' +
        '<div class="ss-track-outer"><div class="ss-track" id="ss-track">' +
        pick.map(function (p, i) {
          return '<a class="ss-card" href="gallery.html?type=photos&album=' + encodeURIComponent(p.albumId) + '">' +
            '<img decoding="async" ' + (i < 4 ? 'loading="eager"' : 'loading="lazy"') + ' alt="' + esc(L(p.caption) || L(p.albumTitle)) + '" src="' + esc(p.src) + '">' +
            '<span class="ss-cap">' + esc(L(p.albumTitle)) + "</span></a>";
        }).join("") +
        "</div></div>" +
        '<button class="ss-nav ss-next" type="button" aria-label="' + esc(t("lb.next")) + '">&#8250;</button>' +
        "</div>");

      var track = document.getElementById("ss-track");
      if (!track) return;
      function cardStep() {
        var card = track.querySelector(".ss-card");
        if (!card) return 240;
        var style = getComputedStyle(track);
        return card.getBoundingClientRect().width + parseFloat(style.columnGap || style.gap || 14);
      }
      function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
      function step(dir) {
        if (atEnd() && dir > 0) { track.scrollTo({ left: 0, behavior: "smooth" }); return; }
        if (track.scrollLeft <= 0 && dir < 0) { track.scrollTo({ left: track.scrollWidth, behavior: "smooth" }); return; }
        track.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
      }
      var hov = false;
      function restartAuto() {
        if (slideTimer) clearInterval(slideTimer);
        slideTimer = null;
        if (hov) return;
        if (pick.length > 1) slideTimer = setInterval(function () { step(1); }, Math.max(2, SS.seconds || 4) * 1000);
      }
      var prevBtn = $(".ss-prev", sec), nextBtn = $(".ss-next", sec);
      if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); restartAuto(); });
      if (nextBtn) nextBtn.addEventListener("click", function () { step(1); restartAuto(); });
      restartAuto();
      /* Theme 2: the strip stops while the mouse is on it (or a finger is touching it) and starts again afterwards. */
      var wrapEl = $(".ss-wrap", sec);
      if (wrapEl) {
        var pauseT;
        wrapEl.addEventListener("mouseenter", function () { hov = true; if (slideTimer) { clearInterval(slideTimer); slideTimer = null; } });
        wrapEl.addEventListener("mouseleave", function () { hov = false; restartAuto(); });
        wrapEl.addEventListener("focusin", function () { hov = true; if (slideTimer) { clearInterval(slideTimer); slideTimer = null; } });
        wrapEl.addEventListener("focusout", function () { hov = false; restartAuto(); });
        wrapEl.addEventListener("touchstart", function () { clearTimeout(pauseT); if (slideTimer) { clearInterval(slideTimer); slideTimer = null; } }, { passive: true });
        wrapEl.addEventListener("touchend", function () { clearTimeout(pauseT); pauseT = setTimeout(restartAuto, 4000); }, { passive: true });
      }
    });
  }

  /* ---------- team + about ---------- */
  function renderTeam() {
    var groups = vis(window.TEAM);
    put("team", groups.length ? groups.map(function (g) {
      return '<section class="team-group"><h2>' + esc(L(g.group)) + '</h2><div class="people">' + (g.members || []).map(function (m) {
        var nm = L(m.name);
        return '<div class="person">' + (m.photo ? '<img class="avatar" loading="lazy" alt="" src="' + esc(m.photo) + '">' : '<div class="avatar" aria-hidden="true">' + esc(initials(nm)) + "</div>") +
          "<h3>" + esc(nm) + '</h3><p class="role">' + esc(L(m.role)) + "</p>" +
          (m.phone ? '<a class="call" href="' + telHref(m.phone) + '">' + esc(m.phone) + "</a>" : "") + "</div>";
      }).join("") + "</div></section>";
    }).join("") : '<p class="empty">' + esc(t("empty.team")) + "</p>");
  }
  function renderAbout() {
    var secs = window.ABOUT || [];
    put("about-toc", '<p class="sr">' + esc(t("about.toc")) + "</p>" + secs.map(function (s) { return '<a href="#' + esc(s.id) + '">' + esc(L(s.title)) + "</a>"; }).join(""));
    put("about", secs.map(function (s) {
      return '<section id="' + esc(s.id) + '"><h2>' + esc(L(s.title)) + "</h2>" +
        (s.paragraphs || []).map(function (p) { return "<p>" + esc(L(p)) + "</p>"; }).join("") +
        (s.list ? "<ul>" + s.list.map(function (li) { return "<li>" + esc(L(li)) + "</li>"; }).join("") + "</ul>" : "") + "</section>";
    }).join(""));
  }

  /* ---------- daan ---------- */
  function copyBtn(text) { return '<button class="copy" type="button" data-copy="' + esc(text) + '">' + esc(t("copy")) + "</button>"; }
  function codeRow(label, value) {
    return '<div class="coderow"><dt>' + esc(label) + '</dt><dd><code>' + esc(value) + "</code>" + copyBtn(value) + "</dd></div>";
  }
  /* a person's name + call button under a daan card; shown only once a phone number is written */
  function recContacts(r) {
    var c = vis(r.contacts).filter(function (x) { return x.phone; }).map(function (x) {
      return '<a class="call-btn call-sm" href="' + telHref(x.phone) + '"><span aria-hidden="true">📞</span> ' + (L(x.name) ? esc(L(x.name)) + " · " : "") + esc(x.phone) + "</a>";
    }).join("");
    return c ? '<div class="r-contacts">' + c + "</div>" : "";
  }
  function secondSunday(y, m) { return 1 + ((7 - new Date(y, m, 1).getDay()) % 7) + 7; }
  /* ---------- Daan page lists: Shantidhara, Dravya daan, Bhaktamar (from a Google Sheet, or from data.js) ---------- */
  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false, i, c;
    text = String(text || "").replace(/^﻿/, "");
    for (i = 0; i < text.length; i++) {
      c = text.charAt(i);
      if (q) {
        if (c === '"') { if (text.charAt(i + 1) === '"') { cur += '"'; i++; } else q = false; }
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text.charAt(i + 1) === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
      else cur += c;
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }
  var sheetCache = {};
  function sheetRows(url) {
    if (sheetCache[url]) return sheetCache[url];
    var pr = sheetRows0(url); sheetCache[url] = pr; pr.catch(function () { delete sheetCache[url]; }); return pr;
  }
  var daanSel = { dravya: "0", punya: "0", kind: "all", bh: "" };   /* what the visitor chose; kept when only the language changes */
  function sheetRows0(url) {
    var ctl = window.AbortController ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, 10000) : 0;
    return fetch(url, ctl ? { signal: ctl.signal } : {}).then(function (r) { if (!r.ok) throw new Error("bad"); return r.text(); }).then(function (txt) {
      clearTimeout(timer);
      if (/^\s*<(!doctype|html)/i.test(txt)) throw new Error("not csv");
      var all = parseCSV(txt).filter(function (r) { return r.some(function (x) { return String(x).trim() !== ""; }); });
      if (!all.length) return [];
      var head = all[0].map(function (h) { return String(h).trim().toLowerCase().replace(/\s+/g, "_"); });
      return all.slice(1).map(function (r) {
        var o = {}; head.forEach(function (h, i) { if (h) o[h] = String(r[i] == null ? "" : r[i]).trim(); });
        return o;
      });
    });
  }
  function normDate(v) {
    v = String(v == null ? "" : v).trim(); var y, m, d, mt;
    if ((mt = v.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/))) { y = +mt[1]; m = +mt[2]; d = +mt[3]; }
    else if ((mt = v.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})/))) { d = +mt[1]; m = +mt[2]; y = +mt[3]; }
    else return "";
    var t = new Date(y, m - 1, d);
    if (t.getFullYear() !== y || t.getMonth() !== m - 1 || t.getDate() !== d) return "";
    return y + "-" + pad2(m) + "-" + pad2(d);
  }
  function sheetText(r, base) {
    var hi = r[base + "_hi"] || "", en = r[base + "_en"] || "", one = r[base] || "";
    if (!hi && !en && one) { hi = one; en = one; }
    return { hi: hi, en: en };
  }
  function fmtAmt(v) {
    if (v == null || v === "") return "";
    var s = String(v).trim(), n = s.replace(/₹|rs\.?|inr|,|\s/gi, "");
    return /^\d+(\.\d+)?$/.test(n) ? "₹" + Number(n).toLocaleString(loc()) : s;
  }
  function addMonths(ym, n) {
    var y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + n;
    y += Math.floor(m / 12); m = ((m % 12) + 12) % 12;
    return y + "-" + pad2(m + 1);
  }
  function mName(ym, style) { return new Date(ym + "-01T00:00:00").toLocaleDateString(loc(), { month: style || "long" }); }
  /* month written in a Sheet cell: a number (1-12), English (jan, Jan, january, janu...), Hindi (जनवरी...), or with the year ("Nov 2026", "2026-11", "11/2026") */
  var MON_EN = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  var MON_HI = [["जनवरी"], ["फरवरी"], ["मार्च"], ["अप्रैल", "अप्रेल"], ["मई"], ["जून"], ["जुलाई"], ["अगस्त"], ["सितंबर", "सितम्बर"], ["अक्टूबर", "अक्तूबर"], ["नवंबर", "नवम्बर"], ["दिसंबर", "दिसम्बर"]];
  function hiNorm(s) { return String(s).replace(/[़]/g, "").replace(/ं/g, "ं"); }
  function monthNum(v) {
    v = String(v == null ? "" : v).trim().toLowerCase().replace(/[.,]/g, ""); var i, n;
    if (!v) return 0;
    if (/^\d{1,2}$/.test(v)) { n = +v; return n >= 1 && n <= 12 ? n : 0; }
    if (/^[a-z]+$/.test(v) && v.length >= 3) {
      for (i = 0; i < 12; i++) if (MON_EN[i].slice(0, 3) === v.slice(0, 3)) return i + 1;
      return 0;
    }
    var h = hiNorm(v);
    for (i = 0; i < 12; i++) for (var k = 0; k < MON_HI[i].length; k++) {
      var w = hiNorm(MON_HI[i][k]);
      if (h === w || (h.length >= 3 && w.indexOf(h) === 0)) return i + 1;
    }
    return 0;
  }
  /* year-month ("YYYY-MM") of a Sheet row from its month / year columns (or its date). No year written: the year that fits the window, else this year. */
  function rowYM(r, windowYMs) {
    var mc = String(r.month || r.mahina || "").trim(), yc = String(r.year || r.saal || "").trim(), mt, y = 0, m = 0;
    if ((mt = mc.match(/(\d{4})/))) { y = +mt[1]; mc = mc.replace(mt[1], " ").replace(/[-\/]/g, " ").trim(); }
    m = monthNum(mc.split(/\s+/)[0]) || monthNum(mc);
    if (!m && (mt = String(r.month || "").match(/^\d{1,2}[-\/](\d{4})$/))) { m = +String(r.month).split(/[-\/]/)[0]; y = +mt[1]; }
    if (!y && /^\d{4}$/.test(yc)) y = +yc;
    if (m && y) return y + "-" + pad2(m);
    if (m) {
      var cy = +todayISO().slice(0, 4), c;
      if (windowYMs) for (c = cy - 1; c <= cy + 1; c++) if (windowYMs.indexOf(c + "-" + pad2(m)) >= 0) return c + "-" + pad2(m);
      return cy + "-" + pad2(m);
    }
    var d = normDate(r.date);
    return d ? d.slice(0, 7) : "";
  }
  function pickLang(n, lang) { n = n || {}; return typeof n === "string" ? n : (n[lang] || n[lang === "hi" ? "en" : "hi"] || ""); }
  /* weekday written in a Sheet cell: Tue / tuesday / mangal / मंगलवार ... gives 0 (Sunday) to 6 (Saturday), or -1 */
  function weekdayNum(v) {
    v = String(v == null ? "" : v).trim().toLowerCase().replace(/[.,]/g, ""); var i;
    if (!v) return -1;
    if (/^[a-z]+$/.test(v) && v.length >= 3) {
      var en = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      for (i = 0; i < 7; i++) if (en[i] === v.slice(0, 3)) return i;
      var tr = { rav: 0, som: 1, man: 2, mang: 2, bud: 3, gur: 4, bri: 4, shu: 5, sha: 6 };
      for (var k in tr) if (v.indexOf(k) === 0) return tr[k];
      return -1;
    }
    var hi = [["रवि", "इतवार"], ["सोम"], ["मंग"], ["बुध"], ["गुरु", "बृह", "वीर"], ["शुक"], ["शनि"]];
    for (i = 0; i < 7; i++) for (var j = 0; j < hi[i].length; j++) if (v.indexOf(hi[i][j]) === 0) return i;
    return -1;
  }
  /* one list: kind = "saptahik" | "masik" | "dravya". Sheet link (SHEETS) if given, else the list written in data.js.
     Dravya daan: year + month only.  Masik: year + month + date (the day number).
     Saptahik: year + month + din (weekday): the name is repeated by the website on every such weekday of that month. */
  function loadDaanList(kind) {
    var url = (window.SHEETS || {})[kind];
    var cur = todayISO().slice(0, 7), win = [addMonths(cur, -1), cur, addMonths(cur, 1)];
    if (url) {
      return sheetRows(url).then(function (rows) {
        var out = [];
        rows.forEach(function (r) {
          var name = sheetText(r, "name"), date, ym;
          if (!name.hi && !name.en) return;
          var base = { kind: kind, name: name, note: sheetText(r, "note"), rashi: r.rashi || r.amount || "" };
          function add(ym2, date2) { var o = {}; for (var k in base) o[k] = base[k]; o.ym = ym2; o.date = date2; out.push(o); }
          if (kind === "dravya") { ym = rowYM(r, win); if (ym) add(ym, ""); return; }
          var wdv = r.din || r.day || r.weekday || r.vaar || r.var || "";
          if (kind === "saptahik" && wdv) {
            var wn = weekdayNum(wdv); if (wn < 0) return;
            var mc = String(r.month || r.mahina || "").trim(), yc = String(r.year || r.saal || "").trim();
            var yms = mc ? [rowYM(r, win)] : win.filter(function (x) { return !/^\d{4}$/.test(yc) || x.slice(0, 4) === yc; });
            yms.forEach(function (m) {
              if (win.indexOf(m) < 0) return;
              var dim = new Date(+m.slice(0, 4), +m.slice(5, 7), 0).getDate();
              for (var d = 1; d <= dim; d++) if (new Date(+m.slice(0, 4), +m.slice(5, 7) - 1, d).getDay() === wn) add(m, m + "-" + pad2(d));
            });
            return;
          }
          ym = rowYM(r, win); if (!ym) return;
          date = bhEntryDate(r.date, ym); if (!date) return;
          add(date.slice(0, 7), date);
        });
        return { ok: true, rows: out };
      }).catch(function () { return { ok: false, rows: [] }; });
    }
    var src = kind === "dravya" ? vis(window.DRAVYA) : vis(window.PUNYARJAK).filter(function (p) { return p.kind === kind; });
    return Promise.resolve({ ok: true, rows: src.map(function (p) {
      var date = normDate(p.date), ym = kind === "dravya" ? (rowYM(p, win) || (p.month ? String(p.month).slice(0, 7) : "")) : (date ? date.slice(0, 7) : "");
      return ym ? { ym: ym, date: date, kind: kind, name: p.name, note: p.note, rashi: p.rashi != null ? p.rashi : p.amount } : null;
    }).filter(Boolean) });
  }
  /* Bhaktamar "date" cell: a full date (2026-10-15, 15/10/2026) or just the day number (15) of the row's month. Empty = default (2nd Sunday). */
  function bhEntryDate(v, ym) {
    v = String(v == null ? "" : v).trim();
    if (!v) return "";
    if (/^\d{1,2}$/.test(v)) {
      var d = +v, y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1;
      return d >= 1 && new Date(y, m, d).getMonth() === m ? ym + "-" + pad2(d) : "";
    }
    return normDate(v);
  }
  function loadBhaktamar() {
    var url = (window.SHEETS || {}).bhaktamar;
    var yr = todayISO().slice(0, 4), win = [];
    for (var i = 1; i <= 12; i++) win.push(yr + "-" + pad2(i));
    function mk(r, name, note, rashi) {
      var ym = rowYM(r, win); if (!ym) return null;
      var date = bhEntryDate(r.date, ym);
      if (date) ym = date.slice(0, 7);
      return { ym: ym, date: date, name: name, note: note, rashi: rashi };
    }
    if (url) {
      return sheetRows(url).then(function (rows) {
        return { ok: true, rows: rows.map(function (r) {
          var name = sheetText(r, "name");
          if (!name.hi && !name.en) return null;
          return mk(r, name, sheetText(r, "note"), r.rashi || r.amount || "");
        }).filter(Boolean) };
      }).catch(function () { return { ok: false, rows: [] }; });
    }
    return Promise.resolve({ ok: true, rows: vis(window.BHAKTAMBAR).map(function (b) {
      return mk({ month: b.month, year: b.year, date: b.date }, b.name, b.note, b.rashi != null ? b.rashi : b.amount);
    }).filter(Boolean) });
  }
  /* date of one Bhaktamar entry: its own date if written, else the 2nd Sunday of its month */
  function bhEff(e) {
    return e.date || e.ym + "-" + pad2(secondSunday(+e.ym.slice(0, 4), +e.ym.slice(5, 7) - 1));
  }
  /* the entries of one month, grouped by date: [{ date, es: [entries] }] sorted by date */
  function bhGroups(rows, ym) {
    var map = {};
    rows.filter(function (e) { return e.ym === ym; }).forEach(function (e) { var d = bhEff(e); (map[d] = map[d] || []).push(e); });
    return Object.keys(map).sort().map(function (d) { return { date: d, es: map[d] }; });
  }
  /* Karyakram made from the Bhaktamar list: ONE card per month (listing every date of that month with its punyarjak families).
     In the daily calendar each date gets its own entry. */
  var autoEvCache = null;
  function bhaktamarEvents() {
    if (S.bhaktamarKaryakram === false) return Promise.resolve([]);
    if (!autoEvCache) autoEvCache = loadBhaktamar().then(function (res) {
      if (!res.ok) return [];
      var yr = todayISO().slice(0, 4), yms = {};
      res.rows.forEach(function (e) { if (e.ym.slice(0, 4) === yr) yms[e.ym] = 1; });
      return Object.keys(yms).sort().map(function (ym) {
        var g = bhGroups(res.rows, ym).map(function (x) {
          return { date: x.date, names: { hi: x.es.map(function (e) { return pickLang(e.name, "hi"); }), en: x.es.map(function (e) { return pickLang(e.name, "en"); }) } };
        });
        return { auto: true, bh: true, ym: ym, date: g[0].date, endDate: g[g.length - 1].date, groups: g, time: S.bhaktamarTime || "", place: { hi: "मंदिर जी", en: "Mandir ji" },
          type: { hi: "भक्तामर पाठ", en: "Bhaktamar path" }, title: { hi: "मासिक भक्तामर पाठ", en: "Monthly Bhaktamar Path" } };
      });
    });
    return autoEvCache;
  }
  /* one single-day entry for each date (used by the daily karyakram page and its calendar) */
  function bhDayEvents(monthEvs) {
    var out = [];
    monthEvs.forEach(function (m) {
      m.groups.forEach(function (g) {
        out.push({ auto: true, date: g.date, time: m.time, place: m.place, type: m.type, title: m.title,
          fams: g.names });
      });
    });
    return out;
  }
  function noteHtml(n) { var x = L(n); return x ? '<small class="dnote">' + esc(x) + "</small>" : ""; }
  /* ONE month chooser: previous / this / next month, in a single dropdown */
  function monthSelect(cls) {
    return '<label class="msel ' + (cls || "") + '"><span class="msel-l">' + esc(t("d.month")) + '</span><select class="mselect"></select></label>';
  }
  function fillMonthSelect(sel, keep) {
    var cur = todayISO().slice(0, 7), prev = keep == null ? "0" : String(keep);
    sel.innerHTML = [[-1, "d.prev"], [0, "d.cur"], [1, "d.next"]].map(function (x) {
      var ym = addMonths(cur, x[0]);
      return '<option value="' + x[0] + '"' + (String(x[0]) === prev ? " selected" : "") + ">" + esc(mName(ym) + " " + ym.slice(0, 4) + " - " + t(x[1])) + "</option>";
    }).join("");
  }
  /* Dravya daan table: names + amount only */
  function daanTable(rows) {
    if (!rows.length) return '<p class="empty">' + esc(t("empty.month")) + "</p>";
    return '<div class="tbl-wrap"><table class="tbl dtbl nodt"><thead><tr><th scope="col">' + esc(t("d.bh_name")) + '</th><th scope="col">' + esc(t("d.col_amount")) + "</th></tr></thead><tbody>" +
      rows.map(function (p) {
        return '<tr class="drow"><td class="dn">' + esc(L(p.name)) + noteHtml(p.note) + '</td><td class="dm">' + esc(fmtAmt(p.rashi) || "-") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }
  /* Shantidhara table (one month). Saptahik names are written once: the same name on every such weekday is ONE row showing the weekday
     and all its dates of the month. Masik rows have one date each. Rows are in order of their first date. */
  function shantiTable(rows) {
    if (!rows.length) return '<p class="empty">' + esc(t("empty.month")) + "</p>";
    var blocks = {}, items = [];
    rows.forEach(function (p) {
      if (p.kind === "masik") { items.push({ first: p.date, order: 1, masik: p }); return; }
      var wd = parseDate(p.date).getDay(), b = blocks[wd] || (blocks[wd] = { wd: wd, groups: {}, list: [] });
      var key = [pickLang(p.name, "hi"), pickLang(p.name, "en"), p.rashi, pickLang(p.note, "hi"), pickLang(p.note, "en")].join("|");
      var g = b.groups[key] || (b.groups[key] = { p: p, dates: [] });
      if (!b.list.length || b.list.indexOf(g) < 0) b.list.push(g);
      if (g.dates.indexOf(p.date) < 0) g.dates.push(p.date);
    });
    Object.keys(blocks).forEach(function (k) {
      var b = blocks[k];
      b.list.forEach(function (g) { g.dates.sort(); });
      b.list.sort(function (x, y) { return x.dates[0] < y.dates[0] ? -1 : x.dates[0] > y.dates[0] ? 1 : 0; });
      items.push({ first: b.list[0].dates[0], order: 0, block: b });
    });
    items.sort(function (x, y) { return x.first < y.first ? -1 : x.first > y.first ? 1 : x.order - y.order; });
    function datesText(ds) {
      var ym = ds[0].slice(0, 7);
      return ds.map(function (d) { return +d.slice(8, 10); }).join(", ") + " " + mName(ym) + " " + ym.slice(0, 4);
    }
    function kindCell(k) { return '<td class="dk"><span class="pd-in"><i class="dot dot-' + k + '"></i>' + esc(t("kind." + k)) + "</span></td>"; }
    var body = "";
    items.forEach(function (it) {
      if (it.masik) {
        var p = it.masik, d = parseDate(p.date);
        body += '<tr class="drow k-masik first"><td class="dd">' + esc(longDate(p.date)) + '</td><td class="dy">' + esc(d.toLocaleDateString(loc(), { weekday: "long" })) + "</td>" + kindCell("masik") +
          '<td class="dn">' + esc(L(p.name)) + noteHtml(p.note) + '</td><td class="dm">' + esc(fmtAmt(p.rashi) || "-") + "</td></tr>";
        return;
      }
      var prevTxt = "";
      it.block.list.forEach(function (g, i) {
        var txt = datesText(g.dates), p = g.p, same = i > 0 && txt === prevTxt;
        prevTxt = txt;
        body += '<tr class="drow k-saptahik ' + (i === 0 ? "first" : "") + (same ? " same" : "") + '"><td class="dd">' + (same ? "" : esc(txt)) + '</td><td class="dy">' + (i === 0 ? esc(new Date(2023, 0, 1 + it.block.wd).toLocaleDateString(loc(), { weekday: "long" })) : "") + "</td>" +
          (i === 0 ? kindCell("saptahik") : '<td class="dk"></td>') + '<td class="dn">' + esc(L(p.name)) + noteHtml(p.note) + '</td><td class="dm">' + esc(fmtAmt(p.rashi) || "-") + "</td></tr>";
      });
    });
    return '<div class="tbl-wrap"><table class="tbl dtbl shtbl"><thead><tr><th scope="col">' + esc(t("d.col_date")) + '</th><th scope="col">' + esc(t("d.col_day")) + '</th><th scope="col">' + esc(t("d.col_kind")) +
      '</th><th scope="col">' + esc(t("d.bh_name")) + '</th><th scope="col">' + esc(t("d.col_amount")) + "</th></tr></thead><tbody>" + body + "</tbody></table></div>";
  }
  function daanListsHtml() {
    var loading = '<p class="empty">' + esc(t("d.list_loading")) + "</p>";
    var h = '<section id="dravya"><h2>' + esc(t("d.dravya")) + '</h2><div class="dctl">' + monthSelect() + '</div><div class="dbody">' + loading + "</div></section>" +
      '<section id="punyarjak"><h2>' + esc(t("d.punya")) + '</h2><div class="dctl"><div class="pfilter kfilter" role="group" aria-label="' + esc(t("d.punya")) + '">' +
      '<button class="pf" type="button" data-k="all" aria-pressed="true">' + esc(t("d.col_kind_all")) + "</button>" +
      '<button class="pf" type="button" data-k="saptahik" aria-pressed="false"><i class="dot dot-saptahik"></i>' + esc(t("kind.saptahik")) + "</button>" +
      '<button class="pf" type="button" data-k="masik" aria-pressed="false"><i class="dot dot-masik"></i>' + esc(t("kind.masik")) + "</button></div>" +
      monthSelect() + '</div><div class="dbody">' + loading + "</div></section>";
    if (window.BHAKTAMBAR !== undefined || (window.SHEETS || {}).bhaktamar) {
      h += '<section id="bhaktamber"><h2>' + esc(t("d.bhaktamber", { year: todayISO().slice(0, 4) })) + '</h2><div class="dctl">' + monthSelect("bh-sel") + '<button class="btn btn-line bh-toggle" type="button"></button></div>' +
        '<div class="bh-one">' + loading + '</div><div class="bh-all" hidden></div></section>';
    }
    return h;
  }
  function drawDaanLists(host) {
    var cur = todayISO().slice(0, 7);
    function setupMonthList(section, getRows, withKind, key) {
      var box = $(".dbody", section), sel = $(".mselect", section), state = { o: +daanSel[key] || 0 };
      fillMonthSelect(sel, state.o);
      function draw() {
        var res = getRows();
        if (!res.ok) { box.innerHTML = '<p class="empty">' + esc(t("d.list_soon")) + "</p>"; return; }
        var ym = addMonths(cur, state.o);
        var rows = res.rows.filter(function (p) { return p.ym === ym; });
        box.innerHTML = (res.warn ? '<p class="note">' + esc(t("d.list_part", { name: res.warn })) + "</p>" : "") + (withKind ? shantiTable(rows) : daanTable(rows));
      }
      sel.addEventListener("change", function () { state.o = +sel.value; daanSel[key] = sel.value; draw(); });
      return { draw: draw, state: state };
    }
    /* Dravya daan */
    var dres = null, dsec = $("#dravya", host);
    var dctl = setupMonthList(dsec, function () { return dres || { ok: true, rows: [] }; }, false, "dravya");
    loadDaanList("dravya").then(function (r) { dres = r; dctl.draw(); });
    /* Shantidhara: Saptahik + Masik in one table, with the All / Saptahik / Masik filter */
    var psec = $("#punyarjak", host), pres = null, kind = daanSel.kind;
    $$(".kfilter .pf", psec).forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-k") === kind ? "true" : "false"); });
    var pctl = setupMonthList(psec, function () {
      if (!pres) return { ok: true, rows: [] };
      if (!pres.sap.ok && !pres.mas.ok) return { ok: false, rows: [] };
      var rows = [], miss = [];
      if (kind !== "masik") { rows = rows.concat(pres.sap.rows); if (!pres.sap.ok) miss.push(t("kind.saptahik")); }
      if (kind !== "saptahik") { rows = rows.concat(pres.mas.rows); if (!pres.mas.ok) miss.push(t("kind.masik")); }
      return { ok: true, rows: rows, warn: miss.join(", ") };
    }, true, "punya");
    $$(".kfilter .pf", psec).forEach(function (b) {
      b.addEventListener("click", function () {
        kind = daanSel.kind = b.getAttribute("data-k");
        $$(".kfilter .pf", psec).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        pctl.draw();
      });
    });
    Promise.all([loadDaanList("saptahik"), loadDaanList("masik")]).then(function (a) { pres = { sap: a[0], mas: a[1] }; pctl.draw(); });

    /* Bhaktamar: ONE dropdown: any month of the current year, or the whole year */
    var bsec = $("#bhaktamber", host);
    if (bsec) {
      var yr = parseInt(cur.slice(0, 4), 10), bres = null;
      var sel = $(".mselect", bsec), one = $(".bh-one", bsec), allBox = $(".bh-all", bsec), ctl = $(".dctl", bsec), tog = $(".bh-toggle", bsec), all = !!daanSel.bhAll;
      sel.innerHTML = Array.apply(null, Array(12)).map(function (x, m) {
        var ym = yr + "-" + pad2(m + 1);
        return '<option value="' + ym + '">' + esc(mName(ym) + " " + yr) + "</option>";
      }).join("");
      sel.value = daanSel.bh && $('option[value="' + daanSel.bh + '"]', sel) ? daanSel.bh : cur;
      function fam(es) {
        return es.map(function (e) {
          return '<div class="bfam"><span class="bfn">' + esc(L(e.name)) + noteHtml(e.note) + '</span><span class="bfa">' + esc(fmtAmt(e.rashi)) + "</span></div>";
        }).join("");
      }
      function dLabel(iso) { return parseDate(iso).toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long" }); }
      function drawBh() {
        if (!bres.ok) { one.innerHTML = '<p class="empty">' + esc(t("d.list_soon")) + "</p>"; allBox.hidden = true; ctl.hidden = true; return; }
        var ymSel = sel.value;
        one.hidden = all; allBox.hidden = !all; sel.disabled = all; ctl.classList.toggle("is-all", all);
        tog.textContent = t(all ? "d.bh_one" : "d.bh_all"); tog.setAttribute("aria-pressed", all ? "true" : "false");
        if (!all) {
          var gs = bhGroups(bres.rows, ymSel), trs = "";
          if (!gs.length) {
            trs = '<tr><td class="bd">' + esc(dLabel(bhEff({ ym: ymSel, date: "" }))) + '</td><td class="open" colspan="2">' + esc(ymSel < cur ? "-" : t("d.bh_open")) + "</td></tr>";
          } else {
            gs.forEach(function (g) {
              g.es.forEach(function (e, i) {
                trs += '<tr class="' + (i ? "same" : "first") + '"><td class="bd">' + (i ? "" : esc(dLabel(g.date))) + '</td><td class="bn">' + esc(L(e.name)) + noteHtml(e.note) + '</td><td class="dm">' + esc(fmtAmt(e.rashi) || "-") + "</td></tr>";
              });
            });
          }
          one.innerHTML = '<div class="bh-month"><h3>' + esc(mName(ymSel) + " " + yr) + '</h3><div class="tbl-wrap"><table class="tbl dtbl bmtbl"><thead><tr><th scope="col">' + esc(t("d.bh_date")) + '</th><th scope="col">' + esc(t("d.bh_name")) + '</th><th scope="col">' + esc(t("d.col_amount")) + "</th></tr></thead><tbody>" + trs + "</tbody></table></div></div>";
        } else {
          var rows = "";
          for (var m = 0; m < 12; m++) {
            var ym = yr + "-" + pad2(m + 1), g2 = bhGroups(bres.rows, ym);
            if (!g2.length) g2 = [{ date: bhEff({ ym: ym, date: "" }), es: [] }];
            g2.forEach(function (g, gi) {
              rows += '<tr class="brow' + (ym === cur ? " now" : "") + '"><td class="bm">' + (gi ? "" : esc(mName(ym))) + '</td><td class="bd">' + esc(dLabel(g.date)) +
                '</td><td class="bn' + (g.es.length ? "" : " open") + '">' + (g.es.length ? fam(g.es) : esc(ym < cur ? "-" : t("d.bh_open"))) + "</td></tr>";
            });
          }
          allBox.innerHTML = '<div class="tbl-wrap"><table class="tbl btbl"><thead><tr><th scope="col">' + esc(t("d.bh_month")) + '</th><th scope="col">' + esc(t("d.bh_date")) + '</th><th scope="col">' + esc(t("d.bh_name")) + " / " + esc(t("d.col_amount")) + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
        }
      }
      sel.addEventListener("change", function () { daanSel.bh = sel.value; if (bres) drawBh(); });
      tog.addEventListener("click", function () { all = daanSel.bhAll = !all; if (bres) drawBh(); });
      tog.textContent = t(all ? "d.bh_one" : "d.bh_all");
      loadBhaktamar().then(function (r) { bres = r; drawBh(); });
    }
  }
  function renderDaan() {
    var D = window.DAAN || {};
    var host = document.getElementById("daan"); if (!host) return;
    if (!D.enabled) { host.innerHTML = '<p class="empty">' + esc(t("d.soon")) + "</p>"; return; }
    var html = L(D.intro) ? '<p class="measure">' + esc(L(D.intro)) + "</p>" : "";

    var cards = "";
    if (D.upiId || D.qrImage) {
      cards += '<div class="card card-upi"><h3>' + esc(t("d.upi")) + "</h3>" +
        (D.qrImage ? '<img class="qr" alt="' + esc(t("d.upi") + " QR, " + L(S.name)) + '" src="' + esc(D.qrImage) + '">' : "") +
        (D.upiId ? '<dl class="rows">' + codeRow(t("d.upiid"), D.upiId) + "</dl>" : "") + "</div>";
    }
    var bank = (D.bank || []).filter(function (b) { return b.value; });
    if (bank.length) {
      cards += '<div class="card"><h3>' + esc(t("d.bank")) + '</h3><dl class="rows">' + bank.map(function (b) {
        return b.copy ? codeRow(L(b.label), L(b.value)) : "<div><dt>" + esc(L(b.label)) + "</dt><dd>" + esc(L(b.value)) + "</dd></div>";
      }).join("") + "</dl></div>";
    }
    if (L(D.inPerson)) cards += '<div class="card"><h3>' + esc(t("d.person")) + "</h3><p>" + esc(L(D.inPerson)) + "</p></div>";
    html += '<section id="how"><h2>' + esc(t("d.how")) + '</h2><div class="cards three">' + cards + "</div>" +
      "</section>";

    /* one box of points: any extra note, the caution (with a warning sign), and the screenshot request */
    var pts = [];
    if (L(D.note)) pts.push(["•", L(D.note)]);
    if (L(D.disclaimer)) pts.push(["⚠️", L(D.disclaimer)]);
    pts.push(["•", t("d.screenshot")]);
    html += '<div class="note disclaimer" role="note"><ul class="notepts">' + pts.map(function (x) {
      return '<li><span class="ni" aria-hidden="true">' + x[0] + "</span><span>" + esc(x[1]) + "</span></li>";
    }).join("") + "</ul></div>";

    var R = vis(window.RECURRING);
    if (R.length) {
      html += '<section id="regular"><h2>' + esc(t("d.regular")) + '</h2><p class="measure">' + esc(t("d.regular_p")) + '</p><div class="cards three">' + R.map(function (r) {
        return '<div class="card"><span class="tag">' + esc(L(r.when)) + "</span><h3>" + esc(L(r.title)) + "</h3><p>" + esc(L(r.text)) + "</p>" +
          (fmtAmt(r.amount) ? '<p class="amt">' + esc(t("d.amount_line", { amt: fmtAmt(r.amount) })) + "</p>" : "") +
          (L(r.how) ? '<p class="fine">' + esc(L(r.how)) + "</p>" : "") + recContacts(r) + "</div>";
      }).join("") + "</div></section>";
    }

    html += '<section id="yojana"><h2>' + esc(t("d.yojana")) + '</h2><p class="measure">' + esc(t("d.yojana_p")) + '</p><a class="btn btn-line" href="yojana.html">' + esc(t("d.yojana_btn")) + "</a></section>";

    var TR = window.TRUST || {};
    if (TR.enabled !== false) {
      var tr = (TR.items || []).filter(function (x) { return x.value; });
      html += '<section id="trust"><h2>' + esc(t("d.trust")) + "</h2>" + (tr.length
        ? '<div class="card"><dl class="rows">' + tr.map(function (x) { return "<div><dt>" + esc(L(x.label)) + "</dt><dd>" + esc(L(x.value)) + "</dd></div>"; }).join("") + "</dl></div>"
        : '<p class="empty">' + esc(t("d.trust_soon")) + "</p>") + (L(TR.note) ? '<p class="fine">' + esc(L(TR.note)) + "</p>" : "") + "</section>";
    }

    html += daanListsHtml();
    html += '<p class="thanks">' + esc(t("d.thanks")) + "</p>";
    host.innerHTML = html;

    drawDaanLists(host);

    $$(".copy", host).forEach(function (b) {
      b.addEventListener("click", function () {
        var txt = b.getAttribute("data-copy");
        var done = function () { b.textContent = t("copied"); setTimeout(function () { b.textContent = t("copy"); }, 1800); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { b.textContent = t("copyfail"); });
        else b.textContent = t("copyfail");
      });
    });
  }

  /* ---------- suvidha (facilities of the mandir) + Home cards ---------- */
  function suvidhaCard(f) {
    /* same look as the daan / visit cards: plain card, h3 title, text, standard rows, small call buttons */
    var info = vis(f.info).filter(function (i) { return L(i.value); }).map(function (i) {
      return "<div><dt>" + (i.icon ? '<span aria-hidden="true">' + esc(i.icon) + "</span> " : "") + esc(L(i.label)) + "</dt><dd>" + esc(L(i.value)) + "</dd></div>";
    }).join("");
    var people = vis(f.contacts).filter(function (x) { return L(x.name) || x.phone; }).map(function (x) {
      var nm = (L(x.name) ? esc(L(x.name)) + (L(x.role) ? " (" + esc(L(x.role)) + ")" : "") : "");
      return x.phone
        ? '<a class="call-btn call-sm" href="' + telHref(x.phone) + '"><span aria-hidden="true">📞</span> ' + (nm ? nm + " · " : "") + esc(x.phone) + "</a>"
        : '<span class="tag">' + nm + "</span>";
    }).join("");
    var paras = vis(f.paragraphs).map(function (p) { return L(p) ? "<p>" + esc(L(p)) + "</p>" : ""; }).join("");
    var list = vis(f.list).filter(function (i) { return L(i); }).map(function (i) { return "<li>" + esc(L(i)) + "</li>"; }).join("");
    return '<div class="card su-card"><h3>' + (f.icon ? esc(f.icon) + " " : "") + esc(L(f.title)) + "</h3>" + paras +
      (info ? '<dl class="rows">' + info + "</dl>" : "") + (list ? '<ul class="su-list">' + list + "</ul>" : "") +
      (L(f.contactNote) ? '<p class="fine su-note">' + esc(L(f.contactNote)) + "</p>" : "") + (people ? '<div class="r-contacts">' + people + "</div>" : "") + "</div>";
  }
  function renderSuvidha() {
    var host = document.getElementById("suvidha"); if (!host) return;
    var list = vis(window.SUVIDHA);
    host.innerHTML = list.length ? '<div class="cards three">' + list.map(suvidhaCard).join("") + "</div>" : '<p class="empty">' + esc(t("suvidha.none")) + "</p>";
  }
  function renderHomeSuvidha() {
    var grid = $(".home-cta"); if (!grid) return;
    $$(".home-suv", grid).forEach(function (e) { e.parentNode.removeChild(e); });
    var pins = vis(window.SUVIDHA).filter(function (f) { return f.pinned; });
    pins.forEach(function (f) {
      var d = document.createElement("div");
      d.className = "card home-suv";
      d.innerHTML = "<h2>" + (f.icon ? esc(f.icon) + " " : "") + esc(L(f.title)) + "</h2><p>" + esc(L(f.short)) + '</p><a class="btn btn-line" href="visit.html#facilities">' + esc(t("home.suvidha_btn")) + "</a>";
      grid.appendChild(d);
    });
    grid.classList.toggle("three", pins.length > 0);
  }

  /* ---------- visit ---------- */
  function mapSrc() {
    if (S.mapEmbed) return S.mapEmbed;
    if (S.mapQuery) return "https://maps.google.com/maps?q=" + encodeURIComponent(S.mapQuery) + "&z=15&output=embed";
    return "";
  }
  function mapOpen() {
    if (S.mapLink) return S.mapLink;
    if (S.mapQuery) return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.mapQuery);
    return "";
  }
  /* ---------- visit: one page, four tabs (Timings, How to reach, Facilities, Dress code) ---------- */
  var VISIT_TABS_ALL = [["timings", "v.tab_timings"], ["reach", "v.tab_reach"], ["facilities", "v.tab_fac"], ["rules", "v.tab_dress"]];
  /* SITE.hideVisitTabs: ["facilities", "rules", ...] hides tabs of the Visit page */
  var VISIT_TABS = VISIT_TABS_ALL.filter(function (x) { return (S.hideVisitTabs || []).indexOf(x[0]) < 0; });
  if (!VISIT_TABS.length) VISIT_TABS = VISIT_TABS_ALL;
  var VISIT_ALIAS = { contact: "timings", address: "reach", timings: "timings", map: "reach", reach: "reach", facilities: "facilities", suvidha: "facilities", rules: "rules", niyam: "rules", dresscode: "rules", dress: "rules" };
  function visitTabFromHash() {
    var h = decodeURIComponent((location.hash || "").replace("#", ""));
    var w = VISIT_ALIAS[h] || "timings";
    return VISIT_TABS.some(function (x) { return x[0] === w; }) ? w : VISIT_TABS[0][0];
  }
  function visitPanels() {
    var src = mapSrc(), open = mapOpen(), T = S.timings || {};
    var reach = "";
    if (S.phone) reach += '<p><a href="' + telHref(S.phone) + '">' + esc(S.phone) + "</a></p>";
    if (S.whatsapp) reach += '<p><a href="https://wa.me/' + esc(S.whatsapp) + '" target="_blank" rel="noopener">' + esc(t("v.wa")) + "</a></p>";
    if (S.email) reach += '<p><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></p>";
    if (!reach) reach = "<p>" + esc(t("v.nocontact")) + "</p>";

    var tm = "";
    if (showTimings()) {
      tm += '<div class="card"><h3>' + esc(t("v.timings")) + '</h3><dl class="rows">' +
        "<div><dt>" + esc(t("tm.open")) + "</dt><dd>" + esc(fmtTime(T.open)) + "</dd></div>" +
        "<div><dt>" + esc(t("tm.abhishek")) + "</dt><dd>" + esc(fmtTime(T.abhishek)) + "</dd></div>" +
        "<div><dt>" + esc(t("tm.aarti")) + "</dt><dd>" + esc(fmtTime(T.aarti)) + "</dd></div>" +
        "<div><dt>" + esc(t("tm.close")) + "</dt><dd>" + esc(fmtTime(T.close)) + "</dd></div></dl>" +
        '<p class="fine">' + esc(L(S.timingsNote) || t("tm.note")) + '</p><a class="btn btn-line" href="daily.html">' + esc(t("hero.cta_time")) + "</a></div>";
    }
    tm += '<div class="card" id="contact"><h3>' + esc(t("v.contact")) + "</h3>" + reach + "</div>";

    var how = vis(window.HOWTO);
    var addrHtml = (S.addressLines || []).map(function (x) { return esc(L(x)); }).join("<br>");
    var rc = '<div class="card addr-card" id="address"><h3>' + esc(t("v.address")) + "</h3><p>" + addrHtml + "</p></div>" +
      '<div class="mapwrap">' + (src ? '<div class="mapbox"><iframe title="' + esc(t("v.maptitle")) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + esc(src) + '"></iframe></div>' : '<p class="empty">' + esc(t("v.nomap")) + "</p>") +
      (open ? '<p><a class="btn btn-gold" href="' + esc(open) + '" target="_blank" rel="noopener">' + esc(t("v.open")) + "</a></p>" : "") + "</div>" +
      (how.length ? '<h3 class="howto-h">' + esc(t("v.howto")) + '</h3><div class="cards three">' + how.map(function (h) { return '<div class="card"><h3>' + esc(L(h.title)) + "</h3><p>" + esc(L(h.text)) + "</p></div>"; }).join("") + "</div>" : "");

    var fac = vis(window.SUVIDHA);
    var fc = fac.length ? '<div class="cards three">' + fac.map(suvidhaCard).join("") + "</div>" : '<p class="empty">' + esc(t("suvidha.none")) + "</p>";

    var D = window.MANDIR_NIYAM || window.DRESSCODE || {}, dl = (D.list || []).filter(function (x) { return L(x); });
    var dc = (L(D.intro) ? '<p class="measure">' + esc(L(D.intro)) + "</p>" : "") +
      (dl.length ? '<div class="cards three">' + dl.map(function (x, i) { return '<div class="card dress"><span class="dress-n" aria-hidden="true">' + (i + 1) + "</span><p>" + esc(L(x)) + "</p></div>"; }).join("") + "</div>" : "");

    return { timings: '<div class="cards three">' + tm + "</div>", reach: rc, facilities: fc, rules: dc };
  }
  function renderVisit() {
    var host = document.getElementById("visit"); if (!host) return;
    var panels = visitPanels();
    host.innerHTML = '<div class="vtabs" role="tablist" aria-label="' + esc(t("v.tabs_aria")) + '">' +
      VISIT_TABS.map(function (x) { return '<button class="vtab" type="button" role="tab" data-v="' + x[0] + '" aria-selected="false">' + esc(t(x[1])) + "</button>"; }).join("") + "</div>" +
      VISIT_TABS.map(function (x) { return '<div class="vpanel" role="tabpanel" data-v="' + x[0] + '" hidden>' + panels[x[0]] + "</div>"; }).join("");
    function show(which, push) {
      $$(".vtab", host).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-v") === which ? "true" : "false"); });
      $$(".vpanel", host).forEach(function (pn) { pn.hidden = pn.getAttribute("data-v") !== which; });
      if (push) { try { history.replaceState(null, "", "#" + which); } catch (e) { location.hash = which; } }
    }
    $$(".vtab", host).forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-v"), true); }); });
    show(visitTabFromHash(), false);
    if (!visitBound) { visitBound = true; window.addEventListener("hashchange", function () { var hh = document.getElementById("visit"); if (hh) { var w = visitTabFromHash(); $$(".vtab", hh).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-v") === w ? "true" : "false"); }); $$(".vpanel", hh).forEach(function (pn) { pn.hidden = pn.getAttribute("data-v") !== w; }); } }); }
  }
  var visitBound = false;

  /* ---------- daily karyakram: schedule + a month calendar (any past or coming date) ---------- */
  var dailyDay = "", dailyMonth = "", bhDay = [], bhDayAsked = false;
  function isoOf(y, m, d) { return y + "-" + pad2(m + 1) + "-" + pad2(d); }
  function eventsOn(iso) {
    return vis(window.EVENTS).filter(function (e) { return e.date <= iso && (e.endDate || e.date) >= iso; }).concat(bhDay.filter(function (e) { return e.date === iso; }));
  }
  function jainOn(iso) { return vis(window.CALENDAR).filter(function (c) { return c.date === iso; }); }
  function dailyRows() {
    var T = S.timings || {};
    return vis(window.DAILY).map(function (d) {
      var hhmm = d.at && T[d.at] ? T[d.at] : d.time;
      return { t: hhmm || "", m: hhmm ? toMin(hhmm) : 0, d: d };
    }).sort(function (a, b) { return a.m - b.m; });
  }
  function renderDaily() {
    var host = document.getElementById("daily"); if (!host) return;
    if (!bhDayAsked) { bhDayAsked = true; bhaktamarEvents().then(function (evs) { if (evs.length) { bhDay = bhDayEvents(evs); renderDaily(); } }); }
    var today = todayISO();
    if (!dailyDay) {
      var q = ""; try { q = new URLSearchParams(location.search).get("date") || ""; } catch (e) {}
      dailyDay = /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : today;
    }
    if (!dailyMonth) dailyMonth = dailyDay.slice(0, 7);
    var y = parseInt(dailyMonth.slice(0, 4), 10), m = parseInt(dailyMonth.slice(5, 7), 10) - 1;
    var first = new Date(y, m, 1).getDay(), dim = new Date(y, m + 1, 0).getDate();
    var wd = []; for (var i = 0; i < 7; i++) wd.push(new Date(2023, 0, 1 + i).toLocaleDateString(loc(), { weekday: "short" }));
    var cells = "";
    for (var b = 0; b < first; b++) cells += '<span class="dc empty-c"></span>';
    for (var d = 1; d <= dim; d++) {
      var iso = isoOf(y, m, d), n = eventsOn(iso).length + jainOn(iso).length;
      cells += '<button type="button" class="dc' + (iso === today ? " is-today" : "") + (iso === dailyDay ? " is-sel" : "") + (n ? " has-ev" : "") + '" data-d="' + iso + '"' + (n ? ' title="' + esc(t("daily.has")) + '"' : "") + ">" + d + (n ? '<i aria-hidden="true"></i>' : "") + "</button>";
    }
    var title = new Date(y, m, 1).toLocaleDateString(loc(), { month: "long", year: "numeric" });
    var rows = dailyRows();
    var evs = eventsOn(dailyDay), jn = jainOn(dailyDay);
    var state = dailyDay === today ? t("daily.today") : (dailyDay < today ? t("daily.past") : t("daily.future"));
    var routine = rows.length ? '<ol class="dsched">' + rows.map(function (r) {
      var cur = dailyDay === today && r.m <= nowMinutes() && (rows[rows.indexOf(r) + 1] ? rows[rows.indexOf(r) + 1].m > nowMinutes() : true) ? " is-now" : "";
      return '<li class="' + cur.trim() + '"><time>' + (r.t ? esc(fmtTime(r.t)) : "") + '</time><span class="dic" aria-hidden="true">' + esc(r.d.icon || "•") + '</span><div><h4>' + esc(L(r.d.title)) + "</h4>" + (L(r.d.text) ? "<p>" + esc(L(r.d.text)) + "</p>" : "") + "</div></li>";
    }).join("") + "</ol>" : "";
    var special = evs.map(function (e) {
      var meta = [L(e.time), L(e.place)].filter(Boolean).map(esc).join(", ");
      return '<article class="dspecial"><span class="tag">' + esc(L(e.type) || t("daily.special")) + "</span><h4>" + esc(L(e.title)) + "</h4>" + (meta ? '<p class="meta">' + meta + "</p>" : "") + (e.fams ? famHtml(e.fams) : L(e.text) ? "<p>" + esc(L(e.text)) + "</p>" : "") + "</article>";
    }).join("") + jn.map(function (c) {
      return '<article class="dspecial jain"><span class="tag tag-' + esc(c.type || "other") + '">' + esc(t("cal." + (c.type || "other"))) + "</span><h4>" + esc(L(c.title)) + "</h4>" + (L(c.note) ? "<p>" + esc(L(c.note)) + "</p>" : "") + "</article>";
    }).join("");
    host.innerHTML = '<div class="daily-grid"><div class="dcal card"><div class="dcal-h"><button type="button" class="dnav" data-mv="-1" aria-label="' + esc(t("daily.prev")) + '">&#8249;</button><strong>' + esc(title) + '</strong><button type="button" class="dnav" data-mv="1" aria-label="' + esc(t("daily.next")) + '">&#8250;</button></div>' +
      '<div class="dgrid" role="grid">' + wd.map(function (w) { return '<span class="dw">' + esc(w) + "</span>"; }).join("") + cells + "</div>" +
      '<div class="dcal-f"><button type="button" class="btn btn-line" id="d-today">' + esc(t("daily.today")) + '</button><label class="dpick"><span class="sr">' + esc(t("daily.pick")) + '</span><input type="date" id="d-pick" value="' + dailyDay + '"></label></div><p class="fine">' + esc(t("daily.note")) + "</p></div>" +
      '<div class="dday"><p class="dday-state">' + esc(state) + '</p><h2>' + esc(fullDate(dailyDay)) + "</h2>" +
      '<h3 class="dh">' + esc(t("daily.special")) + "</h3>" + (special || '<p class="empty">' + esc(t("daily.none_special")) + "</p>") +
      '<h3 class="dh">' + esc(t("daily.routine")) + "</h3>" + routine + "</div></div>";
    $$(".dc[data-d]", host).forEach(function (bt) { bt.addEventListener("click", function () { dailyDay = bt.getAttribute("data-d"); renderDaily(); var el = $(".dday", host); if (el && window.matchMedia("(max-width: 900px)").matches) el.scrollIntoView({ behavior: "smooth", block: "start" }); }); });
    $$(".dnav", host).forEach(function (bt) { bt.addEventListener("click", function () { var mv = parseInt(bt.getAttribute("data-mv"), 10), nd = new Date(y, m + mv, 1); dailyMonth = nd.getFullYear() + "-" + pad2(nd.getMonth() + 1); renderDaily(); var nb = $('.dnav[data-mv="' + mv + '"]'); if (nb) nb.focus(); }); });
    var tb = $("#d-today", host); if (tb) tb.addEventListener("click", function () { dailyDay = today; dailyMonth = today.slice(0, 7); renderDaily(); });
    var pk = $("#d-pick", host); if (pk) pk.addEventListener("change", function () { if (pk.value) { dailyDay = pk.value; dailyMonth = pk.value.slice(0, 7); renderDaily(); } });
  }

  /* ---------- timeline (About us > Timeline) ---------- */
  /* Timeline: one card per entry, alternating left / right. Same-year entries are simply separate cards (each shows its year). */
  function renderTimeline() {
    var items = vis(window.TIMELINE);
    put("timeline", items.length ? '<ol class="tl">' + items.map(function (it, i) {
      var ph = it.hidePhoto ? [] : photoList(it);
      var lab = [it.year == null ? "" : String(it.year), L(it.when)].filter(Boolean);
      return '<li class="tl-item ' + (i % 2 ? "r" : "l") + '"><span class="tl-dot" aria-hidden="true"></span><div class="tl-card card">' +
        (lab.length ? '<span class="tl-year">' + esc(lab[0]) + "</span>" : "") +
        (L(it.when) ? '<span class="tl-when">' + esc(L(it.when)) + "</span>" : "") +
        (L(it.title) ? "<h3>" + esc(L(it.title)) + "</h3>" : "") + (L(it.text) ? "<p>" + esc(L(it.text)) + "</p>" : "") +
        picsHtml(ph, "tlpics", L(it.title)) + "</div></li>";
    }).join("") + "</ol>" : '<p class="empty">' + esc(t("tl.none")) + "</p>");
  }

  /* ---------- nearby (Visit > Nearby): mandirs and tirths close to Nemidham, two groups on one page ---------- */
  function nearbyCard(x) {
    var rows = "";
    if (L(x.distance)) rows += '<p class="nb-row"><span aria-hidden="true">📍</span> ' + esc(t("nb.dist")) + ": " + esc(L(x.distance)) + "</p>";
    if (L(x.address)) rows += '<p class="nb-row"><span aria-hidden="true">🏠</span> ' + esc(L(x.address)) + "</p>";
    var acts = "";
    String(x.phone || "").split(",").map(function (p) { return p.trim(); }).filter(Boolean).forEach(function (p) {
      acts += '<a class="call-btn call-sm" href="' + telHref(p) + '"><span aria-hidden="true">📞</span> ' + esc(p) + "</a>";
    });
    var mp = x.mapLink || (x.mapQuery ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(x.mapQuery) : "");
    if (mp) acts += '<a class="btn btn-line nb-map" href="' + esc(mp) + '" target="_blank" rel="noopener">' + esc(t("nb.map")) + "</a>";
    return '<article class="card nb-card">' + picsHtml(x.hidePhoto ? [] : photoList(x), "nbpics", L(x.name)) +
      "<h3>" + esc(L(x.name)) + "</h3>" + (L(x.text) ? "<p>" + esc(L(x.text)) + "</p>" : "") + rows + (acts ? '<div class="nb-acts">' + acts + "</div>" : "") + "</article>";
  }
  /* data.js: window.NEARBY is a list of groups; every visible group becomes a tab. Old format { mandirs: [], tirths: [] } still works. */
  function nearbyGroups() {
    var N = window.NEARBY;
    if (N && !Array.isArray(N)) {
      N = [{ id: "mandirs", title: { hi: t("nb.mandirs"), en: t("nb.mandirs") }, items: N.mandirs }, { id: "tirths", title: { hi: t("nb.tirths"), en: t("nb.tirths") }, items: N.tirths }];
    }
    return vis(N);
  }
  var nearbyBound = false;
  function nearbyFromHash(gs) {
    var h = ""; try { h = decodeURIComponent((location.hash || "").replace("#", "")); } catch (e) {}
    return gs.some(function (g) { return g.id === h; }) ? h : gs[0].id;
  }
  function renderNearby() {
    var host = document.getElementById("nearby"); if (!host) return;
    var gs = nearbyGroups();
    if (!gs.length) { host.innerHTML = '<p class="empty">' + esc(t("nb.none")) + "</p>"; return; }
    host.innerHTML = '<div class="vtabs" role="tablist" aria-label="' + esc(t("p.nearby.h1")) + '">' +
      gs.map(function (g) { return '<button class="vtab" type="button" role="tab" data-n="' + esc(g.id) + '" aria-selected="false">' + (g.icon ? '<span aria-hidden="true">' + esc(g.icon) + "</span> " : "") + esc(L(g.title)) + "</button>"; }).join("") + "</div>" +
      gs.map(function (g) {
        var list = vis(g.items);
        return '<div class="vpanel nb-group" role="tabpanel" data-n="' + esc(g.id) + '" hidden>' + (L(g.intro) ? '<p class="measure">' + esc(L(g.intro)) + "</p>" : "") +
          (list.length ? '<div class="cards three">' + list.map(nearbyCard).join("") + "</div>" : '<p class="empty">' + esc(t("nb.none")) + "</p>") + "</div>";
      }).join("");
    function show(which, push) {
      $$(".vtab", host).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-n") === which ? "true" : "false"); });
      $$(".vpanel", host).forEach(function (pn) { pn.hidden = pn.getAttribute("data-n") !== which; });
      if (push) { try { history.replaceState(null, "", "#" + which); } catch (e) { location.hash = which; } }
    }
    $$(".vtab", host).forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-n"), true); }); });
    show(nearbyFromHash(gs), false);
    if (!nearbyBound) { nearbyBound = true; window.addEventListener("hashchange", function () { var g2 = nearbyGroups(); if (g2.length && document.getElementById("nearby")) { var w = nearbyFromHash(g2); $$("#nearby .vtab").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-n") === w ? "true" : "false"); }); $$("#nearby .vpanel").forEach(function (pn) { pn.hidden = pn.getAttribute("data-n") !== w; }); } }); }
  }

  /* ---------- home: connect ----------
     Removed: the Home page no longer has its own "Follow us" section.
     The footer's social icons (always visible) do this job on every page. */
  function renderConnect() {}

  /* ---------- gentle scroll-reveal: fade/rise content in as it enters the viewport ---------- */
  var REVEAL_SEL = ".card, .notice, .event, .yojana, .album, .person, .ss-card, .photo, .pmonth";
  var revealIO = null, revealMO = null;
  function setupReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
        });
      }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    }
    function tag(el) {
      if (el.classList.contains("reveal") || el.classList.contains("in")) return;
      el.classList.add("reveal");
      revealIO.observe(el);
    }
    $$(REVEAL_SEL, document).forEach(tag);
    if (!revealMO && "MutationObserver" in window) {
      revealMO = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (n.nodeType !== 1) return;
            if (n.matches && n.matches(REVEAL_SEL)) tag(n);
            if (n.querySelectorAll) $$(REVEAL_SEL, n).forEach(tag);
          });
        });
      });
      revealMO.observe(document.getElementById("main") || document.body, { childList: true, subtree: true });
    }
  }

  /* ---------- go ---------- */
  /* SITE.hideHome: ["yojana","notices","events","gallery","cta"] hides sections of the Home page; the remaining ones keep alternating backgrounds */
  function applyHomeSections() {
    if (document.body.getAttribute("data-page") !== "home") return;
    var hide = S.hideHome || [], k = 0;
    $$("[data-home]").forEach(function (sec) {
      var off = hide.indexOf(sec.getAttribute("data-home")) >= 0;
      sec.hidden = off;
      if (!off) { sec.classList.toggle("alt", k % 2 === 1); k++; }
    });
  }

  /* ---------- install on the phone like an app (PWA) ----------
     A small pop-up offers it to visitors who have not added it yet. "Not now" brings it back after 2 days.
     Once it is added (or the visitor says it is already added) the pop-up never comes again.
     The footer button always stays; if the app is already added it says so. */
  var installEv = null;
  function appCfg() { var a = S.appInstall; if (a === false) return { footerButton: false, popup: false, popupAfterDays: 4, gapMinutes: 30, delaySec: 4 }; a = a && typeof a === "object" ? a : {}; return { footerButton: a.footerButton !== false, popup: a.popup !== false, popupAfterDays: +a.popupAfterDays > 0 ? +a.popupAfterDays : 4, gapMinutes: +a.popupGapMinutes >= 0 && a.popupGapMinutes !== "" && a.popupGapMinutes != null ? +a.popupGapMinutes : 30, delaySec: a.popupDelaySeconds != null && a.popupDelaySeconds !== "" && +a.popupDelaySeconds >= 0 ? +a.popupDelaySeconds : 4 }; }
  function snoozeMs() { return appCfg().popupAfterDays * 24 * 3600 * 1000; }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function isStandalone() { return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function appAdded() { return lsGet("nemi-app-added") === "1"; }
  function canOfferInstall() {
    if (isStandalone()) return false;
    return !!installEv || isIOS() || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  }
  function refreshInstall() { var on = canOfferInstall() && appCfg().footerButton; $$(".install-foot").forEach(function (b) { b.hidden = !on; }); }
  function closeAppGuide() { var g = document.getElementById("app-guide"); if (g) { g.remove(); document.removeEventListener("keydown", guideKey); } }
  function guideKey(e) { if (e.key === "Escape") { var snz = document.getElementById("app-guide").getAttribute("data-offer") === "1"; closeAppGuide(); if (snz) lsSet("nemi-app-snooze", String(Date.now() + snoozeMs())); } }
  function appBox(html, offer) {
    closeAppGuide();
    var g = document.createElement("div"); g.id = "app-guide"; g.className = "app-guide"; if (offer) g.setAttribute("data-offer", "1");
    g.innerHTML = '<div class="app-box" role="dialog" aria-modal="true" aria-labelledby="app-gh">' + html + "</div>";
    document.body.appendChild(g); document.addEventListener("keydown", guideKey);
    g.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-act]"), act = b ? b.getAttribute("data-act") : (e.target === g ? (offer ? "later" : "close") : "");
      if (!act) return;
      if (act === "later") { lsSet("nemi-app-snooze", String(Date.now() + snoozeMs())); closeAppGuide(); }
      else if (act === "close") closeAppGuide();
      else if (act === "install") { if (offer) lsSet("nemi-app-snooze", String(Date.now() + snoozeMs())); doInstall(); }
      else if (act === "how") openAppGuide();
    });
    var f = g.querySelector("[data-act=install], [data-act=close], [data-act=how]"); if (f) f.focus();
  }
  function openAppGuide() {
    var ios = isIOS(), steps = ios ? ["app.ios1", "app.ios2", "app.ios3"] : ["app.and1", "app.and2", "app.and3"];
    appBox('<h3 id="app-gh">' + esc(t(ios ? "app.ios.h" : "app.and.h")) + "</h3><p>" + esc(t("app.p")) + "</p><ol>" +
      steps.map(function (k) { return "<li>" + esc(t(k)) + "</li>"; }).join("") + '</ol><button type="button" class="btn btn-line" data-act="close">' + esc(t("app.close")) + "</button>", false);
  }
  function openAddedInfo() {
    appBox('<h3 id="app-gh">' + esc(t("app.added.h")) + "</h3><p>" + esc(t("app.added.p")) + '</p><div class="app-acts"><button type="button" class="btn btn-line" data-act="close">' + esc(t("app.close")) + '</button><button type="button" class="app-hide" data-act="how">' + esc(t("app.again")) + "</button></div>", false);
  }
  function openOffer() {
    appBox('<img class="app-ic" src="images/icon-192.png" alt="" width="56" height="56"><h3 id="app-gh">' + esc(t("app.h")) + "</h3><p>" + esc(t("app.p")) +
      '</p><div class="app-acts"><button type="button" class="btn btn-line" data-act="install">' + esc(t("app.btn")) + '</button></div>' +
      '<div class="app-acts app-sub"><button type="button" class="app-hide" data-act="later">' + esc(t("app.hide")) + '</button></div>', true);
  }
  function doInstall() {
    if (installEv) {
      var ev = installEv; installEv = null; closeAppGuide();
      ev.prompt(); if (ev.userChoice && ev.userChoice.then) ev.userChoice.then(function (c) { if (c && c.outcome === "dismissed") lsSet("nemi-app-snooze", String(Date.now() + snoozeMs())); refreshInstall(); }, refreshInstall);
      refreshInstall();
    } else openAppGuide();
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); installEv = e; lsDel("nemi-app-added"); refreshInstall(); });   /* the browser only offers install when it is NOT installed */
  window.addEventListener("appinstalled", function () { installEv = null; lsSet("nemi-app-added", "1"); closeAppGuide(); refreshInstall(); });
  if (isStandalone()) lsSet("nemi-app-added", "1");
  if (navigator.getInstalledRelatedApps) { try { navigator.getInstalledRelatedApps().then(function (a) { if (a && a.length) lsSet("nemi-app-added", "1"); }, function () {}); } catch (e) {} }
  document.addEventListener("click", function (e) {
    if (!(e.target.closest && e.target.closest(".install-foot"))) return;
    if (installEv) doInstall(); else if (appAdded()) openAddedInfo(); else openAppGuide();
  });
  /* the pop-up: a few seconds after a page opens, once per visit, only if not added and not snoozed */
  var offerTimer = 0;
  /* testing: open the site with  ?app=test  at the end of the address to forget the saved choices and see the pop-up again */
  if (/[?&]app=test\b/.test(location.search)) { lsDel("nemi-app-added"); lsDel("nemi-app-snooze"); lsDel("nemi-app-offered"); }
  function scheduleOffer() {
    if (offerTimer || !document.body.getAttribute("data-page")) return;
    var snooze = +lsGet("nemi-app-snooze") || 0, seen = false;
    seen = Date.now() - (+lsGet("nemi-app-offered") || 0) < appCfg().gapMinutes * 60 * 1000;   /* shown a short while ago: do not repeat on every page */
    if (!appCfg().popup || seen || snooze > Date.now() || appAdded()) return;
    offerTimer = setTimeout(function () {
      offerTimer = 0;
      if (!appCfg().popup || !canOfferInstall() || appAdded() || document.getElementById("app-guide")) return;
      lsSet("nemi-app-offered", String(Date.now()));
      openOffer();
    }, appCfg().delaySec * 1000);
  }
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
  /* Background animations (rotating mandalas, glow) pause while their area is off the screen or the app is in the background,
     so the phone does not keep drawing what nobody sees. Nothing changes in how they look. */
  var animIO = null;
  function watchAnimations() {
    if (!("IntersectionObserver" in window)) return;
    if (!animIO) animIO = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle("anim-off", !e.isIntersecting); }); }, { rootMargin: "80px" });
    $$(".hero2, .page-head, footer.site").forEach(function (el) { if (!el.__animWatched) { el.__animWatched = true; animIO.observe(el); } });
  }
  document.addEventListener("visibilitychange", function () { document.documentElement.classList.toggle("anim-hidden", document.hidden); });
  /* App opening animation: when the site is opened from the home-screen icon (installed app), the mandir logo
     appears with a soft golden glow and the page fades in (once per app opening). Switch off: SITE.appIntro = false. */
  (function appIntro() {
    var h = document.documentElement;
    if (!h.classList.contains("app-intro")) return;
    if (S.appIntro === false) { h.classList.remove("app-intro"); return; }
    try { sessionStorage.setItem("nemi-intro", "1"); } catch (e) {}
    setTimeout(function () { h.classList.remove("app-intro"); }, 1700);
  })();
  function render() {
    if (timer) { clearInterval(timer); timer = null; }
    ensureTop();
    buildBanner();
    buildHeader();
    buildFooter();
    applyStatic();
    switch (page) {
      case "home":
        renderHero(); renderPanel(); timer = setInterval(renderPanel, 60000);
        renderHomeYojana(); renderAnnouncements(); renderHomeEvents(); renderHomeGallery(); renderHomeSuvidha(); renderConnect();
        break;
      case "yojana": renderYojanaPage(); break;
      case "activity": renderActivityPage(); break;
      case "suvidha": renderSuvidha(); break;
      case "daily": renderDaily(); break;
      case "timeline": renderTimeline(); break;
      case "nearby": renderNearby(); break;
      case "karyakram": renderKaryakram(); break;
      case "calendar": renderCalendar(); break;
      case "announcements": renderAnnouncementsPage(); break;
      case "gallery": renderGallery(); break;
      case "about": renderAbout(); break;
      case "team": renderTeam(); break;
      case "daan": renderDaan(); break;
      case "visit": renderVisit(); break;
    }
    if (firstRender) {
      firstRender = false;
      if (location.hash.length > 1) {
        var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (el) el.scrollIntoView();
      }
    }
    applyHomeSections();
    setupReveal();
    refreshInstall();
    scheduleOffer();
    watchAnimations();
  }
  render();

  /* ---------- numbers: wrap digits (pin code, amounts, phone numbers) so they are drawn larger and clearer ---------- */
  var NUM_RE = /[\u20B9+]?\d(?:[\d,.:\/\- ]*\d)?/g, NUM_SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|IFRAME|SVG|CODE|TITLE)$/;
  var numBusy = false, numTimer = 0;
  function numify() {
    if (numBusy) return; numBusy = true;
    try {
      var roots = [$("main"), $("footer.site"), $("header.site")].filter(Boolean), nodes = [];
      roots.forEach(function (r) {
        var w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT, null), n;
        while ((n = w.nextNode())) {
          if (!/\d/.test(n.nodeValue)) continue;
          var p = n.parentNode;
          if (!p || NUM_SKIP.test(p.nodeName) || (p.closest && p.closest(".num, .dgrid, .tl-year, .dsched time, .brand-text, .foot-name, .legal, h1, h2, [data-nonum]"))) continue;
          nodes.push(n);
        }
      });
      nodes.forEach(function (n) {
        var txt = n.nodeValue, last = 0, m, frag = document.createDocumentFragment();
        NUM_RE.lastIndex = 0;
        while ((m = NUM_RE.exec(txt))) {
          if (m.index > last) frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
          var sp = document.createElement("span"); sp.className = "num"; sp.textContent = m[0]; frag.appendChild(sp);
          last = m.index + m[0].length;
        }
        if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
        n.parentNode.replaceChild(frag, n);
      });
    } finally { numBusy = false; }
  }
  numify();
  if ("MutationObserver" in window) {
    new MutationObserver(function () { if (numBusy) return; clearTimeout(numTimer); numTimer = setTimeout(numify, 60); })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  }
})();
