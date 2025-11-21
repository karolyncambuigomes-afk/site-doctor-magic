import React, { useMemo, useState } from 'react';
import { ModelCardWrapper } from '@/components/ModelCardWrapper';
import { useModels, Model } from '@/hooks/useModels';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Extract numeric price value for sorting
const extractPriceValue = (model: Model): number => {
  let extractedValue = 0;
  let source = 'unknown';

  // Priority 1: pricing.rates[0].rate (most common format)
  if (model.pricing?.rates?.[0]?.rate) {
    const rate = model.pricing.rates[0].rate;
    
    if (typeof rate === 'number') {
      extractedValue = rate;
      source = 'rates[number]';
    } else if (typeof rate === 'string') {
      // Remove dots (thousand separator), commas, and any non-digit characters
      const cleaned = rate.replace(/\./g, '').replace(/,/g, '').replace(/[^\d]/g, '');
      extractedValue = parseFloat(cleaned) || 0;
      source = 'rates[string]';
    }
  }
  
  // Priority 2: pricing.oneHour (new format)
  if (extractedValue === 0 && model.pricing?.oneHour) {
    const rate = model.pricing.oneHour;
    const cleaned = String(rate).replace(/£/g, '').replace(/\./g, '').replace(/,/g, '').replace(/\/hour/g, '').trim();
    extractedValue = parseFloat(cleaned) || 0;
    source = 'oneHour';
  }
  
  // Priority 3: Fallback to price field
  if (extractedValue === 0 && model.price) {
    const cleaned = model.price.replace(/[^\d]/g, '');
    extractedValue = parseFloat(cleaned) || 0;
    source = 'price_fallback';
  }

  console.log(`[Price Sort] ${model.name}: £${extractedValue} (source: ${source})`);
  return extractedValue;
};

export const ModelsGallery: React.FC = () => {
  const { models, loading, error } = useModels();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);

  // Get unique categories/characteristics from models
  const categories = useMemo(() => {
    if (!models.length) return [];
    const allCharacteristics = models.flatMap(model => model.characteristics || []);
    return [...new Set(allCharacteristics)];
  }, [models]);

  const filteredModels = useMemo(() => {
    if (!models.length) return [];
    
    let filtered = models.filter(model => {
      // Search term filter (includes location)
      const matchesSearch = !searchTerm || 
        model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.location?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter (multiple selection)
      const matchesCategory = selectedCharacteristics.length === 0 ||
        selectedCharacteristics.some(char => model.characteristics?.includes(char));

      return matchesSearch && matchesCategory;
    });

    // Sort from most expensive to cheapest
    filtered.sort((a, b) => {
      const priceA = extractPriceValue(a);
      const priceB = extractPriceValue(b);
      return priceB - priceA; // Descending order
    });

    return filtered;
  }, [models, searchTerm, selectedCharacteristics]);

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-0">
        {/* Simple Search and Category Filters */}
        <section className="py-8 border-b border-border/50">
          <div className="container-width">
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search models by name, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4">
              <Button
                variant={selectedCharacteristics.length === 0 ? 'default' : 'outline'}
                onClick={() => setSelectedCharacteristics([])}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-4"
              >
                All Models
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCharacteristics.includes(category) ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedCharacteristics(prev => 
                      prev.includes(category)
                        ? prev.filter(char => char !== category)
                        : [...prev, category]
                    );
                  }}
                  className="text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-4"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Results Counter */}
            <div className="text-center text-sm text-gray-600">
              {filteredModels.length} companion{filteredModels.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </section>

        {/* Models Gallery */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container-width-lg">
            {loading ? (
              <div className="text-center py-24">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-muted-foreground">Loading companions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="luxury-heading-lg mb-3">Unable to load companions</h3>
                <p className="luxury-body-md text-muted-foreground mb-8 max-w-md mx-auto">
                  {error}. Please try again later.
                </p>
              </div>
            ) : filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-6 lg:gap-6 xl:gap-8">
                {filteredModels.map((model, index) => (
                  <ModelCardWrapper key={model.id} model={model} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/30 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="luxury-heading-lg mb-3">No companions found</h3>
                <p className="luxury-body-md text-muted-foreground mb-8 max-w-md mx-auto">
                  Try adjusting your search or browse all companions
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCharacteristics([]);
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};