import { SEOOptimized } from "@/components/SEOOptimized";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ModelsGallery } from "@/components/ModelsGallery";
import { Footer } from "@/components/Footer";


import { Link } from "react-router-dom";
import { MessageCircle, Phone, MessageSquare, Send } from "lucide-react";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateServiceSchema,
  generateFAQSchema,
} from "@/utils/structuredData";
import { generateLocalBusinessSchema } from "@/utils/geoTargeting";
import {
  generateLocalBusinessByPostcode,
  generateServiceWithPricingSchema,
  generateContactPointSchema,
} from "@/utils/advancedStructuredData";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useRealTimeReviews } from "@/hooks/useRealTimeReviews";
import { useBookingContent } from "@/hooks/useBookingContent";
import heroSecondBanner from "@/assets/hero-second-banner-new.webp";
import {
  faqSchemaData,
  serviceSchemaData,
  londonAreasData,
} from "@/data/faq-schema";

const Index = () => {
  
  
  const { info: bookingInfo } = useBookingContent();
  const breadcrumbs = useBreadcrumbs();
  const { data: reviewData } = useRealTimeReviews();

  // Generate comprehensive structured data for the homepage
  const structuredData = [
    generateOrganizationSchema(true),
    generateWebsiteSchema(),
    generateServiceSchema(
      "Premium Companion Services",
      "Elite companions for discerning clients in London",
      "£300-£2000"
    ),
    generateServiceWithPricingSchema(
      serviceSchemaData.serviceName,
      serviceSchemaData.description,
      serviceSchemaData.areaName,
      serviceSchemaData.priceRange
    ),
    generateLocalBusinessSchema({
      name: "Central London",
      postcode: "W1",
      description: "Premium companion services in Central London",
    }),
    generateContactPointSchema(),
    generateFAQSchema(faqSchemaData),
    // Individual area schemas for major London districts
    generateLocalBusinessByPostcode("W1", "Mayfair", reviewData),
    generateLocalBusinessByPostcode("SW1", "Knightsbridge", reviewData),
    generateLocalBusinessByPostcode("SW3", "Chelsea", reviewData),
    generateLocalBusinessByPostcode("SW1X", "Belgravia", reviewData),
  ];
  return (
    // Updated mobile optimizations applied - v2.1
    <>
      <SEOOptimized
        title="Five London - Premium Luxury Escort Services in London"
        description="Elite escort agency in London offering sophisticated companions for discerning clients. Premium escort services with elegant, intelligent models for exclusive experiences."
        keywords="luxury escort London, premium escort agency, elite escorts London, high-class companions, VIP escort service London, sophisticated escorts, exclusive escort agency, professional companions London, Mayfair escorts, Knightsbridge companions, Chelsea escort services, Belgravia luxury escorts"
        canonicalUrl="/"
        ogImage="/og-image.jpg"
        structuredData={structuredData}
      />

      
      <Navigation />

      <main className="pt-0">
        <HeroSection />

        {/* Elite Escort Services Introduction - Text 1 */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-4 text-center">
              <p className="luxury-body-md text-gray-700 leading-relaxed">
                Five London represents the pinnacle of luxury escort services in the capital, offering sophisticated companions for discerning gentlemen who appreciate excellence, discretion, and uncompromising quality. Our carefully selected international models embody elegance, intelligence, and cultural refinement.
              </p>
              <p className="luxury-body-md text-gray-700 leading-relaxed">
                Available 24/7 throughout London's most prestigious districts, our elite companions specialize in business accompaniment, social events, cultural experiences, and intimate dinner dates. Each encounter is tailored to exceed expectations while maintaining the highest standards of professionalism and confidentiality.
              </p>
            </div>
          </div>
        </section>

        {/* All Models Gallery Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ModelsGallery />
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 md:py-16 text-foreground bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* About Our Services - Integrated Design */}
            <div className="max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6 md:p-8">
                <h2 className="luxury-heading-lg text-gray-800 mb-6">
                  About Our Premium Services
                </h2>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h3 className="luxury-heading-md mb-4 text-gray-900">
                      Finest High Class Escorts London
                    </h3>
                    <div className="space-y-4">
                      <p className="luxury-body-md text-gray-700 leading-relaxed">
                        At Exclusive Five London, excellence is not just a promise — it's a standard. We represent a carefully chosen selection of elite London escorts, available for elegant dinners, social events, or exclusive travel arrangements. Every encounter is personalised to perfection, offering a bespoke escort experience defined by discretion, grace, and luxury.
                      </p>
                      <p className="luxury-body-md text-gray-700 leading-relaxed">
                        As one of the finest escort agencies in London, we understand that true companionship goes beyond appearances. Our high class escorts are multilingual, well-educated, and effortlessly engaging — women who know how to move in the world of refinement, culture, and sophistication. From a VIP escort in Knightsbridge to a luxury companion in Chelsea or Mayfair, each meeting is curated to match your individual preferences with complete confidentiality.
                      </p>
                      <p className="luxury-body-md text-gray-700 leading-relaxed">
                        We believe in quality over quantity. That's why every introduction is handled with personal care, ensuring compatibility and comfort for our distinguished clientele. Our reputation as a discreet escort service in London is built on integrity, professionalism, and trust — values that define our brand worldwide.
                      </p>
                      <p className="luxury-body-md text-gray-700 leading-relaxed">
                        With global availability, our exclusive London escorts travel frequently to destinations such as Paris, Dubai, Monaco, and New York, providing seamless international experiences. Wherever you are, luxury companionship is only a step away.
                      </p>
                      <p className="luxury-body-md text-gray-700 leading-relaxed">
                        Discover the finest high class escorts London has to offer and experience the subtle art of true exclusivity. With Exclusive Five London, every encounter is an expression of luxury, privacy, and authenticity — the essence of an elite escort agency designed for the modern gentleman.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 md:py-40 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="luxury-heading-xl text-black mb-6">
              Elite Companion Services
            </h2>
            <p className="luxury-body-base text-black mb-4">
              Contact us through your preferred method for a discreet
              consultation
            </p>
            <p className="luxury-body-sm text-gray-600 mb-16 md:mb-20">
              Our dedicated team is available 24/7 to arrange exclusive
              companion services throughout London's premium districts. All
              communications are handled with complete confidentiality and
              professionalism.
            </p>

            <div className="flex items-center justify-center gap-12 md:gap-16">
              {/* WhatsApp */}
              <a
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-4 transition-all duration-500"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 border border-black rounded-full flex items-center justify-center group-hover:border-black transition-all duration-500">
                  <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-black group-hover:text-black transition-colors duration-500" />
                </div>
                <span className="text-xs text-black group-hover:text-black transition-colors uppercase tracking-widest font-light">
                  WhatsApp
                </span>
              </a>

              {/* Call */}
              <a
                href="tel:+447436190679"
                className="group flex flex-col items-center gap-4 transition-all duration-500"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 border border-black rounded-full flex items-center justify-center group-hover:border-black transition-all duration-500">
                  <Phone className="w-7 h-7 md:w-8 md:h-8 text-black group-hover:text-black transition-colors duration-500" />
                </div>
                <span className="text-xs text-black group-hover:text-black transition-colors uppercase tracking-widest font-light">
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
