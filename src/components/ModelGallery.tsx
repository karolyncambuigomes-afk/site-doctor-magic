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

  const loadGalleryImages = async () => {
    try {
      console.log('🖼️ SITE GALERIA: Carregando imagens para modelId:', modelId);
      
      const { data, error } = await supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', modelId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('🖼️ SITE GALERIA: Erro ao carregar:', error);
        throw error;
      }

      console.log('🖼️ SITE GALERIA: Imagens carregadas:', data);
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine main image with gallery images
  const allImages = [
    { 
      id: 'main', 
      image_url: mainImage, 
      caption: `${modelName} - Principal`,
      order_index: -1 
    },
    ...galleryImages
  ];

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