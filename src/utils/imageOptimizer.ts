// Image optimization utilities

interface OptimizedImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  sizes?: string;
  priority?: boolean;
}

/**
 * Generate responsive image sources with WebP fallback
 */
export const generateImageSources = (config: OptimizedImageConfig) => {
  const { src, quality = 80, format = 'webp' } = config;
  
  // For static imports, we'll use the original source
  // In production, this would integrate with a CDN or image optimization service
  const baseUrl = src.replace(/\.[^/.]+$/, ''); // Remove extension
  const extension = src.match(/\.([^/.]+)$/)?.[1] || 'jpg';
  
  const sources = [
    {
      srcSet: `${baseUrl}.webp`,
      type: 'image/webp'
    },
    {
      srcSet: src,
      type: `image/${extension}`
    }
  ];
  
  return sources;
};

/**
 * Generate responsive sizes attribute
 */
export const generateSizes = (breakpoints: { [key: string]: string }) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(${breakpoint}) ${size}`)
    .join(', ');
};

/**
 * Default responsive breakpoints
 */
export const defaultSizes = generateSizes({
  'max-width: 640px': '100vw',
  'max-width: 1024px': '50vw',
  'max-width: 1280px': '33vw'
});

/**
 * Hero image sizes
 */
export const heroSizes = generateSizes({
  'max-width: 640px': '100vw',
  'max-width: 1024px': '100vw',
  'max-width: 1920px': '100vw'
});

/**
 * Check if WebP is supported
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = (images: string[]) => {
  if (typeof window === 'undefined') return;
  
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.type = src.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    document.head.appendChild(link);
  });
};

/**
 * Lazy load images with intersection observer
 */
export const createImageObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
};