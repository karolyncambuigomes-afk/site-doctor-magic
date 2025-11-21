import React from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBannerContent } from '@/hooks/useBannerContent';
import { trackEvent } from '@/utils/tracking';

export const HeroSection: React.FC = () => {
  const { heroContent, loading } = useHomepageContent();
  const { banners: heroBanners } = useBannerContent('hero');
  const isMobile = useIsMobile();

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

  // Progressive loading: Show image immediately if available, text fades in after
  if (!heroImage) {
    return (
      <section className="relative h-screen w-full flex items-end snap-start">
        <div className="absolute inset-0 z-0 bg-gray-900">
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
            <button 
              onClick={() => {
                trackEvent('cta_click', 'hero', 'View Models - Hero');
                const modelsSection = document.getElementById('models-section');
                if (modelsSection) {
                  modelsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              data-tracking-label="View Models - Hero"
              data-tracking-category="hero_cta"
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs cursor-pointer"
            >
              {heroContent?.button_primary_text || "View Models"}
            </button>
              <a 
                href={heroContent?.button_secondary_url || "https://wa.me/447436190679"} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackEvent('link_click', 'hero', 'Book Now - Hero WhatsApp', undefined, { destination: 'whatsapp' })}
                data-tracking-label="Book Now - Hero"
                data-tracking-category="hero_cta"
                className="inline-block w-full sm:w-auto border border-white text-white hover:bg-white hover:text-black px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs text-center"
              >
                {heroContent?.button_secondary_text || "Book Now"}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render hero section with image - show instantly
  return (
    <section className="relative h-screen w-full flex items-end snap-start">
      {/* Background Image - loads immediately */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <img
          src={heroImage}
          alt={heroContent?.title || 'Elegant companion services'}
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - shows immediately */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-8 md:pb-16 text-center text-white">

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-4 text-white font-light tracking-wide leading-tight">
            {heroContent?.title || "Premium London Escort Agency"}
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 font-light">
            {heroContent?.subtitle || "Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea"}
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button 
              onClick={() => {
                trackEvent('cta_click', 'hero', 'View Models - Hero');
                const modelsSection = document.getElementById('models-section');
                if (modelsSection) {
                  modelsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              data-tracking-label="View Models - Hero"
              data-tracking-category="hero_cta"
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs cursor-pointer"
            >
              {heroContent?.button_primary_text || "View Models"}
            </button>
            
            <a 
              href={heroContent?.button_secondary_url || "https://wa.me/447436190679"} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackEvent('link_click', 'hero', 'Book Now - Hero WhatsApp', undefined, { destination: 'whatsapp' })}
              data-tracking-label="Book Now - Hero"
              data-tracking-category="hero_cta"
              className="inline-block w-full sm:w-auto border border-white text-white hover:bg-white hover:text-black px-6 py-3 sm:py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs text-center"
            >
              {heroContent?.button_secondary_text || "Book Now"}
            </a>
          </div>
        </div>
      </div>

      {/* Hidden SEO Content */}
      <div className="sr-only">
        <p>Five London offers exclusive escort services with sophisticated companions available throughout London's most prestigious districts including Mayfair W1, Knightsbridge SW1, Chelsea SW3, and Belgravia. Our elite escort agency provides discreet, professional companion services for business events, social occasions, dinner dates, and cultural experiences.</p>
        <p>Available 24/7 for outcall services to luxury hotels including The Ritz London, Claridge's, The Savoy, and Shangri-La at The Shard. Our carefully vetted international models offer uncompromising quality, intelligence, and elegance for discerning clients seeking premium escort services in Central London.</p>
        <p>Specializing in high-class entertainment, business accompaniment, social events, and cultural experiences throughout London's exclusive areas. Complete discretion guaranteed with professional, sophisticated companions fluent in multiple languages and experienced in international business and social etiquette.</p>
      </div>
    </section>
  );
};
