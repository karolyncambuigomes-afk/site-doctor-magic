import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ModelsCarousel } from '@/components/ModelsCarousel';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MessageSquare, Send } from 'lucide-react';
import { generateOrganizationSchema, generateWebsiteSchema, generateServiceSchema, generateFAQSchema } from '@/utils/structuredData';
import { generateLocalBusinessSchema } from '@/utils/geoTargeting';
import { generateLocalBusinessByPostcode, generateServiceWithPricingSchema, generateContactPointSchema } from '@/utils/advancedStructuredData';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useReviews } from '@/hooks/useReviews';
import { useBookingContent } from '@/hooks/useBookingContent';
import heroSecondBanner from '@/assets/hero-second-banner-new.jpg';
import { CategoryFilters } from '@/components/CategoryFilters';
import { faqSchemaData, serviceSchemaData, londonAreasData } from '@/data/faq-schema';
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
      serviceSchemaData.serviceName,
      serviceSchemaData.description,
      serviceSchemaData.areaName,
      serviceSchemaData.priceRange
    ),
    generateLocalBusinessSchema({
      name: "Central London",
      postcode: "W1", 
      description: "Premium companion services in Central London"
    }),
    generateContactPointSchema(),
    generateFAQSchema(faqSchemaData),
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

        {/* About Our Services - Collapsible Rich Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <details className="mb-8">
              <summary className="cursor-pointer luxury-heading-lg text-center mb-6 text-foreground hover:text-foreground/80 transition-colors">
                <h2>About Our Premium Services</h2>
              </summary>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md text-foreground">Elite Escort Services London</h3>
                  <p className="luxury-body-md text-foreground leading-relaxed">
                    Five London represents the pinnacle of luxury escort services in the capital, offering sophisticated companions for discerning gentlemen who appreciate excellence, discretion, and uncompromising quality. Our carefully selected international models embody elegance, intelligence, and cultural refinement.
                  </p>
                  <p className="luxury-body-md text-foreground leading-relaxed">
                    Available 24/7 throughout London's most prestigious districts, our elite companions specialize in business accompaniment, social events, cultural experiences, and intimate dinner dates. Each encounter is tailored to exceed expectations while maintaining the highest standards of professionalism and confidentiality.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md text-foreground">Premium London Areas</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium text-foreground">Mayfair W1</h4>
                      <p className="luxury-body-xs text-foreground">Home to luxury shopping at Bond Street, exclusive dining, and world-class hotels including Claridge's and The Connaught.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium text-foreground">Knightsbridge SW1</h4>
                      <p className="luxury-body-xs text-foreground">Prestigious area near Harrods, Hyde Park, and luxury hotels including The Berkeley and Mandarin Oriental.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium text-foreground">Chelsea SW3</h4>
                      <p className="luxury-body-xs text-foreground">Sophisticated neighbourhood with world-class restaurants, galleries, and exclusive private members' clubs.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium text-foreground">Belgravia SW1</h4>
                      <p className="luxury-body-xs text-foreground">Elite residential area with Georgian architecture, premium boutiques, and Michelin-starred dining venues.</p>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 md:py-40 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="luxury-heading-xl text-black mb-6">
              Elite Companion Services
            </h2>
            <p className="luxury-body-base text-black mb-4">
              Contact us through your preferred method for a discreet consultation
            </p>
            <p className="luxury-body-sm text-muted-foreground mb-16 md:mb-20">
              Our dedicated team is available 24/7 to arrange exclusive companion services throughout London's premium districts. All communications are handled with complete confidentiality and professionalism.
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