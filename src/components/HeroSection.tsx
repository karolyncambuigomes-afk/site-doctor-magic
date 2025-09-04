import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-subtle">
      {/* Background Image/Video Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Minimal Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-12">
          <h1 className="text-6xl md:text-8xl font-light tracking-[0.2em] text-white">
            FIVE LONDON
          </h1>
          
          {/* Minimal Call-to-Action */}
          <div className="space-y-6">
            <Link to="/models">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-12 py-4 text-lg tracking-wider">
                DISCOVER
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};