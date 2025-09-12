import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { getImageUrl } from '@/utils/imageMapper';
import { addCacheBusting } from '@/utils/imageCacheBuster';

export interface Model {
  id: string;
  name: string;
  age: number;
  location: string;
  price: string;
  pricing: {
    oneHour: string;
    twoHours: string;
    threeHours: string;
    additionalHour: string;
  };
  image: string;
  image_url_local_main?: string;
  gallery_local_urls?: string[];
  gallery: { image_url: string; visibility?: string; order_index?: number; caption?: string }[];
  services: string[];
  characteristics: string[];
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  reviews: number;
  description: string;
  height: string;
  measurements: string;
  hair: string;
  eyes: string;
  nationality: string;
  education: string;
  interests: string[];
  members_only?: boolean;
  face_visible?: boolean;
}

export const useModels = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const { user, hasAccess } = auth || {};

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Data validation helper (filter out test/dummy names)
      const isValidModel = (model: any) => {
        if (!model || !model.id || !model.name) return false;
        const n = String(model.name).trim().toLowerCase();
        if (n.length <= 2) return false;
        if (n.includes('test') || n.includes('teste') || n === 'julia') return false;
        return true;
      };

      console.log('useModels: Fetching models for user:', !!user, 'hasAccess:', hasAccess);

      // Simplified logic: if user has access, get all models, otherwise get public models
      if (user && hasAccess) {
        // Premium users get ALL models with full gallery data
        const { data, error: queryError } = await supabase
          .from('models')
          .select(`
            *,
            model_gallery(image_url, order_index, visibility, caption)
          `)
          .order('members_only', { ascending: false })
          .order('created_at', { ascending: false });

        if (queryError) {
          console.error('Error fetching all models:', queryError);
          setError('Failed to load models');
          return;
        }

        const transformedModels = data?.filter(isValidModel).map((model: any) => {
          const galleryImages = model.model_gallery
            ?.sort((a: any, b: any) => a.order_index - b.order_index)
            ?.map((img: any) => ({
              image_url: img.image_url,
              visibility: img.visibility,
              order_index: img.order_index,
              caption: img.caption
            })) || [];
          
          let mainImage = model.image;
          
          // If main image is missing or is a local path that likely doesn't exist, try gallery
          if (!mainImage || mainImage.trim() === '' || mainImage.startsWith('/')) {
            const publicGalleryImage = galleryImages.find(g => g.visibility === 'public' || !g.visibility);
            if (publicGalleryImage) {
              mainImage = publicGalleryImage.image_url;
            } else if (galleryImages[0]) {
              mainImage = galleryImages[0].image_url;
            }
          }
          
          mainImage = addCacheBusting(mainImage);
          
          return {
            id: model.id,
            name: model.name,
            age: model.age,
            location: model.location,
            price: model.price,
            pricing: model.pricing || {
              oneHour: model.price || '£500',
              twoHours: '£900',
              threeHours: '£1,300',
              additionalHour: '£400'
            },
            image: mainImage ? getImageUrl(mainImage) : null,
            gallery: galleryImages,
            services: model.services || [],
            characteristics: model.characteristics || [],
            availability: model.availability || 'available',
            rating: model.rating || 0,
            reviews: model.reviews || 0,
            description: model.description || '',
            height: model.height || '',
            measurements: model.measurements || '',
            hair: model.hair || '',
            eyes: model.eyes || '',
            nationality: model.nationality || '',
            education: model.education || '',
            interests: model.interests || [],
            members_only: model.members_only || false,
            face_visible: model.face_visible !== false
          };
        }) || [];

        setModels(transformedModels);
      } else {
        // All other users (no user or no access) get public models only
        const { data, error: rpcError } = await supabase.rpc('get_public_models');

        if (rpcError) {
          console.error('Error fetching public models:', rpcError);
          setError('Failed to load models');
          return;
        }

        console.log('Public models fetched:', data?.length || 0);

        const transformedModels = data?.filter(isValidModel).map((model: any) => {
          const basePrice = model.price ? parseFloat(model.price.replace(/[£,]/g, '')) : 500;
          const pricing = {
            oneHour: `£${basePrice}`,
            twoHours: `£${Math.round(basePrice * 1.8)}`,
            threeHours: `£${Math.round(basePrice * 2.5)}`,
            additionalHour: `£${Math.round(basePrice * 0.8)}`
          };

          return {
            id: model.id,
            name: model.name,
            age: model.age,
            location: model.location,
            price: model.price,
            pricing: pricing,
            image: getImageUrl(model.image),
            gallery: [],
            services: model.services || [],
            characteristics: model.characteristics || [],
            availability: model.availability,
            rating: model.rating,
            reviews: model.reviews,
            description: model.description,
            height: '',
            measurements: '',
            hair: '',
            eyes: '',
            nationality: '',
            education: '',
            interests: [],
            members_only: false
          };
        }) || [];

        setModels(transformedModels);
      }
    } catch (err) {
      console.error('useModels: Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [user?.id, hasAccess]);

  const getModelById = (id: string): Model | null => {
    return models.find(model => model.id === id) || null;
  };

  const refetch = () => {
    fetchModels();
  };

  return {
    models,
    loading,
    error,
    refetch,
    getModelById
  };
};