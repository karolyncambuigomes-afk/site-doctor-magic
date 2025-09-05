import { useParams, Navigate, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { locations } from '@/data/locations';
import { useModels } from '@/hooks/useModels';
import { ModelCard } from '@/components/ModelCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';

const LocationDetail = () => {
  const { locationSlug } = useParams();
  const { models, loading, error } = useModels();
  
  // Find the location by matching the complete slug
  const location = locations.find(loc => loc.slug === locationSlug);
  
  if (!location) {
    return <Navigate to="/404" replace />;
  }

  // Filter models by location
  const locationModels = models.filter(model => 
    model.location && model.location.toLowerCase() === location.name.toLowerCase()
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
        
        <main className="pt-20">
          {/* Ultra Minimal Header */}
          <section className="py-6">
            <div className="container-width">
              <div className="text-center">
                <h1 className="heading-xl mb-2">
                  {location.name}
                </h1>
                <div className="w-24 h-px bg-primary mx-auto"></div>
              </div>
            </div>
          </section>

          {/* Pure Gallery */}
          <section className="py-4">
            <div className="container-width-lg">
              {locationModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {locationModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Link to="/models">
                    <button className="five-london-button-outline">
                      View All Models
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default LocationDetail;