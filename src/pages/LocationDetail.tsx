import { useParams, Navigate, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { locations } from '@/data/locations';
import { models } from '@/data/models';
import { ModelCard } from '@/components/ModelCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';

const LocationDetail = () => {
  const { location: locationSlug } = useParams();
  
  // Find the location by extracting the area name from the slug
  const areaName = locationSlug?.split('-').pop() || '';
  const location = locations.find(loc => 
    loc.name.toLowerCase() === areaName ||
    loc.id === areaName ||
    loc.slug.includes(areaName)
  );
  
  if (!location) {
    return <Navigate to="/404" replace />;
  }

  // Filter models by location
  const locationModels = models.filter(model => 
    model.location.toLowerCase() === location.name.toLowerCase()
  );

  // Get other locations for the "Explore also" section
  const otherLocations = locations.filter(loc => loc.id !== location.id).slice(0, 3);

  return (
    <>
      <SEO 
        title={`Luxury Escorts in ${location.name} | Five London`}
        description={`Find stunning escorts in ${location.name}, London. Browse available girls in this exclusive area. Premium escort services with verified profiles.`}
        keywords={`${location.name.toLowerCase()} escorts, escorts in ${location.name.toLowerCase()}, ${location.name.toLowerCase()} girls, london escorts`}
        canonicalUrl={`/${location.slug}`}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-32">
          {/* Hero Section */}
          <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
            <div className="container-width">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <span className="body-lg text-muted-foreground">{location.name}, London</span>
                </div>
                <h1 className="heading-xl mb-6">
                  Luxury Escorts in {location.name}
                </h1>
                <p className="body-lg text-muted-foreground mb-8">
                  Discover our stunning collection of elite escorts available in {location.name}. 
                  Each companion is carefully selected for her beauty, intelligence, and sophistication.
                </p>
              </div>
            </div>
          </section>

          {/* Main Content Section */}
          <section className="section-padding">
            <div className="container-width">
              <div className="space-y-12">
                {/* Girls Available in this Location */}
                <div>
                  <h2 className="heading-lg mb-8 text-center">
                    Available Girls in {location.name}
                  </h2>
                  
                  {locationModels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {locationModels.map((model) => (
                        <ModelCard key={model.id} model={model} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="body-lg text-muted-foreground mb-6">
                        Currently no girls are specifically stationed in {location.name}, but our escorts are available throughout London.
                      </p>
                      <Link to="/models">
                        <Button>Browse All Available Girls</Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Location Information */}
                <Card className="bg-muted/30">
                  <CardContent className="p-8">
                    <h3 className="heading-md mb-4">About {location.name}</h3>
                    <p className="body-base text-muted-foreground">
                      {location.description} Our elite companions in this prestigious area offer 
                      the highest level of sophistication and discretion for discerning clients.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Explore Other Locations */}
          <section className="section-padding bg-muted/50">
            <div className="container-width">
              <h2 className="heading-lg text-center mb-8">
                Explore Also: {otherLocations.map(loc => loc.name).join(', ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherLocations.map((loc) => (
                  <Card key={loc.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {loc.name}
                      </CardTitle>
                      <CardDescription>
                        Find stunning girls in {loc.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={`/${loc.slug}`}>
                        <Button variant="outline" className="w-full">
                          Girls in {loc.name}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default LocationDetail;