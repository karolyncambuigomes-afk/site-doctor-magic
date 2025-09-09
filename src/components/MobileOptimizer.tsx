import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileOptimizer = () => {
  const isMobile = useIsMobile();
  const [forceUpdateCount, setForceUpdateCount] = useState(0);

  useEffect(() => {
    if (!isMobile) return;

    // Enhanced mobile detection
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
             window.innerWidth <= 768 ||
             'ontouchstart' in window;
    };

    // Aggressive viewport management
    const setupViewport = () => {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    };

    // Enhanced cache busting with multiple strategies
    const aggressiveCacheBust = () => {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      
      // Bust CSS cache
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && !href.includes('?mobile-refresh=')) {
          const separator = href.includes('?') ? '&' : '?';
          link.setAttribute('href', `${href}${separator}mobile-refresh=${timestamp}-${randomId}`);
        }
      });

      // Bust script cache
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach((script) => {
        const src = script.getAttribute('src');
        if (src && src.startsWith('/') && !src.includes('?mobile-refresh=')) {
          const separator = src.includes('?') ? '&' : '?';
          script.setAttribute('src', `${src}${separator}mobile-refresh=${timestamp}-${randomId}`);
        }
      });

      // Force browser cache refresh
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            if (cacheName.includes('static') || cacheName.includes('runtime')) {
              caches.delete(cacheName);
            }
          });
        });
      }
    };

    // Force DOM refresh
    const forceDOMRefresh = () => {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';
      
      // Force re-render of React components
      const event = new CustomEvent('mobile-force-refresh', {
        detail: { timestamp: Date.now() }
      });
      window.dispatchEvent(event);
    };

    // Enhanced mobile refresh with retry logic
    const performMobileRefresh = (attempt = 1) => {
      if (!isMobileDevice()) return;

      console.log(`[MobileOptimizer] Performing mobile refresh attempt ${attempt}`);
      
      try {
        setupViewport();
        aggressiveCacheBust();
        forceDOMRefresh();
        setForceUpdateCount(prev => prev + 1);
        
        // Store last refresh time
        try {
          localStorage.setItem('last-mobile-refresh', Date.now().toString());
        } catch (e) {
          // Fallback for private mode
          sessionStorage.setItem('last-mobile-refresh', Date.now().toString());
        }
      } catch (error) {
        console.warn(`[MobileOptimizer] Refresh attempt ${attempt} failed:`, error);
        if (attempt < 3) {
          setTimeout(() => performMobileRefresh(attempt + 1), 1000);
        }
      }
    };

    // Auto-refresh detection
    const checkForStaleContent = () => {
      try {
        const lastRefresh = localStorage.getItem('last-mobile-refresh') || 
                           sessionStorage.getItem('last-mobile-refresh');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (!lastRefresh || (now - parseInt(lastRefresh)) > fiveMinutes) {
          performMobileRefresh();
        }
      } catch (e) {
        // If we can't check, just refresh
        performMobileRefresh();
      }
    };

    // Enhanced touch optimization
    const optimizeTouchInteraction = () => {
      const touchOptions = { passive: true, capture: false };
      document.addEventListener('touchstart', () => {}, touchOptions);
      document.addEventListener('touchmove', () => {}, touchOptions);
      document.addEventListener('touchend', () => {}, touchOptions);
      
      // Prevent double-tap zoom
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
    };

    // Network change detection
    const handleNetworkChange = () => {
      if (navigator.onLine) {
        setTimeout(performMobileRefresh, 500);
      }
    };

    // Visibility change with enhanced logic
    const handleVisibilityChange = () => {
      if (!document.hidden && isMobileDevice()) {
        // Delay to ensure the app is fully visible
        setTimeout(() => {
          checkForStaleContent();
        }, 200);
      }
    };

    // Page focus detection
    const handlePageFocus = () => {
      if (isMobileDevice()) {
        setTimeout(checkForStaleContent, 100);
      }
    };

    // Orientation change
    const handleOrientationChange = () => {
      if (isMobileDevice()) {
        setTimeout(() => {
          setupViewport();
          performMobileRefresh();
        }, 300);
      }
    };

    // Initialize all optimizations
    setupViewport();
    optimizeTouchInteraction();
    
    // Perform initial refresh check
    setTimeout(checkForStaleContent, 100);

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handlePageFocus);
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Custom event for forced refresh
    const handleForceRefresh = () => performMobileRefresh();
    window.addEventListener('mobile-force-refresh', handleForceRefresh);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handlePageFocus);
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('mobile-force-refresh', handleForceRefresh);
    };
  }, [isMobile, forceUpdateCount]);

  return null;
};