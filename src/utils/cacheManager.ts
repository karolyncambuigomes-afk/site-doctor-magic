// Cache management utilities for image optimization

interface CacheManagerOptions {
  patterns?: string[];
  force?: boolean;
}

/**
 * Purge image cache for specific patterns
 */
export const purgeImageCache = async (patterns: string[] = ['hero-banner-*']): Promise<void> => {
  try {
    console.log('🧹 [CACHE-PURGE] Starting cache purge for patterns:', patterns);
    
    // Clear browser cache for matching patterns
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const url = request.url;
          const shouldPurge = patterns.some(pattern => {
            const regex = new RegExp(pattern.replace('*', '.*'), 'i');
            return regex.test(url);
          });
          
          if (shouldPurge) {
            await cache.delete(request);
            console.log('🗑️ [CACHE-PURGE] Deleted from cache:', url);
          }
        }
      }
    }
    
    // Force reload of cached images in the DOM
    const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    images.forEach(img => {
      const shouldReload = patterns.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'), 'i');
        return regex.test(img.src);
      });
      
      if (shouldReload) {
        const originalSrc = img.src;
        img.src = '';
        img.src = originalSrc + '?cache-bust=' + Date.now();
        console.log('🔄 [CACHE-PURGE] Force reloaded image:', originalSrc);
      }
    });
    
    console.log('✅ [CACHE-PURGE] Cache purge completed successfully');
  } catch (error) {
    console.error('❌ [CACHE-PURGE] Failed to purge cache:', error);
    throw error;
  }
};

/**
 * Refresh service worker to pick up new resources
 */
export const refreshServiceWorker = async (): Promise<void> => {
  try {
    console.log('🔄 [SW-REFRESH] Starting service worker refresh');
    
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        // Update the service worker
        await registration.update();
        console.log('✅ [SW-REFRESH] Service worker updated');
        
        // If there's a waiting service worker, activate it
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          console.log('🚀 [SW-REFRESH] Activated waiting service worker');
        }
      }
    }
    
    console.log('✅ [SW-REFRESH] Service worker refresh completed');
  } catch (error) {
    console.error('❌ [SW-REFRESH] Failed to refresh service worker:', error);
    throw error;
  }
};

/**
 * Complete cache refresh after image updates
 */
export const performCompleteImageRefresh = async (options: CacheManagerOptions = {}): Promise<void> => {
  const { patterns = ['hero-banner-*', 'banner-*'], force = true } = options;
  
  try {
    console.log('🧹 [COMPLETE-REFRESH] Starting complete image refresh');
    
    // Step 1: Purge image cache
    await purgeImageCache(patterns);
    
    // Step 2: Refresh service worker
    await refreshServiceWorker();
    
    // Step 3: Force browser cache refresh if requested
    if (force) {
      // Clear browser's memory cache by reloading specific resources
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]') as NodeListOf<HTMLLinkElement>;
      stylesheets.forEach(link => {
        const href = link.href;
        link.href = '';
        link.href = href + '?refresh=' + Date.now();
      });
    }
    
    console.log('✅ [COMPLETE-REFRESH] Complete image refresh completed successfully');
  } catch (error) {
    console.error('❌ [COMPLETE-REFRESH] Failed to perform complete refresh:', error);
    throw error;
  }
};

/**
 * Preload optimized images
 */
export const preloadOptimizedImages = (imagePaths: string[]): void => {
  console.log('⚡ [PRELOAD] Preloading optimized images:', imagePaths);
  
  imagePaths.forEach(path => {
    // Preload WebP version
    const webpLink = document.createElement('link');
    webpLink.rel = 'preload';
    webpLink.as = 'image';
    webpLink.href = path.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    webpLink.type = 'image/webp';
    document.head.appendChild(webpLink);
    
    // Preload fallback version
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'preload';
    fallbackLink.as = 'image';
    fallbackLink.href = path;
    fallbackLink.type = path.includes('.webp') ? 'image/webp' : 'image/jpeg';
    document.head.appendChild(fallbackLink);
  });
  
  console.log('✅ [PRELOAD] Image preloading initiated');
};