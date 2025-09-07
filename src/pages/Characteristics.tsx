import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { characteristics } from '@/data/characteristics';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';

const Characteristics = () => {
  return (
    <>
      <SEO 
        title="Find Escorts by Characteristics | Five London"
        description="Browse our stunning escorts by their unique characteristics. Find high-class, bi-sexual, open-minded, sophisticated companions in London."
        keywords="escort characteristics, high class escorts, bi sexual escorts, open minded escorts, sophisticated escorts london"
        canonicalUrl="/characteristics"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-12 sm:pt-16">
          {/* Hero Section */}
          <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
            <div className="container-width">
              <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-3 sm:mb-4">
                  Find Escorts by Characteristics
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-3 sm:mb-4">
                  Discover companions with specific traits that match your preferences. 
                  Browse our beautiful escorts by their unique characteristics and personality types.
                </p>
              </div>
            </div>
          </section>

          {/* Characteristics Grid */}
          <section className="py-8 sm:py-12 md:py-16">
            <div className="container-width">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6">
                {characteristics.map((characteristic) => (
                  <Link 
                    key={characteristic.id} 
                    to={`/characteristics/${characteristic.slug}`}
                    className="group"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full h-auto p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 hover:shadow-lg transition-all duration-300 group-hover:border-primary"
                    >
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <h3 className="text-sm sm:text-base font-medium mb-1 group-hover:text-primary transition-colors">
                          {characteristic.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {characteristic.description}
                        </p>
                      </div>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mt-1 sm:mt-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-8 sm:py-12 md:py-16 bg-muted/50">
            <div className="container-width">
              <div className="text-center max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-3 sm:mb-4">
                  Looking for Something Specific?
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6">
                  Can't find the exact characteristics you're looking for? Our diverse collection of companions 
                  offers a wide range of personalities and traits. Contact us to find your perfect match.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link to="/contact">
                    <Button 
                      className="minimal-button text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                      onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                    >
                      Contact Us
                    </Button>
                  </Link>
                  <Link to="/models">
                    <Button variant="outline" className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                      Browse All Models
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Characteristics;