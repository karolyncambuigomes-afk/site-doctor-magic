import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-hero">      
      {/* Ultra Minimal Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="container-width text-center">
          <div className="max-w-4xl mx-auto space-y-20">
            {/* Main Headline */}
            <div className="space-y-12">
              <h1 className="heading-hero text-foreground">
                Five London
              </h1>
              
              {/* Minimal Tagline */}
              <div className="space-y-8">
                <p className="body-luxury text-muted-foreground tracking-[0.2em] uppercase">
                  Luxury Companions
                </p>
                <div className="w-24 h-px bg-accent mx-auto"></div>
              </div>
            </div>
            
            {/* Minimal CTA */}
            <div className="space-y-8">
              <Link to="/models">
                <button className="five-london-button-outline">
                  Discover
                </button>
              </Link>
              
              <p className="caption">
                Discreet • Sophisticated • Exclusive
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-b from-muted-foreground to-transparent"></div>
      </div>
    </section>
  );
};