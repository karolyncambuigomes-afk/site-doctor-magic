import { useState, useEffect } from 'react';

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenWidth: number;
  orientation: 'portrait' | 'landscape';
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  largeDesktop: 1920
} as const;

export const useResponsiveBreakpoints = (): BreakpointState => {
  const [state, setState] = useState<BreakpointState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
        screenWidth: 1024,
        orientation: 'landscape'
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
      isDesktop: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.largeDesktop,
      isLargeDesktop: width >= BREAKPOINTS.largeDesktop,
      screenWidth: width,
      orientation: width > height ? 'landscape' : 'portrait'
    };
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        setState({
          isMobile: width < BREAKPOINTS.mobile,
          isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
          isDesktop: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.largeDesktop,
          isLargeDesktop: width >= BREAKPOINTS.largeDesktop,
          screenWidth: width,
          orientation: width > height ? 'landscape' : 'portrait'
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
};

// Utility hook for specific breakpoint checks
export const useBreakpoint = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  const { screenWidth } = useResponsiveBreakpoints();
  return screenWidth >= BREAKPOINTS[breakpoint];
};

// Container classes based on breakpoints
export const useResponsiveContainer = () => {
  const { isMobile, isTablet } = useResponsiveBreakpoints();
  
  return {
    containerClass: isMobile 
      ? 'container-width-sm px-4' 
      : isTablet 
        ? 'container-width-md px-6' 
        : 'container-width-lg px-8',
    paddingClass: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8',
    gapClass: isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-8'
  };
};