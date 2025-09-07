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

  console.log('=== HERO VIDEO COMPONENT RENDERED ===');
  console.log('Device info:', {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    userAgent: navigator.userAgent,
    screen: { width: window.screen.width, height: window.screen.height },
    viewport: { width: window.innerWidth, height: window.innerHeight }
  });

  useEffect(() => {
    // Carregar configurações do localStorage
    const loadHeroContent = async () => {
      try {
        const saved = localStorage.getItem('simple-hero-content');
        console.log('Saved hero content from localStorage:', saved);
        
        if (saved) {
          const parsedContent = JSON.parse(saved);
          console.log('Parsed hero content:', parsedContent);
          setHeroContent(parsedContent);
        } else {
          console.log('No saved content found, using default values');
          console.log('Default hero content:', heroContent);
        }
      } catch (error) {
        console.error('Error loading hero content:', error);
      }
    };

    loadHeroContent();

    // Enhanced video play functionality for both mobile and desktop
    const forceVideoPlay = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (video.paused) {
          video.play().then(() => {
            console.log('Video playing successfully');
          }).catch((error) => {
            console.log('Could not autoplay video:', error);
            // Fallback: try again after a short delay
            setTimeout(() => {
              video.play().catch(() => console.log('Fallback video play failed'));
            }, 1000);
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
    };
  }, []);

  console.log('Current hero content state:', heroContent);
  console.log('Media type:', heroContent.media_type);
  console.log('Video URL:', heroContent.video_url);
  console.log('Image URL:', heroContent.image_url);

  console.log('=== RENDERING SECTION ===');
  console.log('About to render section with heroContent:', heroContent);
  console.log('Condition check - media_type === video:', heroContent.media_type === 'video');
  console.log('Condition check - video_url exists:', !!heroContent.video_url);
  console.log('Will render video?', heroContent.media_type === 'video' && heroContent.video_url);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {(() => {
          console.log('=== MEDIA RENDER DECISION ===');
          if (heroContent.media_type === 'video' && heroContent.video_url) {
            console.log('Rendering VIDEO element');
            return (
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
                onLoadedData={() => {
                  console.log('Video loaded successfully');
                  setIsLoaded(true);
                }}
                onError={(e) => {
                  console.error('Video failed to load:', e);
                }}
                onCanPlay={() => {
                  console.log('Video can play');
                }}
              >
                <source src={heroContent.video_url} type="video/mp4" />
              </video>
            );
          } else {
            console.log('Rendering IMAGE element');
            return (
              <img
                src={heroContent.image_url}
                alt={heroContent.title}
                className="w-full h-full object-cover"
                onLoad={() => setIsLoaded(true)}
              />
            );
          }
        })()}
        
        {/* Dynamic overlay */}
        <div 
          className="absolute inset-0 bg-black z-10"
          style={{ opacity: heroContent.overlay_opacity / 100 }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl">
              {heroContent.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              {heroContent.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to={heroContent.button_link}>
                <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
                  {heroContent.button_text}
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
      {heroContent.show_scroll_indicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="w-px h-8 bg-white/50"></div>
        </div>
      )}
    </section>
  );
};