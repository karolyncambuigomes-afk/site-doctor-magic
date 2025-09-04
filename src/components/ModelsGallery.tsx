import React, { useState, useMemo } from 'react';
import { ModelCard } from '@/components/ModelCard';
import { models, Model } from '@/data/models';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Search, Filter } from 'lucide-react';

export const ModelsGallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCharacteristic, setSelectedCharacteristic] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  // Get unique values for filters
  const uniqueLocations = [...new Set(models.map(model => model.location))];
  const uniqueCharacteristics = [...new Set(models.flatMap(model => model.characteristics))];

  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || model.location === selectedLocation;
      const matchesCharacteristic = selectedCharacteristic === 'all' || 
                                   model.characteristics.includes(selectedCharacteristic);
      const matchesAvailability = selectedAvailability === 'all' || model.availability === selectedAvailability;
      
      return matchesSearch && matchesLocation && matchesCharacteristic && matchesAvailability;
    });
  }, [searchTerm, selectedLocation, selectedCharacteristic, selectedAvailability]);

  const availableCount = models.filter(model => model.availability === 'available').length;
  const busyCount = models.filter(model => model.availability === 'busy').length;

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
    setSelectedCharacteristic('all');
    setSelectedAvailability('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Clean Header */}
        <section className="py-12 bg-muted/30">
          <div className="container-width text-center">
            <h1 className="heading-xl mb-4">
              Our Companions
            </h1>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully selected companions, each offering unique charm and sophistication
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b border-border">
          <div className="container-width">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:border-primary outline-none transition-colors"
                />
              </div>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:border-primary outline-none transition-colors"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              {/* Characteristic Filter */}
              <select
                value={selectedCharacteristic}
                onChange={(e) => setSelectedCharacteristic(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:border-primary outline-none transition-colors"
              >
                <option value="all">All Characteristics</option>
                {uniqueCharacteristics.map(characteristic => (
                  <option key={characteristic} value={characteristic}>{characteristic}</option>
                ))}
              </select>

              {/* Availability Filter */}
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:border-primary outline-none transition-colors"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Active Filters & Clear */}
            {(searchTerm || selectedLocation !== 'all' || selectedCharacteristic !== 'all' || selectedAvailability !== 'all') && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredModels.length} of {models.length} companions
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Models Grid */}
        <section className="py-12">
          <div className="container-width-lg">
            {filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredModels.map(model => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="heading-lg mb-4">No companions found</h3>
                <p className="body-lg text-muted-foreground mb-8">
                  Try adjusting your search or filter criteria
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="five-london-button-outline"
                >
                  Clear All Filters
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