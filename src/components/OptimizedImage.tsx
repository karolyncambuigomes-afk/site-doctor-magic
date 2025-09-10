import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { generateImageSources, heroSizes, defaultSizes, createImageObserver } from '@/utils/imageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  sizes?: string; // Responsive sizes
  placeholder?: string; // Base64 placeholder
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = createImageObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer?.disconnect();
      }
    });

    if (observer && imgRef.current) {
      observer.observe(imgRef.current);
      return () => observer.disconnect();
    } else {
      // Fallback for browsers without IntersectionObserver
      setIsVisible(true);
    }
  }, [priority]);

  // Generate responsive image sources with WebP fallback
  const imageSources = generateImageSources({ src, alt, width, height });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(5px)'
          }}
        />
      )}

      {/* Main image - only load when visible */}
      {(isVisible || priority) && (
        <picture>
          {imageSources.map((source, index) => (
            <source 
              key={index}
              srcSet={source.srcSet} 
              type={source.type}
              sizes={sizes || (src.includes('hero') ? heroSizes : defaultSizes)}
            />
          ))}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              error && 'bg-muted'
            )}
          />
        </picture>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          <div className="text-center">
            <div>Imagem não encontrada</div>
            <div className="text-xs mt-1 opacity-70">Src: {src}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for preloading critical images
export const useImagePreloader = (imageSources: string[]) => {
  useEffect(() => {
    imageSources.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [imageSources]);
};