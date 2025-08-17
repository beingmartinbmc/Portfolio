// Service Worker for Portfolio - Optimized Caching
const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/css/apple-inspired.css',
  '/assets/js/apple-animations.js',
  '/assets/js/main.js',
  '/assets/js/aos.js',
  '/assets/images/ankit-optimized.jpg',
  '/assets/images/github.png',
  '/assets/images/linked.png',
  '/assets/images/insta.png',
  '/assets/images/stackoverflow.png'
];

// Install event - cache static files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.origin === self.location.origin) {
    // Same-origin requests
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response; // Return cached version
          }
          
          // Fetch from network and cache
          return fetch(request)
            .then(response => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              // Cache in dynamic cache
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // Return offline page for navigation requests
              if (request.destination === 'document') {
                return caches.match('/index.html');
              }
            });
        })
    );
  } else {
    // Cross-origin requests (CDN resources)
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request)
            .then(response => {
              // Cache successful responses
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => {
                    cache.put(request, responseToCache);
                  });
              }
              return response;
            });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/images/ankit-optimized.jpg',
    badge: '/assets/images/github.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/assets/images/github.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/github.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Ankit Sharma Portfolio', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
function doBackgroundSync() {
  // Handle any background sync tasks
  console.log('Background sync completed');
}

// Cache warming - preload important resources
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_WARM') {
    event.waitUntil(
      caches.open(STATIC_CACHE)
        .then(cache => {
          return cache.addAll(STATIC_FILES);
        })
    );
  }
});
