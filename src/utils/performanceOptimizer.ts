// Performance optimization utilities

// Unified console output cleaner for production
export const cleanConsoleOutput = () => {
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.error = noop;
  console.info = noop;
  console.debug = noop;
  console.trace = noop;
  console.group = noop;
  console.groupEnd = noop;
  console.table = noop;
  console.time = noop;
  console.timeEnd = noop;
};

// Initialize immediately in production builds
if (import.meta.env.PROD) {
  cleanConsoleOutput();
}

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
};

// Image preloader
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Bundle analyzer helper
export const measurePerformance = (name: string, fn: () => void) => {
  if (import.meta.env.DEV) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }
};

// Cache utilities for banner data
const BANNER_CACHE_KEY = 'hero_banners_cache';
const BANNER_CACHE_TIMESTAMP_KEY = 'hero_banners_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getBannerCache = () => {
  try {
    const timestamp = sessionStorage.getItem(BANNER_CACHE_TIMESTAMP_KEY);
    if (!timestamp || Date.now() - parseInt(timestamp) > CACHE_DURATION) {
      return null;
    }
    const cached = sessionStorage.getItem(BANNER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

export const setBannerCache = (data: any) => {
  try {
    sessionStorage.setItem(BANNER_CACHE_KEY, JSON.stringify(data));
    sessionStorage.setItem(BANNER_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch {
    // Ignore cache errors
  }
};

export const clearBannerCache = () => {
  try {
    sessionStorage.removeItem(BANNER_CACHE_KEY);
    sessionStorage.removeItem(BANNER_CACHE_TIMESTAMP_KEY);
  } catch {
    // Ignore cache errors
  }
};