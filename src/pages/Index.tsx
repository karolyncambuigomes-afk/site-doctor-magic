import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Heart, Star, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModelCard } from '@/components/ModelCard';
import { models } from '@/data/models';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Five London",
    "description": "London's premier luxury escort agency providing sophisticated companionship services",
    "url": "https://fivelondon.com",
    "logo": "https://fivelondon.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-20-4567-8901",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://instagram.com/fivelondon",
      "https://twitter.com/fivelondon"
    ]
  };

  const features = [
    {
      icon: Shield,
      title: "100% Discreet",
      description: "Complete confidentiality and privacy guaranteed for all our clients"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Round-the-clock service with immediate booking confirmation"
    },
    {
      icon: Heart,
      title: "Carefully Selected",
      description: "Each companion is personally vetted for sophistication and elegance"
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "Luxury experiences tailored to exceed your expectations"
    },
    {
      icon: Users,
      title: "Professional Service",
      description: "Dedicated concierge team ensuring seamless arrangements"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized as London's most prestigious escort agency"
    }
  ];

  const testimonials = [
    {
      name: "James M.",
      role: "Business Executive",
      content: "Exceptional service and absolute professionalism. Five London exceeded all my expectations.",
      rating: 5
    },
    {
      name: "David R.",
      role: "Entrepreneur",
      content: "The perfect companion for my business dinner. Sophisticated, intelligent, and charming.",
      rating: 5
    },
    {
      name: "Michael S.",
      role: "Investment Banker",
      content: "Unparalleled discretion and service quality. I wouldn't trust anyone else in London.",
      rating: 5
    }
  ];

  return (
    <>
      <SEO 
        title="Premium Luxury Escort Services in London"
        description="Five London offers sophisticated, discreet luxury escort services in London. Book elite companions for dinner dates, business events, and social occasions. Available 24/7."
        keywords="luxury escort london, premium escort services, high-class companions london, elite escort agency, sophisticated escorts, VIP companion services"
        canonicalUrl="/"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main>
        <HeroSection />
        
        {/* Featured Models Section */}
        <section className="section-padding bg-muted/50">
          <div className="container-width">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Meet Our <span className="luxury-text-gradient">Exclusive Models</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully selected collection of sophisticated companions, each offering elegance, intelligence, and exceptional service
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20">
                  {models.filter(model => model.availability === 'available').length} Available Now
                </Badge>
                <Badge variant="outline">
                  {models.length} Total Models
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {models.slice(0, 4).map((model, index) => (
                <div 
                  key={model.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ModelCard model={model} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/models">
                <Button className="luxury-button text-lg px-8 py-4">
                  View All Models
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-background">
          <div className="container-width">
            <div className="text-center mb-20">
              <h2 className="heading-lg mb-4">
                Why Choose Five London
              </h2>
              <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the pinnacle of luxury companionship with our carefully curated selection
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="text-center space-y-4"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 text-foreground mb-6">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="heading-md">{feature.title}</h3>
                  <p className="body-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-dark text-secondary-foreground">
          <div className="container-width text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready for an <span className="luxury-text-gradient">Unforgettable Experience</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact us today to arrange your perfect companion. Available 24/7 for immediate bookings.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="luxury-button text-lg px-8 py-4">
                Book Now
              </Button>
              <Button 
                variant="outline" 
                className="text-lg px-8 py-4 border-2 border-primary/30 text-secondary-foreground hover:bg-primary/10"
              >
                Call Us: +44 20 4567 8901
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
