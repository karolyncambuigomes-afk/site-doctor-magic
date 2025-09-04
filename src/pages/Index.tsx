import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Clock, Heart, Star, Users, Award } from 'lucide-react';

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
        
        {/* Features Section */}
        <section className="section-padding bg-background">
          <div className="container-width">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Why Choose <span className="luxury-text-gradient">Five London</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the pinnacle of luxury companionship with our carefully curated selection of sophisticated ladies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="luxury-card p-6 text-center group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="section-padding bg-muted/50">
          <div className="container-width">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Our <span className="luxury-text-gradient">Services</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From intimate dinner dates to exclusive social events, we provide companionship for every occasion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Dinner Dates",
                  description: "Elegant companions for fine dining experiences at London's most prestigious restaurants",
                  image: "/services/dinner.jpg"
                },
                {
                  title: "Business Events",
                  description: "Professional and sophisticated companions for corporate functions and networking events",
                  image: "/services/business.jpg"
                },
                {
                  title: "Travel Companion",
                  description: "Cultured and well-traveled companions for business trips and luxury vacations",
                  image: "/services/travel.jpg"
                }
              ].map((service, index) => (
                <Card 
                  key={service.title}
                  className="luxury-card overflow-hidden group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-48 bg-gradient-luxury relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button className="luxury-button text-lg px-8 py-4">
                View All Services
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding bg-background">
          <div className="container-width">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Client <span className="luxury-text-gradient">Testimonials</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it - hear from our satisfied clients
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={testimonial.name}
                  className="luxury-card p-6 text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-primary fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </Card>
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
