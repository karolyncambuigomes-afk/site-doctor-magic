import { purgeImageCache, refreshServiceWorker } from './cacheManager';

/**
 * Process and configure local banner images
 */
export const processBannerComplete = async (): Promise<void> => {
  try {
    console.log('🎯 [BANNER-PROCESSOR] Starting complete banner processing');
    
    // Step 1: Purge existing banner cache
    await purgeImageCache(['hero-banner-*', 'banner-*']);
    
    // Step 2: Refresh service worker to pick up new files
    await refreshServiceWorker();
    
    // Step 3: Force reload any existing hero images
    const heroImages = document.querySelectorAll('img[src*="hero-banner"], source[srcset*="hero-banner"]') as NodeListOf<HTMLImageElement>;
    heroImages.forEach(img => {
      if (img.src) {
        const originalSrc = img.src;
        img.src = '';
        img.src = originalSrc + '?refresh=' + Date.now();
      }
    });
    
    console.log('✅ [BANNER-PROCESSOR] Banner processing completed successfully');
  } catch (error) {
    console.error('❌ [BANNER-PROCESSOR] Failed to process banner:', error);
    throw error;
  }
};