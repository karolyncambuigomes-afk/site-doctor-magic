const CACHE_NAME = 'five-london-v2.0.0-' + Date.now();
const STATIC_CACHE = 'five-london-static-v2';
const RUNTIME_CACHE = 'five-london-runtime-v2';

// Assets to cache immediately (minimal for better reliability)
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json'
];

// Assets that should never be cached
const NEVER_CACHE = [
  '/admin',
  '/auth',
  '/api/',
  '/supabase',
  '/_vercel',
  'chrome-extension://',
  'moz-extension://',
  '.map'
];

// Check if we're in private mode
function isPrivateMode() {
  try {
    const test = 'privateModeTest';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return false;
  } catch (e) {
    return true;
  }
}

// Install event - cache static assets (skip in private mode)
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  if (isPrivateMode()) {
    console.log('Private mode detected, skipping cache');
    return self.skipWaiting();
  }
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Precaching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean old caches and take control
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE && cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network-first strategy for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for certain URLs or private mode
  if (NEVER_CACHE.some(pattern => url.pathname.startsWith(pattern)) || isPrivateMode()) {
    return;
  }

  // Network-first strategy for HTML documents (for immediate updates)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If network succeeds, update cache and return response
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // If network fails, serve from cache
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  if (request.destination === 'script' || request.destination === 'style' || request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Serve from cache, but update cache in background
            fetch(request)
              .then((response) => {
                if (response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(STATIC_CACHE)
                    .then((cache) => {
                      cache.put(request, responseClone);
                    });
                }
              })
              .catch(() => {
                // Ignore network errors for background updates
              });
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
    );
    return;
  }

  // Default: network-first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});