import React, { useState } from 'react';
import { Model } from '@/hooks/useModels';
import { SafeLink } from '@/components/ui/safe-link';
import { Star, Clock, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface ModelCardProps {
  model: Model;
  index?: number;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, isVisible } = useScrollAnimation(0.2);

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
            {!imageError ? (
              <>
                {/* Main Image */}
                <img
                  src={model.image}
                  alt={`${model.name} - Sophisticated companion in ${model.location}`}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  } ${
                    model.gallery && model.gallery.length > 1 ? 'group-hover:opacity-0 absolute inset-0' : 'group-hover:scale-105'
                  } ${
                    model.face_visible === false ? 'object-[center_20%]' : 'object-center'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
                
                {/* Second Image (from gallery) - only if available */}
                {model.gallery && model.gallery.length > 1 && (
                  <img
                    src={model.gallery[0]}
                    alt={`${model.name} - alternate view`}
                    className="w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100"
                    loading="lazy"
                  />
                )}
                
                {/* Price - Top Left - Mobile responsive */}
                {model.price && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-10">
                    <div className="bg-black/60 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded text-white text-xs sm:text-sm font-light">
                      {model.price}
                    </div>
                  </div>
                )}


                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-[1]"></div>
                
                {/* Info overlay that appears on hover - like homepage */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                  <div className="space-y-1.5">
                     <h3 className="luxury-heading-sm tracking-normal">
                       {model.name}
                     </h3>
                    <div className="flex items-center justify-between">
                      <p className="luxury-body-sm text-white/90 tracking-normal">
                        {model.age ? `${model.age} anos` : ''}
                      </p>
                      {model.characteristics?.[0] && (
                        <span className="luxury-body-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                          {model.characteristics[0]}
                        </span>
                      )}
                    </div>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </SafeLink>
    </div>
  );
};