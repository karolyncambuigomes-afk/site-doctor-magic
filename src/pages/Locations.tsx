import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { locations } from '@/data/locations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

const Locations = () => {
  return (
    <>
      <SEO 
        title="Escort Services by Location in London | Five London"
        description="Find premium escort services in your preferred London location. We serve Mayfair, Knightsbridge, Chelsea, Belgravia, Kensington, and Canary Wharf."
        keywords="london escort locations, area specific escorts, mayfair escorts, knightsbridge escorts, chelsea escorts"
        canonicalUrl="/locations"
      />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-12 bg-white">
            <div className="container-width">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="heading-lg mb-6">
                  Find Girls by Location
                </h1>
                <p className="body-minimal text-muted-foreground mb-8">
                  Browse our stunning escorts by their preferred London locations. 
                  Click on any area below to discover the beautiful girls available in that district.
                </p>
              </div>
            </div>
          </section>

          {/* Elegant Divider */}
          <section className="py-0">
            <div className="container-width">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>
          </section>

          {/* Locations Grid - Loro Piana Style Mobile */}
          <section className="py-8">
            <div className="container-width">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {locations.map((location) => (
                  <Link 
                    key={location.id} 
                    to={`/locations/${location.slug}`}
                    className="group"
                  >
                     <Button 
                      variant="outline" 
                      className="w-full h-12 sm:h-14 md:h-16 px-3 sm:px-4 md:px-6 justify-center hover:shadow-elegant transition-smooth group-hover:border-primary text-xs sm:text-sm md:text-base"
                    >
                      <span className="body-minimal font-medium group-hover:text-primary transition-colors leading-tight text-center">
                        {location.name}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-8 bg-white">
            <div className="container-width">
              <div className="text-center max-w-2xl mx-auto">
                <p className="body-sm text-muted-foreground mb-6">
                  Can't find your preferred location? Contact us to find the perfect companion for your specific area.
                </p>
                <Link to="/contact">
                  <Button 
                    className="minimal-button"
                    onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Locations;