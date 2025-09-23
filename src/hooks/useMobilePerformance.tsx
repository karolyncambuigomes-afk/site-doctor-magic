import { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
}

interface MobilePerformanceConfig {
  enableImageOptimization: boolean;
  enableCriticalCSS: boolean;
  enableResourceHints: boolean;
  enableServiceWorker: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
}

export const useMobilePerformance = () => {
  const isMobile = useIsMobile();
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isOptimized, setIsOptimized] = useState(false);

  const config: MobilePerformanceConfig = {
    enableImageOptimization: true,
    enableCriticalCSS: true,
    enableResourceHints: true,
    enableServiceWorker: true,
    compressionLevel: 'high'
  };

  // Performance monitoring
  const measurePerformance = useCallback(() => {
    if (!isMobile || typeof window === 'undefined') return;

    // Web Vitals measurement
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'layout-shift':
            setMetrics(prev => ({ 
              ...prev, 
              cls: (prev.cls || 0) + (entry as any).value 
            }));
            break;
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
            break;
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            setMetrics(prev => ({ 
              ...prev, 
              ttfb: navEntry.responseStart - navEntry.requestStart 
            }));
            break;
        }
      });
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input', 'navigation'] });

    return () => observer.disconnect();
  }, [isMobile]);

  // Optimize critical rendering path
  const optimizeCriticalPath = useCallback(() => {
    if (!config.enableCriticalCSS) return;

    // Inline critical CSS
    const criticalCSS = `
      /* Critical mobile styles for above-the-fold content */
      .hero-section { will-change: transform; contain: layout style paint; }
      .navigation { will-change: transform; }
      img[loading="lazy"] { content-visibility: auto; contain-intrinsic-size: 200px 150px; }
      .mobile-optimized * { -webkit-transform: translateZ(0); transform: translateZ(0); }
      @media (max-width: 768px) {
        .hero-content { font-size: clamp(1.5rem, 4vw, 3rem); }
        .container { padding: 0 1rem; }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = criticalCSS;
    styleElement.setAttribute('data-critical', 'true');
    document.head.insertBefore(styleElement, document.head.firstChild);
  }, [config.enableCriticalCSS]);

  // Optimize images for mobile
  const optimizeImages = useCallback(() => {
    if (!config.enableImageOptimization) return;

    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      // Prioritize above-the-fold images
      const isAboveFold = index < 3;
      
      if (isAboveFold) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      } else {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('fetchpriority', 'low');
      }

      // Add mobile-specific optimizations
      img.style.contentVisibility = 'auto';
      img.style.containIntrinsicSize = '300px 200px';

      // WebP support detection and fallback
      const supportsWebP = () => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      };

      if (supportsWebP() && img.src.includes('.jpg')) {
        const webpSrc = img.src.replace(/\.(jpg|jpeg)$/i, '.webp');
        img.src = webpSrc;
      }
    });
  }, [config.enableImageOptimization]);

  // Add resource hints
  const addResourceHints = useCallback(() => {
    if (!config.enableResourceHints) return;

    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      { rel: 'preload', href: '/images/hero-banner-vic-mobile-1080x1920.webp', as: 'image', type: 'image/webp' },
    ];

    hints.forEach(({ rel, href, crossorigin, as, type }) => {
      const existing = document.querySelector(`link[href="${href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossorigin) link.crossOrigin = crossorigin;
        if (as) link.as = as;
        if (type) link.type = type;
        document.head.appendChild(link);
      }
    });
  }, [config.enableResourceHints]);

  // Service Worker registration for caching
  const registerServiceWorker = useCallback(async () => {
    if (!config.enableServiceWorker || !('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
    } catch (error) {
      console.log('SW registration failed:', error);
    }
  }, [config.enableServiceWorker]);

  // Main optimization function
  const optimizeForMobile = useCallback(async () => {
    if (!isMobile || isOptimized) return;

    console.log('🚀 Applying mobile performance optimizations...');

    // Apply optimizations in order of priority
    optimizeCriticalPath();
    addResourceHints();
    
    // Defer heavy optimizations
    setTimeout(() => {
      optimizeImages();
      registerServiceWorker();
    }, 100);

    setIsOptimized(true);
  }, [isMobile, isOptimized, optimizeCriticalPath, addResourceHints, optimizeImages, registerServiceWorker]);

  useEffect(() => {
    if (!isMobile) return;

    const cleanup = measurePerformance();
    optimizeForMobile();

    return cleanup;
  }, [isMobile, measurePerformance, optimizeForMobile]);

  return {
    metrics,
    isOptimized,
    config,
    optimizeForMobile
  };
};