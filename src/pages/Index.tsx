import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ModelsCarousel } from '@/components/ModelsCarousel';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MessageSquare, Send } from 'lucide-react';
import { generateOrganizationSchema, generateWebsiteSchema, generateServiceSchema } from '@/utils/structuredData';
import { useBookingContent } from '@/hooks/useBookingContent';

const Index = () => {
  const { main: bookingMain, steps: bookingSteps, info: bookingInfo, loading: bookingLoading } = useBookingContent();
  
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
        title="Elite London Escorts | Premium High-Class Companions | Five London"
        description="London's premier luxury escort agency. Sophisticated, intelligent, and beautiful high-class companions available 24/7. Discreet, professional service across Mayfair, Knightsbridge, Chelsea. Book now."
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
            {/* Hidden SEO heading */}
            <h2 className="sr-only">London's Finest High-Class Escorts - Premium Escort Services</h2>
            
            {/* Visible elegant heading */}
            <h3 className="font-display text-2xl md:text-4xl font-normal tracking-tight text-black mb-8">
              London's Finest Elite Companions
            </h3>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
              Handpicked selection of elite London companions. Beautiful, intelligent, and sophisticated ladies for dinner dates, business events, travel, and intimate encounters. Professional, discreet, available 24/7.
            </p>
            
            <Link 
              to="/services" 
              className="inline-block border border-black/20 hover:border-black/40 px-8 py-3 transition-all duration-300"
            >
              <span className="text-sm tracking-[0.3em] uppercase font-light text-black">
                View All Services
              </span>
            </Link>
          </div>
        </section>

        {/* Contact Section - YSL Style */}
        <section className="py-16 md:py-32 bg-black text-white">
          <div className="max-w-4xl mx-auto px-6 md:px-4 text-center">
            <h2 className="font-display text-xl sm:text-2xl md:text-4xl font-normal tracking-tight mb-6 md:mb-8">
              Book Your Elite Companion Now
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-8 md:mb-12 max-w-2xl mx-auto px-4 sm:px-0">
              Ready for an unforgettable experience? Contact us now for instant booking. Our elite London companions are available 24/7 across all premium locations.
            </p>
            
            <div className="flex items-center justify-center space-x-8 px-4">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-110"
              >
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
                  WhatsApp
                </span>
              </a>

              {/* Call */}
              <a 
                href="tel:+447436190679"
                className="group flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-110"
              >
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
                  Call
                </span>
              </a>

              {/* SMS */}
              <a 
                href="sms:+447436190679"
                className="group flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-110"
              >
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-white" />
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
                className="group flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-110"
              >
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">
                  Telegram
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              {/* Hidden SEO heading */}
              <h2 className="sr-only">How to Book Your Elite Escort - Booking Process</h2>
              
              {/* Visible elegant heading */}
              <h3 className="font-display text-2xl md:text-4xl font-normal tracking-tight text-black mb-8">
                {bookingMain?.title || "How to Book Your Elite Companion"}
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                {bookingMain?.subtitle || "Simple, discreet, and instant. Book your perfect companion in 3 easy steps"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {bookingSteps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-light text-xl">{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-normal text-black mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-8 md:p-12 text-center">
                <h3 className="text-xl md:text-2xl font-normal text-black mb-6 tracking-tight">
                  Important Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {bookingInfo.map((info, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-black mb-3">{info.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {info.content}
                      </p>
                    </div>
                  ))}
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
                Book Now - Available 24/7
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