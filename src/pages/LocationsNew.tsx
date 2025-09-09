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

          {/* SEO Content Section */}
          <section className="mt-16 py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <details className="mb-8">
                <summary className="cursor-pointer luxury-heading-lg text-center mb-6 text-gray-800 hover:text-muted-foreground transition-colors">
                  <h2>Elite Escorts Across London</h2>
                </summary>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-4">
                    <h3 className="luxury-heading-md">Central London Areas</h3>
                    <p className="luxury-body-md text-muted-foreground leading-relaxed">
                      Five London provides premium escort services throughout Central London's most prestigious areas including Mayfair, Marylebone, Fitzrovia, and Covent Garden. Our companions are perfectly positioned to meet clients at luxury hotels, exclusive restaurants, and private venues.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="luxury-body-sm font-medium">Mayfair & Marylebone</h4>
                        <p className="luxury-body-xs text-muted-foreground">Premium coverage of W1 postcode areas including Berkeley Square, Bond Street, and Oxford Street vicinity.</p>
                      </div>
                      <div>
                        <h4 className="luxury-body-sm font-medium">Covent Garden & Bloomsbury</h4>
                        <p className="luxury-body-xs text-muted-foreground">WC1 and WC2 areas served with companions available for theatre, dining, and cultural events.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="luxury-heading-md">Premium Locations</h3>
                    <p className="luxury-body-md text-muted-foreground leading-relaxed">
                      Extending our services to London's most exclusive neighborhoods including Knightsbridge, Belgravia, Kensington, and Chelsea. Our professional companions are experienced with the capital's finest hotels, restaurants, and private clubs.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="luxury-body-sm font-medium">Knightsbridge & Belgravia</h4>
                        <p className="luxury-body-xs text-muted-foreground">SW1 and SW3 premium areas including Harrods, Harvey Nichols, and exclusive diplomatic quarter.</p>
                      </div>
                      <div>
                        <h4 className="luxury-body-sm font-medium">Kensington & Chelsea</h4>
                        <p className="luxury-body-xs text-muted-foreground">SW7 and SW5 areas covering South Kensington museums, Kings Road, and exclusive residential districts.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
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