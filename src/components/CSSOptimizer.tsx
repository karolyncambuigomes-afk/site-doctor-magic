import React from 'react';

interface CSSOptimizerProps {
  children: React.ReactNode;
}

export const CSSOptimizer: React.FC<CSSOptimizerProps> = ({ children }) => {
  React.useEffect(() => {
    // Remove unused CSS classes dynamically
    const removeUnusedCSS = () => {
      // Get all stylesheets
      const stylesheets = document.styleSheets;
      const usedSelectors = new Set<string>();
      
      // Collect all used classes in the DOM
      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        if (element.className) {
          const classes = element.className.toString().split(' ');
          classes.forEach(cls => {
            if (cls.trim()) {
              usedSelectors.add(`.${cls.trim()}`);
            }
          });
        }
      });
      
      // Mark unused CSS for removal (in production only)
      if (process.env.NODE_ENV === 'production') {
        Array.from(stylesheets).forEach(stylesheet => {
          try {
            if (stylesheet.cssRules) {
              Array.from(stylesheet.cssRules).forEach((rule, index) => {
                if (rule instanceof CSSStyleRule) {
                  const selector = rule.selectorText;
                  // Check if selector is used
                  const isUsed = selector.split(',').some(sel => {
                    const cleanSel = sel.trim();
                    return usedSelectors.has(cleanSel) || 
                           document.querySelector(cleanSel) !== null;
                  });
                  
                  if (!isUsed && stylesheet.deleteRule) {
                    // Mark for deletion (commented out to avoid runtime errors)
                    // stylesheet.deleteRule(index);
                    console.log('Unused CSS rule detected:', selector);
                  }
                }
              });
            }
          } catch (e) {
            // Cross-origin stylesheets can't be accessed
            console.log('Cannot access stylesheet:', e);
          }
        });
      }
    };
    
    // Run after all components have mounted
    const timeoutId = setTimeout(removeUnusedCSS, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Preload critical fonts
  React.useEffect(() => {
    const preloadFont = (url: string, type: string = 'font/woff2') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = type;
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload critical fonts
    preloadFont('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2');
    
  }, []);

  return <>{children}</>;
};

// Component to defer non-critical CSS
export const DeferredCSS: React.FC<{ href: string }> = ({ href }) => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);

    // Fallback for browsers that don't support onload
    setTimeout(() => {
      link.media = 'all';
    }, 3000);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [href]);

  return null;
};

// Component to load CSS based on viewport size
export const ResponsiveCSS: React.FC = () => {
  React.useEffect(() => {
    const loadResponsiveCSS = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      // Load device-specific CSS
      if (isMobile && !document.querySelector('[data-mobile-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/mobile.css';
        link.setAttribute('data-mobile-css', 'true');
        document.head.appendChild(link);
      }
      
      if (isTablet && !document.querySelector('[data-tablet-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/tablet.css';
        link.setAttribute('data-tablet-css', 'true');
        document.head.appendChild(link);
      }
    };

    loadResponsiveCSS();
    window.addEventListener('resize', loadResponsiveCSS);
    
    return () => window.removeEventListener('resize', loadResponsiveCSS);
  }, []);

  return null;
};