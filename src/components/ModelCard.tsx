import React, { useState } from 'react';
import { Model } from '@/hooks/useModels';
import { Link } from 'react-router-dom';
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
      <Link to={`/models/${model.id}`} className="block group">
        <div className="card-luxury hover-lift overflow-hidden relative">
          {/* Image Container */}
          <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[1/1] xl:aspect-[4/5] overflow-hidden bg-muted">
            {!imageError ? (
              <>
                {/* Main Image */}
                <img
                  src={model.image}
                  alt={`${model.name} - Sophisticated companion in ${model.location}`}
                  className={`w-full h-full object-cover transition-all duration-700 absolute inset-0 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  } group-hover:opacity-0`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
                
                {/* Second Image (from gallery) */}
                {model.gallery && model.gallery[1] && (
                  <img
                    src={model.gallery[1]}
                    alt={`${model.name} - alternate view`}
                    className="w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100"
                    loading="lazy"
                  />
                )}
                
                {/* Price - Top Left - Discreet */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-light">
                    {model.price}
                  </div>
                </div>

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-[1]"></div>
                
                {/* Minimal Info - Bottom Left - Animates on Scroll */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 z-10">
                  <div className={`text-white transform transition-transform duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`} style={{ transitionDelay: `${index * 0.1}s` }}>
                    <h3 className="text-sm sm:text-base md:text-lg font-light mb-1">
                      {model.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80">
                      {model.location}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-3 bg-background rounded-full flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <p className="font-body text-sm">{model.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};