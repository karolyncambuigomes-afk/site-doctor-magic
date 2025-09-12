import { useEffect, useState, useCallback } from 'react';
import { preloadCriticalImages, checkWebPSupport } from '@/utils/performance/imageOptimizer';
import { registerServiceWorker, collectPerformanceMetrics } from '@/utils/performance/assetOptimizer';

interface PerformanceOptimizationConfig {
  enableServiceWorker?: boolean;
  enableImagePreloading?: boolean;
  enablePerformanceTracking?: boolean;
  criticalImages?: string[];
}

interface PerformanceState {
  webpSupported: boolean;
  criticalImagesLoaded: boolean;
  performanceMetrics: any;
  isOptimized: boolean;
}

export const usePerformanceOptimization = (config: PerformanceOptimizationConfig = {}) => {
  const {
    enableServiceWorker = true,
    enableImagePreloading = true,
    enablePerformanceTracking = process.env.NODE_ENV === 'development',
    criticalImages = []
  } = config;

  const [state, setState] = useState<PerformanceState>({
    webpSupported: false,
    criticalImagesLoaded: false,
    performanceMetrics: null,
    isOptimized: false
  });

  // Check WebP support
  useEffect(() => {
    checkWebPSupport().then(supported => {
      setState(prev => ({ ...prev, webpSupported: supported }));
    });
  }, []);

  // Register service worker
  useEffect(() => {
    if (enableServiceWorker && typeof window !== 'undefined') {
      registerServiceWorker();
    }
  }, [enableServiceWorker]);

  // Preload critical images
  useEffect(() => {
    if (enableImagePreloading && criticalImages.length > 0) {
      preloadCriticalImages(criticalImages).then(() => {
        setState(prev => ({ ...prev, criticalImagesLoaded: true }));
      });
    }
  }, [enableImagePreloading, criticalImages]);

  // Collect performance metrics
  useEffect(() => {
    if (enablePerformanceTracking) {
      const handleLoad = () => {
        setTimeout(() => {
          const metrics = collectPerformanceMetrics();
          setState(prev => ({ 
            ...prev, 
            performanceMetrics: metrics,
            isOptimized: true
          }));
        }, 1000); // Wait for LCP to stabilize
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, [enablePerformanceTracking]);

  // Optimize images based on WebP support
  const getOptimizedImageUrl = useCallback((src: string, quality = 80) => {
    if (!src) return src;
    
    if (state.webpSupported && src.includes('supabase.co/storage')) {
      const url = new URL(src);
      url.searchParams.set('format', 'webp');
      url.searchParams.set('quality', quality.toString());
      return url.toString();
    }
    
    return src;
  }, [state.webpSupported]);

  // Get responsive image sources
  const getResponsiveImageSources = useCallback((src: string) => {
    if (!src) return { webp: '', fallback: '' };
    
    if (src.includes('supabase.co/storage')) {
      const baseUrl = src.split('?')[0];
      
      const webpSources = [
        `${baseUrl}?width=400&format=webp&quality=80 400w`,
        `${baseUrl}?width=800&format=webp&quality=80 800w`,
        `${baseUrl}?width=1200&format=webp&quality=80 1200w`,
        `${baseUrl}?width=1600&format=webp&quality=80 1600w`
      ].join(', ');
      
      const fallbackSources = [
        `${baseUrl}?width=400&format=jpeg&quality=80 400w`,
        `${baseUrl}?width=800&format=jpeg&quality=80 800w`,
        `${baseUrl}?width=1200&format=jpeg&quality=80 1200w`,
        `${baseUrl}?width=1600&format=jpeg&quality=80 1600w`
      ].join(', ');
      
      return {
        webp: webpSources,
        fallback: fallbackSources
      };
    }
    
    return {
      webp: src.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
      fallback: src
    };
  }, []);

  // Lazy load images with intersection observer
  const createImageObserver = useCallback((callback: (entries: IntersectionObserverEntry[]) => void) => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return null;
    }
    
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  }, []);

  // Preload next page resources
  const preloadNextPageResources = useCallback((resources: string[]) => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }, []);

  // Resource cleanup
  const cleanupPreloadedResources = useCallback(() => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"]');
    preloadLinks.forEach(link => {
      if (!document.querySelector(`[src="${link.getAttribute('href')}"]`)) {
        link.remove();
      }
    });
  }, []);

  return {
    ...state,
    getOptimizedImageUrl,
    getResponsiveImageSources,
    createImageObserver,
    preloadNextPageResources,
    cleanupPreloadedResources,
    
    // Performance utilities
    isWebPSupported: state.webpSupported,
    isCriticalContentLoaded: state.criticalImagesLoaded,
    performanceScore: state.performanceMetrics ? calculatePerformanceScore(state.performanceMetrics) : 0
  };
};

// Calculate a simple performance score (0-100)
const calculatePerformanceScore = (metrics: any): number => {
  if (!metrics) return 0;
  
  let score = 100;
  
  // Penalize slow FCP
  if (metrics.fcp > 3000) score -= 30;
  else if (metrics.fcp > 1800) score -= 15;
  
  // Penalize slow LCP
  if (metrics.lcp > 4000) score -= 30;
  else if (metrics.lcp > 2500) score -= 15;
  
  // Penalize slow total load time
  if (metrics.totalTime > 5000) score -= 20;
  else if (metrics.totalTime > 3000) score -= 10;
  
  // Memory usage penalty
  if (metrics.memoryUsage) {
    const memoryRatio = metrics.memoryUsage.used / metrics.memoryUsage.limit;
    if (memoryRatio > 0.8) score -= 10;
    else if (memoryRatio > 0.6) score -= 5;
  }
  
  return Math.max(0, Math.min(100, score));
};