import { useState, useEffect } from 'react';
import heroElegantWoman from '@/assets/hero-elegant-woman.jpg';

interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_url: string;
  video_url: string | null;
  media_type: 'image' | 'video';
  overlay_opacity: number;
  show_scroll_indicator: boolean;
}

export const SimpleHeroVideo = () => {
  const [content, setContent] = useState<HeroContent>({
    id: 'main-hero',
    title: 'Five London',
    subtitle: 'Premier luxury companion services',
    button_text: 'View Our Models',
    button_link: '/models',
    image_url: heroElegantWoman,
    video_url: null,
    media_type: 'image',
    overlay_opacity: 70,
    show_scroll_indicator: true
  });

  useEffect(() => {
    // Carregar configurações salvas do admin
    const loadContent = () => {
      const saved = localStorage.getItem('simple-hero-content');
      if (saved) {
        try {
          const savedContent = JSON.parse(saved);
          console.log('Hero content loaded:', savedContent);
          setContent(savedContent);
        } catch (error) {
          console.error('Error loading hero content:', error);
        }
      } else {
        console.log('No saved hero content found, using defaults');
      }
    };

    loadContent();

    // Força reload quando a página é focada (útil para mobile)
    const handleFocus = () => {
      loadContent();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[100dvh] max-h-screen overflow-hidden bg-black">
      {/* Background Media */}
      {content.media_type === 'video' && content.video_url ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster={content.image_url}
        >
          <source src={content.video_url} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${content.image_url})`,
          }}
        ></div>
      )}
      
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${content.overlay_opacity / 100})`
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-end justify-center pb-20 md:pb-24">
        <div className="text-center px-4 sm:px-6 max-w-md mx-auto">
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-lg sm:text-xl md:text-2xl font-light text-white tracking-[0.3em] uppercase leading-tight">
              {content.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-white/70 font-light tracking-[0.2em] uppercase leading-relaxed">
              {content.subtitle}
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-6">
              <a href={content.button_link} className="inline-block">
                <button className="px-6 py-2 text-xs uppercase tracking-[0.25em] font-light border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300">
                  {content.button_text}
                </button>
              </a>
              
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="px-6 py-2 text-xs uppercase tracking-[0.25em] font-light border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300">
                  Contact
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {content.show_scroll_indicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="w-px h-8 bg-white/50"></div>
        </div>
      )}
    </section>
  );
};