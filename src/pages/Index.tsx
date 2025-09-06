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

        {/* How It Works Section */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-2xl md:text-4xl font-normal tracking-tight text-black mb-8">
                How Booking Works
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                A simple and discreet process to ensure your perfect experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-light text-xl">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-normal text-black mb-4 tracking-tight">
                  Initial Contact
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Reach out to us by phone or contact form. Our team responds quickly and discreetly to understand your preferences.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-light text-xl">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-normal text-black mb-4 tracking-tight">
                  Personalized Selection
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Based on your preferences, we present the most suitable companions. You choose from detailed profiles and photos.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-light text-xl">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-normal text-black mb-4 tracking-tight">
                  Secure Confirmation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We confirm all details - date, time, location and duration. Payment is processed securely and discreetly.
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-8 md:p-12 text-center">
                <h3 className="text-xl md:text-2xl font-normal text-black mb-6 tracking-tight">
                  Important Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h4 className="font-medium text-black mb-3">⏰ Schedule</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Available 24/7. We recommend booking at least 2 hours in advance for better availability.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-3">🔒 Discretion</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Complete confidentiality guaranteed. All data is protected and never shared.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-3">💳 Payment</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We accept credit cards, bank transfers and cash. Payment is always discreet and secure.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-3">📍 Location</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We serve all of London. Hotels, private residences or venues of your choice.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Link 
                to="/contact" 
                className="inline-block border border-black/20 hover:border-black/40 px-8 py-3 transition-all duration-300 hover-scale"
              >
                <span className="text-sm tracking-[0.3em] uppercase font-light text-black">
                  Make Booking
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;