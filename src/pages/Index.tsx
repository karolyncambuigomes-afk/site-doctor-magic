import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ModelsCarousel } from '@/components/ModelsCarousel';
import { Footer } from '@/components/Footer';
import { Shield, Clock, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModelCard } from '@/components/ModelCard';
import { useModels } from '@/hooks/useModels';
import { useState, useEffect } from 'react';

const Index = () => {
  const { models, loading, error } = useModels();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Five London",
    "description": "London's premier luxury escort agency providing sophisticated companionship services",
    "url": "https://fivelondon.com",
    "logo": "https://fivelondon.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-20-4567-8901",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    }
  };

  const features = [];

  // Carrossel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselImages = models.slice(0, 12); // Pegar 12 modelos para o carrossel

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <>
      <SEO 
        title="Five London - Premium Luxury Companions"
        description="Experience the pinnacle of sophistication with our exclusive collection of elite companions in London."
        keywords="luxury companions london, premium escort services, high-class companions, elite companion agency"
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
        <section className="py-20 md:py-32 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-4xl font-normal tracking-tight mb-8">
              Begin Your Journey
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-12 max-w-2xl mx-auto">
              Contact us for a discreet consultation. Available 24/7 for exclusive bookings.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <Link 
                to="/contact"
                className="inline-block border border-white/30 hover:border-white/60 px-8 py-3 transition-all duration-300"
              >
                <span className="text-sm tracking-[0.3em] uppercase font-light">
                  Contact Us
                </span>
              </Link>
              
              <a 
                href="tel:+447436190679"
                className="text-lg tracking-wide text-white/80 hover:text-white transition-colors"
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