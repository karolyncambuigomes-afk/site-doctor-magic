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

  // Filter models by location
  const locationModels = models.filter(model => 
    model.location && model.location.toLowerCase() === location.name.toLowerCase()
  );

  // Get other locations for the "Explore also" section
  const otherLocations = locations.filter(loc => loc.id !== location.id).slice(0, 6);

  // Gallery images (using existing model images for demonstration)
  const galleryImages = [
    '/images/model1.jpg',
    '/images/model2.jpg', 
    '/images/model3.jpg',
    '/images/model4.jpg'
  ];

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
        
        <main className="pt-16">
          {/* Minimal Hero */}
          <section className="py-8 md:py-12 lg:py-16 bg-white">
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
                    <img 
                      src={image} 
                      alt={`Exclusive companion ${index + 1} in ${location.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

          {/* SEO Content Section - Collapsible */}
          <section className="py-10 md:py-14 bg-white">
            <div className="container-width mx-auto px-6">
              <div className="text-center mb-8">
                <Collapsible open={isContentOpen} onOpenChange={setIsContentOpen}>
                  <CollapsibleTrigger asChild>
                     <Button 
                       variant="outline" 
                       size="lg"
                       className="mx-auto flex items-center gap-2 text-black hover:text-black transition-colors border-black/20 hover:border-black/40"
                     >
                      Learn more about {location.name}
                      {isContentOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-8 animate-accordion-down">
                     <div 
                       className="max-w-4xl mx-auto !text-black [&>*]:!text-black [&>h2]:luxury-heading-lg [&>h2]:!text-black [&>h3]:luxury-heading-md [&>h3]:!text-black [&>p]:luxury-body-base [&>p]:!text-black [&>p]:leading-relaxed [&>ul]:!text-black [&>li]:!text-black [&>strong]:!text-black [&>em]:!text-black [&>a]:!text-black"
                       dangerouslySetInnerHTML={{ __html: location.content }}
                     />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </section>

          {/* Other Locations */}
          <section className="py-10 md:py-14 bg-white">
            <div className="container-width mx-auto px-6">
              <div className="text-center mb-8">
                <h2 className="luxury-heading-lg text-foreground mb-4">
                  Explore Other Locations
                </h2>
                <p className="text-foreground mb-6">
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