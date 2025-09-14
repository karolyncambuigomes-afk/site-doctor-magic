// Advanced image optimization utilities with WebP support and responsive srcsets

export interface ImageOptimizationConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
}

export interface ResponsiveImageSource {
  srcSet: string;
  type: string;
  sizes?: string;
}

/**
 * Generate WebP and fallback sources for responsive images
 */
export const generateResponsiveImageSources = (config: ImageOptimizationConfig): ResponsiveImageSource[] => {
  const { src, quality = 80 } = config;
  
  // Check if it's a Supabase image that can be optimized
  if (src.includes('supabase.co/storage')) {
    return generateSupabaseResponsiveSources(src, quality);
  }
  
  // For other sources, generate basic WebP conversion
  return generateBasicResponsiveSources(src);
};

/**
 * Generate Supabase-optimized responsive sources
 */
const generateSupabaseResponsiveSources = (src: string, quality: number): ResponsiveImageSource[] => {
  const baseUrl = src.split('?')[0]; // Remove existing query params
  
  // Generate WebP sources with different sizes
  const webpSrcSet = [
    `${baseUrl}?width=400&height=600&format=webp&quality=${quality}&resize=cover 400w`,
    `${baseUrl}?width=800&height=1200&format=webp&quality=${quality}&resize=cover 800w`,
    `${baseUrl}?width=1200&height=1800&format=webp&quality=${quality}&resize=cover 1200w`,
    `${baseUrl}?width=1600&height=2400&format=webp&quality=${quality}&resize=cover 1600w`
  ].join(', ');
  
  // Generate JPEG fallback sources
  const jpegSrcSet = [
    `${baseUrl}?width=400&height=600&format=jpeg&quality=${quality}&resize=cover 400w`,
    `${baseUrl}?width=800&height=1200&format=jpeg&quality=${quality}&resize=cover 800w`,
    `${baseUrl}?width=1200&height=1800&format=jpeg&quality=${quality}&resize=cover 1200w`,
    `${baseUrl}?width=1600&height=2400&format=jpeg&quality=${quality}&resize=cover 1600w`
  ].join(', ');
  
  return [
    {
      srcSet: webpSrcSet,
      type: 'image/webp'
    },
    {
      srcSet: jpegSrcSet,
      type: 'image/jpeg'
    }
  ];
};

/**
 * Generate basic responsive sources for non-Supabase images
 */
const generateBasicResponsiveSources = (src: string): ResponsiveImageSource[] => {
  // For static assets, we'll assume WebP versions exist
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return [
    {
      srcSet: webpSrc,
      type: 'image/webp'
    },
    {
      srcSet: src,
      type: 'image/jpeg'
    }
  ];
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizesAttribute = (breakpoints?: { [key: string]: string }): string => {
  const defaultBreakpoints = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    '(max-width: 1280px)': '33vw'
  };
  
  const sizes = breakpoints || defaultBreakpoints;
  
  return Object.entries(sizes)
    .map(([breakpoint, size]) => `${breakpoint} ${size}`)
    .join(', ');
};

/**
 * Hero image specific sizes
 */
export const heroImageSizes = generateSizesAttribute({
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '100vw',
  '(max-width: 1920px)': '100vw'
});

/**
 * Gallery image specific sizes  
 */
export const galleryImageSizes = generateSizesAttribute({
  '(max-width: 640px)': '50vw',
  '(max-width: 1024px)': '33vw',
  '(max-width: 1280px)': '25vw'
});

/**
 * Check if browser supports WebP
 */
export const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Preload critical images with proper format detection
 */
export const preloadCriticalImages = async (images: string[]) => {
  if (typeof window === 'undefined') return;
  
  const supportsWebP = await checkWebPSupport();
  
  images.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    
    // Choose optimal format
    if (supportsWebP && src.includes('supabase.co/storage')) {
      link.href = `${src}?format=webp&quality=80`;
      link.type = 'image/webp';
    } else {
      link.href = src;
      link.type = src.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    }
    
    document.head.appendChild(link);
  });
};

/**
 * Intersection Observer for lazy loading with performance optimizations
 */
export const createOptimizedImageObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Calculate optimal image dimensions based on container and DPR
 */
export const calculateOptimalDimensions = (
  containerWidth: number,
  containerHeight: number,
  devicePixelRatio = window.devicePixelRatio || 1
) => {
  const optimalWidth = Math.ceil(containerWidth * devicePixelRatio);
  const optimalHeight = Math.ceil(containerHeight * devicePixelRatio);
  
  // Cap at reasonable limits to prevent huge images
  const maxWidth = 2400;
  const maxHeight = 3600;
  
  return {
    width: Math.min(optimalWidth, maxWidth),
    height: Math.min(optimalHeight, maxHeight)
  };
};

/**
 * Generate blur placeholder data URL
 */
export const generateBlurPlaceholder = (
  width: number = 40,
  height: number = 60,
  color: string = '#f3f4f6'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};