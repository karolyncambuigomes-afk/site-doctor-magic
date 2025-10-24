import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  aspectRatio?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  onLoad,
  onError,
  fallbackSrc = '/images/placeholders/model.jpg',
  aspectRatio = '1/1',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  // Reset when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Image unavailable</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={isVisible ? currentSrc : undefined}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};
