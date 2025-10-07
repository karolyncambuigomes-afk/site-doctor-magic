import { Navigate, Link } from 'react-router-dom';
import { useSafeParams } from '@/hooks/useSafeRouter';
import { useState } from 'react';
import { SEOOptimized } from '@/components/SEOOptimized';
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
      <SEOOptimized 
        title={location.seoTitle}
        description={location.seoDescription}
        keywords={location.keywords.join(", ")}
        canonicalUrl={`/locations/${location.slug}`}
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-0">
          {/* Hero Section */}
          <section className="pt-20 md:pt-24 bg-white border-b border-gray-100">
            <div className="container-width">
              {/* Breadcrumbs */}
              <div className="px-4 sm:px-6 pt-6 pb-4">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/locations" className="hover:text-primary transition-colors">Locations</Link>
                  <span>/</span>
                  <span className="text-foreground">{location.name}</span>
                </nav>
              </div>
              
              {/* Title */}
              <div className="text-center px-4 sm:px-6 pb-12">
                <h1 className="luxury-heading-xl text-black mb-4">
                  {location.name}
                </h1>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
              </div>
            </div>
          </section>

          {/* Rich Content Section */}
          {location?.content && (
            <section className="py-12 md:py-16 bg-white">
              <div className="container-width mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <Collapsible open={isContentOpen} onOpenChange={setIsContentOpen}>
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <CollapsibleTrigger className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <h2 className="text-xl md:text-2xl font-semibold text-black text-left">
                          About {location.name} Escorts
                        </h2>
                        {isContentOpen ? (
                          <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="px-6 py-6 bg-gray-50/50">
                          <div 
                            className="location-content
                              [&>div>p]:text-muted-foreground [&>div>p]:leading-relaxed [&>div>p]:mb-4 [&>div>p]:text-sm
                              [&>div>h2]:text-2xl [&>div>h2]:font-bold [&>div>h2]:text-black [&>div>h2]:mb-4 [&>div>h2]:mt-6 [&>div>h2]:first:mt-0
                              [&>div>ul]:text-muted-foreground [&>div>ul]:my-4 [&>div>ul]:ml-6 [&>div>ul]:list-disc [&>div>ul]:text-sm
                              [&>div>li]:my-2
                              [&>div>a]:text-primary [&>div>a]:font-medium [&>div>a]:underline [&>div>a]:underline-offset-2
                              hover:[&>div>a]:text-primary/80"
                            dangerouslySetInnerHTML={{ __html: location.content }}
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                </div>
              </div>
            </section>
          )}

          {/* Available Models Section - Enhanced Loading */}
          {loading ? (
            <section className="py-6 md:py-10 bg-white">
              <div className="container-width mx-auto px-4">
                <div className="text-center mb-6">
                  <h2 className="luxury-heading-lg text-primary">
                    Available in {location.name}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 animate-pulse rounded" />
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : locationModels.length > 0 ? (
            <section className="py-6 md:py-10 bg-white">
              <div className="container-width mx-auto px-4">
                <div className="text-center mb-6">
                  <h2 className="luxury-heading-lg text-primary">
                    Available in {location.name}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                  {locationModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              </div>
            </section>
          ) : (
            // No models available section - Ultra Simplified
            <section className="py-6 md:py-10 bg-white">
              <div className="container-width mx-auto px-4">
                <div className="text-center">
                  <div className="max-w-lg mx-auto space-y-4">
                    <h2 className="luxury-heading-lg text-primary">
                      No Models Currently Available in {location.name}
                    </h2>
                    
                    <p className="text-muted-foreground text-sm">
                      Our exclusive models are available for outcalls to this area.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <Link 
                        to="/models"
                        className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        <Star className="w-4 h-4" />
                        View All Companions
                      </Link>
                      
                      <a
                        href="https://wa.me/447436190679"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-primary text-primary px-5 py-2.5 rounded-lg hover:bg-primary/5 transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}


          {/* Other Locations - Streamlined */}
          <section className="py-6 md:py-8 bg-gray-50">
            <div className="container-width mx-auto px-4">
              <div className="text-center mb-4">
                <h2 className="luxury-heading-md text-black">
                  Other Areas
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                {otherLocations.slice(0, 4).map((loc) => (
                  <Link 
                    key={loc.id}
                    to={`/${loc.slug}`}
                    className="group p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 text-center"
                  >
                    <h3 className="font-medium text-black text-sm">
                      {loc.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section - Minimal */}
          <section className="py-4 md:py-6 bg-white">
            <div className="container-width text-center">
              <div className="max-w-lg mx-auto px-4">
                <h2 className="luxury-heading-md mb-3 text-black">
                  Book Now
                </h2>
                <a
                  href="https://wa.me/447436190679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 px-5 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm"
                >
                  <Phone className="w-4 h-4" />
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