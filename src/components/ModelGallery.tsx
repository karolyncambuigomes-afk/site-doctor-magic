import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
    try {
      console.log('🖼️ SITE GALERIA: Carregando imagens para modelId:', modelId);
      
      // Get current user info to determine what images they can see
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', modelId)
        .order('order_index', { ascending: true });

      // Filter images based on user access level
      if (!user) {
        // Not logged in - only public images
        query = query.eq('visibility', 'public');
        console.log('🖼️ SITE GALERIA: Usuário não logado - apenas imagens públicas');
      } else {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

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

          if (subscription) {
            // Member can see public and members_only images
            query = query.in('visibility', ['public', 'members_only']);
            console.log('🖼️ SITE GALERIA: Membro - pode ver imagens públicas e exclusivas');
          } else {
            // Regular user - only public images
            query = query.eq('visibility', 'public');
            console.log('🖼️ SITE GALERIA: Usuário comum - apenas imagens públicas');
          }
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('🖼️ SITE GALERIA: Erro ao carregar:', error);
        throw error;
      }

      console.log('🖼️ SITE GALERIA: Imagens carregadas após filtro:', data);
      console.log('🖼️ SITE GALERIA: Número de imagens visíveis:', data?.length || 0);
      setGalleryImages(data || []);
      
      // Force re-render after setting gallery images
      console.log('🖼️ SITE GALERIA: Estado atualizado, forçando re-render');
    } catch (error) {
      console.error('Error loading gallery images:', error);
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

  // Check if there are exclusive images for members
  const [totalImages, setTotalImages] = useState(0);
  const [hasExclusiveImages, setHasExclusiveImages] = useState(false);

  useEffect(() => {
    const checkExclusiveImages = async () => {
      try {
        // Get total number of images for this model
        const { data: allImagesData } = await supabase
          .from('model_gallery')
          .select('visibility')
          .eq('model_id', modelId);

        if (allImagesData) {
          setTotalImages(allImagesData.length);
          const exclusiveCount = allImagesData.filter(img => 
            img.visibility === 'members_only' || img.visibility === 'admin_only'
          ).length;
          setHasExclusiveImages(exclusiveCount > 0);
        }
      } catch (error) {
        console.error('Error checking exclusive images:', error);
      }
    };

    checkExclusiveImages();
  }, [modelId, galleryImages]);

  console.log('🖼️ SITE GALERIA: allImages após processamento:', allImages);
  console.log('🖼️ SITE GALERIA: galleryImages.length:', galleryImages.length);

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

  return (
    <>
      {/* Main Gallery Display */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer">
          <img
            src={allImages[currentImageIndex]?.image_url}
            alt={allImages[currentImageIndex]?.caption || `${modelName} - Photo ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

        {/* Exclusive Images Notification */}
        {hasExclusiveImages && totalImages > galleryImages.length && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-amber-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">
                {totalImages - galleryImages.length} fotos exclusivas disponíveis para membros
              </span>
            </div>
            <p className="text-amber-700 text-sm mt-1">
              Torne-se um membro premium para ver todas as fotos desta modelo
            </p>
          </div>
        )}

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
                  className="w-full h-full object-cover"
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