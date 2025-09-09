import React from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { usePreferenceCategories } from '@/hooks/usePreferenceCategories';
import { LoadingSpinner } from '@/components/LoadingSpinner';
export const CategoryFilters: React.FC = () => {
  const { categories, loading } = usePreferenceCategories();

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="luxury-heading-lg text-black mb-4">
            Browse by Preference
          </h2>
          <p className="luxury-body-md text-black max-w-2xl mx-auto">
            Discover your perfect companion from our carefully curated selection of elite London models
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <SafeLink 
              key={category.id} 
              to={category.path} 
              className="group relative aspect-[3/4] overflow-hidden bg-muted hover:shadow-lg transition-all duration-300"
            >
              <img 
                src={category.image_url} 
                alt={category.image_alt || `${category.name} companions in London`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-center tracking-wide">
                  {category.name}
                </h3>
              </div>
            </SafeLink>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a href="https://wa.me/447436190679" target="_blank" rel="noopener noreferrer" className="inline-block border border-border hover:border-foreground px-8 py-3 transition-all duration-300">
            <span className="luxury-body-sm tracking-[0.3em] uppercase font-light text-black">BOOK NOW</span>
          </a>
        </div>
      </div>
    </section>
  );
};