import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface HeroSlide {
  id: string;
  image_url: string;
  video_url?: string;
  media_type?: 'image' | 'video';
  title: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
}

export const OptimizedHeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    auto_play: true,
    slide_duration: 5000,
    show_dots: true,
    show_scroll_indicator: true,
    overlay_opacity: 30
  });
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      const [slidesResponse, settingsResponse] = await Promise.all([
        supabase
          .from('hero_slides')
          .select('*')
          .eq('active', true)
          .order('order_index'),
        supabase
          .from('hero_settings')
          .select('*')
          .limit(1)
      ]);

      if (slidesResponse.data) {
        setHeroSlides(slidesResponse.data);
        videoRefs.current = new Array(slidesResponse.data.length).fill(null);
      }

      if (settingsResponse.data && settingsResponse.data[0]) {
        setSettings(settingsResponse.data[0]);
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
      setHeroSlides([
        {
          id: '1',
          image_url: '/images/model1.jpg',
          title: 'Five London',
          subtitle: 'Premier luxury companion services',
          button_text: 'View Our Models',
          button_link: '/models'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manage video playback
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (!settings.auto_play || heroSlides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, settings.slide_duration);

    return () => clearInterval(interval);
  }, [settings.auto_play, settings.slide_duration, heroSlides.length, currentSlide]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (heroSlides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0">
            {slide.media_type === 'video' && slide.video_url ? (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={slide.video_url}
                loop
                muted
                playsInline
                preload="none"
                className="w-full h-full object-cover"
                style={{
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}
                onCanPlay={(e) => {
                  if (index === currentSlide) {
                    e.currentTarget.play().catch(() => {});
                  }
                }}
              />
            ) : (
              <img
                src={slide.image_url}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            )}
            <div 
              className="absolute inset-0" 
              style={{backgroundColor: `rgba(0, 0, 0, ${settings.overlay_opacity / 100})`}}
            />
          </div>

          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
                  {slide.title}
                </h1>
                
                {slide.subtitle && (
                  <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                    {slide.subtitle}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                  {slide.button_link && slide.button_text && (
                    <Link to={slide.button_link}>
                      <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors">
                        {slide.button_text}
                      </button>
                    </Link>
                  )}
                  
                  <a 
                    href="https://wa.me/447436190679"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors">
                      Contact Us
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {settings.show_dots && heroSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {settings.show_scroll_indicator && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="w-px h-8 bg-white/40"></div>
        </div>
      )}
    </section>
  );
};