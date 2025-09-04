import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';
import { Model } from '@/data/models';
import { Link } from 'react-router-dom';

interface ModelCardProps {
  model: Model;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getAvailabilityColor = (availability: Model['availability']) => {
    switch (availability) {
      case 'available':
        return 'bg-emerald-500';
      case 'busy':
        return 'bg-amber-500';
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="minimal-card overflow-hidden transition-all duration-200 hover:shadow-elegant">
      <div className="relative overflow-hidden">
        <div className={`aspect-[3/4] bg-muted ${imageLoaded ? 'hidden' : 'block'}`} />
        <img
          src={model.image}
          alt={model.name}
          className={`aspect-[3/4] w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'block' : 'hidden'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Availability Indicator */}
        <div className="absolute top-4 left-4">
          <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(model.availability)}`} />
        </div>
        
        {/* Price */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-xs font-medium">{model.price}</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-foreground">{model.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{model.age} years</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{model.location}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {model.description}
          </p>
          
          <div className="flex items-center gap-2">
            <Star className="h-3 w-3 fill-foreground text-foreground" />
            <span className="text-sm font-medium">{model.rating}</span>
            <span className="text-xs text-muted-foreground">({model.reviews})</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link to={`/models/${model.id}`} className="w-full">
          <Button className="minimal-button-outline w-full">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};