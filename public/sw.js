self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const CACHE_NAME = 'focus-static-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/styles.css'
];

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            try { cache.put(req, res.clone()); } catch (e) {}
            return res;
          });
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
