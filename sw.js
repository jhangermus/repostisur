const CACHE_NAME = 'repostisur-v2';
const ASSETS_TO_CACHE = [
  './',
  './admin.html',
  './index.html',
  './manifest.json',
  './js/storage.js',
  './js/bcv.js',
  './js/app.js',
  './js/admin.js',
  './js/pwa.js',
  './js/supabase-config.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
