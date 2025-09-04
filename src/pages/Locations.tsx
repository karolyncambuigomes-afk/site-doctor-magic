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
        
        <main className="pt-32">
          {/* Hero Section */}
          <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
            <div className="container-width">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="heading-xl mb-6">
                  Escort Services by Location
                </h1>
                <p className="body-lg text-muted-foreground mb-8">
                  Discover our premium escort services across London's most prestigious districts. 
                  Each location offers unique experiences tailored to the area's distinctive character.
                </p>
              </div>
            </div>
          </section>

          {/* Locations Grid */}
          <section className="section-padding">
            <div className="container-width">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {locations.map((location) => (
                  <Card key={location.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <CardTitle className="heading-md mb-2">{location.name}</CardTitle>
                          <CardDescription className="body-sm">
                            {location.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="body-sm text-muted-foreground">
                          Premium escort services in {location.name}, offering sophisticated companionship 
                          for discerning clients in this exclusive London district.
                        </p>
                        <Link to={`/locations/${location.slug}`}>
                          <Button variant="outline" className="w-full group">
                            View Services in {location.name}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="section-padding bg-muted/50">
            <div className="container-width">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="heading-lg mb-4">
                  Can't Find Your Location?
                </h2>
                <p className="body-lg text-muted-foreground mb-8">
                  While we specialize in London's most prestigious districts, our services extend throughout 
                  the Greater London area. Contact us to discuss your specific location requirements.
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