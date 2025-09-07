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
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-6">
            <h2 className="font-display text-2xl md:text-3xl font-normal tracking-wide text-foreground mb-6">
              Exquisite. Exclusive. Elite.
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-light max-w-3xl mx-auto">
              Established luxury companion agency representing a handpicked selection of sophisticated London companions. 
              Beautiful, intelligent, and cultured ladies for discerning gentlemen.
            </p>
          </div>
        </div>
      </section>

      <main className="relative overflow-x-hidden" style={{ minHeight: 'auto' }}>
        {/* Featured Models Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-normal tracking-wide text-foreground mb-4">
                Our Featured Companions
              </h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">
                Meet our handpicked selection of sophisticated and elegant companions
              </p>
            </div>
            <ModelsCarousel />
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-normal tracking-wide text-foreground mb-4">
                Find Your Perfect Match
              </h2>
              <p className="text-muted-foreground font-light max-w-2xl mx-auto">
                Browse by your preferences to discover the ideal companion
              </p>
            </div>
            <CategoryFilters />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-background border-t">
          <div className="max-w-lg mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-normal tracking-wide text-foreground mb-4">
              Book Your Elite Companion
            </h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-12">
              Contact us through your preferred method for a discreet consultation
            </p>
            
            <div className="flex items-center justify-center gap-6 md:gap-8">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider font-light">
                  WhatsApp
                </span>
              </a>

              {/* Call */}
              <a 
                href="tel:+447436190679"
                className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                  <Phone className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider font-light">
                  Call
                </span>
              </a>

              {/* SMS */}
              <a 
                href="sms:+447436190679"
                className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider font-light">
                  SMS
                </span>
              </a>

              {/* Telegram */}
              <a 
                href="https://t.me/FiveLondon"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                  <Send className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider font-light">
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