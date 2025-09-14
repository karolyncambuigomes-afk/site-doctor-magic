import { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileGalleryOptimizations {
  reducedAnimations: boolean;
  lazyLoading: boolean;
  compressedImages: boolean;
  reducedConcurrency: boolean;
  touchOptimized: boolean;
}

interface GalleryPerformanceMetrics {
  loadTime: number;
  imageCount: number;
  memoryUsage: number;
  isSlowConnection: boolean;
}

export const useMobileGalleryOptimizer = () => {
  const isMobile = useIsMobile();
  const [optimizations, setOptimizations] = useState<MobileGalleryOptimizations>({
    reducedAnimations: false,
    lazyLoading: true,
    compressedImages: false,
    reducedConcurrency: false,
    touchOptimized: false
  });
  
  const [metrics, setMetrics] = useState<GalleryPerformanceMetrics>({
    loadTime: 0,
    imageCount: 0,
    memoryUsage: 0,
    isSlowConnection: false
  });

  // Detect connection quality
  const detectConnectionQuality = useCallback(() => {
    // @ts-ignore - navigator.connection may not exist
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const isSlowConnection = 
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        connection.saveData === true;
      
      console.log('📱 MOBILE OPTIMIZER: Connection quality:', {
        effectiveType: connection.effectiveType,
        saveData: connection.saveData,
        isSlowConnection
      });
      
      return isSlowConnection;
    }
    
    // Fallback: detect based on loading performance
    return false;
  }, []);

  // Apply mobile-specific optimizations
  const applyMobileOptimizations = useCallback(() => {
    if (!isMobile) return;

    const isSlowConnection = detectConnectionQuality();
    
    const newOptimizations: MobileGalleryOptimizations = {
      reducedAnimations: true, // Always reduce animations on mobile
      lazyLoading: true, // Always use lazy loading
      compressedImages: isSlowConnection,
      reducedConcurrency: isSlowConnection,
      touchOptimized: true
    };

    console.log('📱 MOBILE OPTIMIZER: Aplicando otimizações:', newOptimizations);
    
    setOptimizations(newOptimizations);
    setMetrics(prev => ({ ...prev, isSlowConnection }));

    // Apply CSS optimizations
    if (newOptimizations.reducedAnimations) {
      document.documentElement.style.setProperty('--gallery-transition-duration', '0.1s');
    }

    if (newOptimizations.touchOptimized) {
      document.documentElement.style.setProperty('--gallery-touch-target', '48px');
    }

  }, [isMobile, detectConnectionQuality]);

  // Track performance metrics
  const trackPerformance = useCallback((startTime: number, imageCount: number) => {
    const loadTime = performance.now() - startTime;
    
    // Get memory usage if available
    let memoryUsage = 0;
    // @ts-ignore - performance.memory may not exist
    if (performance.memory) {
      // @ts-ignore
      memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    const newMetrics = {
      loadTime,
      imageCount,
      memoryUsage,
      isSlowConnection: metrics.isSlowConnection
    };

    console.log('📱 MOBILE OPTIMIZER: Performance metrics:', newMetrics);
    
    setMetrics(newMetrics);

    // Alert if performance is poor
    if (isMobile && loadTime > 3000) {
      console.warn('📱 MOBILE OPTIMIZER: Desempenho ruim detectado - considerando otimizações adicionais');
    }

  }, [isMobile, metrics.isSlowConnection]);

  // Get optimized image URL based on device capabilities
  const getOptimizedImageUrl = useCallback((originalUrl: string): string => {
    if (!isMobile || !optimizations.compressedImages) {
      return originalUrl;
    }

    // Add image optimization parameters for slow connections
    if (originalUrl.includes('supabase')) {
      // Supabase image transformations
      const url = new URL(originalUrl);
      url.searchParams.set('width', '800');
      url.searchParams.set('quality', '75');
      return url.toString();
    }

    return originalUrl;
  }, [isMobile, optimizations.compressedImages]);

  // Get CSS classes for mobile optimizations
  const getOptimizedClasses = useCallback(() => {
    const classes: string[] = [];

    if (optimizations.reducedAnimations) {
      classes.push('motion-reduce:transition-none');
    }

    if (optimizations.touchOptimized) {
      classes.push('touch-pan-x', 'touch-pinch-zoom');
    }

    return classes.join(' ');
  }, [optimizations]);

  useEffect(() => {
    applyMobileOptimizations();

    // Re-check optimizations on network change
    const handleConnectionChange = () => {
      console.log('📱 MOBILE OPTIMIZER: Conexão alterada, reaplicando otimizações');
      applyMobileOptimizations();
    };

    // @ts-ignore - navigator.connection may not exist
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
      return () => connection.removeEventListener('change', handleConnectionChange);
    }

  }, [applyMobileOptimizations]);

  return {
    optimizations,
    metrics,
    trackPerformance,
    getOptimizedImageUrl,
    getOptimizedClasses,
    isMobile,
    isSlowConnection: metrics.isSlowConnection
  };
};