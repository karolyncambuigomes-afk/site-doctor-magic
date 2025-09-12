// Asset optimization utilities for CSS, JS, and static assets

export interface AssetOptimizationConfig {
  enableCompression: boolean;
  enableMinification: boolean;
  cacheHeaders: CacheConfig;
  cdnUrl?: string;
}

export interface CacheConfig {
  staticAssets: number; // Cache duration in seconds
  images: number;
  css: number;
  js: number;
  html: number;
}

/**
 * Default cache configuration for optimal performance
 */
export const defaultCacheConfig: CacheConfig = {
  staticAssets: 31536000, // 1 year
  images: 31536000, // 1 year
  css: 31536000, // 1 year
  js: 31536000, // 1 year
  html: 3600 // 1 hour
};

/**
 * Generate cache headers for different asset types
 */
export const generateCacheHeaders = (assetType: keyof CacheConfig, config = defaultCacheConfig) => {
  const maxAge = config[assetType];
  
  return {
    'Cache-Control': `public, max-age=${maxAge}, immutable`,
    'Expires': new Date(Date.now() + maxAge * 1000).toUTCString(),
    'ETag': `"${Date.now()}-${Math.random().toString(36).substr(2, 9)}"`,
    'Vary': 'Accept-Encoding'
  };
};

/**
 * Optimize CSS by removing unused styles and minifying
 */
export const optimizeCSS = (css: string): string => {
  // Remove comments
  let optimized = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove unnecessary whitespace
  optimized = optimized.replace(/\s+/g, ' ');
  
  // Remove spaces around certain characters
  optimized = optimized.replace(/\s*([{}:;,>+~])\s*/g, '$1');
  
  // Remove trailing semicolons
  optimized = optimized.replace(/;}/g, '}');
  
  // Remove empty rules
  optimized = optimized.replace(/[^{}]+\{\s*\}/g, '');
  
  return optimized.trim();
};

/**
 * Critical CSS extraction for above-the-fold content
 */
export const extractCriticalCSS = (html: string, css: string): string => {
  // This is a simplified version - in production, use tools like Critical or Critters
  const criticalSelectors = [
    'body', 'html', 'main', 'header', 'nav', 'footer',
    '.hero', '.nav', '.container', '.btn', '.button',
    'h1', 'h2', 'h3', 'p', 'a',
    // Add more selectors based on your design system
    '.luxury-heading', '.luxury-body', '.bg-primary', '.text-primary'
  ];
  
  const criticalRules: string[] = [];
  
  criticalSelectors.forEach(selector => {
    const regex = new RegExp(`${selector}[^{]*\\{[^}]*\\}`, 'g');
    const matches = css.match(regex);
    if (matches) {
      criticalRules.push(...matches);
    }
  });
  
  return criticalRules.join('\n');
};

/**
 * Compress and optimize JavaScript
 */
export const optimizeJS = (js: string): string => {
  // Remove comments (simple regex - use proper parser in production)
  let optimized = js.replace(/\/\*[\s\S]*?\*\//g, '');
  optimized = optimized.replace(/\/\/.*$/gm, '');
  
  // Remove unnecessary whitespace
  optimized = optimized.replace(/\s+/g, ' ');
  
  // Remove spaces around operators and punctuation
  optimized = optimized.replace(/\s*([{}();,=+\-*/%<>!&|])\s*/g, '$1');
  
  return optimized.trim();
};

/**
 * Generate resource hints for preloading critical assets
 */
export const generateResourceHints = (criticalAssets: {
  fonts?: string[];
  css?: string[];
  js?: string[];
  images?: string[];
}): string => {
  const hints: string[] = [];
  
  // DNS prefetch for external domains
  const externalDomains = new Set<string>();
  [...(criticalAssets.fonts || []), ...(criticalAssets.images || [])].forEach(url => {
    try {
      const domain = new URL(url).hostname;
      if (domain !== window.location.hostname) {
        externalDomains.add(domain);
      }
    } catch {
      // Invalid URL, skip
    }
  });
  
  externalDomains.forEach(domain => {
    hints.push(`<link rel="dns-prefetch" href="//${domain}">`);
  });
  
  // Preload critical fonts
  criticalAssets.fonts?.forEach(font => {
    hints.push(`<link rel="preload" href="${font}" as="font" type="font/woff2" crossorigin>`);
  });
  
  // Preload critical CSS
  criticalAssets.css?.forEach(css => {
    hints.push(`<link rel="preload" href="${css}" as="style">`);
  });
  
  // Preload critical JS
  criticalAssets.js?.forEach(js => {
    hints.push(`<link rel="preload" href="${js}" as="script">`);
  });
  
  // Preload critical images
  criticalAssets.images?.forEach(image => {
    hints.push(`<link rel="preload" href="${image}" as="image">`);
  });
  
  return hints.join('\n');
};

/**
 * Service Worker registration for asset caching
 */
export const registerServiceWorker = (swPath = '/sw.js') => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};

/**
 * Asset versioning for cache busting
 */
export const addVersionToAsset = (assetPath: string, version: string = Date.now().toString()): string => {
  const url = new URL(assetPath, window.location.origin);
  url.searchParams.set('v', version);
  return url.pathname + url.search;
};

/**
 * Lazy load non-critical CSS
 */
export const loadCSSAsync = (href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    document.head.appendChild(link);
  });
};

/**
 * Lazy load non-critical JavaScript
 */
export const loadJSAsync = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load JS: ${src}`));
    document.head.appendChild(script);
  });
};

/**
 * Bundle size analyzer
 */
export const analyzeBundleSize = (bundleStats: any) => {
  const analysis = {
    totalSize: 0,
    chunkSizes: {} as Record<string, number>,
    recommendations: [] as string[]
  };
  
  if (bundleStats.chunks) {
    bundleStats.chunks.forEach((chunk: any) => {
      const size = chunk.size || 0;
      analysis.totalSize += size;
      analysis.chunkSizes[chunk.id || 'unknown'] = size;
      
      // Add recommendations for large chunks
      if (size > 250000) { // 250KB
        analysis.recommendations.push(`Chunk "${chunk.id}" is large (${(size / 1024).toFixed(1)}KB). Consider code splitting.`);
      }
    });
  }
  
  return analysis;
};

/**
 * Performance metrics collection
 */
export const collectPerformanceMetrics = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  return {
    // Core Web Vitals approximations
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    lcp: 0, // Would need proper LCP measurement
    cls: 0, // Would need proper CLS measurement
    fid: 0, // Would need proper FID measurement
    
    // Navigation timing
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    totalTime: navigation.loadEventEnd - navigation.fetchStart,
    
    // Resource timing
    dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
    connectTime: navigation.connectEnd - navigation.connectStart,
    requestTime: navigation.responseStart - navigation.requestStart,
    responseTime: navigation.responseEnd - navigation.responseStart,
    
    // Memory usage (if available)
    memoryUsage: (performance as any).memory ? {
      used: (performance as any).memory.usedJSHeapSize,
      total: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit
    } : null
  };
};