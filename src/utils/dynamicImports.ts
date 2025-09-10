// Tree shaking optimization - only import what's needed
export const optimizeImports = () => {
  // This file helps Vite identify dead code for tree shaking
  console.log('Import optimization enabled');
};

// Dynamic imports for heavy libraries
export const loadChartLibrary = () => import('recharts');
export const loadFabricLibrary = () => import('fabric');
export const loadCarouselLibrary = () => import('embla-carousel-react');

// Conditional feature loading
export const loadAnalytics = () => {
  if (process.env.NODE_ENV === 'production') {
    return import('@/components/Analytics');
  }
  return Promise.resolve({ default: () => null });
};

export const loadMobileFeatures = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    return Promise.all([
      import('@/components/MobileOptimizer'),
      import('@/components/MobileForceRefresh'),
      import('@/components/MobileDebugPanel'),
      import('@/components/MobileRefreshButton')
    ]);
  }
  return Promise.resolve([]);
};

// Progressive enhancement - load features based on browser capabilities
export const loadProgressiveFeatures = () => {
  const features = [];
  
  // Only load service worker if supported
  if ('serviceWorker' in navigator) {
    features.push(import('@/components/ServiceWorkerManager'));
  }
  
  // Only load intersection observer features if supported
  if ('IntersectionObserver' in window) {
    features.push(import('@/components/OptimizedImage'));
  }
  
  return Promise.all(features);
};