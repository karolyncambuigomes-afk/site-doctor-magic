import React, { useState } from 'react';
import { Model } from '@/hooks/useModels';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

interface ModelCardProps {
  model: Model;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    <Link to={`/models/${model.id}`} className="block group">
      <div className="card-luxury hover-lift overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {!imageError ? (
            <>
              <img
                src={model.image}
                alt={`${model.name} - Sophisticated companion in ${model.location}`}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
              {/* Elegant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
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
          
          {/* Status Indicator */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className={`w-2 h-2 rounded-full ${status.color} ${status.pulse ? 'animate-pulse' : ''}`}></div>
              <span className="text-white text-xs font-medium">{status.text}</span>
            </div>
          </div>

          {/* Rating Badge */}
          {model.rating && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center space-x-1 bg-accent/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Star className="w-3 h-3 text-accent-foreground fill-current" />
                <span className="text-xs font-medium text-accent-foreground">{model.rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-medium text-foreground group-hover:text-accent transition-colors duration-300">
                {model.name}
              </h3>
              {model.age && (
                <span className="text-sm text-muted-foreground font-body">
                  {model.age}
                </span>
              )}
            </div>

            {/* Location */}
            {model.location && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-body">{model.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {model.description && (
            <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-3">
              {model.description}
            </p>
          )}

          {/* Characteristics */}
          {model.characteristics && model.characteristics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {model.characteristics.slice(0, 3).map((char, index) => (
                <span 
                  key={index}
                  className="px-2.5 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full font-body"
                >
                  {char}
                </span>
              ))}
              {model.characteristics.length > 3 && (
                <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs rounded-full font-body">
                  +{model.characteristics.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {model.price && (
              <div className="text-sm font-medium text-foreground">
                From {model.price}
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};