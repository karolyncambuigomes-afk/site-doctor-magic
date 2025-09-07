import heroMain from '@/assets/hero-main.jpg';

export const HeroSection = () => {
  return (
    <section className="relative w-full h-screen min-h-[100dvh] max-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroMain})`,
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-end justify-center pb-20 md:pb-24">
        <div className="text-center px-4 sm:px-6 max-w-md mx-auto">
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-lg sm:text-xl md:text-2xl font-light text-white tracking-[0.3em] uppercase leading-tight">
              Five London
            </h1>
            
            <p className="text-xs sm:text-sm text-white/70 font-light tracking-[0.2em] uppercase leading-relaxed">
              Premier luxury companion services
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-6">
              <a href="/models" className="inline-block">
                <button className="px-6 py-2 text-xs uppercase tracking-[0.25em] font-light border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300">
                  View Our Models
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
        <div className="w-px h-8 bg-white/50"></div>
      </div>
    </section>
  );
};