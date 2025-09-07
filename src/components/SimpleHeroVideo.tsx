import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeroContent {
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Five London',
    subtitle: 'Premier luxury companion services',
    button_text: 'View Our Models',
    button_link: '/models',
    image_url: '/images/model1.jpg',
    video_url: '/video/woman-walking-preview.mp4',
    media_type: 'video',
    overlay_opacity: 30,
    show_scroll_indicator: true
  });

  useEffect(() => {
    // Detectar se é mobile ou desktop
    const isMobile = window.innerWidth < 768;
    console.log(`SimpleHeroVideo: Loading on ${isMobile ? 'mobile' : 'desktop'} device`);
    
    // Garantir sincronização entre mobile e desktop
    const syncHeroContent = () => {
      const saved = localStorage.getItem('simple-hero-content');
      console.log('Hero content from localStorage:', saved);
      
      if (saved) {
        try {
          const parsedContent = JSON.parse(saved);
          console.log('Applying hero content:', parsedContent);
          setHeroContent(parsedContent);
        } catch (error) {
          console.error('Error parsing hero content:', error);
          // Se houver erro, salvar configuração padrão
          const defaultContent = heroContent;
          localStorage.setItem('simple-hero-content', JSON.stringify(defaultContent));
          console.log('Saved default hero content to localStorage');
        }
      } else {
        // Se não existir configuração salva, salvar a configuração padrão
        const defaultContent = heroContent;
        localStorage.setItem('simple-hero-content', JSON.stringify(defaultContent));
        console.log('No saved hero content found, saved defaults to localStorage');
      }
    };

    // Executar sincronização
    syncHeroContent();

    // Adicionar listener para mudanças na tela (mobile/desktop)
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        console.log(`Device changed from ${isMobile ? 'mobile' : 'desktop'} to ${newIsMobile ? 'mobile' : 'desktop'}`);
        syncHeroContent();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Listener para mudanças no localStorage (sincronização entre abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'simple-hero-content') {
        console.log('Hero content changed in another tab, syncing...');
        syncHeroContent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Enhanced video play functionality for both mobile and desktop
    const forceVideoPlay = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (video.paused) {
          video.play().catch(() => {
            // Silent fail if autoplay is blocked
          });
        }
      });
    };

    // More comprehensive event listeners for both mobile and desktop
    const events = ['click', 'scroll', 'touchstart', 'touchend', 'keydown', 'mousemove', 'mouseenter', 'focus'];
    events.forEach(event => {
      document.addEventListener(event, forceVideoPlay, { once: true, passive: true });
    });

    // Additional desktop-specific triggers
    const desktopEvents = ['mousedown', 'mouseup', 'wheel'];
    desktopEvents.forEach(event => {
      document.addEventListener(event, forceVideoPlay, { once: true, passive: true });
    });

    // Immediate play attempt for desktop
    setTimeout(() => {
      forceVideoPlay();
    }, 500);

    return () => {
      [...events, ...desktopEvents].forEach(event => {
        document.removeEventListener(event, forceVideoPlay);
      });
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  console.log('SimpleHeroVideo rendering:', { heroContent, isLoaded });
  
  return (
    <section className="relative w-full h-screen min-h-[100dvh] max-h-screen overflow-hidden bg-red-500 touch-pan-y">{" "}
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {heroContent.media_type === 'video' && heroContent.video_url ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            webkit-playsinline="true"
            x5-playsinline="true"
            className="w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
            onLoadedData={() => setIsLoaded(true)}
            onError={(e) => {
              console.error('Video failed to load:', e);
            }}
          >
            <source src={heroContent.video_url} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroContent.image_url}
            alt={heroContent.title}
            className="w-full h-full object-cover"
            onLoad={() => setIsLoaded(true)}
          />
        )}
        
        {/* Dynamic overlay */}
        <div 
          className="absolute inset-0 bg-black z-10"
          style={{ opacity: heroContent.overlay_opacity / 100 }}
        ></div>
      </div>

      {/* Content - Prada Style - Responsivo */}
      <div className="relative z-20 h-full flex items-end justify-center pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="text-center px-4 sm:px-6 max-w-xl md:max-w-2xl mx-auto">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-wide leading-tight">
              {heroContent.title}
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/80 font-light tracking-wide leading-relaxed">
              {heroContent.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-4 sm:pt-6">
              <Link to={heroContent.button_link}>
                <button className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 text-xs md:text-sm uppercase tracking-widest font-light border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300">
                  {heroContent.button_text}
                </button>
              </Link>
              
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 text-xs md:text-sm uppercase tracking-widest font-light border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300">
                  Contact
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {heroContent.show_scroll_indicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="w-px h-8 bg-white/50"></div>
        </div>
      )}
    </section>
  );
};