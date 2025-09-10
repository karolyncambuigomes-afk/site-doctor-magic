import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, AlertCircle, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileGalleryOptimizer } from '@/hooks/useMobileGalleryOptimizer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ResponsiveGalleryImage } from '@/components/ResponsiveGalleryImage';
import { useAuth } from '@/components/AuthProvider';

interface ModelGalleryResponsiveProps {
  modelId: string;
  mainImage: string;
  modelName: string;
  membersOnly?: boolean;
  allPhotosPublic?: boolean;
  faceVisible?: boolean;
}

export const ModelGalleryResponsive: React.FC<ModelGalleryResponsiveProps> = ({ 
  modelId, 
  mainImage, 
  modelName,
  membersOnly = false,
  allPhotosPublic = true,
  faceVisible = true
}) => {
  const isMobile = useIsMobile();
  const { hasAccess, isAdmin } = useAuth();
  const { 
    optimizations, 
    trackPerformance, 
    getOptimizedImageUrl, 
    getOptimizedClasses 
  } = useMobileGalleryOptimizer();
  
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    loadGalleryImages();
  }, [modelId]);

  useEffect(() => {
    const handleGalleryUpdate = () => {
      console.log('🖼️ RESPONSIVE GALERIA: Atualização recebida');
      loadGalleryImages();
    };

    window.addEventListener('galleryUpdated', handleGalleryUpdate);
    return () => window.removeEventListener('galleryUpdated', handleGalleryUpdate);
  }, []);

  const loadGalleryImages = async () => {
    const startTime = performance.now();
    console.log(`📱 RESPONSIVE GALLERY: Carregando para modelo ${modelId}`);
    
    try {
      setLoading(true);
      setLoadingError(null);
      
      // Get model data with gallery arrays and access settings
      const { data: modelData, error } = await supabase
        .from('models')
        .select('gallery_external_urls, gallery_local_urls, members_only, all_photos_public, face_visible')
        .eq('id', modelId)
        .single();

      if (error) throw error;

      // Create effective gallery list: prioritize local, fallback to external
      const externalUrls = modelData?.gallery_external_urls || [];
      const localUrls = modelData?.gallery_local_urls || [];
      
      // Build effective image list with local priority
      const effectiveImages: string[] = [];
      const maxLength = Math.max(localUrls.length, externalUrls.length);
      
      for (let i = 0; i < maxLength; i++) {
        if (localUrls[i]) {
          effectiveImages.push(localUrls[i]);
        } else if (externalUrls[i]) {
          effectiveImages.push(externalUrls[i]);
        }
      }

      // Apply access control: limit images for non-members
      const modelMembersOnly = modelData?.members_only || membersOnly;
      const modelAllPhotosPublic = modelData?.all_photos_public ?? allPhotosPublic;
      
      // If user doesn't have access and photos are restricted, limit to first 2-3 images
      if (!hasAccess && !isAdmin && (modelMembersOnly || !modelAllPhotosPublic)) {
        effectiveImages.splice(3); // Keep only first 3 images
        console.log(`🔒 ACESSO LIMITADO: Mostrando apenas ${effectiveImages.length} fotos para não-membros`);
      }

      const loadTime = performance.now() - startTime;
      console.log(`📱 RESPONSIVE GALLERY: ${effectiveImages.length} imagens em ${loadTime.toFixed(2)}ms`);
      
      trackPerformance(startTime, effectiveImages.length);
      
      setGalleryImages(effectiveImages);
    } catch (error) {
      console.error('📱 RESPONSIVE GALLERY: Erro:', error);
      setLoadingError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const allImages = galleryImages.length > 0 ? galleryImages : [mainImage];

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
              <span>Carregando galeria...</span>
            </div>
          </div>
        )}
        <div className="animate-pulse">
          <div className="aspect-[3/4] bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Erro ao carregar galeria</span>
        </div>
        <p className="text-sm text-red-600 mt-1">{loadingError}</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery Display */}
      <div className="space-y-4">
        {/* Main Image with ResponsiveGalleryImage */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer">
          <ResponsiveGalleryImage
            localUrls={[allImages[currentImageIndex]]}
            externalUrls={allImages[currentImageIndex] ? [] : [mainImage]}
            alt={`${modelName} - Foto ${currentImageIndex + 1}`}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="eager"
            onLoad={() => console.log('🖼️ Imagem principal carregada')}
            onError={() => console.error('🖼️ Erro na imagem principal')}
          />
          
          {/* Zoom indicator */}
          <div 
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openLightbox(currentImageIndex)}
          >
            <ZoomIn className="w-4 h-4 text-white" />
          </div>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
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

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:border-accent/50 ${
                  index === currentImageIndex 
                    ? 'border-accent shadow-md' 
                    : 'border-border'
                }`}
              >
                <ResponsiveGalleryImage
                  localUrls={[imageUrl]}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full"
                  loading="lazy"
                  membersOnly={membersOnly}
                  allPhotosPublic={allPhotosPublic}
                  faceVisible={faceVisible}
                />
              </button>
            ))}
          </div>
        )}

        {/* Access Control Message */}
        {!hasAccess && !isAdmin && (membersOnly || !allPhotosPublic) && (
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-accent mb-2">
              <Lock className="w-5 h-5" />
              <span className="font-medium">Mais fotos disponíveis para membros</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Faça login para ver todas as {galleryImages.length} fotos desta modelo
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <div className="relative max-w-4xl max-h-full">
            <ResponsiveGalleryImage
              localUrls={[allImages[currentImageIndex]]}
              alt={`${modelName} - Foto ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              loading="eager"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="text-white text-center">
                <p className="text-lg font-medium">{modelName}</p>
                <p className="text-xs opacity-75 mt-2">
                  {currentImageIndex + 1} of {allImages.length}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeLightbox}
          />
        </div>
      )}
    </>
  );
};