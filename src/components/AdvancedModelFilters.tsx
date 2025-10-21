import React, { useState, useEffect } from 'react';
import { Search, X, Filter, MapPin, Heart, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AdvancedModelFiltersProps {
  searchTerm: string;
  selectedLocations: string[];
  selectedCharacteristics: string[];
  selectedServices: string[];
  onSearchChange: (value: string) => void;
  onLocationChange: (locations: string[]) => void;
  onCharacteristicChange: (characteristics: string[]) => void;
  onServiceChange: (services: string[]) => void;
  onClearAll: () => void;
  availableLocations: string[];
  availableCharacteristics: string[];
  availableServices: string[];
}

export const AdvancedModelFilters: React.FC<AdvancedModelFiltersProps> = ({
  searchTerm,
  selectedLocations,
  selectedCharacteristics,
  selectedServices,
  onSearchChange,
  onLocationChange,
  onCharacteristicChange,
  onServiceChange,
  onClearAll,
  availableLocations,
  availableCharacteristics,
  availableServices,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const totalActiveFilters = selectedLocations.length + selectedCharacteristics.length + selectedServices.length;

  const handleLocationToggle = (location: string) => {
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter(l => l !== location)
      : [...selectedLocations, location];
    onLocationChange(newLocations);
  };

  const handleCharacteristicToggle = (characteristic: string) => {
    const newCharacteristics = selectedCharacteristics.includes(characteristic)
      ? selectedCharacteristics.filter(c => c !== characteristic)
      : [...selectedCharacteristics, characteristic];
    onCharacteristicChange(newCharacteristics);
  };

  const handleServiceToggle = (service: string) => {
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    onServiceChange(newServices);
  };

  const removeFilter = (type: 'location' | 'characteristic' | 'service', value: string) => {
    switch (type) {
      case 'location':
        onLocationChange(selectedLocations.filter(l => l !== value));
        break;
      case 'characteristic':
        onCharacteristicChange(selectedCharacteristics.filter(c => c !== value));
        break;
      case 'service':
        onServiceChange(selectedServices.filter(s => s !== value));
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Search Bar */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <Input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 sm:pl-10 pr-3 sm:pr-4 h-9 sm:h-10 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Advanced </span>Filters
                {totalActiveFilters > 0 && (
                  <Badge variant="secondary" className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs h-4 sm:h-5 px-1 sm:px-2">
                    {totalActiveFilters}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Locations */}
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                    <MapPin className="h-4 w-4" />
                    Locations
                  </h4>
                  <div className="space-y-2">
                    {availableLocations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`location-${location}`}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={() => handleLocationToggle(location)}
                        />
                        <label
                          htmlFor={`location-${location}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Characteristics */}
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                    <Heart className="h-4 w-4" />
                    Characteristics
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableCharacteristics.map((characteristic) => (
                      <div key={characteristic} className="flex items-center space-x-2">
                        <Checkbox
                          id={`characteristic-${characteristic}`}
                          checked={selectedCharacteristics.includes(characteristic)}
                          onCheckedChange={() => handleCharacteristicToggle(characteristic)}
                        />
                        <label
                          htmlFor={`characteristic-${characteristic}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {characteristic}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                    <Briefcase className="h-4 w-4" />
                    Services
                  </h4>
                  <div className="space-y-2">
                    {availableServices.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service}`}
                          checked={selectedServices.includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <label
                          htmlFor={`service-${service}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {totalActiveFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="text-gray-500 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4">
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {totalActiveFilters > 0 && (
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {selectedLocations.map((location) => (
              <Badge key={`location-${location}`} variant="secondary" className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="max-w-[100px] sm:max-w-none truncate">{location}</span>
                <button
                  onClick={() => removeFilter('location', location)}
                  className="ml-0.5 sm:ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </Badge>
            ))}
            {selectedCharacteristics.map((characteristic) => (
              <Badge key={`characteristic-${characteristic}`} variant="secondary" className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2">
                <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="max-w-[100px] sm:max-w-none truncate">{characteristic}</span>
                <button
                  onClick={() => removeFilter('characteristic', characteristic)}
                  className="ml-0.5 sm:ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </Badge>
            ))}
            {selectedServices.map((service) => (
              <Badge key={`service-${service}`} variant="secondary" className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2">
                <Briefcase className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="max-w-[100px] sm:max-w-none truncate">{service}</span>
                <button
                  onClick={() => removeFilter('service', service)}
                  className="ml-0.5 sm:ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};