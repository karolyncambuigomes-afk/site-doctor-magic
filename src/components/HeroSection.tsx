import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { OptimizedImage } from '@/components/OptimizedImage';
import { OptimizedHeroImage } from '@/components/OptimizedHeroImage';
import { EnhancedImage } from '@/components/EnhancedImage';
import { resolveImage, getFeatureFlags } from '@/utils/imageResolver';
import heroMainWebp from '@/assets/hero-main.webp';
import heroElegantWoman from '@/assets/hero-elegant-woman.webp';

export const HeroSection: React.FC = () => {
  const { heroContent, loading } = useHomepageContent();
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Validate if URL is accessible
  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Enhanced image resolution with feature flags
  const { primaryImage, fallbackImage, placeholderImage } = useMemo(() => {
    if (!heroContent) return { primaryImage: null, fallbackImage: null, placeholderImage: null };

    const { 
      image_url_local_desktop, 
      image_url_local_mobile, 
      image_url_local_fallback,
      image_url_desktop, 
      image_url_mobile, 
      image_url 
    } = heroContent;
    
    // Local images (prioritized) - strict separation (no cross-device fallback)
    const localImage = isMobile 
      ? (image_url_local_mobile || image_url_local_fallback)
      : (image_url_local_desktop || image_url_local_fallback);
    
    // External images (fallback) - strict separation (no cross-device fallback)
    const externalImage = isMobile 
      ? (image_url_mobile || image_url)
      : (image_url_desktop || image_url);
    
    // Static fallback
    const staticImage = isMobile ? heroElegantWoman : heroMainWebp;
    
    console.log('🎯 [HeroSection] Image resolution:', {
      isMobile,
      localImage,
      externalImage,
      staticImage
    });

    return {
      primaryImage: localImage,
      fallbackImage: externalImage,
      placeholderImage: staticImage
    };
  }, [heroContent, isMobile]);


  if (loading) {
    return (
      <section className="relative h-screen w-full flex items-end snap-start">
        <div className="absolute inset-0 z-0 bg-gray-900">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-sm">Loading banner...</div>
          </div>
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-8 md:pb-16 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded mb-4"></div>
              <div className="h-6 bg-white/20 rounded mb-6"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full flex items-end snap-start">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* Hero Image with Enhanced Fallback */}
        <EnhancedImage
          local={primaryImage || undefined}
          external={fallbackImage || undefined}
          placeholder={placeholderImage || undefined}
          alt={heroContent.title || 'Elegant companion services'}
          className="w-full h-full object-cover object-center"
          data-hero-image="true"
          data-image-type={isMobile ? 'mobile' : 'desktop'}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - Minimalist and positioned at bottom */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-8 md:pb-16 text-center text-white">
        <div className="max-w-2xl mx-auto">
          {/* H1 - Título principal */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-4 text-white font-light tracking-wide leading-tight">
            {heroContent.title}
          </h1>
          
          {/* H2 - Subtítulo */}
          <h2 className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 font-light">
            {heroContent.subtitle}
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <SafeLink to={heroContent.button_primary_url || "/models"} className="inline-block">
              <button className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs">
                {heroContent.button_primary_text || "View Models"}
              </button>
            </SafeLink>
            
            <a href={heroContent.button_secondary_url || "https://wa.me/447436190679"} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto border border-white text-white hover:bg-white hover:text-black px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs text-center">
              {heroContent.button_secondary_text || "Book Now"}
            </a>
          </div>
        </div>
      </div>
      

      {/* Hidden SEO Content - Invisible but indexable */}
      <div className="sr-only">
        <p>Five London offers exclusive escort services with sophisticated companions available throughout London's most prestigious districts including Mayfair W1, Knightsbridge SW1, Chelsea SW3, and Belgravia. Our elite escort agency provides discreet, professional companion services for business events, social occasions, dinner dates, and cultural experiences.</p>
        <p>Available 24/7 for outcall services to luxury hotels including The Ritz London, Claridge's, The Savoy, and Shangri-La at The Shard. Our carefully vetted international models offer uncompromising quality, intelligence, and elegance for discerning clients seeking premium escort services in Central London.</p>
        <p>Specializing in high-class entertainment, business accompaniment, social events, and cultural experiences throughout London's exclusive areas. Complete discretion guaranteed with professional, sophisticated companions fluent in multiple languages and experienced in international business and social etiquette.</p>
      </div>
    </section>
  );
};