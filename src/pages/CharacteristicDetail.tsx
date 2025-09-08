import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSafeParams } from '@/hooks/useSafeRouter';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { characteristics } from '@/data/characteristics';
import { useModels } from '@/hooks/useModels';
import { ModelCard } from '@/components/ModelCard';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

const CharacteristicDetail = () => {
  const params = useSafeParams();
  const { characteristicSlug } = params;
  const { models, loading, error } = useModels();
  const [isContentOpen, setIsContentOpen] = useState(false);
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
    '/vip-escorts-london': 'vip-escorts',
    '/gfe-escorts-london': 'gfe-escorts',
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
      <SEO 
        title={characteristic.seoTitle}
        description={characteristic.seoDescription}
        keywords={characteristic.keywords.join(', ')}
        canonicalUrl={`/characteristics/${characteristic.slug}`}
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-16">
          {/* Minimal Hero */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="luxury-heading-display mb-4 sm:mb-6 text-black">
                  {characteristic.name} Escorts
                </h1>
                <p className="luxury-body-lg text-black">
                  Discover sophisticated companions with {characteristic.name.toLowerCase()} characteristics.
                </p>
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

          {/* SEO Content Section - Collapsible */}
          {characteristic.content && (
            <section className="py-16 md:py-20 bg-white">
              <div className="container-width mx-auto px-6">
                <div className="text-center mb-8">
                  <Collapsible open={isContentOpen} onOpenChange={setIsContentOpen}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="mx-auto flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors border-primary/20 hover:border-primary/40"
                      >
                        Saiba mais sobre {characteristic.name} Escorts
                        {isContentOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-12 animate-accordion-down">
                      <div 
                        className="prose prose-lg max-w-4xl mx-auto text-foreground [&>h2]:luxury-heading-lg [&>h3]:luxury-heading-md [&>p]:luxury-body-base [&>p]:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: characteristic.content }}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </section>
          )}

          {/* Related Characteristics */}
          <section className="py-8">
            <div className="container-width">
              <div className="text-center mb-8">
                <h2 className="luxury-heading-lg mb-4">Explore Other Characteristics</h2>
                <p className="luxury-body-lg text-muted-foreground">
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
                           <div className="caption text-muted-foreground mt-1">
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
        
        <Footer />
      </div>
    </>
  );
};

export default CharacteristicDetail;