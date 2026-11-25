/// <reference lib="webworker" />

const CACHE_NAME = "aitrainer-v1";
const APP_SHELL = ["./", "index.html", "styles.css", "app.js", "manifest.webmanifest", "icons/icon.svg"];

const scope = self as unknown as ServiceWorkerGlobalScope;

scope.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => scope.skipWaiting()),
  );
});

scope.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => scope.clients.claim()),
  );
});

scope.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && new URL(event.request.url).origin === scope.location.origin) {
          const copy = response.clone();
          void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached ?? Response.error())),
  );
});
