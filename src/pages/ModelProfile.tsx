import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { models } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const ModelProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const model = models.find(m => m.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!model) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-8">
            <h1 className="heading-lg text-foreground">Model Not Found</h1>
            <p className="body-minimal text-muted-foreground">The model you're looking for doesn't exist.</p>
            <Link to="/models">
              <Button className="five-london-button-outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gallery
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Create gallery with all available images
  const galleryImages = [model.image, ...(model.gallery || [])];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const getAvailabilityColor = (availability: typeof model.availability) => {
    switch (availability) {
      case 'available':
        return 'text-emerald-500';
      case 'busy':
        return 'text-amber-500';
      case 'unavailable':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
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
      
      <Navigation />
      
      {/* Back Button */}
      <div className="fixed top-20 left-4 z-50">
        <Link to="/models">
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Main Gallery Section */}
      <section className="min-h-screen bg-background">
        {/* Hero Image Gallery */}
        <div className="relative h-screen w-full">
          <img
            src={galleryImages[currentImageIndex]}
            alt={`${model.name} - Photo ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm">
                {currentImageIndex + 1} / {galleryImages.length}
              </span>
            </div>
          )}

          {/* Model Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-white space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(model.availability)}`} />
                  <span className="text-sm opacity-90">{getAvailabilityText(model.availability)}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-light tracking-wide">{model.name}</h1>
                <div className="flex items-center gap-4 text-lg opacity-90">
                  <span>{model.age} years</span>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {model.location}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{model.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {galleryImages.length > 1 && (
          <div className="bg-background border-t border-border">
            <div className="max-w-4xl mx-auto p-4">
              <div className="flex gap-2 overflow-x-auto">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Model Details */}
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
          {/* About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-light">About {model.name}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {model.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-border">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Price</div>
              <div className="font-medium text-accent">{model.price}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Height</div>
              <div className="font-medium">{model.height}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Hair</div>
              <div className="font-medium">{model.hair}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Eyes</div>
              <div className="font-medium">{model.eyes}</div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-xl font-light">Services</h3>
            <div className="flex flex-wrap gap-2">
              {model.services.map((service) => (
                <Badge key={service} variant="secondary" className="font-light">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-xl font-light">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {model.languages.map((language) => (
                <Badge key={language} variant="outline" className="font-light">
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="pt-8 space-y-4">
            <h3 className="text-xl font-light">Book {model.name}</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="five-london-button flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};