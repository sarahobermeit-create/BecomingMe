// Template: the Vite build fills in the cache version and precache list below, then emits it as /sw.js.
const CACHE = "app-__VERSION__";
const PRECACHE = __PRECACHE__;
const NAVIGATION_TIMEOUT_MS = 3000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first for local book covers so images load instantly and work 100% offline
  if (request.method === "GET" && url.origin === self.location.origin && url.pathname.startsWith("/api/books/covers/")) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) {
            void cache.put(request, response.clone());
          }
          return response;
        } catch {
          return Response.error();
        }
      }),
    );
    return;
  }

  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(navigate(request));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request)));
});

// Every route is the same app shell, so a slow or failed navigation falls back to the cached copy of "/".
async function navigate(request) {
  const network = fetch(request).catch(() => undefined);
  const timeout = new Promise((resolve) => setTimeout(resolve, NAVIGATION_TIMEOUT_MS));
  const response = await Promise.race([network, timeout]);
  if (response && response.status < 500) return response;
  return (await caches.match("/")) ?? (await network) ?? Response.error();
}
