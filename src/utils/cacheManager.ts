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
  const { 
    patterns = [
      'hero-banner-*', 
      'model-*', 
      'carousel-*', 
      'blog-*',
      '/images/*'
    ], 
    force = true 
  } = options;
  
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
 * Bulk fix images using the sync-image-to-local Edge Function
 */
export const bulkFixImagesToLocal = async (
  imageUrls: string[], 
  category: string,
  onProgress?: (current: number, total: number) => void
): Promise<{ success: number; failed: number; errors: string[] }> => {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  console.log(`🚀 [BULK-FIX] Starting bulk fix for ${imageUrls.length} ${category} images`);
  
  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];
    
    try {
      onProgress?.(i + 1, imageUrls.length);
      
      // Use fetch to call the Edge Function directly
      const response = await fetch(`https://jiegopvbwpyfohhfvmwo.supabase.co/functions/v1/sync-image-to-local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          category: category.toLowerCase(),
          itemId: `bulk-${Date.now()}-${i}`,
          tableName: 'bulk_migration',
          fieldName: 'image_url',
          itemName: `${category.toLowerCase()}-${i}`,
          altText: `Optimized ${category} image`
        })
      });

      const result = await response.json();
      
      if (result.success) {
        results.success++;
        console.log(`✅ [BULK-FIX] [${i+1}/${imageUrls.length}] Fixed: ${imageUrl.substring(0, 50)}...`);
      } else {
        results.failed++;
        results.errors.push(`${imageUrl}: ${result.error || 'Unknown error'}`);
        console.error(`❌ [BULK-FIX] [${i+1}/${imageUrls.length}] Failed: ${imageUrl}`);
      }
      
      // Small delay to avoid overwhelming the system
      if (i < imageUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
    } catch (error) {
      results.failed++;
      results.errors.push(`${imageUrl}: ${error}`);
      console.error(`❌ [BULK-FIX] [${i+1}/${imageUrls.length}] Error: ${error}`);
    }
  }
  
  // Comprehensive cache purge after bulk operations
  await performCompleteImageRefresh({ 
    patterns: [`${category.toLowerCase()}-*`, '/images/*'], 
    force: true 
  });
  
  console.log(`✅ [BULK-FIX] Completed: ${results.success} success, ${results.failed} failed`);
  return results;
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

/**
 * Enhanced Cache Manager class for comprehensive cache control
 */
export class CacheManager {
  /**
   * Purge specific cache patterns
   */
  static async purge(patterns: string[]): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send message to service worker to purge cache
      navigator.serviceWorker.controller.postMessage({
        type: 'PURGE_CACHE',
        patterns
      });

      // Also force refresh service worker
      navigator.serviceWorker.controller.postMessage({
        type: 'SKIP_WAITING'
      });

      console.log('Cache purge requested for patterns:', patterns);
    }

    // Also use existing purge functionality
    await purgeImageCache(patterns);
  }

  /**
   * Force service worker to skip waiting and claim clients
   */
  static async forceUpdate(): Promise<void> {
    await refreshServiceWorker();
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLAIM_CLIENTS' });
    }
  }
}