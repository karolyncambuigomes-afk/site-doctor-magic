import React, { useState, useEffect } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBannerContent } from '@/hooks/useBannerContent';

export const HeroSection: React.FC = () => {
  const { heroContent, loading } = useHomepageContent();
  const { banners: heroBanners } = useBannerContent('hero');
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the appropriate hero image
  const heroImage = React.useMemo(() => {
    if (!heroBanners || heroBanners.length === 0) return null;
    
    const allBanner = heroBanners.find(b => b.device_type === 'all' && b.is_active);
    const deviceBanner = heroBanners.find(b => 
      b.device_type === (isMobile ? 'mobile' : 'desktop') && b.is_active
    );
    
    const activeBanner = deviceBanner || allBanner;
    return activeBanner?.image_url || null;
  }, [heroBanners, isMobile]);

  // Preload image
  useEffect(() => {
    if (heroImage) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = heroImage;
    }
  }, [heroImage]);

  // Progressive loading: Show image immediately if available, text fades in after
  if (!heroImage) {
    return (
      <section className="relative h-screen w-full flex items-end snap-start">
      <div className="absolute inset-0 z-0 bg-white">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-8 md:pb-16 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-4 text-white font-light tracking-wide leading-tight">
              {heroContent?.title || "Premium London Escort Agency"}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 font-light">
              {heroContent?.subtitle || "Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea"}
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <SafeLink to={heroContent?.button_primary_url || "/models"} className="inline-block">
              <button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs">
                {heroContent?.button_primary_text || "View Models"}
              </button>
            </SafeLink>
            <a href={heroContent?.button_secondary_url || "https://wa.me/447436190679"} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs text-center">
              {heroContent?.button_secondary_text || "Book Now"}
            </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render hero section with image - show image immediately, fade in text
  return (
    <section className="relative h-screen w-full flex items-end snap-start">
      {/* Background Image - loads immediately */}
      <div className="absolute inset-0 z-0 bg-white">
        <img
          src={heroImage}
          alt={heroContent?.title || 'Elegant companion services'}
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - fades in after image loads or after loading completes */}
      <div 
        className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-8 md:pb-16 text-center text-white transition-opacity duration-500 ${
          imageLoaded || !loading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-4 text-white font-light tracking-wide leading-tight">
            {heroContent?.title || "Premium London Escort Agency"}
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 font-light">
            {heroContent?.subtitle || "Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea"}
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <SafeLink to={heroContent?.button_primary_url || "/models"} className="inline-block">
              <button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs">
                {heroContent?.button_primary_text || "View Models"}
              </button>
            </SafeLink>
            
            <a href={heroContent?.button_secondary_url || "https://wa.me/447436190679"} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs text-center">
              {heroContent?.button_secondary_text || "Book Now"}
            </a>
          </div>
        </div>
      </div>

      <div className="sr-only">
        <p>Five London offers exclusive escort services with sophisticated companions available throughout London's most prestigious districts including Mayfair W1, Knightsbridge SW1, Chelsea SW3, and Belgravia. Our elite escort agency provides discreet, professional companion services for business events, social occasions, dinner dates, and cultural experiences.</p>
        {heroContent?.content && <div dangerouslySetInnerHTML={{ __html: heroContent.content }} />}
      </div>
    </section>
  );
};
