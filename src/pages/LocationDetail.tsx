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
  const otherLocations = locations.filter(loc => loc.id !== location.id).slice(0, 6);

  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Locations", url: "https://fivelondon.com/locations" },
      { name: location.name, url: `https://fivelondon.com/${location.slug}` }
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
      "url": `https://fivelondon.com/${location.slug}`,
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
        canonicalUrl={`/${location.slug}`}
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section with rich content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h1 className="font-sans text-3xl md:text-5xl font-extralight tracking-wide text-black mb-6">
                  Luxury Escorts in {location.name}
                </h1>
                <div className="w-16 h-px bg-black/20 mx-auto mb-8"></div>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Exclusive Five London offers high-class companions in the heart of {location.name}. Known for elegance, sophistication, and discretion, our {location.name} escorts are available for private dinners, events, and unforgettable moments in London's most exclusive district.
                </p>
              </div>
            </div>
          </section>


          {/* Available Models */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-sans text-2xl md:text-4xl font-extralight tracking-wide text-black mb-6">
                  {location.name} Escorts Gallery
                </h2>
                <div className="w-16 h-px bg-black/20 mx-auto"></div>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading companions...</p>
                </div>
              ) : locationModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {locationModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 mb-6">
                    Our companions are available throughout London and can meet you in {location.name}.
                  </p>
                  <Link to="/models">
                    <Button variant="outline" className="border-black/20 hover:border-black/40">
                      View All Companions
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Internal Links */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <p className="text-lg text-gray-700 mb-4">
                Explore also{" "}
                {otherLocations.slice(0, 3).map((loc, index) => (
                  <span key={loc.id}>
                    <Link 
                      to={`/${loc.slug}`}
                      className="text-black hover:text-gray-700 underline transition-colors"
                    >
                      {loc.name} Escorts
                    </Link>
                    {index < 2 && " · "}
                  </span>
                ))}
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-16 md:py-24 bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="font-sans text-2xl md:text-4xl font-extralight tracking-wide mb-6">
                Book Your {location.name} Experience
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
                Contact our experienced concierge team to arrange your perfect companion in {location.name}.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <a 
                  href="tel:+447436190679"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-lg transition-all duration-300 group"
                >
                  <Phone className="w-8 h-8 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Call Us</h3>
                  <p className="text-white/70 mb-3">Speak directly with our team</p>
                  <span className="text-white font-medium">+44 7436 190679</span>
                </a>

                <a 
                  href="https://wa.me/447436190679"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-lg transition-all duration-300 group"
                >
                  <MessageCircle className="w-8 h-8 text-white mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">WhatsApp</h3>
                  <p className="text-white/70 mb-3">Quick and discreet messaging</p>
                  <span className="text-white font-medium">Send Message</span>
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