import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Synchronous initial detection for SSR/hydration
const getInitialMobileState = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Quick sync check based on screen width and touch capability
  const screenMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const userAgentMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(navigator.userAgent.toLowerCase());
  
  return userAgentMobile || (screenMobile && touchCapable);
};

export function useIsMobile() {
  // Initialize synchronously to prevent flash on mobile
  const [isMobile, setIsMobile] = React.useState<boolean>(() => getInitialMobileState())

  React.useEffect(() => {
    // Smart mobile detection with manual override
    const detectMobile = () => {
      // Check for manual override
      const urlParams = new URLSearchParams(window.location.search);
      const forceMobileParam = urlParams.get('force-mobile');
      
      if (forceMobileParam === 'true') {
        console.log('[MobileDetection] Manual mobile override enabled');
        return true;
      }
      
      if (forceMobileParam === 'false') {
        console.log('[MobileDetection] Manual mobile override disabled');
        return false;
      }
      
      // Real mobile detection - exclude crawlers
      const userAgent = navigator.userAgent.toLowerCase();
      const isCrawler = /googlebot|bingbot|pagespeed|gtmetrix|pingdom|webpagetest|lighthouse|crawler|bot|spider|facebookexternalhit|whatsapp|linkedinbot|slurp|duckduckbot/i.test(userAgent);
      
      // If it's a crawler, never treat as mobile
      if (isCrawler) {
        console.log('[MobileDetection] Crawler detected, forcing desktop mode:', userAgent);
        return false;
      }
      
      const userAgentMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
      const screenMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Combine detection methods
      const isMobileDevice = userAgentMobile || (screenMobile && touchCapable);
      
      console.log('[MobileDetection] Smart detection:', {
        userAgentMobile,
        screenMobile,
        touchCapable,
        finalResult: isMobileDevice,
        dimensions: `${window.innerWidth}x${window.innerHeight}`
      });
      
      return isMobileDevice;
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const mobile = detectMobile();
      console.log('[MobileDetection] Status change:', { mobile, timestamp: new Date().toISOString() });
      setIsMobile(mobile);
      
      // Only dispatch events if actually mobile
      if (mobile) {
        console.log('[MobileDetection] Dispatching mobile sync events...');
        
        // Selective sync events for mobile only
        const events = [
          'mobile-status-change',
          'mobile-sync-request'
        ];

        events.forEach(eventType => {
          window.dispatchEvent(new CustomEvent(eventType, { 
            detail: { 
              isMobile: mobile, 
              timestamp: Date.now(),
              source: 'mobile-detection'
            } 
          }));
        });
      }
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(detectMobile())
    
    // Initialize with current state
    onChange();
    
    // Listen for orientation changes on mobile
    const handleOrientationChange = () => {
      if (detectMobile()) {
        setTimeout(onChange, 100);
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener('orientationchange', handleOrientationChange);
    }
  }, [])

  return isMobile
}
