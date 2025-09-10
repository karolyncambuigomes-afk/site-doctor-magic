import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileGalleryOptimizer } from '@/hooks/useMobileGalleryOptimizer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ResponsiveGalleryImage } from '@/components/ResponsiveGalleryImage';

interface GalleryImage {
  id: string;
  image_url: string;
  caption?: string;
  order_index: number;
}

interface ModelGalleryProps {
  modelId: string;
  mainImage: string;
  modelName: string;
  membersOnly?: boolean;
  allPhotosPublic?: boolean;
  faceVisible?: boolean;
}

export const ModelGallery: React.FC<ModelGalleryProps> = ({ 
  modelId, 
  mainImage, 
  modelName,
  membersOnly = false,
  allPhotosPublic = true,
  faceVisible = true
}) => {
  const isMobile = useIsMobile();
  const { 
    optimizations, 
    trackPerformance, 
    getOptimizedImageUrl, 
    getOptimizedClasses 
  } = useMobileGalleryOptimizer();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    loadGalleryImages();
  }, [modelId]);

  // Listen for gallery updates using a custom event
  useEffect(() => {
    const handleGalleryUpdate = () => {
      console.log('🖼️ SITE GALERIA: Recebido evento de atualização da galeria');
      loadGalleryImages();
    };

    window.addEventListener('galleryUpdated', handleGalleryUpdate);
    return () => window.removeEventListener('galleryUpdated', handleGalleryUpdate);
  }, []);

  const loadGalleryImages = async () => {
    const startTime = performance.now();
    console.log(`📱 MODEL GALLERY DEBUG [${isMobile ? 'MOBILE' : 'DESKTOP'}]: Carregando arrays para modelo ${modelId}`);
    
    try {
      setLoading(true);
      setLoadingError(null);
      
      // Get model data with gallery arrays
      const { data: modelData, error } = await supabase
        .from('models')
        .select('members_only, all_photos_public, gallery_external_urls, gallery_local_urls')
        .eq('id', modelId)
        .single();

      if (error) throw error;

      console.log(`📱 MODEL GALLERY DEBUG: Configuração do modelo:`, modelData);
      
      // Create effective gallery list: local || external
      const externalUrls = modelData?.gallery_external_urls || [];
      const localUrls = modelData?.gallery_local_urls || [];
      
      const imgs = [...localUrls, ...externalUrls].filter(Boolean);
      
      // Convert to gallery format
      const images: GalleryImage[] = imgs.map((url, index) => ({
        id: `img-${index}`,
        image_url: url,
        caption: `${modelName} - Foto ${index + 1}`,
        order_index: index
      }));

      const loadTime = performance.now() - startTime;
      console.log(`📱 MODEL GALLERY DEBUG: ${images.length} imagens processadas em ${loadTime.toFixed(2)}ms`);
      
      trackPerformance(startTime, images.length);
      
      if (isMobile && loadTime > 2000) {
        console.warn(`📱 MODEL GALLERY DEBUG: Carregamento lento detectado (${loadTime.toFixed(2)}ms)`);
      }
      
      setGalleryImages(images);
      console.log(`📱 MODEL GALLERY DEBUG: Estado atualizado`);
    } catch (error) {
      console.error(`📱 MODEL GALLERY DEBUG: Erro ao carregar galeria:`, error);
      setLoadingError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Use gallery images with ResponsiveGalleryImage fallback strategy
  const allImages = galleryImages.length > 0 ? galleryImages.map((img, index) => ({
    ...img,
    image_url: img.image_url,
    fallback_url: index === 0 ? mainImage : undefined // First image can fallback to main
  })) : [
    { 
      id: 'fallback', 
      image_url: mainImage, 
      caption: `${modelName}`,
      order_index: 0 
    }
  ];

  console.log(`📱 MODEL GALLERY DEBUG: allImages após processamento:`, allImages);
  console.log(`📱 MODEL GALLERY DEBUG: galleryImages.length:`, galleryImages.length);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {isMobile && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <LoadingSpinner className="w-4 h-4" />
              <span>Carregando galeria (mobile)...</span>
            </div>
          </div>
        )}
        <div className="animate-pulse">
          <div className="aspect-[3/4] bg-muted rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-16 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Erro ao carregar galeria</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{loadingError}</p>
          {isMobile && (
            <p className="text-xs text-red-500 mt-2">
              Modo mobile detectado - verifique sua conexão
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery Display */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer">
          <div 
            className="w-full h-full transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            onClick={() => openLightbox(currentImageIndex)}
          >
            <ResponsiveGalleryImage
              localUrls={[allImages[currentImageIndex]?.image_url].filter(url => url?.startsWith('/images/'))}
              externalUrls={[allImages[currentImageIndex]?.image_url].filter(url => url && !url.startsWith('/images/'))}
              alt={allImages[currentImageIndex]?.caption || `${modelName} - Photo ${currentImageIndex + 1}`}
              className="object-[center_15%]"
            />
          </div>
          
          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>

          {/* Navigation arrows - only show if more than 1 image */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </span>
            </div>
          )}
        </div>


        {/* Thumbnail Gallery - only show if more than 1 image */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:border-accent/50 ${
                  index === currentImageIndex 
                    ? 'border-accent shadow-md' 
                    : 'border-border'
                }`}
              >
                <ResponsiveGalleryImage
                  localUrls={[image.image_url].filter(url => url?.startsWith('/images/'))}
                  externalUrls={[image.image_url].filter(url => url && !url.startsWith('/images/'))}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-[center_25%]"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Caption */}
        {allImages[currentImageIndex]?.caption && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground italic">
              {allImages[currentImageIndex].caption}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Main lightbox image */}
          <div className="relative max-w-4xl max-h-full">
            <ResponsiveGalleryImage
              localUrls={[allImages[currentImageIndex]?.image_url].filter(url => url?.startsWith('/images/'))}
              externalUrls={[allImages[currentImageIndex]?.image_url].filter(url => url && !url.startsWith('/images/'))}
              alt={allImages[currentImageIndex]?.caption || `${modelName} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              loading="eager"
            />
            
            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="text-white text-center">
                <p className="text-lg font-medium">{modelName}</p>
                {allImages[currentImageIndex]?.caption && (
                  <p className="text-sm opacity-90 mt-1">
                    {allImages[currentImageIndex].caption}
                  </p>
                )}
                <p className="text-xs opacity-75 mt-2">
                  {currentImageIndex + 1} of {allImages.length}
                </p>
              </div>
            </div>
          </div>

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeLightbox}
            aria-label="Close lightbox"
          />
        </div>
      )}
    </>
  );
};