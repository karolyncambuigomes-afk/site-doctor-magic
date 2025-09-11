import React, { useState, useMemo, useEffect } from 'react';
import { EnhancedImageProps, resolveImage, createImageFallbackChain } from '@/utils/imageResolver';
import { useImagePreference } from '@/hooks/useImagePreference';
import { cn } from '@/lib/utils';

export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  local,
  external,
  placeholder,
  alt,
  className,
  onLoad,
  onError,
  'data-model-image': dataModelImage,
  'data-model-name': dataModelName,
  'data-carousel-image': dataCarouselImage,
  'data-blog-image': dataBlogImage,
  'data-post-title': dataPostTitle
}) => {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get image preference with real-time updates
  const { preferLocalImages } = useImagePreference();

  // Create fallback chain based on preference with robust backup strategy
  const fallbackChain = useMemo(() => {
    const featureFlags = { preferLocalImages };
    const primarySrc = resolveImage({ local, external, placeholder }, featureFlags);
    
    // Create comprehensive fallback chain
    const allSources = [];
    
    // HOTFIX: Always prioritize external images first to fix missing local images
    if (external) allSources.push(external);
    if (local) allSources.push(local);
    if (placeholder) allSources.push(placeholder);
    
    // Always ensure we have a fallback
    if (allSources.length === 0) {
      allSources.push('/images/placeholders/model.jpg');
    }
    
    return createImageFallbackChain(primarySrc, allSources);
  }, [local, external, placeholder, preferLocalImages]);

  // Reset state when fallback chain changes (preference updated)
  useEffect(() => {
    setCurrentSrcIndex(0);
    setHasError(false);
    setIsLoaded(false);
  }, [fallbackChain]);

  const currentSrc = fallbackChain[currentSrcIndex] || '';

  const handleError = () => {
    console.warn(`❌ [EnhancedImage] Failed to load:`, currentSrc);
    
    // Try next fallback
    if (currentSrcIndex < fallbackChain.length - 1) {
      setCurrentSrcIndex(prev => prev + 1);
      console.log(`🔄 [EnhancedImage] Trying fallback ${currentSrcIndex + 1}:`, fallbackChain[currentSrcIndex + 1]);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
    console.log(`✅ [EnhancedImage] Loaded successfully:`, currentSrc);
  };

  // Show error state if all fallbacks failed
  if (hasError || !currentSrc) {
    console.warn('⚠️ [EnhancedImage] All fallbacks failed:', { 
      fallbackChain, 
      external, 
      local, 
      placeholder,
      preferLocalImages 
    });
    
    return (
      <div 
        className={cn(
          'relative overflow-hidden bg-muted flex items-center justify-center text-muted-foreground text-sm text-center',
          className
        )}
      >
        <div>
          <div>Imagem não disponível</div>
          <div className="text-xs mt-1 opacity-70">
            Tried {fallbackChain.length} sources
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn(className, !isLoaded && 'opacity-50')}
      loading="lazy"
      decoding="async"
      data-model-image={dataModelImage}
      data-model-name={dataModelName}
      data-carousel-image={dataCarouselImage}
      data-blog-image={dataBlogImage}
      data-post-title={dataPostTitle}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        transition: 'opacity 0.3s ease',
      }}
    />
  );
};