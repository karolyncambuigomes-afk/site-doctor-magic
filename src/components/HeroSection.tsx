import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <>
      {/* Loro Piana Style - Fullscreen Hero */}
      <section className="h-screen relative overflow-hidden">
        {/* Background Video/Image - Fullscreen */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            poster="/video/woman-walking-preview.jpg"
          >
            <source src="/video/woman-walking.mp4" type="video/mp4" />
            {/* Fallback background */}
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/video/woman-walking-preview.jpg')"
              }}
            ></div>
          </video>
          {/* Subtle overlay only on mobile for readability */}
          <div className="absolute inset-0 bg-black/10 md:bg-transparent"></div>
        </div>
        
        {/* Bottom Content - Only visible on larger screens */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
          <div className="text-center space-y-6">
            <div className="text-white/80 text-sm tracking-[0.3em] uppercase font-light">
              Luxury Companions
            </div>
            <Link to="/models">
              <button className="bg-white/90 backdrop-blur-sm text-black px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-white transition-all duration-300 font-medium">
                Discover
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile CTA - Positioned at bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 md:hidden">
          <Link to="/models">
            <button className="bg-white/95 backdrop-blur-sm text-black px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium rounded-full">
              Discover
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};