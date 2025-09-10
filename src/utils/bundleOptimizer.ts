// Bundle optimization utilities

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload critical CSS (if using separate CSS files)
  const criticalCSS = [
    '/assets/index.css'
  ];
  
  criticalCSS.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
};

/**
 * Lazy load non-critical CSS
 */
export const loadNonCriticalCSS = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  document.head.appendChild(link);
};

/**
 * Preconnect to external domains
 */
export const setupPreconnects = () => {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Resource hints for better loading
 */
export const setupResourceHints = () => {
  // DNS prefetch for external resources
  const prefetchDomains = [
    '//www.google-analytics.com',
    '//www.googletagmanager.com'
  ];
  
  prefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

/**
 * Initialize all optimizations
 */
export const initializeBundleOptimizations = () => {
  if (typeof window !== 'undefined') {
    // Run on next tick to avoid blocking initial render
    setTimeout(() => {
      preloadCriticalResources();
      setupPreconnects();
      setupResourceHints();
    }, 0);
  }
};