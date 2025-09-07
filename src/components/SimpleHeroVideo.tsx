export const SimpleHeroVideo = () => {
  return (
    <section className="relative w-full h-screen min-h-[100dvh] max-h-screen overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 max-w-xl md:max-w-2xl mx-auto">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide leading-tight">
              Five London
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 font-light tracking-wide leading-relaxed">
              Premier luxury companion services
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <a href="/models" className="inline-block">
                <button className="w-full sm:w-auto px-8 py-3 text-sm uppercase tracking-widest font-light border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300">
                  View Our Models
                </button>
              </a>
              
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="w-full sm:w-auto px-8 py-3 text-sm uppercase tracking-widest font-light border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300">
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