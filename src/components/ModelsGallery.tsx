import React, { useState, useMemo } from 'react';
import { ModelCard } from '@/components/ModelCard';
import { models, Model } from '@/data/models';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const ModelsGallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all');

  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = filterAvailability === 'all' || model.availability === filterAvailability;
      
      return matchesSearch && matchesAvailability;
    });
  }, [searchTerm, filterAvailability]);

  const availableCount = models.filter(model => model.availability === 'available').length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32">
        {/* Ultra Minimal Header */}
        <section className="section-padding-sm bg-gradient-hero">
          <div className="container-width text-center">
            <h1 className="heading-xl mb-8">
              Our Companions
            </h1>
            <p className="body-luxury max-w-3xl mx-auto">
              A carefully curated selection of sophisticated companions, 
              each embodying elegance, intelligence, and discretion.
            </p>
            
            <div className="flex justify-center mt-12">
              <div className="caption">
                {availableCount} Available • {models.length} Total
              </div>
            </div>
          </div>
        </section>

        {/* Pure Minimal Search */}
        <section className="section-padding-sm border-b border-border">
          <div className="container-width">
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search companions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-0 py-4 text-center bg-transparent border-0 border-b border-border focus:border-foreground transition-luxury outline-none text-lg font-light tracking-wide"
              />
            </div>
          </div>
        </section>

        {/* Ultra Minimal Gallery Grid */}
        <section className="section-padding">
          <div className="container-width-lg">
            {filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
                {filteredModels.map(model => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32">
                <h3 className="heading-md mb-8">No matches found</h3>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="caption hover:text-foreground transition-luxury cursor-pointer border-b border-muted-foreground hover:border-foreground"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};