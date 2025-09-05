import React, { useState } from 'react';
import { Model } from '@/data/models';
import { AnonymizedModel } from '@/utils/dataAnonymizer';
import { DisplayModel } from '@/hooks/useModels';
import { Link } from 'react-router-dom';

interface ModelCardProps {
  model: DisplayModel;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-accent';
      case 'busy':
        return 'bg-muted-foreground';
      case 'unavailable':
        return 'bg-border';
      default:
        return 'bg-border';
    }
  };

  return (
    <Link to={`/models/${model.id}`} className="model-card block group">
      <div className="relative overflow-hidden aspect-[3/4] bg-muted rounded-sm transition-all duration-300 group-hover:shadow-lg">
        {!imageError ? (
          <img
            src={model.image}
            alt={`${model.name} - Luxury Escort in ${model.location}`}
            className={`model-card-image transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <div className="text-2xl mb-2">👤</div>
              <div className="text-sm">{model.name}</div>
            </div>
          </div>
        )}
        
        {/* Availability Indicator */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getAvailabilityColor(model.availability)}`} />
        </div>
        
        {/* Overlay Content - Responsivo */}
        <>
          <div className="model-card-overlay" />
          <div className="model-card-content px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
            <div className="space-y-1 sm:space-y-2 lg:space-y-3">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-light text-white mb-1">{model.name}</h3>
                <p className="text-xs sm:text-sm text-white/80">
                  {'age' in model && model.age ? `${model.age} • ` : ''}{model.location}
                </p>
              </div>
              
              <div className="w-8 sm:w-10 lg:w-12 h-px bg-white/30"></div>
              
              <p className="text-xs sm:text-sm text-white/90 line-clamp-2 leading-relaxed">
                {model.description}
              </p>
            </div>
          </div>
        </>
      </div>
    </Link>
  );
};