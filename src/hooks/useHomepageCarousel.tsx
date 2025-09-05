// UPDATED 2025: Homepage carousel with age and characteristics
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getImageUrl } from '@/utils/imageMapper';

export interface CarouselModel {
  id: string;
  name: string;
  image: string;
  location?: string;
  price?: string;
  age?: number;
  characteristics?: string[];
}

export const useHomepageCarousel = () => {
  const [models, setModels] = useState<CarouselModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarouselModels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get carousel items
      const { data: carouselData, error: carouselError } = await supabase
        .from('homepage_carousel')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (carouselError) {
        console.error('Error fetching carousel:', carouselError);
        setError('Failed to load carousel');
        return;
      }

      // Get model details for each carousel item
      const modelIds = carouselData?.map(item => item.model_id) || [];
      
      let modelsData = [];
      if (modelIds.length > 0) {
        const { data, error: modelsError } = await supabase
          .from('models')
          .select('id, location, price, age, characteristics')
          .in('id', modelIds);

        if (modelsError) {
          console.error('Error fetching model details:', modelsError);
        } else {
          modelsData = data || [];
        }
      }

      // Transform data to match our interface
      const transformedModels = carouselData?.map((item: any) => {
        const modelDetails = modelsData.find(m => m.id === item.model_id);
          return {
            id: item.model_id,
            name: item.model_name,
            image: getImageUrl(item.image_url),
            location: modelDetails?.location || '',
            price: modelDetails?.price || '',
            age: modelDetails?.age || null,
            characteristics: modelDetails?.characteristics || []
          };
      }) || [];

      setModels(transformedModels);
    } catch (err) {
      console.error('Unexpected error fetching carousel:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselModels();
    // Force refresh - 2025-09-05 17:36
  }, []);

  return {
    models,
    loading,
    error,
    refetch: fetchCarouselModels
  };
};