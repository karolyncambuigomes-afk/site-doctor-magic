import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-40"
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
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-24 w-px h-24 bg-white/10"></div>
      <div className="absolute top-1/3 right-32 w-2 h-2 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-1/4 right-24 w-px h-24 bg-white/10"></div>
      <div className="absolute bottom-1/3 left-32 w-2 h-2 bg-white/20 rounded-full"></div>
      
      {/* Ultra Minimal Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="container-width text-center">
          <div className="max-w-4xl mx-auto space-y-20">
            {/* Main Headline */}
            <div className="space-y-12">
              <h1 className="heading-hero text-white">
                Five London
              </h1>
              
              {/* Minimal Tagline */}
              <div className="space-y-8">
                <p className="body-luxury text-white/80 tracking-[0.2em] uppercase">
                  Luxury Companions
                </p>
                <div className="w-24 h-px bg-white/40 mx-auto"></div>
              </div>
            </div>
            
            {/* Minimal CTA */}
            <div className="space-y-8">
              <Link to="/models">
                <button className="bg-white text-black px-12 py-4 text-sm tracking-[0.1em] uppercase hover:bg-white/90 transition-all duration-500 font-light">
                  Discover
                </button>
              </Link>
              
              <p className="text-white/60 text-sm tracking-[0.2em] uppercase font-light">
                Discreet • Sophisticated • Exclusive
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with Elegant Emoji */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-white/30 text-2xl animate-bounce">
          ⬇
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent mt-4"></div>
      </div>
    </section>
  );
};