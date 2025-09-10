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
    const loadFilterOptions = async () => {
      try {
        const [locationsResult, characteristicsResult, servicesResult] = await Promise.all([
          supabase.rpc('get_distinct_locations'),
          supabase.rpc('get_distinct_characteristics'),
          supabase.rpc('get_distinct_services'),
        ]);

        // Fallback to direct queries if RPC functions don't exist
        if (locationsResult.error) {
          const { data: locations } = await supabase
            .from('models')
            .select('location')
            .not('location', 'is', null);
          
          const uniqueLocations = [...new Set(locations?.map(m => m.location) || [])].filter(Boolean);
          setAvailableOptions(prev => ({ ...prev, locations: uniqueLocations }));
        } else {
          setAvailableOptions(prev => ({ ...prev, locations: locationsResult.data || [] }));
        }

        if (characteristicsResult.error) {
          const { data: models } = await supabase
            .from('models')
            .select('characteristics')
            .not('characteristics', 'is', null);
          
          const allCharacteristics = models?.flatMap(m => m.characteristics || []) || [];
          const uniqueCharacteristics = [...new Set(allCharacteristics)].filter(Boolean);
          setAvailableOptions(prev => ({ ...prev, characteristics: uniqueCharacteristics }));
        } else {
          setAvailableOptions(prev => ({ ...prev, characteristics: characteristicsResult.data || [] }));
        }

        if (servicesResult.error) {
          const { data: models } = await supabase
            .from('models')
            .select('services')
            .not('services', 'is', null);
          
          const allServices = models?.flatMap(m => m.services || []) || [];
          const uniqueServices = [...new Set(allServices)].filter(Boolean);
          setAvailableOptions(prev => ({ ...prev, services: uniqueServices }));
        } else {
          setAvailableOptions(prev => ({ ...prev, services: servicesResult.data || [] }));
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
        // Fallback to hardcoded values based on our query results
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