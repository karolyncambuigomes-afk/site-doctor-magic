import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileGalleryOptimizer } from '@/hooks/useMobileGalleryOptimizer';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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
}

export const ModelGallery: React.FC<ModelGalleryProps> = ({ 
  modelId, 
  mainImage, 
  modelName 
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
    console.log(`📱 MODEL GALLERY DEBUG [${isMobile ? 'MOBILE' : 'DESKTOP'}]: Carregando galeria pública para modelo ${modelId}`);
    
    try {
      setLoading(true);
      setLoadingError(null);
      
      // Get model info to check access configuration
      const { data: modelData } = await supabase
        .from('models')
        .select('members_only, all_photos_public')
        .eq('id', modelId)
        .single();

      console.log(`📱 MODEL GALLERY DEBUG: Configuração do modelo:`, modelData);
      
      // Get current user info to determine what images they can see
      const { data: { user } } = await supabase.auth.getUser();
      console.log(`📱 MODEL GALLERY DEBUG: Usuário:`, user ? 'logado' : 'não logado', user?.email);
      
      let query = supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', modelId)
        .order('order_index', { ascending: true });

      // Filter images based on model configuration and user access level
      if (modelData?.all_photos_public) {
        // All photos are public - everyone can see all images
        console.log('🖼️ SITE GALERIA: Todas as fotos são públicas - todos podem ver');
        // No filter needed - show all images
      } else if (modelData?.members_only) {
        // Members only model
        if (!user) {
          // Not logged in - no images
          query = query.eq('visibility', 'members_only'); // This will return empty for non-members
          console.log('🖼️ SITE GALERIA: Modelo exclusivo - usuário não logado, sem imagens');
        } else {
          // Check if user is admin or has subscription
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          console.log('🖼️ SITE GALERIA: Profile do usuário:', profile);

          if (profile?.role === 'admin') {
            // Admin can see all images
            console.log('🖼️ SITE GALERIA: Admin - pode ver todas as imagens');
          } else {
            // Check if user has subscription (is a member)
            const { data: subscription } = await supabase
              .from('user_subscriptions')
              .select('active')
              .eq('user_id', user.id)
              .eq('active', true)
              .maybeSingle();

            console.log('🖼️ SITE GALERIA: Subscription do usuário:', subscription);

            if (subscription) {
              // Member can see all images of members-only model
              console.log('🖼️ SITE GALERIA: Membro - pode ver todas as imagens do modelo exclusivo');
            } else {
              // Regular user - no images for members-only model
              query = query.eq('visibility', 'members_only_no_access'); // This will return empty
              console.log('🖼️ SITE GALERIA: Usuário comum - sem acesso ao modelo exclusivo');
            }
          }
        }
      } else {
        // Mixed access model - filter by individual photo visibility
        if (!user) {
          // Not logged in - only public images
          query = query.eq('visibility', 'public');
          console.log('🖼️ SITE GALERIA: Modelo misto - usuário não logado, apenas imagens públicas');
        } else {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          console.log('🖼️ SITE GALERIA: Profile do usuário:', profile);

          if (profile?.role === 'admin') {
            // Admin can see all images
            console.log('🖼️ SITE GALERIA: Admin - pode ver todas as imagens');
          } else {
            // Check if user has subscription (is a member)
            const { data: subscription } = await supabase
              .from('user_subscriptions')
              .select('active')
              .eq('user_id', user.id)
              .eq('active', true)
              .maybeSingle();

            console.log('🖼️ SITE GALERIA: Subscription do usuário:', subscription);

            if (subscription) {
              // Member can see ONLY members_only images (not public ones)
              query = query.eq('visibility', 'members_only');
              console.log('🖼️ SITE GALERIA: Membro - pode ver apenas imagens exclusivas para membros');
            } else {
              // Regular user - only public images
              query = query.eq('visibility', 'public');
              console.log('🖼️ SITE GALERIA: Usuário comum - apenas imagens públicas');
            }
          }
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error(`📱 MODEL GALLERY DEBUG: Erro na query Supabase:`, error);
        throw error;
      }

      const loadTime = performance.now() - startTime;
      console.log(`📱 MODEL GALLERY DEBUG: Galeria carregada em ${loadTime.toFixed(2)}ms`);
      console.log(`📱 MODEL GALLERY DEBUG: ${data?.length || 0} imagens visíveis encontradas`);
      
      // Track performance metrics
      trackPerformance(startTime, data?.length || 0);
      
      if (isMobile && loadTime > 2000) {
        console.warn(`📱 MODEL GALLERY DEBUG: Carregamento lento detectado (${loadTime.toFixed(2)}ms) - otimização necessária`);
      }
      
      if (data && data.length > 0) {
        console.log(`📱 MODEL GALLERY DEBUG: Visibilidades:`, data.map(img => ({ order: img.order_index, visibility: img.visibility })));
      }
      
      setGalleryImages(data || []);
      console.log(`📱 MODEL GALLERY DEBUG: Estado atualizado, forçando re-render`);
    } catch (error) {
      console.error(`📱 MODEL GALLERY DEBUG: Erro ao carregar galeria:`, error);
      setLoadingError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Use only gallery images, first one is the main image
  const allImages = galleryImages.length > 0 ? galleryImages : [
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
          <img
            src={allImages[currentImageIndex]?.image_url}
            alt={allImages[currentImageIndex]?.caption || `${modelName} - Photo ${currentImageIndex + 1}`}
            className="w-full h-full object-cover object-[center_15%] transition-transform duration-300 group-hover:scale-105"
            onClick={() => openLightbox(currentImageIndex)}
          />
          
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
                <img
                  src={image.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover object-[center_25%]"
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
            <img
              src={allImages[currentImageIndex]?.image_url}
              alt={allImages[currentImageIndex]?.caption || `${modelName} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
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