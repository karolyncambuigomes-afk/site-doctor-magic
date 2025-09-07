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
    const saved = localStorage.getItem('simple-hero-content');
    if (saved) {
      try {
        const savedContent = JSON.parse(saved);
        setContent(savedContent);
      } catch (error) {
        console.error('Error loading hero content:', error);
      }
    }
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
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 max-w-xl md:max-w-2xl mx-auto">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide leading-tight">
              {content.title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 font-light tracking-wide leading-relaxed">
              {content.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <a href={content.button_link} className="inline-block">
                <button className="w-full sm:w-auto px-8 py-3 text-sm uppercase tracking-widest font-light border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300">
                  {content.button_text}
                </button>
              </a>
              
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="w-full sm:w-auto px-8 py-3 text-sm uppercase tracking-widest font-light border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300">
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