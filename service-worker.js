const CACHE_NAME = 'cineflix-v1';
const STATIC_ASSETS = [
  '/movie-app/',
  '/movie-app/index.html',
  '/movie-app/style.css',
  '/movie-app/manifest.json',
  '/movie-app/assets/logo.svg',
  '/movie-app/assets/placeholder.webp',
  '/movie-app/data/genres.json',
  '/movie-app/js/utils.js',
  '/movie-app/js/state.js',
  '/movie-app/js/api.js',
  '/movie-app/js/components.js',
  '/movie-app/js/home.js',
  '/movie-app/js/discover.js',
  '/movie-app/js/search.js',
  '/movie-app/js/detail.js',
  '/movie-app/js/tv.js',
  '/movie-app/js/library.js',
  '/movie-app/js/nations.js',
  '/movie-app/js/router.js',
  '/movie-app/js/app.js'
];

const IMAGE_CACHE = 'cineflix-images-v1';

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== IMAGE_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static, network-first for API, stale-while-revalidate for images
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API calls: network first, fallback to cache
  if (url.hostname.includes('api.themoviedb.org') || url.hostname.includes('image.tmdb.org')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        }).catch(() => cache.match(request));
      })
    );
    return;
  }

  // Static assets: cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-watchlist') {
    event.waitUntil(syncWatchlist());
  }
});

async function syncWatchlist() {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => client.postMessage({ type: 'SYNC_WATCHLIST' }));
}

// Push notifications (future-ready)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Cineflix', {
      body: data.body ?? 'New content available!',
      icon: '/movie-app/assets/logo.svg',
      badge: '/movie-app/assets/logo.svg',
      tag: data.tag ?? 'cineflix',
      data: data.url ?? '/movie-app/'
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
