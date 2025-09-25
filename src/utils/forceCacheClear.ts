/**
 * Aggressive cache clearing utility - guaranteed to work
 */

export const forceClearAllCaches = async (): Promise<void> => {
  console.log('🚨 [FORCE-CACHE-CLEAR] Starting aggressive cache clearing');
  
  try {
    // 1. Clear ALL browser cache API caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('🔍 [FORCE-CACHE-CLEAR] Found caches:', cacheNames);
      
      // Delete each cache individually with confirmation
      for (const cacheName of cacheNames) {
        try {
          const deleted = await caches.delete(cacheName);
          console.log(`🗑️ [FORCE-CACHE-CLEAR] Cache '${cacheName}' deleted: ${deleted}`);
        } catch (error) {
          console.error(`❌ [FORCE-CACHE-CLEAR] Failed to delete cache '${cacheName}':`, error);
        }
      }
      
      // Also try to delete common cache patterns
      const patterns = [
        'five-london-runtime-v2.0.0',
        'five-london-static-v2.0.0',
        'five-london-cdn-v2.0.0',
        'runtime-cache',
        'static-cache',
        'api-cache'
      ];
      
      for (const pattern of patterns) {
        try {
          await caches.delete(pattern);
          console.log(`🗑️ [FORCE-CACHE-CLEAR] Attempted to delete: ${pattern}`);
        } catch (e) {
          // Ignore - cache might not exist
        }
      }
    }
    
    // 2. Clear localStorage and sessionStorage completely
    try {
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => localStorage.removeItem(key));
      sessionStorage.clear();
      console.log('🗑️ [FORCE-CACHE-CLEAR] Cleared all storage');
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    
    // 3. Force refresh ALL images with aggressive cache busting
    const images = document.querySelectorAll('img');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    
    images.forEach((img, index) => {
      if (img.src) {
        const url = new URL(img.src);
        url.searchParams.set('force_refresh', timestamp.toString());
        url.searchParams.set('bust', random);
        url.searchParams.set('idx', index.toString());
        img.src = url.toString();
        console.log(`🔄 [FORCE-CACHE-CLEAR] Force refreshed image: ${img.src.substring(0, 50)}...`);
      }
    });
    
    // 4. Force refresh CSS and JS files
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]') as NodeListOf<HTMLLinkElement>;
    stylesheets.forEach(link => {
      const href = link.href;
      const url = new URL(href);
      url.searchParams.set('v', timestamp.toString());
      link.href = url.toString();
    });
    
    // 5. Send multiple messages to service worker to ensure it clears
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const commands = [
        'FORCE_CACHE_CLEAR',
        'CLEAR_ALL_CACHES', 
        'CLEAR_ALL_CACHE',
        'PURGE_ALL'
      ];
      
      commands.forEach(command => {
        navigator.serviceWorker.controller?.postMessage({
          type: command,
          force: true,
          timestamp: Date.now()
        });
      });
      console.log('📤 [FORCE-CACHE-CLEAR] Sent multiple clear commands to service worker');
    }
    
    // 6. Try to update service worker registration
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      } catch (e) {
        console.warn('Could not update service worker:', e);
      }
    }
    
    console.log('✅ [FORCE-CACHE-CLEAR] Aggressive cache clearing completed');
    
  } catch (error) {
    console.error('❌ [FORCE-CACHE-CLEAR] Failed:', error);
    throw error;
  }
};

export const forceReloadWithCacheClear = (): void => {
  console.log('🔄 [FORCE-CACHE-CLEAR] Forcing hard reload');
  
  // Multiple approaches to ensure hard reload
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  
  // Force hard reload bypassing all caches
  window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'force_reload=' + Date.now();
};