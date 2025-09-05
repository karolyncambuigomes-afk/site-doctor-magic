import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ModelsCarousel } from '@/components/ModelsCarousel';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { generateOrganizationSchema, generateWebsiteSchema, generateServiceSchema } from '@/utils/structuredData';

const Index = () => {
  
  // Generate comprehensive structured data for homepage
  const structuredData = [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateServiceSchema(
      "Premium Luxury Escort Services",
      "Exclusive companion services in London offering sophisticated, professional companionship for discerning clients seeking luxury experiences.",
      "500-1000"
    )
  ];

  return (
    <>
      <SEO 
        title="Five London - Premium Luxury Escort Services & Elite Companions in London"
        description="Discover London's most sophisticated escort agency. Elite companions for discerning clients seeking luxury experiences. Professional, discreet, and exclusive services across London's finest locations."
        keywords="luxury escort London, premium companion services, elite escorts London, sophisticated companions, VIP escort service, high-class escort agency, exclusive escort London, professional companions, luxury lifestyle services, Mayfair escorts, Knightsbridge escorts, Chelsea escorts"
        canonicalUrl="/"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="min-h-screen">
        {/* YSL Style Hero Carousel */}
        <HeroCarousel />

        {/* Featured Models Section - YSL Style Carousel */}
        <ModelsCarousel />

        {/* Services Section - Minimal */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-4xl font-normal tracking-tight text-black mb-8">
              Exceptional Experiences
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
              We specialize in providing sophisticated companionship for discerning clients. 
              From intimate dinners to exclusive events, our companions ensure every moment is extraordinary.
            </p>
            
            <Link 
              to="/services" 
              className="inline-block border border-black/20 hover:border-black/40 px-8 py-3 transition-all duration-300"
            >
              <span className="text-sm tracking-[0.3em] uppercase font-light text-black">
                Our Services
              </span>
            </Link>
          </div>
        </section>

        {/* Contact Section - YSL Style */}
        <section className="py-16 md:py-32 bg-black text-white">
          <div className="max-w-4xl mx-auto px-6 md:px-4 text-center">
            <h2 className="font-display text-xl sm:text-2xl md:text-4xl font-normal tracking-tight mb-6 md:mb-8">
              Begin Your Journey
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-8 md:mb-12 max-w-2xl mx-auto px-4 sm:px-0">
              Contact us for a discreet consultation. Available 24/7 for exclusive bookings.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 px-4 sm:px-0">
              <Link 
                to="/contact"
                className="inline-block border border-white/30 hover:border-white/60 px-6 sm:px-8 py-3 transition-all duration-300 w-full sm:w-auto text-center"
              >
                <span className="text-sm tracking-[0.3em] uppercase font-light">
                  Contact Us
                </span>
              </Link>
              
              <a 
                href="tel:+447436190679"
                className="text-base sm:text-lg tracking-wide text-white/80 hover:text-white transition-colors"
              >
                +44 7436 190679
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