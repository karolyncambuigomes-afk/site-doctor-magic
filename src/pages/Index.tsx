import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { SimpleHeroVideo } from '@/components/SimpleHeroVideo';
import { ModelsCarousel } from '@/components/ModelsCarousel';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MessageSquare, Send } from 'lucide-react';
import { generateOrganizationSchema, generateWebsiteSchema, generateServiceSchema } from '@/utils/structuredData';
import { useBookingContent } from '@/hooks/useBookingContent';
import heroElegantWoman from '@/assets/hero-elegant-woman.jpg';

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
      
      <SimpleHeroVideo />
      

      {/* Introductory Text About Agency */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-6">
                Exquisite. Exclusive. Elite.
              </h2>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-light">
                Established luxury companion agency representing a handpicked selection of sophisticated London companions. 
                Beautiful, intelligent, and cultured ladies for dinner dates, business events, international travel, and intimate encounters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative overflow-x-hidden" style={{ minHeight: 'auto' }}>{" "}
        {/* Featured Models Section - YSL Style Carousel */}
        <ModelsCarousel />


        {/* Services Section - Hidden SEO heading only */}
        <section className="py-4 md:py-6 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            {/* Hidden SEO heading */}
            <h2 className="sr-only">London's Finest High-Class Escorts - Premium Escort Services</h2>
          </div>
        </section>

        {/* Category Filters */}
        <CategoryFilters />

        {/* Contact Section - YSL Style */}
        <section className="relative py-20 md:py-32 lg:py-40 bg-black text-white overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroElegantWoman})`,
            }}
          ></div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
          
          <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
            <h2 className="font-display text-lg md:text-xl font-normal tracking-[0.2em] uppercase mb-8 md:mb-12">
              Book Your Elite Companion
            </h2>
            
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1 sm:gap-2 transition-all duration-300 hover:scale-110"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
                  WhatsApp
                </span>
              </a>

              {/* Call */}
              <a 
                href="tel:+447436190679"
                className="group flex flex-col items-center gap-1 sm:gap-2 transition-all duration-300 hover:scale-110"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
                  Call
                </span>
              </a>

              {/* SMS */}
              <a 
                href="sms:+447436190679"
                className="group flex flex-col items-center gap-1 sm:gap-2 transition-all duration-300 hover:scale-110"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
                  SMS
                </span>
              </a>

              {/* Telegram */}
              <a 
                href="https://t.me/FiveLondon"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1 sm:gap-2 transition-all duration-300 hover:scale-110"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
                  Telegram
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Important Information Section */}
        <section className="py-12 md:py-20 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-12 text-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-black mb-4 sm:mb-6 tracking-tight">
                Important Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-left">
                {bookingInfo.map((info, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-black mb-2 sm:mb-3 text-sm sm:text-base">{info.title}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {info.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Index;