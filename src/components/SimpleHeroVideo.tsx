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
  }, []);

  return (
    <section className="relative min-h-screen h-screen overflow-hidden flex items-center justify-center">
      {/* Background Media */}
      <div className="absolute inset-0">
        {/* Static background image - only shows for image type */}
        {heroContent.media_type === 'image' && (
          <img
            src={heroContent.image_url}
            alt="Five London"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Video overlay - loads instantly */}
        {heroContent.media_type === 'video' && heroContent.video_url && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="w-full h-full object-cover"
            style={{ 
              pointerEvents: 'none',
              objectFit: 'cover'
            }}
            onLoadedData={() => setIsLoaded(true)}
            onError={(e) => {
              console.error('Video failed to load:', e);
              setIsLoaded(false);
            }}
            onCanPlay={(e) => {
              const video = e.currentTarget;
              console.log('Video can play, attempting autoplay...');
              video.play().then(() => {
                console.log('Video playing successfully');
              }).catch((error) => {
                console.error('Autoplay failed:', error);
                // Fallback: Try to play after a brief delay
                setTimeout(() => {
                  video.play().catch(() => {
                    console.log('Autoplay blocked by browser policy');
                  });
                }, 100);
              });
            }}
            onLoadStart={() => console.log('Video started loading')}
            onLoadedMetadata={() => console.log('Video metadata loaded')}
          >
            <source src={heroContent.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Dark overlay */}
        <div 
          className="absolute inset-0 z-10" 
          style={{backgroundColor: `rgba(0, 0, 0, ${heroContent.overlay_opacity / 100})`}}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
              {heroContent.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              {heroContent.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to={heroContent.button_link}>
                <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors hover-scale">
                  {heroContent.button_text}
                </button>
              </Link>
              
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors hover-scale">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {heroContent.show_scroll_indicator && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="w-px h-8 bg-white/40"></div>
        </div>
      )}
    </section>
  );
};