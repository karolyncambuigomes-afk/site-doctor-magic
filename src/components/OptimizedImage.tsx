import React, { useMemo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  onLoad,
  onError,
}) => {
  // Generate responsive image sources for better mobile performance
  const { srcSet, sizes } = useMemo(() => {
    if (!src || src.startsWith('data:')) {
      return { srcSet: undefined, sizes: undefined };
    }

    // Check if image is from Supabase storage (has potential for responsive variants)
    const isSupabaseImage = src.includes('supabase') || src.includes('/storage/');
    
    if (isSupabaseImage) {
      // Generate srcset for different screen sizes
      // Assumes images are available in -800.webp and -1200.webp variants
      const baseUrl = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      const ext = src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.webp';
      
      return {
        srcSet: `${baseUrl}-800${ext} 800w, ${baseUrl}-1200${ext} 1200w, ${src} 1600w`,
        sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px'
      };
    }

    return { srcSet: undefined, sizes: undefined };
  }, [src]);

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={onLoad}
      onError={onError}
    />
  );
};