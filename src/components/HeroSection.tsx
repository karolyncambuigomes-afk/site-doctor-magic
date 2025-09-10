import React, { useState, useMemo, useEffect } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { OptimizedImage } from '@/components/OptimizedImage';
import { addCacheBusting } from '@/utils/imageCacheBuster';
import { syncModelMainImages } from '@/utils/modelImageSyncManager';

export const HeroSection: React.FC = () => {
  const { heroContent, loading } = useHomepageContent();
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Removed auto-sync to prevent potential issues
  useEffect(() => {
    console.log('🎯 [HeroSection] Component mounted without auto-sync');
  }, []);

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

  // Determine which image to use based on device type with robust fallback
  const primaryImage = useMemo(() => {
    console.log('🖼️ [HERO] Determinando imagem para exibição');
    console.log('🖼️ [HERO] - Device: ', isMobile ? 'Mobile 📱' : 'Desktop 🖥️');
    console.log('🖼️ [HERO] - image_url_mobile:', heroContent.image_url_mobile);
    console.log('🖼️ [HERO] - image_url_desktop:', heroContent.image_url_desktop);
    console.log('🖼️ [HERO] - image_url (fallback):', heroContent.image_url);
    
    // Cascading fallback: device-specific -> general -> local assets
    const candidates = [
      isMobile ? heroContent.image_url_mobile : heroContent.image_url_desktop,
      heroContent.image_url,
      '/src/assets/hero-main.webp',
      '/src/assets/hero-elegant-woman.webp',
      '/lovable-uploads/4b8ba540-676f-4e57-9771-9e3a6638f837.png'
    ];
    
    let selectedImage: string = '';
    let source = 'unknown';
    
    for (const candidate of candidates) {
      if (isValidUrl(candidate)) {
        selectedImage = candidate;
        if (candidate === heroContent.image_url_mobile) source = 'Mobile específica';
        else if (candidate === heroContent.image_url_desktop) source = 'Desktop específica';
        else if (candidate === heroContent.image_url) source = 'Fallback geral';
        else source = 'Asset local';
        break;
      }
    }
    
    console.log('✅ [HERO] Imagem selecionada:', selectedImage);
    console.log('📍 [HERO] Origem:', source);
    
    // Only apply cache busting to Supabase URLs
    if (selectedImage.includes('supabase.co')) {
      const finalImage = addCacheBusting(selectedImage);
      console.log('🔄 [HERO] Com cache busting:', finalImage);
      return finalImage;
    }
    
    return selectedImage;
  }, [isMobile, heroContent.image_url_mobile, heroContent.image_url_desktop, heroContent.image_url]);

  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);
  const fallbackImages = [
    '/src/assets/hero-main.webp',
    '/src/assets/hero-elegant-woman.webp',
    '/src/assets/hero-second-banner.webp'
  ];

  const handleImageError = () => {
    console.error('❌ [HERO] Falha ao carregar imagem:', primaryImage);
    
    // Try next fallback image
    if (currentFallbackIndex < fallbackImages.length - 1) {
      console.log('🔄 [HERO] Tentando próximo fallback:', fallbackImages[currentFallbackIndex + 1]);
      setCurrentFallbackIndex(prev => prev + 1);
    } else {
      console.warn('🚨 [HERO] Todos os fallbacks falharam');
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    console.log('Hero image loaded successfully:', primaryImage);
    setImageLoaded(true);
  };

  if (loading) {
    return <section className="relative h-screen w-full flex items-end snap-start">
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
      </section>;
  }

  return <section className="relative h-screen w-full flex items-end snap-start">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <OptimizedImage
          src={imageError ? fallbackImages[fallbackImages.length - 1] : (currentFallbackIndex > 0 ? fallbackImages[currentFallbackIndex] : primaryImage)}
          alt="Elite luxury escorts and sophisticated companions in London's prestigious Mayfair, Knightsbridge, and Chelsea districts offering discreet premium escort services for discerning clientele"
          className="w-full h-full"
          priority={true}
          sizes="100vw"
          onError={handleImageError}
          onLoad={handleImageLoad}
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
    </section>;
};