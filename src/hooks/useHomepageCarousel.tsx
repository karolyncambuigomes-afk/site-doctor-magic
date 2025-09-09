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
  members_only?: boolean;
}

export const useHomepageCarousel = () => {
  const [models, setModels] = useState<CarouselModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarouselModels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get models configured to show on homepage
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('id, name, location, price, age, characteristics, image, members_only')
        .eq('show_on_homepage', true)
        .order('homepage_order', { ascending: true, nullsFirst: false });

      if (modelsError) {
        console.error('Error fetching homepage models:', modelsError);
        setError('Failed to load carousel');
        return;
      }

      // Transform data to match our interface, with gallery fallback for images
      const transformedModels = [];
      
      for (const model of modelsData || []) {
        let imageUrl = model.image;
        
        // If no main image, try to get from gallery
        if (!imageUrl) {
          const { data: galleryData } = await supabase
            .from('model_gallery')
            .select('image_url')
            .eq('model_id', model.id)
            .order('order_index')
            .limit(1);
          
          if (galleryData && galleryData.length > 0) {
            imageUrl = galleryData[0].image_url;
          }
        }
        
        transformedModels.push({
          id: model.id,
          name: model.name.split(' ')[0], // First name only for public display
          image: getImageUrl(imageUrl),
          location: model.location || '',
          price: model.price || '',
          age: model.age || null,
          characteristics: model.characteristics || [],
          members_only: model.members_only || false
        });
      }

      console.log('Homepage Carousel - Models from database:', transformedModels);
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