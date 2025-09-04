import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { models } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  MessageCircle, 
  Phone,
  Globe,
  User,
  Ruler,
  Eye,
  GraduationCap
} from 'lucide-react';
import { SEO } from '@/components/SEO';

export const ModelProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const model = models.find(m => m.id === id);

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Model Not Found</h1>
        <p className="text-muted-foreground mb-6">The model you're looking for doesn't exist.</p>
        <Link to="/models">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
        </Link>
      </div>
    );
  }

  const getAvailabilityColor = (availability: typeof model.availability) => {
    switch (availability) {
      case 'available':
        return 'text-emerald-500';
      case 'busy':
        return 'text-amber-500';
      case 'unavailable':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getAvailabilityText = (availability: typeof model.availability) => {
    switch (availability) {
      case 'available':
        return 'Available Now';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <SEO 
        title={`${model.name} - Luxury Escort in ${model.location}`}
        description={`Meet ${model.name}, an elegant ${model.age}-year-old companion in ${model.location}. ${model.description}`}
        keywords={`${model.name}, luxury escort, ${model.location}, companion, ${model.nationality}`}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/models">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="overflow-hidden">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full aspect-[3/4] object-cover"
                />
              </Card>
              
              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button className="w-full" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="ghost" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Favorites
                </Button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">{model.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{model.age} years old</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {model.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary mb-1">{model.price}</div>
                  <div className={`flex items-center gap-1 ${getAvailabilityColor(model.availability)}`}>
                    <Clock className="h-4 w-4" />
                    {getAvailabilityText(model.availability)}
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="text-lg font-semibold">{model.rating}</span>
                </div>
                <span className="text-muted-foreground">({model.reviews} reviews)</span>
              </div>
              
              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {model.description}
              </p>
            </div>

            <Separator />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Physical Details */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Physical Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height:</span>
                    <span>{model.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Measurements:</span>
                    <span>{model.measurements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hair:</span>
                    <span>{model.hair}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Eyes:</span>
                    <span>{model.eyes}</span>
                  </div>
                </div>
              </Card>

              {/* Personal Details */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Personal Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nationality:</span>
                    <span>{model.nationality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Education:</span>
                    <span>{model.education}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Languages:</span>
                    <span>{model.languages.join(', ')}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Services */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {model.services.map((service) => (
                  <Badge key={service} variant="secondary" className="text-sm">
                    {service}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Interests */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Interests & Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {model.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="text-sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-semibold mb-4">Book {model.name}</h3>
              <p className="text-muted-foreground mb-4">
                To arrange a meeting with {model.name}, please contact us through one of the methods below. 
                All arrangements are handled with complete discretion and professionalism.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};