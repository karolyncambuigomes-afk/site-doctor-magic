import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSafeParams } from '@/hooks/useSafeRouter';
import { SEOOptimized } from '@/components/SEOOptimized';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
import { characteristics } from '@/data/characteristics';
import { useModels } from '@/hooks/useModels';
import { ModelCard } from '@/components/ModelCard';
import { Button } from '@/components/ui/button';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

const CharacteristicDetail = () => {
  const params = useSafeParams();
  const { characteristicSlug } = params;
  const { models, loading, error } = useModels();
  const currentPath = window.location.pathname;
  
  // Safety check for router context
  if (!params) {
    console.warn('CharacteristicDetail: useParams returned undefined');
    return <div>Loading...</div>;
  }
  
  // Path mapping for SEO routes
  const pathMap: { [key: string]: string } = {
    '/blonde-escorts-london': 'blonde-escorts',
    '/brunette-escorts-london': 'brunette-escorts',
    '/busty-escorts-london': 'busty-escorts',
    '/petite-escorts-london': 'petite-escorts',
    '/curvy-escorts-london': 'curvy-escorts',
    '/slim-escorts-london': 'slim-escorts',
    '/english-escorts-london': 'english-escorts',
    '/international-escorts-london': 'international-escorts',
    '/young-escorts-london': 'young-escorts',
    '/mature-escorts-london': 'mature-escorts',
    '/vip-escorts-london': 'vip-elite-escorts',
    '/gfe-escorts-london': 'gfe-girlfriend-experience-escorts',
    '/redhead-escorts-london': 'redhead-escorts',
    '/asian-escorts-london': 'asian-escorts',
    '/european-escorts-london': 'european-escorts',
    '/ebony-escorts-london': 'ebony-escorts',
    '/tall-escorts-london': 'tall-escorts',
    '/natural-escorts-london': 'natural-escorts',
    '/brazilian-escorts-london': 'brazilian-escorts',
    '/russian-escorts-london': 'russian-escorts',
    '/middle-eastern-escorts-london': 'middle-eastern-escorts',
    '/latina-escorts-london': 'latina-escorts',
    '/iranian-escorts-london': 'iranian-escorts',
    '/vip-elite-escorts-london': 'vip-elite-escorts',
    '/party-escorts-london': 'party-escorts',
    '/adventurous-escorts-london': 'adventurous-escorts',
    '/open-minded-escorts-london': 'open-minded-escorts',
    '/exclusive-escorts-london': 'exclusive-escorts',
    '/high-class-escorts-london': 'high-class-escorts',
    '/dinner-date-escorts-london': 'dinner-date-escorts',
    '/domination-fetish-escorts-london': 'domination-fetish-escorts',
    '/bisexual-escorts-london': 'bisexual-escorts',
    '/couples-escorts-london': 'couples-escorts',
    '/outcalls-escorts-london': 'outcalls-escorts',
  };
  
  // Find characteristic by slug or by matching the URL path
  const characteristic = characteristics.find(char => {
    // Direct slug match (e.g., /characteristics/blonde-escorts)
    if (char.slug === characteristicSlug) return true;
    
    // URL-based matching for SEO routes
    return pathMap[currentPath] === char.slug;
  });
  
  if (!characteristic) {
    return <Navigate to="/404" replace />;
  }

  // Filter models by characteristic
  const characteristicModels = models.filter(model => 
    model.characteristics && model.characteristics.some(char => char.toLowerCase() === characteristic.name.toLowerCase())
  );

  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Characteristics", url: "https://fivelondon.com/characteristics" },
      { name: characteristic.name, url: `https://fivelondon.com/characteristics/${characteristic.slug}` }
    ])
  ];

  return (
    <>
      <SEOOptimized 
        title={characteristic.seoTitle}
        description={characteristic.seoDescription}
        keywords={characteristic.keywords.join(', ')}
        canonicalUrl={`/characteristics/${characteristic.slug}`}
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-0">
          {/* Hero */}
          <section className="pt-20 md:pt-24 bg-white border-b border-gray-100">
            <div className="container-width">
              {/* Breadcrumbs */}
              <div className="px-4 sm:px-6 pt-6 pb-4">
                <nav className="flex items-center gap-2 luxury-body-sm text-gray-600">
                  <Link to="/" className="hover:text-black transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/characteristics" className="hover:text-black transition-colors">Characteristics</Link>
                  <span>/</span>
                  <span className="text-black">{characteristic.name}</span>
                </nav>
              </div>
              
              {/* Title */}
              <div className="text-center px-4 sm:px-6 pb-12">
                <h1 className="luxury-heading-xl text-black mb-4">
                  {characteristic.name} Escorts
                </h1>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent mx-auto"></div>
              </div>
            </div>
          </section>

          {/* Models Gallery */}
          <section className="py-8 bg-white">
            <div className="container-width">
              {characteristicModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 sm:px-6">
                  {characteristicModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4 sm:px-6">
                  <h2 className="luxury-heading-lg mb-4 text-black">No models available with this characteristic</h2>
                  <p className="luxury-body-lg text-black mb-8">
                    We're constantly updating our collection. Please check back soon or browse our full gallery.
                  </p>
                  <Link to="/models">
                    <button className="bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm">
                      View All Models
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-gray-50">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="luxury-heading-display mb-4 sm:mb-6 text-black">
                  Find Your Perfect {characteristic.name} Companion
                </h2>
                <p className="luxury-body-lg text-black mb-6 sm:mb-8">
                  Contact our concierge team to arrange your exclusive experience.
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

          {/* SEO Content Section - Always Expanded */}
          {characteristic.content && (
            <section className="py-16 md:py-20 bg-gray-100">
              <div className="container-width mx-auto px-6">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6 md:p-8">
                  <div className="text-center mb-8">
                    <h2 className="luxury-heading-lg text-black mb-4">
                      About {characteristic.name} Escorts
                    </h2>
                  </div>
                  <div 
                    className="prose prose-lg max-w-4xl mx-auto text-black [&>h2]:luxury-heading-lg [&>h3]:luxury-heading-md [&>p]:luxury-body-base [&>p]:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: characteristic.content }}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Related Characteristics */}
          <section className="py-8">
            <div className="container-width">
              <div className="text-center mb-8">
                <h2 className="luxury-heading-lg mb-4">Explore Other Characteristics</h2>
                <p className="luxury-body-lg text-gray-600">
                  Discover more companions with different unique traits
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {characteristics
                  .filter(char => char.id !== characteristic.id)
                  .slice(0, 4)
                  .map((char) => (
                    <Link key={char.id} to={`/characteristics/${char.slug}`}>
                       <Button variant="outline" className="w-full p-4 h-auto">
                         <div className="text-center">
                           <div className="font-medium">{char.name}</div>
                           <div className="luxury-body-xs text-muted-foreground mt-1">
                             {models.filter(m => m.characteristics && m.characteristics.some(c => c.toLowerCase() === char.name.toLowerCase())).length} models
                           </div>
                         </div>
                      </Button>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        </main>
        
        <ContactBar showOnScroll={false} />
        <Footer />
      </div>
    </>
  );
};

export default CharacteristicDetail;