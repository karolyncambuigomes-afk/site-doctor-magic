// Five London - Service Worker for Caching and Offline Support
// Optimized for private browsing compatibility

const CACHE_NAME = 'five-london-v1';
const STATIC_CACHE = 'five-london-static-v1';
const RUNTIME_CACHE = 'five-london-runtime-v1';

// Essential assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json'
];

// URLs to never cache
const NEVER_CACHE = [
  '/api/',
  '/supabase/',
  '/admin',
  '/auth',
  'chrome-extension',
  '.map'
];

// Ultra-simple private mode detection
function isPrivateMode() {
  try {
    self.localStorage.setItem('swtest', 'test');
    self.localStorage.removeItem('swtest');
    return false;
  } catch (e) {
    return true;
  }
}

// Install event - cache assets only if not in private mode
self.addEventListener('install', event => {
  console.log('SW: Install event');
  
  // Quick private mode check and exit immediately if detected
  if (isPrivateMode()) {
    console.log('SW: Private mode detected, skipping all caching');
    return self.skipWaiting();
  }
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE);
        console.log('SW: Caching assets');
        await cache.addAll(PRECACHE_ASSETS);
        console.log('SW: Assets cached successfully');
      } catch (error) {
        console.log('SW: Caching failed:', error);
      }
      
      return self.skipWaiting();
    })()
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
  );
});

// Fetch event - enhanced mobile-optimized strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests and never-cache patterns
  if (event.request.method !== 'GET' || 
      NEVER_CACHE.some(pattern => url.pathname.includes(pattern))) {
    return;
  }

  // Quick private mode check
  if (isPrivateMode()) {
    // Private mode - network only, no caching
    event.respondWith(
      fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return new Response('Offline - Private mode', { 
            status: 200, 
            headers: { 'Content-Type': 'text/plain' } 
          });
        }
        throw new Error('Network failed');
      })
    );
    return;
  }

  // Ultra-aggressive mobile-first caching strategy
  event.respondWith(
    (async () => {
      const isMobileRequest = event.request.headers.get('user-agent')?.match(/(iPhone|iPad|Android|Mobile)/i);
      const hasRefreshParam = url.searchParams.has('mobile-refresh') || 
                             url.searchParams.has('force-refresh') || 
                             url.searchParams.has('sync') ||
                             url.searchParams.has('t') ||
                             url.searchParams.has('retry');
      
      try {
        // Ultra-aggressive mobile strategy: always network-first, bypass cache completely
        if (isMobileRequest || hasRefreshParam) {
          console.log('SW: Mobile request detected, using network-first strategy');
          
          try {
            // Force fresh request with no-cache headers
            const freshRequest = new Request(event.request, {
              cache: 'no-store',
              headers: {
                ...event.request.headers,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
              }
            });
            
            const response = await fetch(freshRequest);
            
            if (response.status === 200) {
              const cache = await caches.open(RUNTIME_CACHE);
              // Clear any existing cache for this request
              await cache.delete(event.request);
              await cache.delete(event.request.url);
              
              // Store fresh version with timestamp
              const responseClone = response.clone();
              cache.put(event.request, responseClone);
              
              console.log('SW: Fresh response cached for mobile request');
            }
            
            return response;
          } catch (networkError) {
            console.log('SW: Network failed for mobile, trying cache fallback');
            // Last resort fallback to cache
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
              return cachedResponse;
            }
            throw networkError;
          }
        }
        
        // Regular network-first strategy for desktop
        const response = await fetch(event.request);
        
        if (response.status === 200) {
          const cache = await caches.open(STATIC_CACHE);
          cache.put(event.request, response.clone());
        }
        
        return response;
      } catch (error) {
        console.log('SW: All strategies failed, using cache fallback');
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        if (event.request.mode === 'navigate') {
          return new Response('Offline - Please refresh', { 
            status: 200, 
            headers: { 'Content-Type': 'text/plain' } 
          });
        }
        
        throw error;
      }
    })()
  );
});

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  console.log('SW: Received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('SW: Skipping waiting...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('SW: Clearing all caches...');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        console.log('SW: Found caches to delete:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('SW: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('SW: All caches cleared successfully');
      })
    );
  }
  
  if (event.data && event.data.type === 'FORCE_MOBILE_REFRESH') {
    console.log('SW: Force mobile refresh requested');
    // Clear mobile-specific caches immediately
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});