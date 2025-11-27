import { Link } from 'react-router-dom';
import { SEOOptimized } from '@/components/SEOOptimized';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
import { characteristics } from '@/data/characteristics';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { useContactSettings } from '@/hooks/useContactSettings';

const Characteristics = () => {
  const { getWhatsAppLink } = useContactSettings();
  
  return (
    <>
      <SEOOptimized 
        title="Find Escorts by Characteristics | Five London"
        description="Browse our stunning escorts by their unique characteristics. Find high-class, bi-sexual, open-minded, sophisticated companions in London."
        keywords="escort characteristics, high class escorts, bi sexual escorts, open minded escorts, sophisticated escorts london"
        canonicalUrl="/characteristics"
      />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-0">
          {/* Hero Section */}
          <section className="pt-20 pb-16 md:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                  Escorts by Characteristics
                </h1>
                <p className="luxury-body-lg text-black mb-12 md:mb-12">
                  Discover companions with specific traits that match your preferences.
                </p>
              </div>
            </div>
            {/* Elegant separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
          </section>

          {/* Characteristics Grid */}
          <section className="py-12 md:py-16 lg:py-20 bg-white">
            <div className="container-width">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4 sm:px-6">
                {characteristics.map((characteristic) => (
                  <Link 
                    key={characteristic.id} 
                    to={`/characteristics/${characteristic.slug}`}
                    className="group"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full h-12 sm:h-14 md:h-16 px-3 sm:px-4 md:px-6 justify-center hover:shadow-elegant transition-smooth group-hover:border-primary"
                    >
                      <span className="luxury-body-sm tracking-wider group-hover:text-primary transition-colors text-center">
                        {characteristic.name}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center mb-8 text-gray-800">
            Find Your Perfect Companion
          </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Physical Characteristics</h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Our diverse selection of companions includes sophisticated ladies with varying physical attributes, from elegant brunettes to stunning blondes, petite companions to statuesque beauties, ensuring the perfect match for your preferences.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Elegant Sophistication</h4>
                      <p className="luxury-body-xs text-muted-foreground">High-class companions with refined appearance and impeccable presentation for London's most exclusive venues.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Diverse Selection</h4>
                      <p className="luxury-body-xs text-muted-foreground">Wide range of ethnicities, ages, and physical types to match your specific preferences and requirements.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Personality Traits</h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Beyond physical beauty, our companions are selected for their intelligence, sophistication, and engaging personalities. Whether you prefer vivacious conversation or quiet elegance, we have the perfect companion for your occasion.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Intellectual Companions</h4>
                      <p className="luxury-body-xs text-muted-foreground">Well-educated companions capable of engaging conversation on diverse topics from business to arts and culture.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Social Adaptability</h4>
                      <p className="luxury-body-xs text-muted-foreground">Companions skilled in various social settings, from intimate dinners to high-profile business events across London.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="luxury-heading-lg mb-4 sm:mb-6 text-black">
                  Looking for Something Specific?
                </h2>
                <p className="luxury-body-lg text-black mb-6 sm:mb-8">
                  Can't find the exact characteristics you're looking for? Contact us to find your perfect match.
                </p>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        </main>
        
        <ContactBar showOnScroll={false} />
        <Footer />
      </div>
    </>
  );
};

export default Characteristics;