import React, { useState } from 'react';
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
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const ModelProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const model = models.find(m => m.id === id);
  const [imageLoaded, setImageLoaded] = useState(false);

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
      
      {/* Hero Section with Cover Image (Five London Style) */}
      <section className="relative h-screen overflow-hidden">
        {/* Cover Image with Blur Overlay */}
        <div className="absolute inset-0">
          <img
            src={model.image}
            alt={`${model.name} cover`}
            className="w-full h-full object-cover"
            style={{ filter: 'blur(8px) brightness(0.7)' }}
          />
          <div className="five-london-hero-overlay"></div>
        </div>
        
        {/* Centered Content */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center space-y-8">
            {/* Circular Profile Image */}
            <div className="relative">
              <img
                src={model.image}
                alt={model.name}
                className="five-london-circular-image"
                onLoad={() => setImageLoaded(true)}
              />
              {/* Golden Border Animation */}
              <div className="absolute inset-0 w-48 h-48 rounded-full border-4 border-accent mx-auto animate-glow"></div>
            </div>
            
            {/* Model Name & Location */}
            <div className="space-y-4">
              <h1 className="heading-hero text-white text-shadow-luxury">
                {model.name}
              </h1>
              <p className="body-luxury text-white/90 tracking-widest">
                {model.location}
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="pt-8">
              <Button className="five-london-button-outline bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                Book Me Below →
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70">
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Model Image */}
            <div className="order-2 lg:order-1">
              <img
                src={model.image}
                alt={`About ${model.name}`}
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
            
            {/* About Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="heading-lg text-foreground">About {model.name}</h2>
                <p className="body-luxury text-muted-foreground leading-relaxed">
                  {model.description}
                </p>
              </div>
              
              {/* Availability & Price */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="body-minimal text-muted-foreground">Availability:</span>
                  <div className={`flex items-center gap-2 ${getAvailabilityColor(model.availability)}`}>
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{getAvailabilityText(model.availability)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-minimal text-muted-foreground">Starting from:</span>
                  <span className="heading-md text-primary">{model.price}</span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="heading-md text-foreground">{model.rating}</span>
                </div>
                <span className="body-sm">({model.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Physical Details */}
            <Card className="five-london-card p-8">
              <h3 className="heading-md mb-6 flex items-center gap-3">
                <User className="h-6 w-6 text-accent" />
                Physical Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="body-minimal text-muted-foreground">Height:</span>
                  <span className="body-minimal text-foreground">{model.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-minimal text-muted-foreground">Measurements:</span>
                  <span className="body-minimal text-foreground">{model.measurements}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-minimal text-muted-foreground">Hair:</span>
                  <span className="body-minimal text-foreground">{model.hair}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-minimal text-muted-foreground">Eyes:</span>
                  <span className="body-minimal text-foreground">{model.eyes}</span>
                </div>
              </div>
            </Card>

            {/* Personal Details */}
            <Card className="five-london-card p-8">
              <h3 className="heading-md mb-6 flex items-center gap-3">
                <Globe className="h-6 w-6 text-accent" />
                Personal Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="body-minimal text-muted-foreground">Nationality:</span>
                  <span className="body-minimal text-foreground">{model.nationality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-minimal text-muted-foreground">Education:</span>
                  <span className="body-minimal text-foreground">{model.education}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-minimal text-muted-foreground">Languages:</span>
                  <span className="body-minimal text-foreground">{model.languages.join(', ')}</span>
                </div>
              </div>
            </Card>

            {/* Services */}
            <Card className="five-london-card p-8">
              <h3 className="heading-md mb-6">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {model.services.map((service) => (
                  <Badge key={service} variant="secondary" className="body-sm font-light">
                    {service}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <Card className="five-london-card p-12">
            <h3 className="heading-lg mb-8 text-center">Interests & Hobbies</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {model.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="body-minimal font-light px-4 py-2">
                  {interest}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Booking Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-width text-center space-y-8">
          <h2 className="heading-lg">Book {model.name}</h2>
          <p className="body-luxury max-w-2xl mx-auto">
            To arrange a meeting with {model.name}, please contact us through one of the methods below. 
            All arrangements are handled with complete discretion and professionalism.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button className="five-london-button-outline border-white text-white hover:bg-white hover:text-primary flex-1">
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Button>
            <Button className="five-london-button-outline border-white text-white hover:bg-white hover:text-primary flex-1">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};