import { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface UltraPerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
  performanceScore: number;
}

export const useUltraMobileOptimizer = () => {
  const isMobile = useIsMobile();
  const [metrics, setMetrics] = useState<Partial<UltraPerformanceMetrics>>({});
  const [isOptimized, setIsOptimized] = useState(false);

  // Advanced performance measurement
  const measureUltraPerformance = useCallback(() => {
    if (!isMobile || typeof window === 'undefined') return;

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
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ 
                ...prev, 
                cls: (prev.cls || 0) + (entry as any).value 
              }));
            }
            break;
          case 'first-input':
            setMetrics(prev => ({ 
              ...prev, 
              fid: (entry as any).processingStart - entry.startTime 
            }));
            break;
        }
      });
    });

    try {
      observer.observe({ 
        entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] 
      });
    } catch (e) {
      console.warn('Performance Observer not fully supported');
    }

    return () => observer.disconnect();
  }, [isMobile]);

  // Ultra-aggressive resource optimization
  const optimizeResources = useCallback(() => {
    if (!isMobile) return;

    // 1. Critical path optimization
    const optimizeCriticalPath = () => {
      // Remove render-blocking resources
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
      stylesheets.forEach(link => {
        link.setAttribute('media', 'print');
        link.setAttribute('onload', "this.media='all'");
      });

      // Preload critical resources with highest priority
      const criticalResources = [
        { href: '/images/hero-banner-vic-mobile-1080x1920.webp', as: 'image', type: 'image/webp' },
        { href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
      ];

      criticalResources.forEach(({ href, as, type, crossorigin }) => {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = href;
          link.as = as;
          if (type) link.type = type;
          if (crossorigin) link.crossOrigin = crossorigin;
          link.fetchPriority = 'high';
          document.head.appendChild(link);
        }
      });
    };

    // 2. Image optimization with WebP and AVIF support
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        // Priority for above-the-fold images
        if (index < 2) {
          img.setAttribute('loading', 'eager');
          img.setAttribute('fetchpriority', 'high');
          img.setAttribute('decoding', 'sync');
        } else {
          img.setAttribute('loading', 'lazy');
          img.setAttribute('fetchpriority', 'low');
          img.setAttribute('decoding', 'async');
        }

        // Advanced containment
        img.style.contentVisibility = 'auto';
        img.style.contain = 'layout style paint';
        
        // Optimize for mobile viewport
        if (!img.style.maxWidth) {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
        }
      });
    };

    // 3. Script optimization
    const optimizeScripts = () => {
      const scripts = document.querySelectorAll('script[src]:not([data-critical])');
      scripts.forEach(script => {
        // Defer non-critical scripts
        if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
          script.setAttribute('defer', '');
        }
      });
    };

    // Execute optimizations
    optimizeCriticalPath();
    
    requestAnimationFrame(() => {
      optimizeImages();
      optimizeScripts();
    });

  }, [isMobile]);

  // Calculate performance score
  const calculatePerformanceScore = useCallback(() => {
    const { fcp = 0, lcp = 0, cls = 0, fid = 0 } = metrics;
    
    // Performance scoring based on Core Web Vitals
    let score = 100;
    
    // FCP scoring (target: < 1.8s)
    if (fcp > 3000) score -= 25;
    else if (fcp > 1800) score -= 15;
    else if (fcp > 1000) score -= 5;
    
    // LCP scoring (target: < 2.5s)
    if (lcp > 4000) score -= 30;
    else if (lcp > 2500) score -= 20;
    else if (lcp > 1500) score -= 10;
    
    // CLS scoring (target: < 0.1)
    if (cls > 0.25) score -= 20;
    else if (cls > 0.1) score -= 10;
    else if (cls > 0.05) score -= 5;
    
    // FID scoring (target: < 100ms)
    if (fid > 300) score -= 15;
    else if (fid > 100) score -= 8;
    else if (fid > 50) score -= 3;
    
    setMetrics(prev => ({ ...prev, performanceScore: Math.max(0, score) }));
  }, [metrics]);

  // Main optimization function
  const applyUltraOptimizations = useCallback(() => {
    if (!isMobile || isOptimized) return;

    console.log('🚀 Applying ultra mobile optimizations for 95+ score...');
    
    optimizeResources();
    setIsOptimized(true);
  }, [isMobile, isOptimized, optimizeResources]);

  useEffect(() => {
    if (!isMobile) return;

    const cleanup = measureUltraPerformance();
    applyUltraOptimizations();

    return cleanup;
  }, [isMobile, measureUltraPerformance, applyUltraOptimizations]);

  useEffect(() => {
    calculatePerformanceScore();
  }, [calculatePerformanceScore]);

  return {
    metrics,
    isOptimized,
    applyUltraOptimizations,
    performanceScore: metrics.performanceScore || 0
  };
};