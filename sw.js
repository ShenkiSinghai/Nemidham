/* Service worker: lets the site open like an app, fast, and show the last seen pages when the network is weak.
   - Pages, styles and scripts: asked fresh from the server first (so every website update shows up), but if the
     network is slow (more than 2.5 seconds) the saved copy is shown at once and the fresh copy is saved for next time.
   - Pictures: the saved copy is shown at once and quietly refreshed in the background.
   Google Sheet lists, fonts and the mantra audio are never saved here. */
var CACHE = "nemidham-v3";
var SHELL = ["./", "index.html", "css/style.css", "css/theme2.css", "js/data.js", "js/i18n.js", "js/main.js", "images/mandir-logo.webp", "images/icon-192.png", "images/icon-512.png"];
var WAIT_MS = 2500;
/* when a page had to be shown from the saved copy (slow network), its styles and scripts are also taken from the saved copy
   at once for a short while, instead of waiting 2.5 seconds again for each one (they are still refreshed for next time) */
var slowUntil = 0;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(new Request(u, { cache: "no-cache" })).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function save(req, res) { if (res && res.ok && res.type === "basic") { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); } return res; }
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || /\.(mp3|mp4|webm)$/i.test(u.pathname) || r.headers.has("range")) return;
  var nav = r.mode === "navigate";
  var key = nav ? new Request(u.origin + u.pathname) : r;   /* one saved copy per page, whatever is after ? or # */
  if (/\.(png|jpe?g|webp|svg|gif|ico)$/i.test(u.pathname)) {   /* pictures: saved copy first, refreshed quietly */
    e.respondWith(caches.match(r).then(function (hit) {
      var net = fetch(u.href, { cache: "no-cache" }).then(function (res) { return save(r, res); }).catch(function () { return hit || Response.error(); });
      if (hit) { e.waitUntil(net); return hit; }
      return net;
    }));
    return;
  }
  e.respondWith(new Promise(function (resolve) {
    var done = false;
    function give(res) { if (!done && res) { done = true; resolve(res); } }
    /* a page that moved (redirect) is handed to the browser as a redirect, because the browser refuses a page fetched through one */
    var net = fetch(u.href, { cache: "no-cache", redirect: nav ? "manual" : "follow" }).then(function (res) { return save(key, res); });
    e.waitUntil(net.catch(function () {}));
    var wait = !nav && Date.now() < slowUntil ? 0 : WAIT_MS;
    var timer = setTimeout(function () { if (nav) slowUntil = Date.now() + 15000; caches.match(key).then(function (hit) { give(hit); }); }, wait);
    net.then(function (res) { clearTimeout(timer); if (nav && !done) slowUntil = 0; give(res); }, function () {
      clearTimeout(timer);
      caches.match(key).then(function (hit) { return hit || (nav ? caches.match("index.html") : undefined); })
        .then(function (x) { give(x || Response.error()); });
    });
  }));
});
