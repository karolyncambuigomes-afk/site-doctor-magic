import { useParams, Navigate, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { locations } from '@/data/locations';
import { useModels } from '@/hooks/useModels';
import { ModelCard } from '@/components/ModelCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight, Phone, MessageCircle, Users, Star, Clock, Shield } from 'lucide-react';
import { generateLocationSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

const LocationDetail = () => {
  const { locationSlug } = useParams();
  const { models, loading, error } = useModels();
  
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
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section with rich content */}
          <section className="py-20 md:py-32 bg-gradient-to-br from-white via-neutral-50 to-gray-100">
            <div className="container-width mx-auto px-6">
              <div className="text-center mb-20">
                <h1 className="heading-display text-4xl md:text-6xl text-primary mb-8">
                  Luxury Escorts in {location.name}
                </h1>
                <div className="w-24 h-0.5 bg-gradient-primary mx-auto mb-12"></div>
                <p className="body-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-8">
                  Exclusive Five London offers high-class companions in the heart of {location.name}. Known for elegance, sophistication, and discretion, our {location.name} escorts are available for private dinners, events, and unforgettable moments in London's most exclusive district.
                </p>
                
                {/* Location features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
                  <div className="text-center p-6">
                    <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Elite Companions</h3>
                    <p className="text-sm text-muted-foreground">Carefully selected models</p>
                  </div>
                  <div className="text-center p-6">
                    <Star className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Premium Service</h3>
                    <p className="text-sm text-muted-foreground">Exceptional experiences</p>
                  </div>
                  <div className="text-center p-6">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Total Discretion</h3>
                    <p className="text-sm text-muted-foreground">Complete confidentiality</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Location Content Section */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container-width mx-auto px-6">
              <div 
                className="prose prose-lg max-w-4xl mx-auto text-foreground"
                dangerouslySetInnerHTML={{ __html: location.content }}
              />
            </div>
          </section>


          {/* Available Models */}
          <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
            <div className="container-width mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="heading-display text-3xl md:text-4xl text-primary mb-6">
                  Available Companions in {location.name}
                </h2>
                <div className="w-16 h-0.5 bg-gradient-primary mx-auto mb-8"></div>
                <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
                  Meet our exclusive selection of sophisticated companions available in {location.name}
                </p>
              </div>
              
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading companions...</p>
                </div>
              ) : locationModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {locationModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-4">Available Throughout London</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Our companions are available throughout London and can meet you in {location.name}.
                  </p>
                  <Link to="/models">
                    <Button variant="luxury" size="lg">
                      View All Companions
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Other Locations */}
          <section className="py-16 md:py-20 bg-background">
            <div className="container-width mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Explore Other Locations
                </h2>
                <p className="text-muted-foreground mb-8">
                  Discover our premium escort services in London's most exclusive districts
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {otherLocations.slice(0, 6).map((loc) => (
                  <Link 
                    key={loc.id}
                    to={`/${loc.slug}`}
                    className="group p-6 bg-card hover:bg-accent rounded-lg border border-border transition-all duration-300 hover:shadow-elegant"
                  >
                    <MapPin className="w-5 h-5 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {loc.name} Escorts
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {loc.description}
                    </p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-3" />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
            <div className="container-width mx-auto px-6 text-center">
              <h2 className="heading-display text-3xl md:text-5xl mb-8">
                Book Your {location.name} Experience
              </h2>
              <p className="body-lg text-white/90 leading-relaxed mb-12 max-w-3xl mx-auto">
                Contact our experienced concierge team to arrange your perfect companion in {location.name}. 
                Discretion, elegance, and exceptional service guaranteed.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
                <a 
                  href="tel:+447436190679"
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-luxury"
                >
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Call Our Concierge</h3>
                  <p className="text-white/80 mb-4">Speak directly with our experienced team</p>
                  <span className="text-white font-medium text-lg">+44 7436 190679</span>
                </a>

                <a 
                  href="https://wa.me/447436190679"
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-luxury"
                >
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">WhatsApp Message</h3>
                  <p className="text-white/80 mb-4">Quick and discreet messaging</p>
                  <span className="text-white font-medium text-lg">Send Message</span>
                </a>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>100% Discreet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>Premium Service</span>
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

export default LocationDetail;