import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

interface ResponsiveGalleryImageProps {
  localUrls?: string[];
  externalUrls?: string[];
  alt: string;
  className?: string;
  index?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  membersOnly?: boolean;
  allPhotosPublic?: boolean;
  faceVisible?: boolean;
}

export const ResponsiveGalleryImage: React.FC<ResponsiveGalleryImageProps> = ({
  localUrls = [],
  externalUrls = [],
  alt,
  className = '',
  index = 0,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  loading = 'lazy',
  onLoad,
  onError,
  membersOnly = false,
  allPhotosPublic = true,
  faceVisible = true
}) => {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const { hasAccess, isAdmin } = useAuth();

  // Create effective source array: prioritize local, then external
  const allSources = [
    ...localUrls.filter(Boolean),
    ...externalUrls.filter(Boolean)
  ];

  const currentSource = allSources[currentSourceIndex];
  
  // Check if image should be blurred for non-members
  const shouldBlur = !hasAccess && !isAdmin && (membersOnly || !allPhotosPublic || !faceVisible);
  
  // Debug log for Anastasia
  if (alt.includes('Anastasia') || externalUrls.some(url => url?.includes('anastasia'))) {
    console.log(`🔍 ANASTASIA DEBUG: ResponsiveGalleryImage inputs`, {
      localUrls,
      externalUrls,
      allSources,
      currentSource,
      currentSourceIndex,
      alt,
      shouldBlur,
      hasAccess,
      membersOnly,
      allPhotosPublic,
      faceVisible
    });
  }

  // Generate responsive srcset for local images (if available)
  const generateSrcSet = (baseUrl: string) => {
    if (!baseUrl.startsWith('/images/') || !baseUrl.includes('gallery-')) return baseUrl;
    
    // Extract the base path and generate different sizes
    const base800 = baseUrl.replace('-1200.webp', '-800.webp');
    const base1200 = baseUrl;
    
    return `${base800} 800w, ${base1200} 1200w`;
  };

  const handleError = () => {
    setHasError(true);
    
    // Try next source if available
    if (currentSourceIndex < allSources.length - 1) {
      console.log(`🖼️ Image failed, trying next source: ${allSources[currentSourceIndex + 1]}`);
      setCurrentSourceIndex(prev => prev + 1);
      setHasError(false);
    } else {
      console.error('🖼️ All image sources failed');
      onError?.();
    }
  };

  const handleLoad = () => {
    setHasError(false);
    onLoad?.();
  };

  if (!currentSource || allSources.length === 0) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">No image available</span>
      </div>
    );
  }

  // If we have a local optimized image, use picture element with responsive sources
  const isLocalImage = currentSource.startsWith('/images/') && currentSource.includes('gallery-');
  
  if (isLocalImage && !hasError) {
    return (
      <picture className={className}>
        <source
          srcSet={generateSrcSet(currentSource)}
          sizes={sizes}
          type="image/webp"
        />
        <img
          src={currentSource}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-300 ${shouldBlur ? 'blur-md grayscale' : ''}`}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{ aspectRatio: '4/3' }}
          width={1200}
          height={900}
        />
      </picture>
    );
  }

  // Fallback to regular img for external/raw sources
  return (
    <img
      src={currentSource}
      alt={alt}
      className={`w-full h-full object-cover transition-all duration-300 ${shouldBlur ? 'blur-md grayscale' : ''} ${className}`}
      loading={loading}
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      style={{ aspectRatio: '4/3' }}
      sizes={sizes}
      width={1200}
      height={900}
    />
  );
};