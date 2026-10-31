/* Service worker: lets the site open like an app and show the last seen pages when the network is weak.
   Pages, styles and scripts are always fetched fresh from the network first (so every website update shows up at once);
   the saved copy is used only when the network fails. Google Sheet lists, fonts and the mantra audio are never saved here. */
var CACHE = "nemidham-v1";
var SHELL = ["./", "index.html", "css/style.css", "css/theme2.css", "js/data.js", "js/i18n.js", "js/main.js", "images/icon-192.png", "images/icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || /\.(mp3|mp4|webm)$/i.test(u.pathname) || r.headers.has("range")) return;
  var isImg = /\.(png|jpe?g|webp|svg|gif|ico)$/i.test(u.pathname);
  if (isImg) {   /* pictures: saved copy first, refreshed quietly */
    e.respondWith(caches.match(r).then(function (hit) {
      var net = fetch(r).then(function (res) { if (res && res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); } return res; }).catch(function () { return hit; });
      return hit || net;
    }));
    return;
  }
  e.respondWith(fetch(r.mode === "navigate" ? r : u.href, r.mode === "navigate" ? undefined : { cache: "no-cache" }).then(function (res) {
    if (res && res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); }
    return res;
  }).catch(function () {
    return caches.match(r).then(function (hit) { return hit || (r.mode === "navigate" ? caches.match("index.html") : Response.error()); });
  }));
});
