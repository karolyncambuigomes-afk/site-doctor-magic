import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSafeParams } from '@/hooks/useSafeRouter';
import { useModels } from '@/hooks/useModels';
import { characteristics } from '@/data/characteristics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Star, MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { SEOOptimized } from '@/components/SEOOptimized';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
import { ModelGallery } from '@/components/ModelGallery';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
export const ModelProfile: React.FC = () => {
  const { id } = useSafeParams() as { id?: string };
  const { getModelById, models, loading, error } = useModels();

  // Support both UUID id and SEO slug (e.g., /models/julia)
  const slugify = (s: string) =>
    s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  let model = id ? getModelById(id) : null;
  if (!model && id) {
    const target = slugify(String(id));
    model = models.find(m => slugify(m.name) === target) || null;
  }


  // Helper to normalize and format prices
  const formatPrice = (value: string | number | null | undefined): string => {
    if (value == null) return '';
    const num = typeof value === 'number' 
      ? value 
      : parseFloat(value.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return '£' + num.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  };

  // Scroll to top when model changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  if (loading) {
    return <>
        <Navigation />
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading companion profile...</p>
          </div>
        </div>
        <Footer />
      </>;
  }
  if (error) {
    return <>
        <Navigation />
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-light mb-4">Unable to load profile</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link to="/models" className="text-primary hover:underline">
              ← Back to companions
            </Link>
          </div>
        </div>
        <Footer />
      </>;
  }
  if (!model) {
    return <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center space-y-8">
            <h1 className="luxury-heading-lg text-black">Model Not Found</h1>
            <p className="body-minimal text-gray-700">The model you're looking for doesn't exist.</p>
            <Link to="/models">
              <Button className="border border-black text-black hover:bg-black hover:text-white px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gallery
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>;
  }

  // Gallery is now handled by ModelGallery component

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
  return <>
      <SEOOptimized title={`${model.name} - Luxury Escort in ${model.location}`} description={`Meet ${model.name}, an elegant ${model.age}-year-old companion in ${model.location}. ${model.description}`} keywords={`${model.name}, luxury escort, ${model.location}, companion, ${model.nationality}`} />
      
      <Navigation />

      {/* Main Gallery Section */}
      <section className="min-h-screen bg-white pt-16 md:pt-20">
        <div className="max-w-md mx-auto p-4">
          <ModelGallery modelId={model.id} mainImage={model.image} modelName={model.name} />
        </div>

        {/* Model Details */}
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Model Header */}
          <div className="text-center space-y-4 pb-8 mb-8 border-b border-border">
            <h1 className="luxury-heading-xl text-black">{model.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 luxury-body-base">
              {model.age && (
                <span className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                  {model.age} years
                </span>
              )}
              {model.location && (
                <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  <MapPin className="h-4 w-4" />
                  <span>{model.location}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="text-sm px-6 py-2 hover:bg-accent hover:text-accent-foreground transition-luxury" onClick={() => window.open('https://wa.me/447436190679', '_blank')}>
                Book Now
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h2 className="luxury-heading-lg text-black mb-4">About {model.name}</h2>
            <div 
              className="text-muted-foreground leading-relaxed luxury-body-base prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(model.description || '') }}
            />
          </div>

          {/* Pricing Section */}
          <div className="mb-6">
            <h3 className="luxury-heading-md text-foreground mb-3">Pricing</h3>
            
            {/* Simple price display (no pricing object) */}
            {model.price && !model.pricing && (
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-center">
                  <span className="luxury-heading-md text-accent">{model.price}</span>
                  <p className="luxury-body-sm text-muted-foreground mt-1">Base rate</p>
                </div>
              </div>
            )}
            
            {/* Old format pricing (rates array) - Barbara uses this - PRIORITY */}
            {model.pricing?.rates && model.pricing.rates.length > 0 && (
              <div className="bg-luxury-navy border border-luxury-navy rounded-lg p-4">
                <div className="space-y-3">
                  {model.pricing.rates.map((rateItem: any, index: number) => {
                    const displayRate = typeof rateItem.rate === 'number' 
                      ? `£${rateItem.rate}`
                      : rateItem.rate;
                    
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-luxury-cream luxury-body-sm">{rateItem.duration}</span>
                        <span className="luxury-body-base font-semibold text-white">
                          {displayRate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* New format pricing (oneHour, twoHours, etc.) */}
            {model.pricing?.oneHour && !model.pricing?.rates && (
              <div className="bg-luxury-navy border border-luxury-navy rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-cream luxury-body-sm">1 hour</span>
                    <span className="luxury-body-base font-semibold text-white">{model.pricing.oneHour}</span>
                  </div>
                  {model.pricing.twoHours && (
                    <div className="flex justify-between items-center">
                      <span className="text-luxury-cream luxury-body-sm">2 hours</span>
                      <span className="luxury-body-base font-semibold text-white">{model.pricing.twoHours}</span>
                    </div>
                  )}
                  {model.pricing.threeHours && (
                    <div className="flex justify-between items-center">
                      <span className="text-luxury-cream luxury-body-sm">3 hours</span>
                      <span className="luxury-body-base font-semibold text-white">{model.pricing.threeHours}</span>
                    </div>
                  )}
                  {model.pricing.additionalHour && (
                    <div className="flex justify-between items-center">
                      <span className="text-luxury-cream luxury-body-sm">Additional hour</span>
                      <span className="luxury-body-base font-semibold text-white">{model.pricing.additionalHour}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* No pricing info */}
            {!model.price && !model.pricing && (
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-muted-foreground">Pricing available upon request</p>
              </div>
            )}
          </div>



          {/* Characteristics Section - Only show if data exists */}
          {model.characteristics && model.characteristics.length > 0 && <div className="mb-8">
              <h3 className="luxury-heading-md text-foreground mb-4">Characteristics</h3>
              <div className="flex flex-wrap gap-2">
                {model.characteristics.map(characteristic => {
              // Find the corresponding characteristic object to get the slug
              const characteristicData = characteristics.find(char => char.name.toLowerCase() === characteristic.toLowerCase());
              if (characteristicData) {
                return <Link key={characteristic} to={`/characteristics/${characteristicData.slug}`}>
                        <Badge variant="outline" className="luxury-body-sm px-3 py-1 text-black hover:bg-accent hover:text-accent-foreground transition-luxury cursor-pointer">
                          {characteristic}
                        </Badge>
                      </Link>;
              } else {
                return <Badge key={characteristic} variant="outline" className="luxury-body-sm px-3 py-1">
                        {characteristic}
                      </Badge>;
              }
            })}
              </div>
            </div>}

          {/* Contact Section */}
          <div id="book-section" className="bg-white rounded-lg p-8 text-center">
            <h3 className="luxury-heading-xl text-black mb-2">Book {model.name}</h3>
            <p className="text-muted-foreground luxury-body-base mb-8">Get in touch to arrange your appointment</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button className="border border-black text-black hover:bg-black hover:text-white px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm flex-1" onClick={() => window.open('https://wa.me/447436190679', '_blank')}>
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        <div className="border-t border-border/30 bg-white">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h3 className="luxury-heading-lg text-black mb-6 text-center">You Might Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {models.filter(m => m.id !== model.id).slice(0, 6).map(suggestedModel => <Link key={suggestedModel.id} to={`/models/${suggestedModel.id}`} className="group">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                      <img src={suggestedModel.image} alt={suggestedModel.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="font-medium luxury-body-sm">{suggestedModel.name}</h4>
                        <p className="luxury-body-xs opacity-90">{suggestedModel.age} • {suggestedModel.location}</p>
                      </div>
                    </div>
                  </Link>)}
            </div>
          </div>
        </div>
      </section>

      <ContactBar showOnScroll={false} />
      <Footer />
    </>;
};