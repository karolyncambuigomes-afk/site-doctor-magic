import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ModelFilters {
  searchTerm: string;
  selectedLocations: string[];
  selectedCharacteristics: string[];
  selectedServices: string[];
}

export const useModelsFilters = () => {
  const [filters, setFilters] = useState<ModelFilters>({
    searchTerm: '',
    selectedLocations: [],
    selectedCharacteristics: [],
    selectedServices: [],
  });

  const [availableOptions, setAvailableOptions] = useState<{
    locations: string[];
    characteristics: string[];
    services: string[];
  }>({
    locations: [],
    characteristics: [],
    services: [],
  });

  // Load available filter options from database
  useEffect(() => {
    console.log('useModelsFilters: Starting loadFilterOptions');
    
    const loadFilterOptions = async () => {
      try {
        console.log('useModelsFilters: Making database queries');
        
        // Direct queries since RPC functions don't exist
        const [locationsQuery, modelsQuery] = await Promise.all([
          supabase
            .from('models')
            .select('location')
            .not('location', 'is', null),
          supabase
            .from('models')
            .select('characteristics, services')
            .not('characteristics', 'is', null)
            .not('services', 'is', null)
        ]);

        console.log('useModelsFilters: Queries completed', { 
          locationsError: locationsQuery.error, 
          modelsError: modelsQuery.error 
        });

        // Extract unique locations
        const uniqueLocations = [...new Set(locationsQuery.data?.map(m => m.location) || [])].filter(Boolean);
        
        // Extract unique characteristics and services
        const allCharacteristics = modelsQuery.data?.flatMap(m => m.characteristics || []) || [];
        const uniqueCharacteristics = [...new Set(allCharacteristics)].filter(Boolean);
        
        const allServices = modelsQuery.data?.flatMap(m => m.services || []) || [];
        const uniqueServices = [...new Set(allServices)].filter(Boolean);

        console.log('useModelsFilters: Setting available options', {
          locations: uniqueLocations.length,
          characteristics: uniqueCharacteristics.length,
          services: uniqueServices.length
        });

        setAvailableOptions({
          locations: uniqueLocations,
          characteristics: uniqueCharacteristics,
          services: uniqueServices,
        });
      } catch (error) {
        console.error('useModelsFilters: Error loading filter options:', error);
        // Fallback to hardcoded values
        setAvailableOptions({
          locations: ['Knightsbridge', 'Mayfair'],
          characteristics: [
            'Latina', 'VIP / Elite', 'European', 'GFE (Girlfriend Experience)', 
            'Exclusive', 'Couples', 'Petite', 'Brazilian', 'High-Class', 
            'Open-Minded', 'Russian', 'Party', 'Young', 'Slim', 
            'Domination / Fetish', 'Tall', 'Natural', 'Blonde', 
            'Dinner Date', 'Outcalls', 'Brunette'
          ],
          services: [
            'Private Meetings', 'Event Escort', 'Social Events', 
            'Luxury Events', 'Dinner Companion', 'International Travel'
          ],
        });
      }
    };

    loadFilterOptions();
  }, []);

  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  const updateLocations = useCallback((selectedLocations: string[]) => {
    setFilters(prev => ({ ...prev, selectedLocations }));
  }, []);

  const updateCharacteristics = useCallback((selectedCharacteristics: string[]) => {
    setFilters(prev => ({ ...prev, selectedCharacteristics }));
  }, []);

  const updateServices = useCallback((selectedServices: string[]) => {
    setFilters(prev => ({ ...prev, selectedServices }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      selectedLocations: [],
      selectedCharacteristics: [],
      selectedServices: [],
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return filters.searchTerm !== '' || 
           filters.selectedLocations.length > 0 || 
           filters.selectedCharacteristics.length > 0 || 
           filters.selectedServices.length > 0;
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return filters.selectedLocations.length + 
           filters.selectedCharacteristics.length + 
           filters.selectedServices.length;
  }, [filters.selectedLocations, filters.selectedCharacteristics, filters.selectedServices]);

  return {
    filters,
    availableOptions,
    updateSearchTerm,
    updateLocations,
    updateCharacteristics,
    updateServices,
    clearAllFilters,
    hasActiveFilters,
    activeFiltersCount,
  };
};