import React, { useState, useMemo } from 'react';
import { ModelCard } from '@/components/ModelCard';
import { useModels } from '@/hooks/useModels';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Search, MapPin, Sparkles, Settings, ChevronDown, AlertCircle } from 'lucide-react';

export const ModelsGallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCharacteristic, setSelectedCharacteristic] = useState('all');
  const [selectedServiceType, setSelectedServiceType] = useState('all');
  
  // Use secure hook instead of hardcoded data
  const { models, loading, error } = useModels();

  // Get unique values for filters
  const uniqueLocations = [...new Set(models.map(model => model.location).filter(Boolean))];
  const uniqueCharacteristics = [...new Set(models.flatMap(model => model.characteristics || []).filter(Boolean))];

  const filteredModels = useMemo(() => {
    if (!models.length) return [];
    
    return models.filter(model => {
      const matchesSearch = model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || model.location === selectedLocation;
      const matchesCharacteristic = selectedCharacteristic === 'all' || 
                                   (model.characteristics && model.characteristics.includes(selectedCharacteristic));
      const matchesServiceType = selectedServiceType === 'all' || 
                                 (model.services && model.services.some(service => 
                                   service.toLowerCase().includes(selectedServiceType.toLowerCase())
                                 ));
      
      return matchesSearch && matchesLocation && matchesCharacteristic && matchesServiceType;
    });
  }, [models, searchTerm, selectedLocation, selectedCharacteristic, selectedServiceType]);


  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
    setSelectedCharacteristic('all');
    setSelectedServiceType('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Elegant Header */}
        <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
          <div className="container-width text-center">
            <h1 className="heading-xl mb-4 tracking-tight">
              Our Companions
            </h1>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully selected companions, each offering unique charm and sophistication
            </p>
          </div>
        </section>

        {/* Sophisticated Filters */}
        <section className="py-8 border-b border-border/50">
          <div className="container-width">
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-9 pr-4 py-2 body-sm border border-border rounded-full bg-background focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-40 pl-9 pr-10 py-2 body-sm border border-border rounded-full bg-background focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Areas</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Characteristic Filter */}
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <select
                  value={selectedCharacteristic}
                  onChange={(e) => setSelectedCharacteristic(e.target.value)}
                  className="w-44 pl-9 pr-10 py-2 body-sm border border-border rounded-full bg-background focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  {uniqueCharacteristics.map(characteristic => (
                    <option key={characteristic} value={characteristic}>{characteristic}</option>
                  ))}
                </select>
              </div>

              {/* Service Type Filter */}
              <div className="relative">
                <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <select
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                  className="w-36 pl-9 pr-10 py-2 body-sm border border-border rounded-full bg-background focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Services</option>
                  <option value="incall">Incall</option>
                  <option value="outcall">Outcall</option>
                </select>
              </div>
            </div>

            {/* Results Counter & Clear */}
            {(searchTerm || selectedLocation !== 'all' || selectedCharacteristic !== 'all' || selectedServiceType !== 'all') && (
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/30">
                <span className="body-sm text-muted-foreground">
                  {filteredModels.length} companions found
                </span>
                <button
                  onClick={clearAllFilters}
                  className="body-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Elegant Gallery - Loro Piana Style Mobile */}
        <section className="py-16">
          <div className="container-width-lg">
            {loading ? (
              <div className="text-center py-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading companions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="heading-lg mb-3">Unable to load companions</h3>
                <p className="body-md text-muted-foreground mb-8 max-w-md mx-auto">
                  {error}. Please try again later.
                </p>
              </div>
            ) : filteredModels.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                {filteredModels.map(model => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/30 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="heading-lg mb-3">No companions found</h3>
                <p className="body-md text-muted-foreground mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or browse all companions
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-6 py-2 body-sm font-medium text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40 rounded-full transition-all"
                >
                  Clear Filters
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