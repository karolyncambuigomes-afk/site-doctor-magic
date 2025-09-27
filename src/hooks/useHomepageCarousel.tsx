// UPDATED 2025: Homepage carousel with age and characteristics
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
// Removed heavy utilities for better performance

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

      // Helper to filter out test/dummy names
      const isValidName = (name?: string) => {
        if (!name) return false;
        const n = name.trim().toLowerCase();
        if (n.length <= 2) return false;
        return !(
          n.includes('test') ||
          n.includes('teste') ||
          n === 'julia'
        );
      };

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

      // Transform data to match our interface, with robust gallery fallback for images
      const transformedModels: CarouselModel[] = [];

      // Filter out invalid/test names before processing
      const homepageModels = (modelsData || []).filter(m => isValidName(m.name));

      for (const model of homepageModels) {
        let imageUrl = model.image;

        // Robust fallback: if main image is missing or is a local path, try gallery
        if (!imageUrl || imageUrl.trim() === '' || imageUrl.startsWith('/')) {
          const { data: galleryData } = await supabase
            .from('model_gallery')
            .select('image_url')
            .eq('model_id', model.id)
            .eq('visibility', 'public')
            .order('order_index')
            .limit(1);

          if (galleryData && galleryData.length > 0) {
            imageUrl = galleryData[0].image_url;
          }
        }

        transformedModels.push({
          id: model.id,
          name: model.name.split(' ')[0],
          image: imageUrl || '/images/placeholders/model.jpg',
          location: model.location || '',
          price: model.price || '',
          age: model.age || null,
          characteristics: model.characteristics || [],
          members_only: model.members_only || false,
        });
      }

      // Fallback: if too few homepage models, append from public models RPC
      if (transformedModels.length < 4) {
        const { data: publicData, error: rpcError } = await supabase.rpc('get_public_models');
        if (!rpcError && publicData) {
          const fallback = publicData
            .filter((m: any) => isValidName(m.name))
            .map((m: any) => ({
              id: m.id,
              name: String(m.name).split(' ')[0],
              image: m.image || '/images/placeholders/model.jpg',
              location: m.location || '',
              price: m.price || '',
              age: m.age || null,
              characteristics: m.characteristics || [],
              members_only: false,
            } as CarouselModel));
          const byId = new Map<string, CarouselModel>();
          for (const item of transformedModels) byId.set(item.id, item);
          for (const item of fallback) if (!byId.has(item.id)) byId.set(item.id, item);
          setModels(Array.from(byId.values()));
          return;
        }
      }

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
    
    // Set up real-time subscription for homepage carousel changes
    const channel = supabase
      .channel('homepage-carousel-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'models'
        },
        (payload) => {
          fetchCarouselModels();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homepage_carousel'
        },
        (payload) => {
          fetchCarouselModels();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'model_gallery'
        },
        (payload) => {
          fetchCarouselModels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    models,
    loading,
    error,
    refetch: fetchCarouselModels
  };
};