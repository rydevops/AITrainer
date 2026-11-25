"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/sw.ts
  var require_sw = __commonJS({
    "src/sw.ts"() {
      var CACHE_NAME = "aitrainer-v1";
      var APP_SHELL = ["./", "index.html", "styles.css", "app.js", "manifest.webmanifest", "icons/icon.svg"];
      var scope = self;
      scope.addEventListener("install", (event) => {
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => scope.skipWaiting())
        );
      });
      scope.addEventListener("activate", (event) => {
        event.waitUntil(
          caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => scope.clients.claim())
        );
      });
      scope.addEventListener("fetch", (event) => {
        if (event.request.method !== "GET") {
          return;
        }
        event.respondWith(
          fetch(event.request).then((response) => {
            if (response.ok && new URL(event.request.url).origin === scope.location.origin) {
              const copy = response.clone();
              void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return response;
          }).catch(() => caches.match(event.request).then((cached) => cached ?? Response.error()))
        );
      });
    }
  });
  require_sw();
})();
//# sourceMappingURL=sw.js.map
