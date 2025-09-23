import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  addCriticalCSS, 
  preloadCriticalResources, 
  addResourceHints, 
  optimizeImages, 
  deferNonCriticalScripts,
  enableServiceWorker 
} from '@/utils/mobileOptimizations';

export const MobilePerformanceOptimizer: React.FC = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Ultra-aggressive critical CSS optimization
    const inlineCriticalCSS = () => {
      const criticalCSS = `
        /* Ultra-optimized mobile critical styles */
        html { font-display: swap; scroll-behavior: auto; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        * { will-change: auto; contain: layout style paint; }
        .hero-section, .navigation { will-change: transform; contain: layout style paint; }
        img, picture, video { content-visibility: auto; contain-intrinsic-size: 400px 300px; max-width: 100%; height: auto; }
        .container, .grid, .flex { contain: layout style paint; transform: translateZ(0); }
        button, a, input { touch-action: manipulation; min-height: 44px; min-width: 44px; }
        .mobile-touch { transform: translateZ(0); backface-visibility: hidden; }
        .text-content { text-rendering: optimizeSpeed; }
        .animation { animation-duration: 0.2s; transition-duration: 0.2s; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
      `;
      
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      style.setAttribute('data-critical-mobile', 'true');
      document.head.insertBefore(style, document.head.firstChild);
    };

    // Optimize images for mobile
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        // Add loading optimization
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Add content-visibility
        img.style.contentVisibility = 'auto';
        
        // Optimize for mobile viewport
        if (!img.style.maxWidth) {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
        }

        // Add intersection observer for better lazy loading
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                if (img.dataset.src && !img.src) {
                  img.src = img.dataset.src;
                }
                observer.unobserve(img);
              }
            });
          }, { rootMargin: '50px' });
          
          observer.observe(img);
        }
      });
    };

    // Defer non-critical resources
    const deferNonCriticalResources = () => {
      // Defer third-party scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach((script) => {
        const src = script.getAttribute('src');
        if (src && (src.includes('analytics') || src.includes('gtag') || src.includes('facebook'))) {
          script.setAttribute('defer', '');
        }
      });

      // Preload critical resources
      const preloadResources = [
        { href: '/images/hero-banner-vic-mobile-1080x1920.webp', as: 'image', type: 'image/webp' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
      ];

      preloadResources.forEach(({ href, as, type }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        document.head.appendChild(link);
      });
    };

    // Optimize rendering performance
    const optimizeRendering = () => {
      // Add performance hints to body
      document.body.classList.add('mobile-optimized');
      
      // Optimize scroll performance
      if (CSS.supports('scroll-behavior', 'smooth')) {
        document.documentElement.style.scrollBehavior = 'auto';
      }

      // Reduce layout thrashing
      const containers = document.querySelectorAll('.container, .grid, .flex');
      containers.forEach((container) => {
        (container as HTMLElement).style.contain = 'layout style paint';
      });

      // Optimize touch targets
      const buttons = document.querySelectorAll('button, a, input');
      buttons.forEach((btn) => {
        (btn as HTMLElement).classList.add('mobile-touch');
      });
    };

    // Memory optimization
    const optimizeMemory = () => {
      // Clear unused caches
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            if (cacheName.includes('old') || cacheName.includes('unused')) {
              caches.delete(cacheName);
            }
          });
        });
      }

      // Optimize garbage collection
      if (typeof window.gc === 'function') {
        setTimeout(() => window.gc(), 1000);
      }
    };

    // Network optimization
    const optimizeNetwork = () => {
      // Add connection hints
      const connectionHints = [
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ];

      connectionHints.forEach(({ rel, href, crossorigin }) => {
        const existing = document.querySelector(`link[href="${href}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = rel;
          link.href = href;
          if (crossorigin) link.crossOrigin = crossorigin;
          document.head.appendChild(link);
        }
      });
    };

    // Ultra-aggressive optimization bundle
    const applyUltraOptimizations = () => {
      inlineCriticalCSS();
      addCriticalCSS();
      addResourceHints();
      preloadCriticalResources();
      deferNonCriticalScripts();
      optimizeRendering();
      optimizeNetwork();
      
      // Immediate optimizations for critical path
      requestAnimationFrame(() => {
        optimizeImages();
        optimizeMemory();
      });
      
      // Service worker after initial render
      setTimeout(() => {
        enableServiceWorker();
      }, 50);
    };

    // Apply ultra-optimizations immediately
    applyUltraOptimizations();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyUltraOptimizations);
    }

    // Re-optimize on route changes with minimal delay
    const handleRouteChange = () => {
      requestAnimationFrame(applyUltraOptimizations);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('DOMContentLoaded', applyUltraOptimizations);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isMobile]);

  return null;
};