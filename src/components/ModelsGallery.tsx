import React, { useMemo } from 'react';
import { ModelCard } from '@/components/ModelCard';
import { useModels } from '@/hooks/useModels';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdvancedModelFilters } from './AdvancedModelFilters';
import { useModelsFilters } from '@/hooks/useModelsFilters';
import { Search, AlertCircle } from 'lucide-react';
export const ModelsGallery: React.FC = () => {
  const {
    filters,
    availableOptions,
    updateSearchTerm,
    updateLocations,
    updateCharacteristics,
    updateServices,
    clearAllFilters,
    hasActiveFilters,
    activeFiltersCount,
  } = useModelsFilters();

  const { models, loading, error } = useModels();

  const filteredModels = useMemo(() => {
    if (!models.length) return [];
    
    return models.filter(model => {
      // Search term filter
      const matchesSearch = !filters.searchTerm || 
        model.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        model.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Location filter (multi-select)
      const matchesLocation = filters.selectedLocations.length === 0 ||
        filters.selectedLocations.includes(model.location || '');

      // Characteristics filter (multi-select)
      const matchesCharacteristics = filters.selectedCharacteristics.length === 0 ||
        filters.selectedCharacteristics.some(characteristic => 
          model.characteristics?.includes(characteristic)
        );

      // Services filter (multi-select)
      const matchesServices = filters.selectedServices.length === 0 ||
        filters.selectedServices.some(service => 
          model.services?.includes(service)
        );

      return matchesSearch && matchesLocation && matchesCharacteristics && matchesServices;
    });
  }, [models, filters]);
  return <div className="min-h-screen bg-white">
      
      
      <main id="main-content" className="pt-16 sm:pt-20">
        {/* Breadcrumbs */}
        <section className="py-4 border-b border-border/30">
          
        </section>


        {/* Advanced Filters */}
        <section className="py-8 border-b border-border/50">
          <div className="container-width">
            <AdvancedModelFilters
              searchTerm={filters.searchTerm}
              selectedLocations={filters.selectedLocations}
              selectedCharacteristics={filters.selectedCharacteristics}
              selectedServices={filters.selectedServices}
              onSearchChange={updateSearchTerm}
              onLocationChange={updateLocations}
              onCharacteristicChange={updateCharacteristics}
              onServiceChange={updateServices}
              onClearAll={clearAllFilters}
              availableLocations={availableOptions.locations}
              availableCharacteristics={availableOptions.characteristics}
              availableServices={availableOptions.services}
            />

            {/* Results Counter */}
            {hasActiveFilters && (
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/30">
                <span className="text-sm text-gray-600">
                  {filteredModels.length} companion{filteredModels.length !== 1 ? 's' : ''} found
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Elegant Gallery - Loro Piana Style Mobile */}
        <section className="py-16">
          <div className="container-width-lg">
            {loading ? <div className="text-center py-24">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-muted-foreground">Loading companions...</p>
              </div> : error ? <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="luxury-heading-lg mb-3">Unable to load companions</h3>
                <p className="luxury-body-md text-muted-foreground mb-8 max-w-md mx-auto">
                  {error}. Please try again later.
                </p>
              </div> : filteredModels.length > 0 ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-6 lg:gap-6 xl:gap-8">
                {filteredModels.map(model => <ModelCard key={model.id} model={model} />)}
              </div> : <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/30 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="luxury-heading-lg mb-3">No companions found</h3>
                <p className="luxury-body-md text-muted-foreground mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or browse all companions
                </p>
                <button onClick={clearAllFilters} className="inline-flex items-center px-6 py-2 luxury-body-sm font-medium text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40 rounded-full transition-all">
                  Clear Filters
                </button>
              </div>}
          </div>
        </section>
      </main>
    </div>;
};