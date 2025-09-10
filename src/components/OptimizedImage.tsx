import React, { useState, useRef, useEffect } from 'react';
import { 
  getOptimizedImageUrl, 
  generateResponsiveSources, 
  generateFallbackSources,
  getOptimalSize,
  ImageSize 
} from '@/utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fixedSize?: ImageSize;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  fixedSize,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [optimalSize, setOptimalSize] = useState<ImageSize>('medium');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Calculate optimal size based on container
  useEffect(() => {
    if (fixedSize) {
      setOptimalSize(fixedSize);
      return;
    }

    const calculateSize = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const optimal = getOptimalSize(rect.width, rect.height);
        setOptimalSize(optimal);
      }
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [fixedSize]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Don't render anything until in view (for non-priority images)
  if (!isInView) {
    return (
      <div 
        ref={containerRef} 
        className={`bg-muted animate-pulse ${className}`}
        style={{ aspectRatio: '3/4' }}
      />
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Failed to load image</span>
      </div>
    );
  }

  // Generate optimized URLs
  const webpSrcSet = generateResponsiveSources(src);
  const jpegSrcSet = generateFallbackSources(src);
  const fallbackSrc = getOptimizedImageUrl(src, optimalSize, 'jpeg', 85);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <picture>
        {/* WebP sources for modern browsers */}
        <source 
          srcSet={webpSrcSet} 
          sizes={sizes} 
          type="image/webp" 
        />
        
        {/* JPEG fallback */}
        <source 
          srcSet={jpegSrcSet} 
          sizes={sizes} 
          type="image/jpeg" 
        />
        
        {/* Final fallback */}
        <img
          ref={imgRef}
          src={fallbackSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          {...(priority && { fetchPriority: 'high' as any })}
        />
      </picture>
    </div>
  );
};

// Specialized components for different use cases
export const ModelImage: React.FC<Omit<OptimizedImageProps, 'sizes'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  />
);

export const HeroImage: React.FC<Omit<OptimizedImageProps, 'sizes' | 'priority'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="100vw"
    priority={true}
    fixedSize="large"
  />
);

export const ThumbnailImage: React.FC<Omit<OptimizedImageProps, 'sizes' | 'fixedSize'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 640px) 40vw, 200px"
    fixedSize="thumbnail"
  />
);