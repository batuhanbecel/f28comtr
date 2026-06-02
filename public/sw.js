const CACHE_NAME = 'f28-v4';
const PRECACHE = ['/', '/production', '/ai-powered', '/portfolios', '/about'];

function shouldSkipCache(url: URL): boolean {
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) return true;
  if (url.pathname.startsWith('/_next/')) return true;
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) return true;
  return false;
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;

  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (shouldSkipCache(url)) return;

  // Images: cache-first
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(webp|jpg|jpeg|png|gif|svg|avif)$/i)
  ) {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            }
            return res;
          })
      )
    );
    return;
  }

  // HTML pages: network-first with cache fallback (never cache JS bundles)
  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && url.origin === self.location.origin && request.mode === 'navigate') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request).then((r) => r || new Response('Offline', { status: 503 })))
  );
});
