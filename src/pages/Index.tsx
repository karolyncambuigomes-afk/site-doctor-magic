import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ModelsCarousel } from '@/components/ModelsCarousel';
import { SlidingFooter } from '@/components/SlidingFooter';
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
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <ModelsCarousel />
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-12 md:py-16 text-black bg-neutral-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <CategoryFilters />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 md:py-40 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="heading-xl text-black mb-6">
              Elite Companion
            </h2>
            <p className="body-base text-black mb-16 md:mb-20">
              Contact us through your preferred method for a discreet consultation
            </p>
            
            <div className="flex items-center justify-center gap-12 md:gap-16">
              {/* WhatsApp */}
              <a href="https://wa.me/447436190679" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 transition-all duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 border border-black rounded-full flex items-center justify-center group-hover:border-black transition-all duration-500">
                  <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-black group-hover:text-black transition-colors duration-500" />
                </div>
                <span className="text-xs text-black group-hover:text-black transition-colors uppercase tracking-widest font-light">
                  WhatsApp
                </span>
              </a>

              {/* Call */}
              <a href="tel:+447436190679" className="group flex flex-col items-center gap-4 transition-all duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 border border-black rounded-full flex items-center justify-center group-hover:border-black transition-all duration-500">
                  <Phone className="w-7 h-7 md:w-8 md:h-8 text-black group-hover:text-black transition-colors duration-500" />
                </div>
                <span className="text-xs text-black group-hover:text-black transition-colors uppercase tracking-widest font-light">
                  Call
                </span>
              </a>

              {/* Telegram */}
              <a href="https://t.me/FiveLondon" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 transition-all duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 border border-black rounded-full flex items-center justify-center group-hover:border-black transition-all duration-500">
                  <Send className="w-7 h-7 md:w-8 md:h-8 text-black group-hover:text-black transition-colors duration-500" />
                </div>
                <span className="text-xs text-black group-hover:text-black transition-colors uppercase tracking-widest font-light">
                  Telegram
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SlidingFooter />
    </>
  );
};
export default Index;