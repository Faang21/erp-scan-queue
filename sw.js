// Service Worker for PT. Erik Maju Jaya Mobile Portal App
const CACHE_NAME = 'emj-portal-v2';
const urlsToCache = [
  '/',
  '/logo_emj.png',
  '/logo_emj_192.png',
  '/logo_emj_512.png',
  '/manifest.json',
  '/manifest_security.json',
  '/manifest_ob.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Always fetch fresh HTML and API from network
  if (event.request.mode === 'navigate' || event.request.url.includes('.html') || event.request.url.includes('portal') || event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
