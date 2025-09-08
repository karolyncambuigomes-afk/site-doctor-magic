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
  const {
    info: bookingInfo
  } = useBookingContent();

  // Generate comprehensive structured data for homepage
  const structuredData = [generateOrganizationSchema(), generateWebsiteSchema(), generateServiceSchema("Premium Luxury Escort Services", "Exclusive companion services in London offering sophisticated, professional companionship for discerning clients seeking luxury experiences.", "500-1000"),
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
  }];
  return (
    // Updated mobile optimizations applied - v2.1
    <>
      <SEO title="Elite London Escorts | Premium High-Class Companions SW1 W1 | Five London" description="London's premier luxury escort agency serving Mayfair W1, Knightsbridge SW1, Chelsea SW3. Sophisticated, intelligent companions available 24/7. Discreet, professional service. Book now." keywords="luxury escort London, premium companion services, elite escorts London, sophisticated companions, VIP escort service, high-class escort agency, exclusive escort London, professional companions, Mayfair escorts W1, Knightsbridge escorts SW1, Chelsea escorts SW3" canonicalUrl="/" structuredData={structuredData} />
      
      <Navigation />
      
      <main className="pt-0">
        <HeroSection />
        
        {/* Featured Models Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container-width">
            <ModelsCarousel />
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container-width">
            <CategoryFilters />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="heading-xl text-foreground mb-8">
              Elite Companion
            </h2>
            <p className="body-lg text-muted-foreground mb-20 md:mb-24">
              Contact us through your preferred method for a discreet consultation
            </p>
            
            <div className="flex items-center justify-center gap-12 md:gap-16">
              {/* WhatsApp */}
              <a href="https://wa.me/447436190679" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 transition-luxury">
                <div className="w-16 h-16 md:w-20 md:h-20 border border-foreground rounded-full flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-luxury">
                  <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-foreground group-hover:text-primary-foreground transition-luxury" />
                </div>
                <span className="body-xs text-foreground group-hover:text-primary transition-luxury uppercase tracking-widest font-light">
                  WhatsApp
                </span>
              </a>

              {/* Call */}
              <a href="tel:+447436190679" className="group flex flex-col items-center gap-4 transition-luxury">
                <div className="w-16 h-16 md:w-20 md:h-20 border border-foreground rounded-full flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-luxury">
                  <Phone className="w-7 h-7 md:w-8 md:h-8 text-foreground group-hover:text-primary-foreground transition-luxury" />
                </div>
                <span className="body-xs text-foreground group-hover:text-primary transition-luxury uppercase tracking-widest font-light">
                  Call
                </span>
              </a>

              {/* Telegram */}
              <a href="https://t.me/FiveLondon" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 transition-luxury">
                <div className="w-16 h-16 md:w-20 md:h-20 border border-foreground rounded-full flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-luxury">
                  <Send className="w-7 h-7 md:w-8 md:h-8 text-foreground group-hover:text-primary-foreground transition-luxury" />
                </div>
                <span className="body-xs text-foreground group-hover:text-primary transition-luxury uppercase tracking-widest font-light">
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