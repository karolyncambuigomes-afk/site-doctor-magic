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
        
        <main className="pt-16">
          {/* Minimal Hero */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="heading-display mb-4 sm:mb-6 text-black">
                  Escorts by Characteristics
                </h1>
                <p className="body-lg text-black">
                  Discover companions with specific traits that match your preferences.
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
                        <h3 className="heading-sm font-medium mb-1 group-hover:text-primary transition-colors">
                          {characteristic.name}
                        </h3>
                        <p className="body-xs text-muted-foreground">
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

          {/* Contact Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-gray-50">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="heading-display mb-4 sm:mb-6 text-black">
                  Looking for Something Specific?
                </h2>
                <p className="body-lg text-black mb-6 sm:mb-8">
                  Can't find the exact characteristics you're looking for? Contact us to find your perfect match.
                </p>
                <a
                  href="https://wa.me/447436190679"
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
        
        <Footer />
      </div>
    </>
  );
};

export default Characteristics;