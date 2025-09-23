import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (isInView && !isLoaded && imageSrc === placeholder) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        onError?.();
      };
      img.src = src;
    }
  }, [isInView, isLoaded, src, placeholder, onLoad, onError, imageSrc]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6'
  };

  const imageStyle: React.CSSProperties = {
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0.7,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  if (width && height) {
    containerStyle.width = width;
    containerStyle.height = height;
  }

  return (
    <div style={containerStyle} className={className}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        style={imageStyle}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        onLoad={() => {
          if (imageSrc === src) {
            setIsLoaded(true);
            onLoad?.();
          }
        }}
        onError={onError}
      />
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};