import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { generateImageSources, heroSizes, defaultSizes, createImageObserver } from '@/utils/imageOptimizer';
import { useImagePreference } from '@/hooks/useImagePreference';
import { resolveImage } from '@/utils/imageResolver';
import { useIsMobile } from '@/hooks/use-mobile';

interface OptimizedImageProps {
  src?: string;
  localSrc?: string; // Local optimized version
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
  onLoad?: (e?: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e?: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  localSrc,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  placeholder,
  onLoad,
  onError
}) => {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { preferLocalImages } = useImagePreference();

  // Resolve image source based on preference
  const resolvedSrc = resolveImage({
    local: localSrc,
    external: src,
    placeholder
  }, { preferLocalImages });

  // Early validation
  if (!resolvedSrc || resolvedSrc.trim() === '') {
    console.warn(`🚨 [OptimizedImage] No valid image source:`, { src, localSrc });
    return (
      <div 
        className={cn('relative overflow-hidden bg-muted flex items-center justify-center', className)}
        style={{ width, height }}
      >
        <div className="text-muted-foreground text-sm text-center">
          <div>Imagem não disponível</div>
          <div className="text-xs mt-1 opacity-70">
            Mode: {preferLocalImages ? 'Local' : 'External'}
          </div>
        </div>
      </div>
    );
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

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
      setIsVisible(true);
    }
  }, [priority]);

  // Reset state when source changes (preference updated)
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [resolvedSrc]);

  const imageSources = generateImageSources({ 
    src: resolvedSrc, 
    alt, 
    width, 
    height 
  });

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`✅ [OptimizedImage] Image loaded:`, resolvedSrc, `(${preferLocalImages ? 'local' : 'external'} mode)`);
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`❌ [OptimizedImage] Failed to load:`, resolvedSrc);
    setError(true);
    setIsLoaded(true);
    onError?.(e);
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
          className="absolute inset-0 bg-muted animate-pulse backdrop-blur-sm"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {/* Main image */}
      {(isVisible || priority) && (
        <picture>
          {imageSources.map((source, index) => (
            <source 
              key={index}
              srcSet={source.srcSet} 
              type={source.type}
              sizes={sizes || (resolvedSrc.includes('hero') ? heroSizes : defaultSizes)}
            />
          ))}
          <img
            src={resolvedSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'low'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              error && 'bg-muted',
              isMobile && 'will-change-transform'
            )}
            style={isMobile ? { 
              contentVisibility: 'auto',
              containIntrinsicSize: `${width || 300}px ${height || 200}px`
            } : undefined}
          />
        </picture>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          <div className="text-center">
            <div>Imagem não encontrada</div>
            <div className="text-xs mt-1 opacity-70">
              {preferLocalImages ? 'Local' : 'External'}: {resolvedSrc}
            </div>
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