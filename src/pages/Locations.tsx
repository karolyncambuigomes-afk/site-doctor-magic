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
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-4 bg-gradient-to-b from-muted/30 to-background">
            <div className="container-width">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="heading-xl mb-4">
                  Find Girls by Location
                </h1>
                <p className="body-lg text-muted-foreground mb-4">
                  Browse our stunning escorts by their preferred London locations. 
                  Click on any area below to discover the beautiful girls available in that district.
                </p>
              </div>
            </div>
          </section>

          {/* Locations Grid */}
          <section className="py-4">
            <div className="container-width">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                  <Link 
                    key={location.id} 
                    to={`/${location.slug}`}
                    className="group"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-300 group-hover:border-primary"
                    >
                      <MapPin className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <h3 className="heading-sm mb-1 group-hover:text-primary transition-colors">
                          {location.name}
                        </h3>
                        <p className="body-sm text-muted-foreground">
                          Find girls in {location.name}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-4 bg-muted/50">
            <div className="container-width">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="heading-lg mb-4">
                  Looking for a Different Area?
                </h2>
                <p className="body-lg text-muted-foreground mb-6">
                  Can't find your preferred location? Our beautiful escorts are available throughout London. 
                  Contact us to find the perfect companion for your specific area.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button className="minimal-button">
                      Contact Us
                    </Button>
                  </Link>
                  <Link to="/models">
                    <Button variant="outline">
                      Browse Our Models
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

export default Locations;