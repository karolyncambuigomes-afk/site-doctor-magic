import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // FORÇA MOBILE - Ultra-aggressive mobile detection
    const detectMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const userAgentMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
      const screenMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const orientation = screen.orientation?.type?.includes('portrait') || window.innerHeight > window.innerWidth;
      
      // FORÇA SEMPRE MOBILE para garantir sincronização
      const forceMobile = true; // SEMPRE TRUE para forçar sync
      
      // Enhanced logging for debugging
      console.log('[MobileDetection] FORÇANDO MOBILE - Details:', {
        userAgent: userAgent.substring(0, 50),
        userAgentMobile,
        screenMobile,
        touchCapable,
        orientation,
        dimensions: `${window.innerWidth}x${window.innerHeight}`,
        finalResult: forceMobile,
        forced: true,
        timestamp: new Date().toISOString()
      });
      
      return forceMobile;
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const mobile = detectMobile(); // Sempre true agora
      console.log('[MobileDetection] SEMPRE MOBILE - Status change:', { mobile, forced: true, timestamp: new Date().toISOString() });
      setIsMobile(mobile);
      
      // ULTRA-AGGRESSIVE sync events SEMPRE
      console.log('[MobileDetection] Disparando eventos mobile FORÇADOS...');
      
      // Multiple sync events for different components
      const events = [
        'mobile-status-change',
        'mobile-force-refresh', 
        'mobile-force-sync',
        'mobile-cache-clear',
        'preference-categories-refresh',
        'data-refresh'
      ];

      events.forEach(eventType => {
        window.dispatchEvent(new CustomEvent(eventType, { 
          detail: { 
            isMobile: mobile, 
            timestamp: Date.now(), 
            ultra: true,
            forced: true,
            source: 'detection-forced'
          } 
        }));
      });
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(detectMobile()) // Força mobile imediatamente
    
    // Força onChange imediatamente para disparar eventos
    setTimeout(onChange, 100);
    
    // Also listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(onChange, 100);
    };
    
    // Força sync a cada 3 segundos
    const forceInterval = setInterval(() => {
      console.log('[MobileDetection] Intervalo forçado de sync');
      onChange();
    }, 3000);
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearInterval(forceInterval);
    }
  }, [])

  return !!isMobile
}
