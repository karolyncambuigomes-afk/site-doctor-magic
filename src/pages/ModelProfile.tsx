import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useModels } from '@/hooks/useModels';
import { characteristics } from '@/data/characteristics';
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
  const { getModelById, models, loading, error } = useModels();
  const model = id ? getModelById(id) : null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top when model changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading companion profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-light mb-4">Unable to load profile</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link to="/models" className="text-primary hover:underline">
              ← Back to companions
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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

      {/* Main Gallery Section */}
      <section className="min-h-screen bg-background pt-16 md:pt-20">
        {/* Hero Image Gallery */}
        <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full md:w-auto md:max-w-md lg:max-w-lg mx-auto md:rounded-lg overflow-hidden md:aspect-[3/4]">
          <img
            src={galleryImages[currentImageIndex]}
            alt={`${model.name} - Photo ${currentImageIndex + 1}`}
            className="w-full h-full object-cover md:rounded-lg"
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
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Model Header */}
          <div className="text-center space-y-4 pb-8 mb-8 border-b border-border">
            <h1 className="text-3xl md:text-4xl font-light tracking-wide text-foreground">{model.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-base text-muted-foreground">
              <span className="font-medium">{model.age} years</span>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{model.location}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                className="text-sm px-6 py-2 hover:bg-accent hover:text-accent-foreground transition-luxury"
                onClick={() => {
                  const bookSection = document.querySelector('#book-section');
                  bookSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Now
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-xl font-light text-foreground mb-4">About {model.name}</h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {model.description}
            </p>
          </div>

          {/* Pricing Section - Only show for premium users with pricing data */}
          {model.pricing && (
            <div className="mb-8">
              <h3 className="text-lg font-light text-foreground mb-4">Pricing</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">1 Hora</div>
                  <div className="text-lg font-semibold text-accent">{model.pricing.oneHour}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">2 Horas</div>
                  <div className="text-lg font-semibold text-accent">{model.pricing.twoHours}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">3 Horas</div>
                  <div className="text-lg font-semibold text-accent">{model.pricing.threeHours}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Hora Adicional</div>
                  <div className="text-lg font-semibold text-accent">{model.pricing.additionalHour}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info Cards - Only show if data is available */}
          {(model.height || model.hair || model.eyes) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {model.height && (
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Height</div>
                  <div className="text-lg font-semibold text-foreground">{model.height}</div>
                </div>
              )}
              {model.hair && (
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Hair</div>
                  <div className="text-lg font-semibold text-foreground">{model.hair}</div>
                </div>
              )}
              {model.eyes && (
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Eyes</div>
                  <div className="text-lg font-semibold text-foreground">{model.eyes}</div>
                </div>
              )}
            </div>
          )}


          {/* Characteristics Section - Only show if data exists */}
          {model.characteristics && model.characteristics.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-light text-foreground mb-4">Características</h3>
              <div className="flex flex-wrap gap-2">
                {model.characteristics.map((characteristic) => {
                  // Find the corresponding characteristic object to get the slug
                  const characteristicData = characteristics.find(
                    char => char.name.toLowerCase() === characteristic.toLowerCase()
                  );
                  
                  if (characteristicData) {
                    return (
                      <Link key={characteristic} to={`/${characteristicData.slug}`}>
                        <Badge 
                          variant="outline" 
                          className="text-sm px-3 py-1 hover:bg-accent hover:text-accent-foreground transition-luxury cursor-pointer"
                        >
                          {characteristic}
                        </Badge>
                      </Link>
                    );
                  } else {
                    return (
                      <Badge key={characteristic} variant="outline" className="text-sm px-3 py-1">
                        {characteristic}
                      </Badge>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div id="book-section" className="bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-light text-foreground mb-2">Book {model.name}</h3>
            <p className="text-muted-foreground mb-8">Get in touch to arrange your appointment</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Button className="five-london-button flex-1 py-3">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button variant="outline" className="flex-1 py-3">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        <div className="border-t border-border/30 bg-muted/20">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h3 className="text-xl font-light text-foreground mb-6 text-center">You Might Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {models
                .filter(m => m.id !== model.id)
                .slice(0, 6)
                .map((suggestedModel) => (
                  <Link 
                    key={suggestedModel.id} 
                    to={`/models/${suggestedModel.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                      <img
                        src={suggestedModel.image}
                        alt={suggestedModel.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="font-medium text-sm">{suggestedModel.name}</h4>
                        <p className="text-xs opacity-90">{suggestedModel.age} • {suggestedModel.location}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};