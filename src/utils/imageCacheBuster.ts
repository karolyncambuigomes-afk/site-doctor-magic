// Utility for aggressive image cache busting
export const addCacheBusting = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;
  
  // Only apply cache busting to Supabase storage URLs
  if (imageUrl.includes('supabase.co')) {
    const timestamp = Date.now();
    const randomSalt = Math.random().toString(36).substr(2, 9);
    const separator = imageUrl.includes('?') ? '&' : '?';
    
    const cachedBustedUrl = `${imageUrl}${separator}t=${timestamp}&cb=${randomSalt}`;
    console.log(`🔄 [CACHE-BUST] Original: ${imageUrl.substring(0, 100)}...`);
    console.log(`🔄 [CACHE-BUST] With cache busting: ${cachedBustedUrl.substring(0, 100)}...`);
    
    return cachedBustedUrl;
  }
  
  return imageUrl;
};

// Force refresh all images on the page
export const forceImageRefresh = () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && src.includes('supabase.co')) {
      const newSrc = addCacheBusting(src.split('?')[0]); // Remove existing params first
      img.src = newSrc;
      console.log(`🔄 [FORCE-REFRESH] Refreshed image: ${newSrc.substring(0, 100)}...`);
    }
  });
};

// Preload critical images with cache busting
export const preloadWithCacheBusting = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    if (url) {
      const img = new Image();
      img.src = addCacheBusting(url);
      console.log(`🔄 [PRELOAD] Preloading with cache busting: ${img.src.substring(0, 100)}...`);
    }
  });
};