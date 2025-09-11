// UPDATED 2025: Homepage carousel with age and characteristics
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getImageUrl } from '@/utils/imageMapper';
import { addCacheBusting } from '@/utils/imageCacheBuster';

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
          console.log(`🔍 [CAROUSEL] Model ${model.name} sem imagem principal, buscando na galeria`);

          const { data: galleryData } = await supabase
            .from('model_gallery')
            .select('image_url')
            .eq('model_id', model.id)
            .order('order_index')
            .limit(1);

          if (galleryData && galleryData.length > 0) {
            imageUrl = galleryData[0].image_url;
            console.log(`✅ [CAROUSEL] Encontrada imagem de fallback para ${model.name}:`, imageUrl);
          } else {
            console.warn(`⚠️ [CAROUSEL] Nenhuma imagem encontrada para ${model.name}`);
          }
        } else {
          console.log(`✅ [CAROUSEL] Model ${model.name} tem imagem principal:`, imageUrl);
        }

        // Apply aggressive cache busting
        imageUrl = addCacheBusting(imageUrl);

        transformedModels.push({
          id: model.id,
          name: model.name.split(' ')[0],
          image: getImageUrl(imageUrl),
          location: model.location || '',
          price: model.price || '',
          age: model.age || null,
          characteristics: model.characteristics || [],
          members_only: model.members_only || false,
        });
      }

      // Fallback: if too few homepage models, append from public models RPC
      if (transformedModels.length < 4) {
        console.log('⚠️ [CAROUSEL] Few homepage models, fetching public models as fallback');
        const { data: publicData, error: rpcError } = await supabase.rpc('get_public_models');
        if (rpcError) {
          console.warn('RPC get_public_models error (fallback):', rpcError);
        } else if (publicData) {
          const fallback = publicData
            .filter((m: any) => isValidName(m.name))
            .map((m: any) => ({
              id: m.id,
              name: String(m.name).split(' ')[0],
              image: getImageUrl(addCacheBusting(m.image)),
              location: m.location || '',
              price: m.price || '',
              age: m.age || null,
              characteristics: m.characteristics || [],
              members_only: false,
            } as CarouselModel));
          const byId = new Map<string, CarouselModel>();
          // Keep homepage order first
          for (const item of transformedModels) byId.set(item.id, item);
          for (const item of fallback) if (!byId.has(item.id)) byId.set(item.id, item);
          setModels(Array.from(byId.values()));
          console.log('Homepage Carousel - Combined models (with fallback):', Array.from(byId.values()));
          return;
        }
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