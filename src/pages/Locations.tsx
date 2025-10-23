import { Link } from 'react-router-dom';
import { SEOOptimized } from '@/components/SEOOptimized';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
import { locations } from '@/data/locations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

const Locations = () => {
  return (
    <>
      <SEOOptimized 
        title="Escort Services by Location in London | Five London"
        description="Find premium escort services in your preferred London location. We serve Mayfair, Knightsbridge, Chelsea, Belgravia, Kensington, and Canary Wharf."
        keywords="london escort locations, area specific escorts, mayfair escorts, knightsbridge escorts, chelsea escorts"
        canonicalUrl="/locations"
      />
      
      <Navigation />
      
        <main className="pt-0">
          {/* Hero Section */}
          <section className="section-padding-lg bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="heading-1 title-margin-md text-primary-content">
                  Escorts by Location
                </h1>
                <p className="body-lead text-primary-content mb-12 md:mb-12">
                  Find sophisticated companions across London's most exclusive districts.
                </p>
              </div>
            </div>
            {/* Elegant separator */}
            <div className="separator-elegant"></div>
          </section>

          {/* Locations Grid */}
          <section className="section-padding-md bg-white">
            <div className="container-width">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-4 sm:px-6">
                {locations.map((location) => (
                  <Link 
                    key={location.id} 
                    to={`/locations/${location.slug}`}
                    className="group"
                  >
                     <Button 
                      variant="outline" 
                      className="w-full h-12 sm:h-14 md:h-16 px-3 sm:px-4 md:px-6 justify-center hover:shadow-elegant transition-smooth group-hover:border-primary text-xs sm:text-sm md:text-base"
                    >
                      <span className="body-minimal font-medium group-hover:text-primary transition-colors leading-tight text-center">
                        {location.name}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="section-padding-md bg-secondary-surface">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="heading-2 title-margin-md text-primary-content">
                  Looking for a Specific Location?
                </h2>
                <p className="body-lead text-primary-content mb-6 sm:mb-8">
                  Our elite companions provide services throughout Greater London. Contact us to arrange an appointment in your preferred area.
                </p>
                <a
                  href="https://wa.me/447436190679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm"
                >
                  Contact WhatsApp
                </a>
              </div>
            </div>
          </section>
        </main>
        
        <ContactBar showOnScroll={false} />
        <Footer />
    </>
  );
};

export default Locations;