import { useEffect } from 'react';

export const MobileOptimizer = () => {
  useEffect(() => {
    // Prevent zoom on input focus (iOS Safari)
    const addViewportMeta = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    };

    // Force repaint to ensure mobile updates
    const forceRepaint = () => {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    };

    // Handle mobile refresh properly
    const handleMobileRefresh = () => {
      if (window.navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        // Add timestamp to force cache bust on mobile
        const timestamp = Date.now();
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (href && !href.includes('?')) {
            link.setAttribute('href', `${href}?v=${timestamp}`);
          }
        });
        
        forceRepaint();
      }
    };

    // Optimize touch events
    const optimizeTouchEvents = () => {
      document.addEventListener('touchstart', () => {}, { passive: true });
      document.addEventListener('touchmove', () => {}, { passive: true });
    };

    // Initialize optimizations
    addViewportMeta();
    handleMobileRefresh();
    optimizeTouchEvents();

    // Handle page visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(handleMobileRefresh, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
};