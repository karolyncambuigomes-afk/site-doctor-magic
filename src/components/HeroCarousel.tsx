import { useState, useEffect } from 'react';
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

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [videoLoaded, setVideoLoaded] = useState<{[key: string]: boolean}>({});
  const [showVideo, setShowVideo] = useState<{[key: string]: boolean}>({});
  const [settings, setSettings] = useState({
    auto_play: true,
    slide_duration: 5000,
    show_dots: true,
    show_scroll_indicator: true,
    overlay_opacity: 30
  });

  // Load slides and settings from database
  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      // Load slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('active', true)
        .order('order_index');

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1);

      if (slidesData) {
        setHeroSlides(slidesData);
      }

      if (settingsData && settingsData[0]) {
        setSettings(settingsData[0]);
      }
    } catch (error) {
      console.error('HeroCarousel: Error loading hero data:', error);
      // Fallback to default slides if database fails
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
    }
  };

  // Preload videos after page load
  useEffect(() => {
    if (heroSlides.length === 0) return;
    
    // Start loading videos in background after a small delay
    const timer = setTimeout(() => {
      heroSlides.forEach((slide, index) => {
        if (slide.media_type === 'video' && slide.video_url && !videoLoaded[slide.id]) {
          // For current slide, show video immediately
          if (index === currentSlide) {
            setShowVideo(prev => ({ ...prev, [slide.id]: true }));
          }
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [heroSlides, currentSlide, videoLoaded]);

  // Auto-play functionality
  useEffect(() => {
    if (!settings.auto_play || heroSlides.length === 0) return;
    
    const interval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % heroSlides.length);
    }, settings.slide_duration);

    return () => clearInterval(interval);
  }, [currentSlide, settings.auto_play, settings.slide_duration, heroSlides.length]);

  const handleSlideChange = (slideIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(slideIndex);
      setIsTransitioning(false);
    }, 150);
  };

  const handleDotClick = (index: number) => {
    if (index !== currentSlide) {
      handleSlideChange(index);
    }
  };

  if (heroSlides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Media */}
          <div className="absolute inset-0">
            {slide.media_type === 'video' && slide.video_url ? (
              <>
                {/* Always show poster image first */}
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    showVideo[slide.id] && videoLoaded[slide.id] ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                
                {/* Video loads progressively */}
                {showVideo[slide.id] && (
                  <video
                    key={`${slide.id}-video`}
                    src={slide.video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    controls={false}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      videoLoaded[slide.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ pointerEvents: 'none' }}
                    onLoadedData={(e) => {
                      const video = e.target as HTMLVideoElement;
                      setVideoLoaded(prev => ({ ...prev, [slide.id]: true }));
                      video.currentTime = 0;
                      video.play().catch(console.error);
                    }}
                    onCanPlayThrough={(e) => {
                      const video = e.target as HTMLVideoElement;
                      video.play().catch(console.error);
                    }}
                  />
                )}
              </>
            ) : (
              <img
                src={slide.image_url}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0" style={{backgroundColor: `rgba(0, 0, 0, ${settings.overlay_opacity / 100})`}}></div>
          </div>

          {/* Content */}
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


      {/* Navigation Dots - Bottom Center */}
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

      {/* Scroll Indicator */}
      {settings.show_scroll_indicator && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="w-px h-8 bg-white/40"></div>
        </div>
      )}
    </section>
  );
};