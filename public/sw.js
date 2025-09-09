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

// Install event - cache assets only if not in private mode or mobile
self.addEventListener('install', event => {
  console.log('SW: Install event');
  
  // Check for mobile browsers and disable completely
  const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
  
  if (isMobileBrowser) {
    console.log('SW: Mobile browser detected, disabling service worker completely');
    return self.skipWaiting();
  }
  
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

// Fetch event - special handling for mobile auth endpoints
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
  
  // Skip service worker entirely for auth endpoints to prevent request body corruption
  if (url.pathname.includes('/auth/') || url.pathname.includes('/token') || url.pathname.includes('supabase.co/auth/')) {
    console.log('SW: Bypassing auth endpoint:', url.pathname);
    return;
  }
  
  if (isMobileBrowser) {
    // For mobile POST requests with body, clone properly to avoid corruption
    if (event.request.method === 'POST' && event.request.body) {
      event.respondWith(
        (async () => {
          try {
            // Clone the request properly to preserve body
            const clonedRequest = event.request.clone();
            const response = await fetch(clonedRequest);
            return response;
          } catch (error) {
            console.error('SW: Mobile POST request failed:', error);
            throw error;
          }
        })()
      );
      return;
    }
    
    // For other mobile requests, use cache-busting headers
    event.respondWith(
      fetch(new Request(event.request.url, {
        method: event.request.method,
        headers: new Headers({
          ...Object.fromEntries(event.request.headers.entries()),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }),
        mode: event.request.mode,
        credentials: event.request.credentials,
        body: event.request.body
      }))
    );
    return;
  }
  
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

  // Smart caching strategy with mobile optimization
  event.respondWith(
    (async () => {
      const userAgent = event.request.headers.get('user-agent') || '';
      const isMobileRequest = /iPhone|iPad|Android|Mobile|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const hasForceRefreshParam = url.searchParams.has('force-mobile') && url.searchParams.get('force-mobile') === 'true';
      const hasVersionParam = url.searchParams.has('v');
      
      console.log('SW: Request analysis:', {
        url: url.pathname,
        isMobile: isMobileRequest,
        hasForceRefresh: hasForceRefreshParam,
        hasVersion: hasVersionParam,
        userAgent: userAgent.substring(0, 30)
      });
      
      try {
        // Special handling for mobile with force refresh or versioned content
        if (isMobileRequest && (hasForceRefreshParam || hasVersionParam)) {
          console.log('SW: Mobile force refresh or versioned content');
          
          // For versioned content, try cache first
          if (hasVersionParam) {
            const cache = await caches.open(RUNTIME_CACHE);
            const cachedResponse = await cache.match(event.request);
            
            if (cachedResponse) {
              console.log('SW: Versioned content cache hit');
              return cachedResponse;
            }
          }

          // Fetch fresh with smart cache-busting
          const freshRequest = new Request(event.request.url, {
            method: event.request.method,
            headers: new Headers({
              ...Object.fromEntries(event.request.headers.entries()),
              'Cache-Control': 'no-cache'
            }),
            mode: event.request.mode,
            credentials: event.request.credentials
          });

          const response = await fetch(freshRequest);
          
          if (response && response.status === 200) {
            // Cache versioned content for future use
            if (hasVersionParam) {
              const cache = await caches.open(RUNTIME_CACHE);
              cache.put(event.request, response.clone());
              console.log('SW: Cached fresh versioned content');
            }
            return response;
          }
          
          throw new Error('Mobile fetch failed');
        }

        // Normal caching strategy for all other requests
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          console.log('SW: Cache hit');
          return cachedResponse;
        }

        const response = await fetch(event.request);
        
        if (response && response.status === 200) {
          console.log('SW: Caching new response');
          cache.put(event.request, response.clone());
        }
        
        return response;
        
      } catch (error) {
        console.error('SW: Fetch error:', error);
        
        // Try to return cached version as fallback
        const cache = await caches.open(RUNTIME_CACHE);
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          console.log('SW: Fallback to cache');
          return cachedResponse;
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