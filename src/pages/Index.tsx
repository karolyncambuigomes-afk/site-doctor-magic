import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ModelsCarousel } from '@/components/ModelsCarousel';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MessageSquare, Send } from 'lucide-react';
import { generateOrganizationSchema, generateWebsiteSchema, generateServiceSchema } from '@/utils/structuredData';
import { useBookingContent } from '@/hooks/useBookingContent';
import heroSecondBanner from '@/assets/hero-second-banner-new.jpg';


import { CategoryFilters } from '@/components/CategoryFilters';

const Index = () => {
  const { info: bookingInfo } = useBookingContent();
  
  // Generate comprehensive structured data for homepage
  const structuredData = [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateServiceSchema(
      "Premium Luxury Escort Services",
      "Exclusive companion services in London offering sophisticated, professional companionship for discerning clients seeking luxury experiences.",
      "500-1000"
    ),
    // Add location-specific schema for better geo-targeting
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Five London Elite Escorts",
      "areaServed": {
        "@type": "City",
        "name": "London",
        "addressCountry": "GB"
      },
      "hasMap": "https://www.google.com/maps/place/London,+UK",
      "geo": {
        "@type": "GeoCoordinates", 
        "latitude": "51.5074",
        "longitude": "-0.1278"
      }
    }
  ];

  return (
    // Updated mobile optimizations applied - v2.1
    <>
      <SEO 
        title="Elite London Escorts | Premium High-Class Companions SW1 W1 | Five London"
        description="London's premier luxury escort agency serving Mayfair W1, Knightsbridge SW1, Chelsea SW3. Sophisticated, intelligent companions available 24/7. Discreet, professional service. Book now."
        keywords="luxury escort London, premium companion services, elite escorts London, sophisticated companions, VIP escort service, high-class escort agency, exclusive escort London, professional companions, Mayfair escorts W1, Knightsbridge escorts SW1, Chelsea escorts SW3"
        canonicalUrl="/"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <HeroSection />
      
      {/* Introductory Text About Agency */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-8">
            <h2 className="font-display text-2xl md:text-3xl font-light tracking-widest uppercase text-foreground mb-8">
              Exquisite. Exclusive. Elite.
            </h2>
            <p className="text-lg md:text-xl leading-loose text-muted-foreground font-light max-w-2xl mx-auto">
              Established luxury companion agency representing a handpicked selection of sophisticated London companions. 
              Beautiful, intelligent, and cultured ladies for discerning gentlemen.
            </p>
          </div>
        </div>
      </section>

      <main className="relative overflow-x-hidden" style={{ minHeight: 'auto' }}>
        {/* Featured Models Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="font-display text-2xl md:text-3xl font-light tracking-widest uppercase text-foreground mb-6">
                Featured Companions
              </h2>
              <p className="text-muted-foreground font-light max-w-lg mx-auto">
                Meet our handpicked selection of sophisticated and elegant companions
              </p>
            </div>
            <ModelsCarousel />
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="font-display text-2xl md:text-3xl font-light tracking-widest uppercase text-foreground mb-6">
                Perfect Match
              </h2>
              <p className="text-muted-foreground font-light max-w-lg mx-auto">
                Browse by your preferences to discover the ideal companion
              </p>
            </div>
            <CategoryFilters />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 md:py-40 bg-background">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-light tracking-widest uppercase text-foreground mb-6">
              Elite Companion
            </h2>
            <p className="text-muted-foreground font-light mb-16 md:mb-20">
              Contact us through your preferred method for a discreet consultation
            </p>
            
            <div className="flex items-center justify-center gap-12 md:gap-16">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-4 transition-all duration-500"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 border border-border/40 rounded-full flex items-center justify-center group-hover:border-foreground/60 transition-all duration-500">
                  <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-foreground/70 group-hover:text-foreground transition-colors duration-500" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest font-light">
                  WhatsApp
                </span>
              </a>

              {/* Call */}
              <a 
                href="tel:+447436190679"
                className="group flex flex-col items-center gap-4 transition-all duration-500"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 border border-border/40 rounded-full flex items-center justify-center group-hover:border-foreground/60 transition-all duration-500">
                  <Phone className="w-7 h-7 md:w-8 md:h-8 text-foreground/70 group-hover:text-foreground transition-colors duration-500" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest font-light">
                  Call
                </span>
              </a>

              {/* Telegram */}
              <a 
                href="https://t.me/FiveLondon"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-4 transition-all duration-500"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 border border-border/40 rounded-full flex items-center justify-center group-hover:border-foreground/60 transition-all duration-500">
                  <Send className="w-7 h-7 md:w-8 md:h-8 text-foreground/70 group-hover:text-foreground transition-colors duration-500" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest font-light">
                  Telegram
                </span>
              </a>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </>
  );
};

export default Index;