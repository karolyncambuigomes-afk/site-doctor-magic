import { useState, useEffect } from 'react';

export function useScrollFooter() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / documentHeight, 1);
      
      setScrollProgress(progress);

      // Don't show if manually hidden
      if (isManuallyHidden) return;

      // Show tab when 60% scrolled
      if (progress >= 0.6) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }

      // Auto-expand when 80% scrolled
      if (progress >= 0.8) {
        setIsExpanded(true);
      } else if (progress < 0.75) {
        // Add some hysteresis to prevent flickering
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isManuallyHidden]);

  const hideFooter = () => {
    setIsManuallyHidden(true);
    setIsVisible(false);
    setIsExpanded(false);
    
    // Reset after scrolling back to top
    if (scrollProgress < 0.3) {
      setTimeout(() => setIsManuallyHidden(false), 1000);
    }
  };

  const showFooter = () => {
    setIsManuallyHidden(false);
  };

  return {
    isVisible,
    isExpanded,
    scrollProgress,
    hideFooter,
    showFooter,
    isManuallyHidden
  };
}