const CACHE_NAME = 'jam-society-cache-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    ).then(() => self.clients.claim())
  );
});

function shouldBypassCache(request) {
  if (request.method !== 'GET') return true;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return true;

  const path = url.pathname;
  if (path.startsWith('/src/') || path.startsWith('/@') || path.includes('@react-refresh')) {
    return true;
  }

  const dest = request.destination;
  return dest === 'document' || dest === 'script' || dest === 'worker' || path.endsWith('.js');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (shouldBypassCache(request)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response && response.status === 200 && response.type === 'basic') {
        cache.put(request, response.clone());
      }
      return response;
    })
  );
});
