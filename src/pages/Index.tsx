import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ModelsCarousel } from '@/components/ModelsCarousel';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MessageSquare, Send } from 'lucide-react';
import { generateOrganizationSchema, generateWebsiteSchema, generateServiceSchema } from '@/utils/structuredData';
import { generateLocalBusinessSchema } from '@/utils/geoTargeting';
import { generateLocalBusinessByPostcode, generateServiceWithPricingSchema, generateContactPointSchema } from '@/utils/advancedStructuredData';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useReviews } from '@/hooks/useReviews';
import { useBookingContent } from '@/hooks/useBookingContent';
import heroSecondBanner from '@/assets/hero-second-banner-new.jpg';
import { CategoryFilters } from '@/components/CategoryFilters';
const Index = () => {
  const { info: bookingInfo } = useBookingContent();
  const breadcrumbs = useBreadcrumbs();
  const { data: reviewData } = useReviews();

  // Generate comprehensive structured data for the homepage
  const structuredData = [
    generateOrganizationSchema(true),
    generateWebsiteSchema(),
    generateServiceSchema("Premium Companion Services", "Elite companions for discerning clients in London", "£300-£2000"),
    generateServiceWithPricingSchema(
      "Luxury Companion Services London",
      "Premium, sophisticated companions for exclusive events, business functions, and cultural experiences throughout London",
      "London",
      "£££"
    ),
    generateLocalBusinessSchema({
      name: "Central London",
      postcode: "W1", 
      description: "Premium companion services in Central London"
    }),
    generateContactPointSchema(),
    // Individual area schemas for major London districts
    generateLocalBusinessByPostcode("W1", "Mayfair", reviewData),
    generateLocalBusinessByPostcode("SW1", "Knightsbridge", reviewData),
    generateLocalBusinessByPostcode("SW3", "Chelsea", reviewData),
    generateLocalBusinessByPostcode("SW1X", "Belgravia", reviewData)
  ];
  return (
    // Updated mobile optimizations applied - v2.1
    <>
      <SEO 
        title="Five London - Premium Luxury Escort Services in London"
        description="Elite escort agency in London offering sophisticated companions for discerning clients. Premium escort services with elegant, intelligent models for exclusive experiences."
        keywords="luxury escort London, premium escort agency, elite escorts London, high-class companions, VIP escort service London, sophisticated escorts, exclusive escort agency, professional companions London, Mayfair escorts, Knightsbridge companions, Chelsea escort services, Belgravia luxury escorts"
        canonicalUrl="/"
        ogImage="/og-image.jpg"
        structuredData={structuredData}
        locationContext={{
          area: "Central London",
          postcode: "W1",
          coordinates: { lat: 51.5074, lng: -0.1278 }
        }}
        hreflang={[
          { lang: "en-gb", href: "https://fivelondon.com/" },
          { lang: "en-us", href: "https://fivelondon.com/" }
        ]}
      />
      
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
        <section className="py-12 md:py-16 text-foreground bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <CategoryFilters />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 md:py-40 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="luxury-heading-xl text-black mb-6">
              Elite Companion
            </h2>
            <p className="luxury-body-base text-black mb-16 md:mb-20">
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

      <Footer />
    </>
  );
};
export default Index;