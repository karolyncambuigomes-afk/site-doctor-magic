import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
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
        {/* YSL Style Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/model1.jpg"
              alt="Elegant companion"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-8">
              Five London
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light tracking-wide text-white/90 mb-12 max-w-2xl mx-auto">
              Premier luxury companion services in London
            </p>
            
            {/* CTA Button */}
            <Link 
              to="/models" 
              className="inline-block border border-white/30 hover:border-white/60 px-8 py-3 md:px-12 md:py-4 transition-all duration-300"
            >
              <span className="text-sm md:text-base tracking-[0.3em] uppercase font-light">
                Discover
              </span>
            </Link>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-px h-16 bg-white/40"></div>
          </div>
        </section>

        {/* Featured Models Section - YSL Style */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-24">
              <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-normal tracking-tight text-black mb-4">
                Our Models
              </h2>
              <div className="w-16 h-px bg-black/20 mx-auto"></div>
            </div>
            
            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {models && models.length > 0 ? models.slice(0, 6).map((model, index) => (
                <div key={model.id} className="group">
                  <Link to={`/models/${model.id}`} className="block">
                    <div className="relative overflow-hidden mb-4">
                      <img
                        src={model.image}
                        alt={model.name}
                        className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-sans text-lg font-normal text-black mb-1">
                        {model.name}
                      </h3>
                      <p className="text-sm text-gray-600 tracking-wide">
                        {model.location}
                      </p>
                    </div>
                  </Link>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">Loading models...</p>
                </div>
              )}
            </div>
            
            {/* View All Link */}
            <div className="text-center mt-16 md:mt-24">
              <Link 
                to="/models" 
                className="inline-block border border-black/20 hover:border-black/40 px-8 py-3 transition-all duration-300"
              >
                <span className="text-sm tracking-[0.3em] uppercase font-light text-black">
                  View All Models
                </span>
              </Link>
            </div>
          </div>
        </section>

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
                href="tel:+442045678901"
                className="text-lg tracking-wide text-white/80 hover:text-white transition-colors"
              >
                +44 20 4567 8901
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