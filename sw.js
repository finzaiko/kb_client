const version = "0.0.01b";
const cacheName = `sw-kbclient-${version}`;
const cacheFiles = [
  "index.html",
  "app.webmanifest",
  "assets/css/webix.css",
  "codebase/myapp.css",
  "assets/css/materialdesignicons.css",
  "sw.js",
  "assets/js/webix.min.js",
  "codebase/myapp.js",
  "assets/icon/favicon-16x16.png",
  "assets/icon/favicon-32x32.png",
  "assets/icon/android-icon-192x192.png",
  "assets/icon/android-chrome-192x192.png",
  "assets/icon/android-chrome-512x512.png",
  "assets/icon/apple-touch-icon.png",
  "assets/css/fonts/Roboto-Regular-webfont.woff2",
  "assets/css/fonts/Roboto-Medium-webfont.woff2",
  "assets/css/fonts/webixmdi-webfont.woff2",
  "assets/css/fonts/materialdesignicons-webfont.woff2",
];

self.addEventListener("install", (event) => {
  console.log(`Event fired: ${event.type}`);
  console.dir(event);
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheFiles).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log(`Fetching ${event.request.url}`);
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(cacheName).then((cache) => {
        return cache.match(event.request);
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== cacheName) {
              console.log("[ServiceWorker] Removing old cache", key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("sync", (event) => {
  console.log("SW: Sync event: " + event);
});
