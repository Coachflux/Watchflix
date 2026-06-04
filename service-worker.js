const CACHE_NAME = 'cineflix-v1';
const STATIC_ASSETS = [
  '/movie-app/',
  '/movie-app/index.html',
  '/movie-app/style.css',
  '/movie-app/manifest.json',
  '/movie-app/assets/logo.svg',
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
  '/movie-app/js/app.js',
  '/movie-app/data/genres.json'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(() => {
      // Silent fail for individual assets
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API requests (TMDB)
  if (url.hostname.includes('themoviedb.org') || url.hostname.includes('tmdb.org')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // Skip image.tmdb.org - cache images
  if (url.hostname.includes('image.tmdb.org')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Default: network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/movie-app/index.html');
          }
          throw new Error('Network error');
        });
      })
  );
});

// Background sync for downloads
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-downloads') {
    event.waitUntil(syncDownloads());
  }
});

async function syncDownloads() {
  // Background sync placeholder
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ type: 'SYNC_COMPLETE' });
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Cineflix', {
      body: data.body || 'New content available!',
      icon: '/movie-app/assets/logo.svg',
      badge: '/movie-app/assets/logo.svg',
      tag: data.tag || 'cineflix-notification',
      requireInteraction: false,
      data: data.data || {}
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/movie-app/')
  );
});
