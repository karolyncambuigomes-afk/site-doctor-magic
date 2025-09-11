import React, { useState, useMemo } from 'react';
import { Model } from '@/hooks/useModels';
import { SafeLink } from '@/components/ui/safe-link';
import { Star, Clock, MapPin, Crown } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useImagePreference } from '@/hooks/useImagePreference';
import { EnhancedImage } from '@/components/EnhancedImage';
import { useAuth } from '@/components/AuthProvider';
interface ModelCardProps {
  model: Model;
  index?: number;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, isVisible } = useScrollAnimation(0.2);
  const { preferLocalImages } = useImagePreference();
  const { hasAccess } = useAuth() || {};

  // Enhanced image selection with robust fallback (respect area visibility)
  const imageConfig = useMemo(() => {
    const gallerySorted = Array.isArray(model.gallery)
      ? [...model.gallery].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      : [];

    const membersImages = gallerySorted.filter(img => img.visibility === 'members_only');
    const publicImages = gallerySorted.filter(img => img.visibility === 'public' || !img.visibility);

    // In members area (hasAccess), use only members images if they exist; otherwise fall back to public
    const subset = hasAccess && membersImages.length > 0 ? membersImages : publicImages;

    const primaryUrl = subset[0]?.image_url || model.image || null;

    return {
      local: null, // Temporarily disable local images
      external: primaryUrl,
      placeholder: '/images/placeholders/model.jpg'
    };
  }, [model.gallery, model.image, hasAccess]);

  // Secondary image for hover effect
  const secondaryImage = useMemo(() => {
    if (model.gallery && Array.isArray(model.gallery)) {
      const gallerySorted = [...model.gallery].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      const membersImages = gallerySorted.filter(img => img.visibility === 'members_only');
      const publicImages = gallerySorted.filter(img => img.visibility === 'public' || !img.visibility);
      const subset = hasAccess && membersImages.length > 0 ? membersImages : publicImages;

      const primarySrc = imageConfig.external;
      const secondSrc = subset[1]?.image_url;
      return secondSrc && secondSrc !== primarySrc ? secondSrc : null;
    }
    return null;
  }, [model.gallery, imageConfig.external, hasAccess]);

  const getAvailabilityStatus = (availability: Model['availability']) => {
    switch (availability) {
      case 'available':
        return { color: 'bg-green-400', text: 'Available', pulse: true };
      case 'busy':
        return { color: 'bg-amber-400', text: 'Limited', pulse: false };
      case 'unavailable':
        return { color: 'bg-red-400', text: 'Unavailable', pulse: false };
      default:
        return { color: 'bg-gray-400', text: 'Unknown', pulse: false };
    }
  };

  const status = getAvailabilityStatus(model.availability);

  return (
    <div ref={ref} style={{ animationDelay: `${index * 0.1}s` }}>
      <SafeLink to={model?.id ? `/models/${model.id}` : undefined} className="block group">
        <div className="hover-lift overflow-hidden relative bg-card shadow-luxury rounded-lg transition-luxury hover:shadow-elegant">
          {/* Image Container */}
          <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[1/1] xl:aspect-[4/5] overflow-hidden bg-muted">
            {/* Exclusive Members Badge */}
            {model.members_only && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
                <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg border border-yellow-400/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Crown size={14} className="fill-current text-yellow-100" />
                    <span className="text-xs sm:text-sm font-semibold tracking-wide">
                      <span className="hidden sm:inline">EXCLUSIVE</span>
                      <span className="sm:hidden">VIP</span>
                    </span>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
            
            {imageConfig.local || imageConfig.external ? (
              <>
                {/* Main Image */}
                <EnhancedImage
                  local={imageConfig.local}
                  external={imageConfig.external}
                  placeholder={imageConfig.placeholder}
                  alt={`${model.name} - Sophisticated companion in ${model.location}`}
                  className={`w-full h-full transition-all duration-700 ${
                    secondaryImage ? 'group-hover:opacity-0 absolute inset-0' : 'group-hover:scale-105'
                  }`}
                  data-model-image="true"
                  data-model-name={model.name}
                />
                
                {/* Second Image (from gallery) - only if available */}
                {secondaryImage && (
                  <EnhancedImage
                    external={secondaryImage}
                    alt={`${model.name} - alternate view`}
                    className="w-full h-full transition-all duration-700 opacity-0 group-hover:opacity-100"
                    data-model-image="true"
                    data-model-name={`${model.name}-secondary`}
                  />
                )}
                
                {/* Price - Top Left */}
                {model.price && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-white/10">
                      <span className="text-white text-xs sm:text-sm font-medium">
                        {model.price}
                      </span>
                    </div>
                  </div>
                )}


                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-[1]"></div>
                
                {/* Info overlay that appears on hover - with age below name */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                  <div className="space-y-1.5">
                     <h3 className="luxury-heading-sm tracking-normal text-white">
                       {model.name}
                     </h3>
                     {model.age && (
                       <p className="luxury-body-sm text-white tracking-normal">
                         {model.age} anos
                       </p>
                     )}
                     {model.characteristics?.[0] && (
                       <div className="flex justify-start">
                         <span className="luxury-body-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm text-white">
                           {model.characteristics[0]}
                         </span>
                       </div>
                     )}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                   <div className="w-16 h-16 mx-auto mb-3 bg-background rounded-full flex items-center justify-center">
                     <span className="text-2xl">✨</span>
                   </div>
                   <p className="luxury-body-sm">{model.name}</p>
                   <div className="text-xs mt-1 opacity-70">Imagem não disponível</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SafeLink>
    </div>
  );
};