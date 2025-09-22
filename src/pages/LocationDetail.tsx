import { Navigate, Link } from 'react-router-dom';
import { useSafeParams } from '@/hooks/useSafeRouter';
import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { locations } from '@/data/locations';
import { useModels } from '@/hooks/useModels';
import { ModelCard } from '@/components/ModelCard';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MapPin, ArrowRight, Phone, MessageCircle, Clock, Shield, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { generateLocationSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

const LocationDetail = () => {
  const params = useSafeParams();
  const { locationSlug } = params;
  const { models, loading, error } = useModels();
  const [isContentOpen, setIsContentOpen] = useState(false);
  
  // Safety check for router context
  if (!params) {
    console.warn('LocationDetail: useParams returned undefined');
    return <div>Loading...</div>;
  }
  
  // Get current path to determine the slug format
  const currentPath = window.location.pathname;
  
  // Find the location by matching either format: /locations/slug or /escorts-in-location
  let location = locations.find(loc => loc.slug === locationSlug);
  
  // If not found and we're on a specific /escorts-in-* route, extract the location name
  if (!location && currentPath.startsWith('/escorts-in-')) {
    const locationName = currentPath.replace('/escorts-in-', '');
    location = locations.find(loc => loc.slug === `escorts-in-${locationName}`);
  }
  
  if (!location) {
    return <Navigate to="/404" replace />;
  }

  // Create flexible location matching
  const createLocationMatcher = (locationName: string) => {
    const normalizedLocation = locationName.toLowerCase().trim();
    
    // Location aliases and variations
    const locationAliases: { [key: string]: string[] } = {
      'kensington': ['south kensington', 'kensington'],
      'westminster': ['westminster', 'city of westminster', 'west minister'],
      'mayfair': ['mayfair', 'may fair'],
      'chelsea': ['chelsea'],
      'belgravia': ['belgravia'],
      'knightsbridge': ['knightsbridge', 'knights bridge'],
      'canary wharf': ['canary wharf', 'canary-wharf'],
      'notting hill': ['notting hill', 'notting-hill'],
      'paddington': ['paddington'],
      'marylebone': ['marylebone', 'marley bone'],
      'fitzrovia': ['fitzrovia'],
      'shoreditch': ['shoreditch'],
      'covent garden': ['covent garden', 'covent-garden']
    };

    return (modelLocation: string) => {
      if (!modelLocation) return false;
      const normalizedModelLocation = modelLocation.toLowerCase().trim();
      
      // Direct match
      if (normalizedModelLocation === normalizedLocation) return true;
      
      // Check aliases
      for (const [key, aliases] of Object.entries(locationAliases)) {
        if (aliases.includes(normalizedLocation)) {
          return aliases.includes(normalizedModelLocation);
        }
      }
      
      // Partial match (for cases like "South Kensington" matching "Kensington")
      return normalizedModelLocation.includes(normalizedLocation) || 
             normalizedLocation.includes(normalizedModelLocation);
    };
  };

  const locationMatcher = createLocationMatcher(location.name);
  
  // Filter models by location using flexible matching
  const locationModels = models.filter(model => 
    model.location && locationMatcher(model.location)
  );

  // Get other locations for the "Explore also" section
  const otherLocations = locations.filter(loc => loc.id !== location.id).slice(0, 6);


  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Locations", url: "https://fivelondon.com/locations" },
      { name: location.name, url: `https://fivelondon.com/locations/${location.slug}` }
    ]),
    generateLocationSchema({
      name: location.name,
      description: location.description,
      coordinates: null // You can add coordinates later if needed
    }),
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `Five London - ${location.name}`,
      "description": location.seoDescription,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location.name,
        "addressRegion": "London",
        "addressCountry": "GB"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "addressLocality": location.name,
          "addressCountry": "GB"
        }
      },
      "telephone": "+447436190679",
      "url": `https://fivelondon.com/locations/${location.slug}`,
      "priceRange": "£500-£1000",
      "serviceType": "Luxury Companion Services"
    }
  ];

  return (
    <>
      <SEO 
        title={location.seoTitle}
        description={location.seoDescription}
        keywords={location.keywords.join(", ")}
        canonicalUrl={`/locations/${location.slug}`}
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-0">
          {/* Hero Section - Simplified */}
          <section className="pt-20 pb-8 md:pt-24 md:pb-12 bg-white">
            <div className="container-width text-center">
              <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <h1 className="luxury-heading-xl mb-3 text-black">
                  {location.name} Escorts
                </h1>
                <p className="luxury-body-base text-muted-foreground">
                  Exclusive companions in {location.name}
                </p>
              </div>
            </div>
          </section>



          {/* Available Models Section - Fotos Maiores */}
          {locationModels.length > 0 ? (
            <section className="py-8 md:py-12 bg-white">
              <div className="container-width mx-auto px-6">
                <div className="text-center mb-8">
                  <h2 className="luxury-heading-lg text-primary mb-2">
                    Available in {location.name}
                  </h2>
                </div>
                
                {loading ? (
                  <div className="text-center py-16">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading companions...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
                    {locationModels.map((model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : (
            // No models available section - Simplified
            <section className="py-8 md:py-12 bg-white">
              <div className="container-width mx-auto px-6">
                <div className="text-center mb-8">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="luxury-heading-lg text-primary mb-4">
                      Available Companions
                    </h2>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <p className="luxury-body-base text-muted-foreground mb-4">
                        Our exclusive models are available throughout London
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Link 
                          to="/models"
                          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          View All Companions
                        </Link>
                        
                        <a
                          href="https://wa.me/447436190679"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-primary text-primary px-5 py-2.5 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact Us
                        </a>
                      </div>
                    </div>
                    
                    {/* Suggest nearby locations with models */}
                    <div className="text-left">
                      <h3 className="luxury-heading-md text-black mb-6 text-center">
                        Explore Nearby Areas with Available Companions
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                          // Get locations with models
                          const locationsWithModels = locations
                            .filter(loc => {
                              const locationMatcher = createLocationMatcher(loc.name);
                              return models.some(model => model.location && locationMatcher(model.location));
                            })
                            .filter(loc => loc.id !== location.id) // Exclude current location
                            .slice(0, 4); // Show top 4
                          
                          return locationsWithModels.map((loc) => {
                            const locationMatcher = createLocationMatcher(loc.name);
                            const modelCount = models.filter(model => 
                              model.location && locationMatcher(model.location)
                            ).length;
                            
                            return (
                              <Link 
                                key={loc.id}
                                to={`/${loc.slug}`}
                                className="group p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/30 transition-all duration-300"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium text-black group-hover:text-primary transition-colors">
                                      {loc.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {modelCount} companion{modelCount !== 1 ? 's' : ''} available
                                    </p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </Link>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}


          {/* Other Locations - Simplified */}
          <section className="py-8 md:py-10 bg-gray-50">
            <div className="container-width mx-auto px-6">
              <div className="text-center mb-6">
                <h2 className="luxury-heading-lg text-black mb-2">
                  Other Areas
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {otherLocations.slice(0, 6).map((loc) => (
                  <Link 
                    key={loc.id}
                    to={`/${loc.slug}`}
                    className="group p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md text-center"
                  >
                    <h3 className="font-medium text-black text-sm mb-1">
                      {loc.name}
                    </h3>
                    <ArrowRight className="w-3 h-3 text-muted-foreground mx-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section - Simplified */}
          <section className="py-6 md:py-8 bg-white">
            <div className="container-width text-center">
              <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <h2 className="luxury-heading-lg mb-3 text-black">
                  Book Now
                </h2>
                <a
                  href="https://wa.me/447436190679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium text-sm"
                >
                  Contact Now
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

export default LocationDetail;