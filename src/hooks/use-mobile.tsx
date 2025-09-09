import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Ultra-aggressive mobile detection with debugging
    const detectMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const userAgentMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
      const screenMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const orientation = screen.orientation?.type?.includes('portrait') || window.innerHeight > window.innerWidth;
      
      // Force mobile detection - more aggressive
      const forceMobile = userAgentMobile || screenMobile || touchCapable || orientation;
      
      // Enhanced logging for debugging
      console.log('[MobileDetection] Details:', {
        userAgent: userAgent.substring(0, 50),
        userAgentMobile,
        screenMobile,
        touchCapable,
        orientation,
        dimensions: `${window.innerWidth}x${window.innerHeight}`,
        finalResult: forceMobile,
        timestamp: new Date().toISOString()
      });
      
      return forceMobile;
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const mobile = detectMobile();
      console.log('[MobileDetection] Status change:', { mobile, timestamp: new Date().toISOString() });
      setIsMobile(mobile);
      
      // Ultra-aggressive sync events when mobile
      if (mobile) {
        console.log('[MobileDetection] Dispatching mobile events...');
        
        // Multiple sync events for different components
        window.dispatchEvent(new CustomEvent('mobile-status-change', { 
          detail: { isMobile: mobile, timestamp: Date.now(), ultra: true } 
        }));
        
        window.dispatchEvent(new CustomEvent('mobile-force-refresh', {
          detail: { timestamp: Date.now(), forced: true, source: 'detection' }
        }));
        
        window.dispatchEvent(new CustomEvent('mobile-force-sync', {
          detail: { timestamp: Date.now(), forced: true, source: 'detection' }
        }));
        
        window.dispatchEvent(new CustomEvent('mobile-cache-clear', {
          detail: { timestamp: Date.now(), forced: true }
        }));
      }
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(detectMobile())
    
    // Also listen for orientation changes on mobile
    const handleOrientationChange = () => {
      setTimeout(onChange, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener('orientationchange', handleOrientationChange);
    }
  }, [])

  return !!isMobile
}
