import { useEffect, useState, useCallback } from 'react';

interface CacheStats {
  hits: number;
  misses: number;
  errors: number;
  updates: number;
  hitRate: number;
  version: string;
  lastReset: number;
}

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isActive: boolean;
  version: string | null;
  updateAvailable: boolean;
}

export const useServiceWorkerManager = () => {
  const [swState, setSwState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isActive: false,
    version: null,
    updateAvailable: false
  });
  
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  /**
   * Register service worker with enhanced error handling
   */
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });

      setRegistration(reg);
      setSwState(prev => ({ ...prev, isRegistered: true }));

      console.log('SW: Registered successfully', reg);

      // Check for updates every 30 seconds
      const updateInterval = setInterval(() => {
        reg.update().catch(console.error);
      }, 30000);

      // Handle service worker updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        console.log('SW: Update found');
        setSwState(prev => ({ ...prev, updateAvailable: true }));

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('SW: New version available');
            // Don't auto-update, let user decide
          }
        });
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', handleSWMessage);

      // Check initial state
      if (navigator.serviceWorker.controller) {
        setSwState(prev => ({ ...prev, isActive: true }));
        requestCacheStats();
      }

      // Cleanup on unmount
      return () => {
        clearInterval(updateInterval);
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      };

    } catch (error) {
      console.error('SW: Registration failed:', error);
      setSwState(prev => ({ ...prev, isRegistered: false }));
    }
  }, []);

  /**
   * Handle messages from service worker
   */
  const handleSWMessage = useCallback((event: MessageEvent) => {
    const { type, version, stats } = event.data;

    switch (type) {
      case 'SW_ACTIVATED':
        console.log(`SW: Activated version ${version}`);
        setSwState(prev => ({ 
          ...prev, 
          isActive: true, 
          version,
          updateAvailable: false 
        }));
        break;

      case 'CACHE_STATS':
        setCacheStats(stats);
        break;

      case 'CACHE_CLEARED':
        console.log('SW: Cache cleared by service worker');
        requestCacheStats();
        break;

      default:
        console.log('SW: Unknown message:', event.data);
    }
  }, []);

  /**
   * Request cache statistics from service worker
   */
  const requestCacheStats = useCallback(() => {
    if (!navigator.serviceWorker.controller) return;

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = handleSWMessage;

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_STATS' },
      [messageChannel.port2]
    );
  }, [handleSWMessage]);

  /**
   * Clear all caches
   */
  const clearAllCaches = useCallback(() => {
    if (!navigator.serviceWorker.controller) return;

    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_ALL_CACHES'
    });

    console.log('SW: Clear all caches requested');
  }, []);

  /**
   * Invalidate cache for specific pattern
   */
  const invalidateCache = useCallback((pattern: string) => {
    if (!navigator.serviceWorker.controller) return;

    navigator.serviceWorker.controller.postMessage({
      type: 'INVALIDATE_CACHE',
      pattern
    });

    console.log(`SW: Cache invalidation requested for: ${pattern}`);
  }, []);

  /**
   * Force service worker update
   */
  const forceUpdate = useCallback(async () => {
    if (!registration) return;

    try {
      // Skip waiting for new service worker
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Update registration
      await registration.update();

      // Force refresh after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('SW: Force update failed:', error);
    }
  }, [registration]);

  /**
   * Trigger cache invalidation after deployment
   */
  const invalidateOnDeploy = useCallback((buildHash?: string) => {
    if (!navigator.serviceWorker.controller) return;

    // Clear runtime cache to ensure fresh content
    navigator.serviceWorker.controller.postMessage({
      type: 'FORCE_UPDATE'
    });

    // If build hash provided, invalidate specific version
    if (buildHash) {
      invalidateCache(buildHash);
    }

    console.log('SW: Deploy invalidation triggered');
  }, [invalidateCache]);

  /**
   * Check if admin pages are cached (they shouldn't be)
   */
  const auditAdminCaching = useCallback(async () => {
    if (!('caches' in window)) return { safe: true, reason: 'No cache API' };

    try {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const url = new URL(request.url);
          
          // Check for admin/auth paths in cache
          if (url.pathname.includes('/admin') || 
              url.pathname.includes('/auth') ||
              url.pathname.includes('/dashboard')) {
            return { 
              safe: false, 
              reason: `Admin page cached: ${url.pathname}`,
              cacheName,
              url: url.href
            };
          }
        }
      }
      
      return { safe: true, reason: 'No admin pages in cache' };
    } catch (error) {
      return { safe: false, reason: `Audit failed: ${error.message}` };
    }
  }, []);

  /**
   * Initialize service worker
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setSwState(prev => ({ 
      ...prev, 
      isSupported: 'serviceWorker' in navigator 
    }));

    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, [registerServiceWorker]);

  /**
   * Periodic cache stats refresh
   */
  useEffect(() => {
    if (!swState.isActive) return;

    const interval = setInterval(requestCacheStats, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [swState.isActive, requestCacheStats]);

  return {
    // State
    serviceWorker: swState,
    cacheStats,
    
    // Actions
    clearAllCaches,
    invalidateCache,
    forceUpdate,
    invalidateOnDeploy,
    requestCacheStats,
    auditAdminCaching,
    
    // Utils
    isOnline: navigator?.onLine ?? true,
    cacheHitRate: cacheStats ? cacheStats.hitRate : 0,
    isOptimal: cacheStats ? cacheStats.hitRate > 0.7 : false
  };
};