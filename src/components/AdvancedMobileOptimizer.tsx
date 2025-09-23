import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const AdvancedMobileOptimizer: React.FC = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Ultra-aggressive performance optimizations for 95+ score
    const applyAdvancedOptimizations = () => {
      // 1. Critical resource prioritization
      const prioritizeCriticalResources = () => {
        // Preload hero image with highest priority
        const heroPreload = document.createElement('link');
        heroPreload.rel = 'preload';
        heroPreload.href = '/images/hero-banner-vic-mobile-1080x1920.webp';
        heroPreload.as = 'image';
        heroPreload.type = 'image/webp';
        heroPreload.fetchPriority = 'high';
        document.head.insertBefore(heroPreload, document.head.firstChild);

        // Preload critical fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreload);
      };

      // 2. Advanced image optimization
      const optimizeAllImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
          // First 2 images get highest priority
          if (index < 2) {
            img.setAttribute('loading', 'eager');
            img.setAttribute('fetchpriority', 'high');
            img.setAttribute('decoding', 'sync');
          } else {
            img.setAttribute('loading', 'lazy');
            img.setAttribute('fetchpriority', 'low');
            img.setAttribute('decoding', 'async');
          }

          // Add advanced containment
          img.style.contentVisibility = 'auto';
          img.style.contain = 'layout style paint';
          img.style.willChange = 'auto';
        });
      };

      // 3. JavaScript optimization
      const optimizeJavaScript = () => {
        // Defer all non-critical scripts
        const scripts = document.querySelectorAll('script[src]:not([data-critical])');
        scripts.forEach(script => {
          if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
            script.setAttribute('defer', '');
          }
        });

        // Optimize event listeners for mobile
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        document.addEventListener('scroll', () => {}, { passive: true });
      };

      // 4. CSS optimization
      const optimizeCSS = () => {
        // Inline ultra-critical CSS
        const ultraCriticalCSS = `
          /* Ultra-critical mobile CSS */
          html { font-display: swap; -webkit-text-size-adjust: 100%; }
          body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
          .hero-section { transform: translateZ(0); will-change: transform; }
          img { max-width: 100%; height: auto; vertical-align: middle; }
          button, input, select, textarea { font: inherit; }
          * { box-sizing: border-box; }
          @media (max-width: 768px) {
            .container { padding: 0 16px; }
            .text-xl { font-size: 1.125rem; }
          }
        `;

        const style = document.createElement('style');
        style.textContent = ultraCriticalCSS;
        style.setAttribute('data-ultra-critical', 'true');
        document.head.insertBefore(style, document.head.firstChild);
      };

      // 5. Network optimization
      const optimizeNetwork = () => {
        // Add comprehensive resource hints
        const hints = [
          { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
          { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
          { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
          { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
        ];

        hints.forEach(({ rel, href, crossorigin }) => {
          if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = rel;
            link.href = href;
            if (crossorigin) link.crossOrigin = crossorigin;
            document.head.appendChild(link);
          }
        });
      };

      // 6. Memory optimization
      const optimizeMemory = () => {
        // Clean up unused resources
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              if (cacheName.includes('old-') || cacheName.includes('unused-')) {
                caches.delete(cacheName);
              }
            });
          });
        }

        // Optimize garbage collection
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            // Force garbage collection if available
            if (typeof window.gc === 'function') {
              window.gc();
            }
          });
        }
      };

      // 7. Viewport optimization
      const optimizeViewport = () => {
        // Ensure proper viewport meta tag
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
          viewport = document.createElement('meta');
          viewport.setAttribute('name', 'viewport');
          document.head.appendChild(viewport);
        }
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover');

        // Add theme-color for better perceived performance
        const themeColor = document.createElement('meta');
        themeColor.setAttribute('name', 'theme-color');
        themeColor.setAttribute('content', '#000000');
        document.head.appendChild(themeColor);
      };

      // Execute optimizations in priority order
      prioritizeCriticalResources();
      optimizeCSS();
      optimizeViewport();
      optimizeNetwork();
      
      // Use RAF for non-blocking optimizations
      requestAnimationFrame(() => {
        optimizeAllImages();
        optimizeJavaScript();
      });

      // Defer memory optimization
      setTimeout(optimizeMemory, 1000);
    };

    // Apply optimizations immediately
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyAdvancedOptimizations);
    } else {
      applyAdvancedOptimizations();
    }

    // Clean up
    return () => {
      document.removeEventListener('DOMContentLoaded', applyAdvancedOptimizations);
    };
  }, [isMobile]);

  return null;
};