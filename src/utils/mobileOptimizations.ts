// Mobile-specific performance optimizations

export const addCriticalCSS = () => {
  const criticalCSS = `
    /* Critical mobile performance styles */
    :root {
      --mobile-transition: 150ms ease-out;
      --mobile-transform: translateZ(0);
    }
    
    @media (max-width: 768px) {
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeSpeed;
      }
      
      img {
        content-visibility: auto;
        contain-intrinsic-size: 300px 200px;
      }
      
      .mobile-optimized {
        will-change: transform;
        transform: var(--mobile-transform);
      }
      
      .hero-section,
      .navigation,
      .footer {
        contain: layout style paint;
      }
      
      /* Reduce motion for better performance */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Touch optimization */
      button,
      a,
      input,
      textarea,
      select {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Scrolling optimization */
      .scroll-container {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      
      /* Font loading optimization */
      @font-face {
        font-display: swap;
      }
    }
  `;

  const existingStyle = document.querySelector('style[data-mobile-critical]');
  if (existingStyle) {
    existingStyle.textContent = criticalCSS;
  } else {
    const style = document.createElement('style');
    style.setAttribute('data-mobile-critical', 'true');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }
};

export const preloadCriticalResources = () => {
  const resources = [
    {
      href: '/images/hero-banner-vic-mobile-1080x1920.webp',
      as: 'image',
      type: 'image/webp'
    },
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      as: 'style'
    }
  ];

  resources.forEach(({ href, as, type }) => {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    }
  });
};

export const addResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
  ];

  hints.forEach(({ rel, href, crossorigin }) => {
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

export const optimizeImages = () => {
  const images = document.querySelectorAll('img');
  const isMobile = window.innerWidth <= 768;
  
  images.forEach((img, index) => {
    // Prioritize above-the-fold images
    const isAboveFold = index < 3;
    
    if (isAboveFold) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('decoding', 'sync');
    } else {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('fetchpriority', 'low');
      img.setAttribute('decoding', 'async');
    }

    // Mobile-specific optimizations
    if (isMobile) {
      img.style.contentVisibility = 'auto';
      img.style.containIntrinsicSize = '300px 200px';
      img.style.willChange = 'transform';
    }
  });
};

export const deferNonCriticalScripts = () => {
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && (
      src.includes('analytics') ||
      src.includes('gtag') ||
      src.includes('facebook') ||
      src.includes('twitter') ||
      src.includes('linkedin')
    )) {
      script.setAttribute('defer', '');
      script.setAttribute('loading', 'lazy');
    }
  });
};

export const enableServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration.scope);
      return registration;
    } catch (error) {
      console.log('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};