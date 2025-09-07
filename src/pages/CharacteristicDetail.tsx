import { useParams, Navigate, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { characteristics } from '@/data/characteristics';
import { useModels } from '@/hooks/useModels';
import { ModelCard } from '@/components/ModelCard';
import { Button } from '@/components/ui/button';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

const CharacteristicDetail = () => {
  const { characteristicSlug } = useParams();
  const { models, loading, error } = useModels();
  
  // Find the characteristic by matching the complete slug
  const characteristic = characteristics.find(char => char.slug === characteristicSlug);
  
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
        
        <main className="pt-20">
          {/* Ultra Minimal Header */}
          <section className="py-6">
            <div className="container-width">
              <div className="text-center">
                <h1 className="heading-xl mb-2">
                  {characteristic.name} Escorts
                </h1>
                <div className="w-24 h-px bg-primary mx-auto"></div>
              </div>
            </div>
          </section>

          {/* Pure Gallery */}
          <section className="py-4">
            <div className="container-width-lg">
              {characteristicModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {characteristicModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h2 className="heading-lg mb-4">No models available with this characteristic</h2>
                  <p className="body-lg text-muted-foreground mb-8">
                    We're constantly updating our collection. Please check back soon or browse our full gallery.
                  </p>
                  <Link to="/models">
                    <Button className="five-london-button-outline">
                      View All Models
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Content Section */}
          {characteristic.content && (
            <section className="py-8 bg-muted/30">
              <div className="container-width">
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="prose prose-lg max-w-none text-muted-foreground text-center"
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
                <h2 className="heading-lg mb-4">Explore Other Characteristics</h2>
                <p className="body-lg text-muted-foreground">
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