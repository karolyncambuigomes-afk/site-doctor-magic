import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <div className="container-width section-padding text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="heading-xl minimal-text">
            Five London
          </h1>
          <div className="w-24 h-px bg-foreground mx-auto"></div>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            Sophisticated companionship for discerning gentlemen in London. 
            Experience elegance, discretion, and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link to="/models">
              <Button className="minimal-button">
                View Our Models
              </Button>
            </Link>
            <a 
              href="tel:+442045678901" 
              className="body-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              Call +44 20 4567 8901
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};