self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const CACHE_NAME = 'focus-static-v2';
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

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:'window'}).then(function(clientList) {
    for (const client of clientList) {
      if (client.url && 'focus' in client) return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow('/');
  }));
});
