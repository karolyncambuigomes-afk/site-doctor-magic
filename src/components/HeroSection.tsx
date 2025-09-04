import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-primary">
      {/* Five London Hero Overlay */}
      <div className="five-london-hero-overlay z-10"></div>
      
      {/* Ultra Minimal Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-16">
          <h1 className="heading-hero text-white text-shadow-luxury">
            FIVE LONDON
          </h1>
          
          {/* Minimal Subtitle */}
          <p className="body-luxury text-white/80 tracking-[0.2em] uppercase">
            Luxury Companions
          </p>
          
          {/* Five London CTA */}
          <div className="space-y-8">
            <Link to="/models">
              <Button className="five-london-button-outline bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                DISCOVER
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/70 flex justify-center">
          <div className="w-1 h-3 bg-white/70 mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};