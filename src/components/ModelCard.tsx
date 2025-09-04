import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { Model } from '@/data/models';
import { Link } from 'react-router-dom';

interface ModelCardProps {
  model: Model;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const [isFavorite, setIsFavorite] = useState(false);
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
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-luxury border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="relative overflow-hidden">
        <div className={`aspect-[3/4] bg-muted animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
        <img
          src={model.image}
          alt={model.name}
          className={`aspect-[3/4] w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'block' : 'hidden'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Availability Indicator */}
        <div className="absolute top-4 left-4">
          <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(model.availability)} animate-pulse`} />
        </div>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 bg-background/20 backdrop-blur-sm hover:bg-background/40"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </Button>
        
        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-sm font-medium">{model.rating}</span>
          <span className="text-xs text-muted-foreground">({model.reviews})</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{model.name}</h3>
            <p className="text-sm text-muted-foreground">{model.age} years old</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{model.price}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{model.location}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {model.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {model.services.slice(0, 2).map((service) => (
            <Badge key={service} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
          {model.services.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{model.services.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link to={`/models/${model.id}`} className="w-full">
          <Button className="w-full">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};