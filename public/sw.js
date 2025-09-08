const CACHE_NAME = 'five-london-v3.0.0-' + Date.now();
const STATIC_CACHE = 'five-london-static-v3';
const RUNTIME_CACHE = 'five-london-runtime-v3';

// Minimal assets to cache (for better private browser compatibility)
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

// Robust private mode detection - multiple methods
function isPrivateMode() {
  try {
    // Method 1: localStorage test
    const test = 'privateModeTest';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    
    // Method 2: Check if storage is severely limited
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        if (estimate.quota && estimate.quota < 50000000) { // Less than 50MB = likely private
          console.log('SW: Low storage quota detected, private mode likely');
          return true;
        }
      });
    }
    
    return false;
  } catch (e) {
    console.log('SW: Private mode detected via localStorage test');
    return true;
  }
}

// Install event - minimal caching for compatibility
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  // Skip caching entirely in private mode
  if (isPrivateMode()) {
    console.log('SW: Private mode detected, skipping all caching');
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Caching essential assets');
        return cache.addAll(PRECACHE_ASSETS).catch(error => {
          console.log('SW: Cache failed, continuing anyway:', error);
        });
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.log('SW: Install failed, continuing anyway:', error);
        self.skipWaiting();
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE && cacheName !== CACHE_NAME) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
      .catch(error => {
        console.log('SW: Activation error:', error);
      })
  );
});

// Fetch event - network-first with graceful fallbacks
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for certain URLs or in private mode
  if (NEVER_CACHE.some(pattern => url.pathname.startsWith(pattern)) || isPrivateMode()) {
    return; // Let browser handle normally
  }

  // Simple network-first strategy for all requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses and if not in private mode
        if (response.status === 200 && !isPrivateMode()) {
          try {
            const responseClone = response.clone();
            const cacheName = request.destination === 'document' ? RUNTIME_CACHE : STATIC_CACHE;
            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseClone);
              })
              .catch(() => {
                // Ignore cache errors in private mode
              });
          } catch (error) {
            // Ignore clone/cache errors
          }
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache as fallback
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cache, return a basic offline page for navigation requests
          if (request.mode === 'navigate') {
            return new Response('Offline - Please check your connection', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          }
          throw new Error('Network and cache failed');
        });
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