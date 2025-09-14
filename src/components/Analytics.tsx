import { useEffect, useState } from 'react';
import { isPrivateModeSync } from '@/lib/utils';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const Analytics = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load analytics if not in private mode
    const isPrivate = isPrivateModeSync();
    if (isPrivate) {
      console.log('Private mode detected, Analytics disabled');
      return;
    }
    
    setShouldLoad(true);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    // Google Analytics 4
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
        consent_mode: 'denied'
      });
    `;
    document.head.appendChild(script2);

    // Google Search Console verification
    const searchConsoleScript = document.createElement('meta');
    searchConsoleScript.setAttribute('name', 'google-site-verification');
    searchConsoleScript.setAttribute('content', 'YOUR_SEARCH_CONSOLE_VERIFICATION_CODE');
    document.head.appendChild(searchConsoleScript);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(searchConsoleScript);
    };
  }, []);

  return null;
};