import React from 'react';
import { Model } from '@/data/models';
import { Link } from 'react-router-dom';

interface ModelCardProps {
  model: Model;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {

  const getAvailabilityColor = (availability: Model['availability']) => {
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
    <Link to={`/models/${model.id}`} className="model-card block">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={model.image}
          alt={`${model.name} - Luxury Escort in ${model.location}`}
          className="model-card-image"
          loading="lazy"
        />
        
        {/* Availability Indicator */}
        <div className="absolute top-6 left-6">
          <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(model.availability)}`} />
        </div>
        
        {/* Overlay Content */}
        <div className="model-card-overlay" />
        <div className="model-card-content">
          <div className="space-y-3">
            <div>
              <h3 className="heading-sm text-white mb-2">{model.name}</h3>
              <p className="caption text-white/80">
                {model.age} • {model.location}
              </p>
            </div>
            
            <div className="w-12 h-px bg-white/30"></div>
            
            <p className="body-sm text-white/90 line-clamp-2">
              {model.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};