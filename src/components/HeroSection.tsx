import React, { useState, useMemo } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBannerContent } from '@/hooks/useBannerContent';

export const HeroSection: React.FC = () => {
  console.log('🎯 [HeroSection] Component rendering started');
  
  const { heroContent, loading } = useHomepageContent();
  const { banners: heroBanners, loading: bannersLoading } = useBannerContent('hero');
  const isMobile = useIsMobile();

  // Get image from Supabase banners
  const heroImage = useMemo(() => {
    console.log('🎯 [HeroSection] Banner data:', { heroBanners, loading: bannersLoading });
    
    if (!heroBanners || heroBanners.length === 0) {
      console.log('🎯 [HeroSection] No banners found');
      return null;
    }
    
    // Find the active banner for current device type
    const allBanner = heroBanners.find(b => b.device_type === 'all' && b.is_active);
    const deviceBanner = heroBanners.find(b => 
      b.device_type === (isMobile ? 'mobile' : 'desktop') && b.is_active
    );
    
    // Prefer device-specific banner, fallback to 'all' banner
    const activeBanner = deviceBanner || allBanner;
    
    console.log('🎯 [HeroSection] Active banner:', {
      isMobile,
      deviceBanner: deviceBanner?.image_url,
      allBanner: allBanner?.image_url,
      selected: activeBanner?.image_url
    });

    return activeBanner?.image_url || null;
  }, [heroBanners, isMobile]);


  if (loading || bannersLoading) {
    return (
      <section className="relative h-screen w-full flex items-end snap-start">
        <div className="absolute inset-0 z-0 bg-gray-900">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-sm">Loading hero content...</div>
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

  if (!heroImage) {
    return (
      <section className="relative h-screen w-full flex items-end snap-start">
        <div className="absolute inset-0 z-0 bg-gray-900">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-sm">No hero image configured. Please add one in the admin panel.</div>
          </div>
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-8 md:pb-16 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-4 text-white font-light tracking-wide leading-tight">
              {heroContent?.title || "Premium London Escort Agency"}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 font-light">
              {heroContent?.subtitle || "Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea"}
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <SafeLink to={heroContent?.button_primary_url || "/models"} className="inline-block">
                <button className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs">
                  {heroContent?.button_primary_text || "View Models"}
                </button>
              </SafeLink>
              <a href={heroContent?.button_secondary_url || "https://wa.me/447436190679"} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto border border-white text-white hover:bg-white hover:text-black px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs text-center">
                {heroContent?.button_secondary_text || "Book Now"}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render hero section with image
  console.log('🎯 [HeroSection] Rendering with image:', heroImage);
  
  return (
    <section className="relative h-screen w-full flex items-end snap-start">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* Hero Image from Supabase */}
        <img
          src={heroImage}
          alt={heroContent?.title || 'Elegant companion services'}
          className="w-full h-full object-cover object-center"
          data-hero-image="true"
          data-image-type={isMobile ? 'mobile' : 'desktop'}
          onError={(e) => {
            console.error('🎯 [HeroSection] Image failed to load:', heroImage);
            e.currentTarget.style.display = 'none';
          }}
          onLoad={() => {
            console.log('🎯 [HeroSection] Image loaded successfully:', heroImage);
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - Minimalist and positioned at bottom */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-8 md:pb-16 text-center text-white">
        <div className="max-w-2xl mx-auto">
          {/* H1 - Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-4 text-white font-light tracking-wide leading-tight">
            {heroContent?.title || "Premium London Escort Agency"}
          </h1>
          
          {/* H2 - Subtitle */}
          <h2 className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 font-light">
            {heroContent?.subtitle || "Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea"}
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <SafeLink to={heroContent?.button_primary_url || "/models"} className="inline-block">
              <button className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs">
                {heroContent?.button_primary_text || "View Models"}
              </button>
            </SafeLink>
            
            <a href={heroContent?.button_secondary_url || "https://wa.me/447436190679"} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto border border-white text-white hover:bg-white hover:text-black px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs text-center">
              {heroContent?.button_secondary_text || "Book Now"}
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