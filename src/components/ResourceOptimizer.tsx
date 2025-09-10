import React from 'react';

// Performance-optimized preloader for critical resources
export const ResourcePreloader: React.FC = () => {
  React.useEffect(() => {
    // Only preload critical resources for initial page load
    const criticalResources = [
      // Critical fonts
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' },
      // Core vendor chunks that will be needed soon
      { href: '/assets/react-vendor-[hash].js', as: 'script', type: 'module' },
      { href: '/assets/router-[hash].js', as: 'script', type: 'module' }
    ];

    const linkElements = criticalResources.map(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      link.crossOrigin = 'anonymous';
      return link;
    });

    // Add to document head
    linkElements.forEach(link => document.head.appendChild(link));

    // Cleanup on unmount
    return () => {
      linkElements.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  return null;
};

// Prefetch non-critical resources when browser is idle
export const IdlePrefetcher: React.FC = () => {
  React.useEffect(() => {
    if ('requestIdleCallback' in window) {
      const prefetchWhenIdle = () => {
        window.requestIdleCallback(() => {
          // Prefetch likely next pages
          const prefetchResources = [
            '/models',
            '/about',
            '/contact',
            '/services'
          ];

          prefetchResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
          });
        });
      };

      // Delay prefetching to after initial load
      setTimeout(prefetchWhenIdle, 2000);
    }
  }, []);

  return null;
};

// DNS prefetch for external domains
export const DNSPrefetcher: React.FC = () => {
  React.useEffect(() => {
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'jiegopvbwpyfohhfvmwo.supabase.co'
    ];

    const linkElements = externalDomains.map(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      return link;
    });

    linkElements.forEach(link => document.head.appendChild(link));

    return () => {
      linkElements.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  return null;
};