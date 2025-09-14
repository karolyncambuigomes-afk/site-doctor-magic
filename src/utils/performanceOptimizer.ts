// Performance optimization utilities

interface DeviceInfo {
  isMobile: boolean;
  isSlowConnection: boolean;
  hasLowMemory: boolean;
  supportsWebP: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Detect device capabilities and network conditions
 */
export const detectDeviceCapabilities = (): DeviceInfo => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Network detection
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const isSlowConnection = connection ? 
    connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData :
    false;

  // Memory detection (Chrome only)
  const deviceMemory = (navigator as any).deviceMemory;
  const hasLowMemory = deviceMemory ? deviceMemory <= 2 : false;

  // WebP support detection
  const supportsWebP = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })();

  // Motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    isMobile,
    isSlowConnection,
    hasLowMemory,
    supportsWebP,
    prefersReducedMotion
  };
};

/**
 * Apply performance optimizations based on device capabilities
 */
export const applyPerformanceOptimizations = (deviceInfo: DeviceInfo) => {
  // Disable animations for low-performance devices
  if (deviceInfo.prefersReducedMotion || deviceInfo.hasLowMemory || deviceInfo.isSlowConnection) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
    document.documentElement.style.setProperty('--transition-duration', '0s');
  }

  // Reduce image quality for slow connections
  if (deviceInfo.isSlowConnection) {
    document.documentElement.setAttribute('data-connection', 'slow');
  }

  // Set WebP support flag
  if (deviceInfo.supportsWebP) {
    document.documentElement.setAttribute('data-webp', 'true');
  }

  // Mobile optimizations
  if (deviceInfo.isMobile) {
    document.documentElement.setAttribute('data-mobile', 'true');
    
    // Reduce scroll smoothness for better performance
    document.documentElement.style.scrollBehavior = 'auto';
  }
};

/**
 * Lazy load modules based on user interaction
 */
export const createIntersectionObserver = (callback: () => void, options = {}) => {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  }, {
    rootMargin: '100px',
    threshold: 0.1,
    ...options
  });
};

/**
 * Preload critical resources with priority hints
 */
export const preloadCriticalImages = (imageSources: string[]) => {
  imageSources.forEach((src, index) => {
    const link = document.createElement('link');
    link.rel = index < 3 ? 'preload' : 'prefetch'; // Preload first 3, prefetch rest
    link.as = 'image';
    link.href = src;
    if (index < 3) {
      link.setAttribute('fetchpriority', 'high');
    }
    document.head.appendChild(link);
  });
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log performance metrics (in production, send to analytics)
        const value = (entry as any).value || entry.duration || 0;
        console.log(`${entry.name}: ${value}ms`);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }

  // Monitor resource loading
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    
    if (loadTime > 3000) {
      console.warn('Slow page load detected:', loadTime + 'ms');
      // In production: send alert to monitoring system
    }
  });
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  const deviceInfo = detectDeviceCapabilities();
  applyPerformanceOptimizations(deviceInfo);
  initPerformanceMonitoring();
  
  return deviceInfo;
};