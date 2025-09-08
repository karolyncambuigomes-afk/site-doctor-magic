import React from 'react';
import { SEO } from '@/components/SEO';
import { generateLocalBusinessSchema, generateGeoTargetingSchema } from '@/utils/geoTargeting';
import { generateBreadcrumbSchema } from '@/utils/structuredData';
import { locations } from '@/data/locations';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Star } from 'lucide-react';

export const Locations: React.FC = () => {
  const structuredData = [
    generateGeoTargetingSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "London Locations", url: "https://fivelondon.com/locations" }
    ]),
    ...locations.slice(0, 5).map(location => generateLocalBusinessSchema(location))
  ];

  return (
    <>
      <SEO 
        title="Elite Escorts Across London | All Areas Covered | Five London"
        description="Premium escort services across all London areas. Mayfair, Knightsbridge, Chelsea, Canary Wharf & more. Elite companions available 24/7 in your postcode."
        keywords="london escorts, london areas, mayfair escorts, knightsbridge escorts, chelsea escorts, canary wharf escorts, kensington escorts, central london escorts"
        canonicalUrl="/locations"
        structuredData={structuredData}
      />
      
      <main className="min-h-screen pt-16 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="luxury-heading-display text-foreground mb-6">
              Elite Escorts Across London
            </h1>
            <p className="luxury-body-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              Premium companion services available in all prestigious London areas. From Mayfair to Canary Wharf, 
              our sophisticated escorts provide exceptional experiences across the capital.
            </p>
            <div className="flex flex-wrap justify-center gap-4 luxury-body-base text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                All London Postcodes
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                24/7 Availability
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Same-Day Booking
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                Verified Models
              </span>
            </div>
          </section>

          {/* Locations Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => (
              <Link
                key={location.id}
                to={`/locations/${location.slug}`}
                className="group bg-card border border-border hover:border-muted-foreground transition-all duration-300 hover:shadow-elegant"
              >
                <div className="p-6">
                  <h2 className="luxury-heading-lg text-foreground mb-3 group-hover:text-muted-foreground transition-colors">
                    {location.name}
                  </h2>
                  <p className="luxury-body-base text-muted-foreground mb-4 leading-relaxed">
                    {location.description}
                  </p>
                  
                  {/* Postcodes */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {location.postcodes?.map((postcode) => (
                      <span 
                        key={postcode}
                        className="bg-muted text-muted-foreground px-2 py-1 luxury-body-xs font-medium"
                      >
                        {postcode}
                      </span>
                    ))}
                  </div>

                  {/* Landmarks */}
                  <div className="luxury-body-xs text-muted-foreground">
                    <span className="font-medium">Near:</span> {location.nearbyLandmarks?.join(", ")}
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {/* Coverage Area */}
          <section className="mt-20 bg-muted/30 p-8 md:p-12 text-center">
            <h2 className="luxury-heading-xl text-foreground mb-6">
              Complete London Coverage
            </h2>
            <p className="luxury-body-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our elite escort service covers all London areas with verified companions available for 
              outcalls across Central London, West London, East London, and beyond.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 luxury-body-base">
              <div>
                <h3 className="luxury-heading-sm text-foreground mb-2">Central London</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>W1 - Mayfair, Marylebone</li>
                  <li>WC1 - Bloomsbury</li>
                  <li>WC2 - Covent Garden</li>
                  <li>EC1 - Clerkenwell</li>
                </ul>
              </div>
              
              <div>
                <h3 className="luxury-heading-sm text-foreground mb-2">West London</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>SW1 - Belgravia</li>
                  <li>SW3 - Chelsea</li>
                  <li>SW7 - South Kensington</li>
                  <li>W8 - Kensington</li>
                </ul>
              </div>
              
              <div>
                <h3 className="luxury-heading-sm text-foreground mb-2">East London</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>E1 - Shoreditch</li>
                  <li>E14 - Canary Wharf</li>
                  <li>E2 - Bethnal Green</li>
                  <li>EC2 - City of London</li>
                </ul>
              </div>
              
              <div>
                <h3 className="luxury-heading-sm text-foreground mb-2">North London</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>NW1 - Camden</li>
                  <li>NW3 - Hampstead</li>
                  <li>NW8 - St John's Wood</li>
                  <li>N1 - Islington</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 text-center">
            <h2 className="luxury-heading-xl text-foreground mb-4">
              Book Your Elite Companion Today
            </h2>
            <p className="luxury-body-lg text-muted-foreground mb-8">
              Available across all London locations. Same-day booking available.
            </p>
            <a 
              href="tel:+447436190679"
              className="inline-block border border-border hover:border-foreground px-8 py-3 transition-all duration-300"
            >
              <span className="luxury-body-base tracking-[0.3em] uppercase font-light text-foreground">
                Call Now: +44 7436 190679
              </span>
            </a>
          </section>
        </div>
      </main>
    </>
  );
};