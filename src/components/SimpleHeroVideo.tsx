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
    // Carregar configurações do localStorage
    const saved = localStorage.getItem('simple-hero-content');
    if (saved) {
      try {
        setHeroContent(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading hero content:', error);
      }
    }

    // Force video play on any user interaction
    const forceVideoPlay = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (video.paused) {
          video.play().catch(() => {
            console.log('Could not autoplay video');
          });
        }
      });
    };

    // Listen for any user interaction to force video play
    const events = ['click', 'scroll', 'touchstart', 'keydown', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, forceVideoPlay, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, forceVideoPlay);
      });
    };
  }, []);

  return (
    <section className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ width: '100vw', height: '100vh' }}
          onLoadedData={() => {
            console.log('Video loaded successfully');
            setIsLoaded(true);
          }}
          onError={(e) => {
            console.error('Video failed to load:', e);
          }}
        >
          <source src="/video/woman-walking-preview.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl">
              Five London
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Premier luxury companion services
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/models">
                <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
                  View Our Models
                </button>
              </Link>
              
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors transform hover:scale-105">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-px h-8 bg-white/50"></div>
      </div>
    </section>
  );
};