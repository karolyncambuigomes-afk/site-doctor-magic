// Enhanced Service Worker with CDN and Cache Optimization
// Version: 2.0.0 - Production-ready with cache invalidation

const VERSION = '2.0.0';
const CACHE_NAME = `five-london-v${VERSION}`;
const STATIC_CACHE = `five-london-static-v${VERSION}`;
const RUNTIME_CACHE = `five-london-runtime-v${VERSION}`;
const CDN_CACHE = `five-london-cdn-v${VERSION}`;

// Cache configuration
const CACHE_CONFIG = {
  // Static assets (immutable, long-term cache)
  STATIC_MAX_AGE: 31536000, // 1 year
  // Runtime content (updates with deployments)
  RUNTIME_MAX_AGE: 86400, // 1 day
  // CDN assets
  CDN_MAX_AGE: 604800, // 1 week
  // Dynamic content (admin pages, API)
  DYNAMIC_MAX_AGE: 0 // No cache
};

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Add critical CSS and JS files
  '/assets/css/index.css',
  '/assets/js/main.js'
];

// CDN domains to cache
const CDN_DOMAINS = [
  'jiegopvbwpyfohhfvmwo.supabase.co',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// URLs to NEVER cache (always fresh)
const NEVER_CACHE_PATTERNS = [
  '/api/',
  '/supabase/',
  '/admin',
  '/auth',
  '/login',
  '/logout',
  '.map',
  'hot-update'
];

// Admin/dynamic patterns (must be fresh)
const DYNAMIC_PATTERNS = [
  '/admin',
  '/dashboard',
  '/api',
  '/auth',
  '/supabase'
];

// Cache monitoring
let cacheStats = {
  hits: 0,
  misses: 0,
  errors: 0,
  updates: 0,
  lastReset: Date.now()
};

/**
 * Check if request should bypass cache completely
 */
function shouldBypassCache(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Never cache admin/auth pages
  if (DYNAMIC_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
    return true;
  }
  
  // Never cache patterns
  if (NEVER_CACHE_PATTERNS.some(pattern => pathname.includes(pattern))) {
    return true;
  }
  
  // Never cache POST/PUT/DELETE requests
  if (request.method !== 'GET') {
    return true;
  }
  
  // Skip if explicitly requested
  if (url.searchParams.has('no-cache') || url.searchParams.has('bypass-sw')) {
    return true;
  }
  
  return false;
}

/**
 * Determine cache strategy based on request
 */
function getCacheStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const hostname = url.hostname;
  
  // CDN assets
  if (CDN_DOMAINS.some(domain => hostname.includes(domain))) {
    return { type: 'cdn', cache: CDN_CACHE, maxAge: CACHE_CONFIG.CDN_MAX_AGE };
  }
  
  // Static assets (versioned/hashed files)
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|ico)$/) 
      && pathname.includes('-')) {
    return { type: 'static', cache: STATIC_CACHE, maxAge: CACHE_CONFIG.STATIC_MAX_AGE };
  }
  
  // HTML and other dynamic content
  return { type: 'runtime', cache: RUNTIME_CACHE, maxAge: CACHE_CONFIG.RUNTIME_MAX_AGE };
}

/**
 * Enhanced cache with TTL and versioning
 */
async function cacheWithStrategy(request, response, strategy) {
  if (!response || response.status !== 200) return response;
  
  try {
    const cache = await caches.open(strategy.cache);
    const responseToCache = response.clone();
    
    // Add cache metadata
    const headers = new Headers(responseToCache.headers);
    headers.set('sw-cached', new Date().toISOString());
    headers.set('sw-cache-strategy', strategy.type);
    headers.set('sw-version', VERSION);
    
    const enhancedResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers: headers
    });
    
    await cache.put(request, enhancedResponse);
    cacheStats.updates++;
    
    console.log(`SW: Cached ${request.url} with strategy: ${strategy.type}`);
  } catch (error) {
    console.error('SW: Cache write failed:', error);
    cacheStats.errors++;
  }
  
  return response;
}

/**
 * Check if cached response is still valid
 */
function isCacheValid(cachedResponse, maxAge) {
  if (!cachedResponse) return false;
  
  const cachedDate = cachedResponse.headers.get('sw-cached');
  if (!cachedDate) return false;
  
  const age = (Date.now() - new Date(cachedDate).getTime()) / 1000;
  return age < maxAge;
}

/**
 * Install event - precache critical assets
 */
self.addEventListener('install', event => {
  console.log(`SW: Installing version ${VERSION}`);
  
  event.waitUntil(
    (async () => {
      try {
        // Clear old version caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(name => name.startsWith('five-london-') && !name.includes(VERSION))
            .map(name => {
              console.log(`SW: Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
        
        // Precache critical assets
        const staticCache = await caches.open(STATIC_CACHE);
        await staticCache.addAll(PRECACHE_ASSETS);
        
        console.log(`SW: Version ${VERSION} installed successfully`);
        
        // Skip waiting to activate immediately
        await self.skipWaiting();
      } catch (error) {
        console.error('SW: Install failed:', error);
      }
    })()
  );
});

/**
 * Activate event - claim clients and setup
 */
self.addEventListener('activate', event => {
  console.log(`SW: Activating version ${VERSION}`);
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(name => 
              name.startsWith('five-london-') && 
              !name.includes(VERSION)
            )
            .map(name => caches.delete(name))
        );
        
        // Claim all clients
        await self.clients.claim();
        
        // Reset cache stats
        cacheStats.lastReset = Date.now();
        
        console.log(`SW: Version ${VERSION} activated`);
        
        // Notify clients of activation
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: VERSION,
            timestamp: Date.now()
          });
        });
      } catch (error) {
        console.error('SW: Activation failed:', error);
      }
    })()
  );
});

/**
 * Fetch event - smart caching with CDN support
 */
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests and bypass patterns
  if (shouldBypassCache(request)) {
    console.log(`SW: Bypassing cache for: ${url.pathname}`);
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        const strategy = getCacheStrategy(request);
        const cache = await caches.open(strategy.cache);
        
        // Check cache first
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse && isCacheValid(cachedResponse, strategy.maxAge)) {
          cacheStats.hits++;
          console.log(`SW: Cache hit for: ${url.pathname} (${strategy.type})`);
          
          // Return cached response and update in background for runtime content
          if (strategy.type === 'runtime') {
            // Background fetch to keep cache fresh
            fetch(request)
              .then(response => cacheWithStrategy(request, response, strategy))
              .catch(error => console.log('SW: Background update failed:', error));
          }
          
          return cachedResponse;
        }
        
        // Cache miss - fetch from network
        cacheStats.misses++;
        console.log(`SW: Cache miss for: ${url.pathname} (${strategy.type})`);
        
        const networkResponse = await fetch(request);
        
        // Cache the response based on strategy
        return await cacheWithStrategy(request, networkResponse, strategy);
        
      } catch (error) {
        console.error('SW: Fetch failed:', error);
        cacheStats.errors++;
        
        // Try to return stale cache as fallback
        const cache = await caches.open(RUNTIME_CACHE);
        const staleResponse = await cache.match(request);
        
        if (staleResponse) {
          console.log(`SW: Returning stale cache for: ${url.pathname}`);
          return staleResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return new Response(`
            <!DOCTYPE html>
            <html>
              <head><title>Offline</title></head>
              <body>
                <h1>You're offline</h1>
                <p>Please check your connection and try again.</p>
                <button onclick="location.reload()">Retry</button>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        throw error;
      }
    })()
  );
});

/**
 * Message handling for cache management
 */
self.addEventListener('message', event => {
  const data = event.data;
  
  switch (data.type) {
    case 'SKIP_WAITING':
      console.log('SW: Skip waiting requested');
      self.skipWaiting();
      break;
      
    case 'CLEAR_ALL_CACHES':
      console.log('SW: Clearing all caches');
      event.waitUntil(
        caches.keys()
          .then(names => Promise.all(names.map(name => caches.delete(name))))
          .then(() => {
            cacheStats = { hits: 0, misses: 0, errors: 0, updates: 0, lastReset: Date.now() };
            console.log('SW: All caches cleared');
          })
      );
      break;
      
    case 'INVALIDATE_CACHE':
      console.log('SW: Invalidating cache for pattern:', data.pattern);
      event.waitUntil(
        (async () => {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            for (const request of requests) {
              if (request.url.includes(data.pattern)) {
                await cache.delete(request);
                console.log(`SW: Invalidated: ${request.url}`);
              }
            }
          }
        })()
      );
      break;
      
    case 'GET_CACHE_STATS':
      console.log('SW: Cache stats requested');
      event.ports[0].postMessage({
        type: 'CACHE_STATS',
        stats: {
          ...cacheStats,
          hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0,
          version: VERSION
        }
      });
      break;
      
    case 'FORCE_UPDATE':
      console.log('SW: Force update requested');
      event.waitUntil(
        (async () => {
          // Clear runtime cache to force fresh content
          await caches.delete(RUNTIME_CACHE);
          // Notify clients
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_CLEARED' });
          });
        })()
      );
      break;
  }
});

/**
 * Background sync for cache optimization
 */
self.addEventListener('sync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      (async () => {
        // Clean up old cache entries
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          // Remove entries older than max age
          for (const request of requests) {
            const response = await cache.match(request);
            const strategy = getCacheStrategy(request);
            
            if (!isCacheValid(response, strategy.maxAge)) {
              await cache.delete(request);
            }
          }
        }
        
        console.log('SW: Cache cleanup completed');
      })()
    );
  }
});

// Periodic cache stats reporting
setInterval(() => {
  if (cacheStats.hits + cacheStats.misses > 0) {
    console.log('SW: Cache Statistics:', {
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: `${((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1)}%`,
      errors: cacheStats.errors,
      updates: cacheStats.updates,
      version: VERSION
    });
  }
}, 60000); // Every minute
