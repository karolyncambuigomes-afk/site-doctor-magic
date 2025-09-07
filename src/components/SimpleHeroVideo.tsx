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
  const [content, setContent] = useState<HeroContent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadContent = () => {
      try {
        // Limpa localStorage antigo que pode estar causando conflito
        const saved = localStorage.getItem('simple-hero-content');
        console.log('=== HERO DEBUG ===');
        console.log('Device width:', window.innerWidth);
        console.log('Raw localStorage:', saved);
        
        if (saved) {
          const savedContent = JSON.parse(saved);
          console.log('Loaded image_url:', savedContent.image_url);
          console.log('Media type:', savedContent.media_type);
          setContent(savedContent);
        } else {
          // Usar valores padrão limpos
          const defaultContent = {
            id: 'main-hero',
            title: 'Five London',
            subtitle: 'Premier luxury companion services', 
            button_text: 'View Our Models',
            button_link: '/models',
            image_url: '/images/model1.jpg', // Use a mesma imagem padrão em todos os casos
            video_url: null,
            media_type: 'image' as const,
            overlay_opacity: 70,
            show_scroll_indicator: true
          };
          console.log('Using default image_url:', defaultContent.image_url);
          setContent(defaultContent);
          // Salva o padrão para sincronizar entre dispositivos
          localStorage.setItem('simple-hero-content', JSON.stringify(defaultContent));
        }
        console.log('=== END DEBUG ===');
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading hero content:', error);
        setIsLoaded(true);
      }
    };

    loadContent();
  }, []);

  // Não renderizar até ter carregado o conteúdo
  if (!isLoaded || !content) {
    return (
      <section className="relative w-full h-screen min-h-[100dvh] max-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen min-h-[100dvh] max-h-screen overflow-hidden bg-black">
      {/* Debug Info */}
      <div className="absolute top-4 left-4 z-50 text-white text-xs bg-black/50 p-2 rounded">
        Device: {window.innerWidth}px | Image: {content.image_url.split('/').pop()}
      </div>
      
      {/* Background Media */}
      {content.media_type === 'video' && content.video_url ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster={content.image_url}
          key={content.video_url} // Force re-render on URL change
        >
          <source src={content.video_url} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${content.image_url})`,
          }}
          key={content.image_url} // Force re-render on image change
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