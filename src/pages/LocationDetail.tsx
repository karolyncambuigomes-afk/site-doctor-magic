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

  // Create dynamic gallery from models in this location
  const galleryImages = locationModels
    .filter(model => model.image) // Only models with images
    .slice(0, 4) // Take first 4 models
    .map(model => ({
      url: model.image,
      name: model.name,
      modelId: model.id
    }));

  // If we don't have enough models for gallery, add fallback images
  const fallbackImages = [
    '/images/model1.webp',
    '/images/model2.webp', 
    '/images/model3.webp',
    '/images/model4.webp'
  ];

  // Ensure we always have 4 gallery images
  while (galleryImages.length < 4) {
    const fallbackIndex = galleryImages.length;
    galleryImages.push({
      url: fallbackImages[fallbackIndex] || fallbackImages[0],
      name: `Companion ${galleryImages.length + 1}`,
      modelId: null
    });
  }

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
          {/* Hero Section */}
          <section className="pt-20 pb-16 md:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                  Escorts in {location.name}
                </h1>
                <p className="luxury-body-lg text-black">
                  Exclusive companions available in {location.name}. Elegant, sophisticated, and discreet.
                </p>
              </div>
            </div>
            {/* Elegant separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
          </section>

          {/* Gallery Section */}
          <section className="py-10 md:py-14 bg-white">
            <div className="container-width mx-auto px-6">
                <div className="text-center mb-8">
                <h2 className="luxury-heading-lg text-black mb-4">
                  Our Exclusive {location.name} Collection
                </h2>
                <div className="w-16 h-0.5 bg-gradient-primary mx-auto mb-6"></div>
                <p className="luxury-body-base text-muted-foreground max-w-2xl mx-auto">
                  Meet our sophisticated companions available in {location.name}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
                {galleryImages.map((image, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-100">
                    {image.modelId ? (
                      <Link to={`/models/${image.modelId}`} className="block w-full h-full">
                        <img 
                          src={image.url} 
                          alt={`${image.name} - Exclusive companion in ${location.name}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="font-medium text-sm">{image.name}</p>
                          <p className="text-xs opacity-80">Available in {location.name}</p>
                        </div>
                      </Link>
                    ) : (
                      <>
                        <img 
                          src={image.url} 
                          alt={`${image.name} in ${location.name}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* Available Models - Only show if there are models for this location */}
          {locationModels.length > 0 && (
            <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
              <div className="container-width mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="luxury-heading-lg text-primary mb-4">
                    Available Companions in {location.name}
                  </h2>
                  <div className="w-16 h-0.5 bg-gradient-primary mx-auto mb-6"></div>
                  <p className="luxury-body-lg text-muted-foreground max-w-2xl mx-auto">
                    Meet our exclusive selection of sophisticated companions available in {location.name}
                  </p>
                </div>
                
                {loading ? (
                  <div className="text-center py-16">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading companions...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {locationModels.map((model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}


          {/* Other Locations */}
          <section className="py-10 md:py-14 bg-white">
            <div className="container-width mx-auto px-6">
              <div className="text-center mb-8">
                <h2 className="luxury-heading-lg text-black mb-4">
                  Explore Other Locations
                </h2>
                <p className="text-gray-600 mb-6">
                  Discover our premium escort services in London's most exclusive districts
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {otherLocations.slice(0, 6).map((loc) => (
                  <Link 
                    key={loc.id}
                    to={`/${loc.slug}`}
                    className="group p-6 bg-white hover:bg-gray-50 rounded-lg border border-black transition-all duration-300 hover:shadow-lg"
                  >
                    <MapPin className="w-5 h-5 text-black mb-3" />
                    <h3 className="font-semibold text-black transition-colors mb-2">
                      {loc.name} Escorts
                    </h3>
                    <p className="text-sm text-black line-clamp-2">
                      {loc.description}
                    </p>
                    <ArrowRight className="w-4 h-4 text-black group-hover:text-black transition-colors mt-3" />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="luxury-heading-lg mb-4 sm:mb-6 text-black">
                  Book Your {location.name} Experience
                </h2>
                <p className="luxury-body-lg text-black mb-6 sm:mb-8">
                  Contact our experienced concierge team to arrange your perfect companion in {location.name}.
                </p>
                <a
                  href="https://wa.me/447436190679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm"
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