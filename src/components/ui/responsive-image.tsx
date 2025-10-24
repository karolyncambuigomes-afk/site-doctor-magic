import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallbackSrc?: string;
  placeholder?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  fallbackSrc,
  placeholder,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  // Handle image error with fallback
  const handleError = (error: any) => {
    console.warn('Image failed to load:', currentSrc);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    if (placeholder && currentSrc !== placeholder) {
      setCurrentSrc(placeholder);
      return;
    }
    
    setHasError(true);
    onError?.(error);
  };

  // Generate responsive srcSet
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('supabase.co')) return undefined;
    
    const baseUrl = baseSrc.split('?')[0];
    return [
      `${baseUrl}?width=320&quality=75 320w`,
      `${baseUrl}?width=640&quality=80 640w`,
      `${baseUrl}?width=1024&quality=85 1024w`,
      `${baseUrl}?width=1920&quality=90 1920w`
    ].join(', ');
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center text-sm">
          <div className="w-8 h-8 mx-auto mb-2 bg-background rounded-full flex items-center justify-center">
            <span className="text-xs">📷</span>
          </div>
          Image unavailable
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <Skeleton 
          className={cn("absolute inset-0", className)}
          style={{ width, height }}
        />
      )}
      
      <img
        src={currentSrc}
        srcSet={generateSrcSet(currentSrc)}
        sizes={sizes}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  );
};