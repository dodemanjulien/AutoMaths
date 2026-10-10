const CACHE_NAME = 'automaths-v1.4.0';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './gamification.js',
  './curriculum.js',
  './gen-cap-c1.js',
  './gen-cap-c2.js',
  './gen-bac2nde.js',
  './gen-bac1ere.js',
  './gen-bac-term.js',
  './lesson-hints.js',
  './minigame.js',
  './theme_assets.js',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    }).catch(() => {
      if (e.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
