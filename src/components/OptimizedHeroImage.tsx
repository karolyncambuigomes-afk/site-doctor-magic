import React from 'react';

interface OptimizedHeroImageProps {
  src: string;
  alt: string;
  className?: string;
  'data-hero-image'?: string;
  'data-image-type'?: string;
}

export const OptimizedHeroImage: React.FC<OptimizedHeroImageProps> = ({
  src,
  alt,
  className = "",
  'data-hero-image': dataHeroImage,
  'data-image-type': dataImageType
}) => {
  // Generate WebP and fallback sources
  const generateSources = (imageSrc: string) => {
    if (!imageSrc) return { webpSrc: '', fallbackSrc: '' };
    
    // For local images, create WebP version
    if (imageSrc.startsWith('/') || imageSrc.startsWith('images/')) {
      const webpSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return {
        webpSrc,
        fallbackSrc: imageSrc
      };
    }
    
    // For external images, use as-is (they might already be optimized)
    return {
      webpSrc: imageSrc,
      fallbackSrc: imageSrc
    };
  };

  const { webpSrc, fallbackSrc } = generateSources(src);

  // Responsive sizes for hero images
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw";

  return (
    <picture className="w-full h-full">
      {/* WebP source for modern browsers */}
      <source
        srcSet={webpSrc}
        type="image/webp"
        sizes={sizes}
      />
      
      {/* Fallback for browsers that don't support WebP */}
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading="eager" // Hero images should load immediately
        decoding="async"
        sizes={sizes}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          width: '100%',
          height: '100%'
        }}
        data-hero-image={dataHeroImage}
        data-image-type={dataImageType}
        onLoad={() => {
          console.log('✅ [HERO-IMAGE] Loaded successfully:', webpSrc || fallbackSrc);
        }}
        onError={(e) => {
          console.error('❌ [HERO-IMAGE] Failed to load:', e.currentTarget.src);
        }}
      />
    </picture>
  );
};