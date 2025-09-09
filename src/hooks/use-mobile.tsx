import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Enhanced mobile detection combining multiple methods
    const detectMobile = () => {
      const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const screenMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return userAgentMobile || screenMobile || touchCapable;
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const mobile = detectMobile();
      setIsMobile(mobile);
      
      // Force sync when mobile status changes
      if (mobile) {
        window.dispatchEvent(new CustomEvent('mobile-status-change', { 
          detail: { isMobile: mobile, timestamp: Date.now() } 
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
