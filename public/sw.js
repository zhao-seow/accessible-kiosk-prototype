// Minimal service worker for the Accessible Kiosk PWA.
// Network-first for navigations (so the kiosk always gets the latest UI when
// online), with a cached app-shell fallback so it still launches offline.
const CACHE = "kiosk-shell-v1";
// self.registration.scope is the absolute URL of the directory this worker was
// registered against (e.g. https://host/accessible-kiosk-prototype/), so the
// shell list stays correct whether the app is served from the domain root or
// a GitHub Pages subpath.
const BASE = self.registration.scope;
const SHELL = [BASE, `${BASE}index.html`, `${BASE}manifest.webmanifest`, `${BASE}apple-touch-icon.png`, `${BASE}icon-192.png`, `${BASE}icon-512.png`];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // App navigations: try network, fall back to the cached shell.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(`${BASE}index.html`, copy));
          return res;
        })
        .catch(() => caches.match(`${BASE}index.html`).then((r) => r || caches.match(BASE))),
    );
    return;
  }

  // Other GETs: cache-first with background refresh.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
