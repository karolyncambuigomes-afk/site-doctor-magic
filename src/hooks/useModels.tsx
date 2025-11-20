import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface Model {
  id: string;
  name: string;
  age: number;
  location: string;
  price: string;
  pricing?: {
    oneHour?: string;
    twoHours?: string;
    threeHours?: string;
    additionalHour?: string;
    rates?: Array<{ duration: string; rate: string | number }>;
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
  const auth = useAuth();
  const { user, hasAccess } = auth || {};
  const queryClient = useQueryClient();

  // Data validation helper (filter out test/dummy names)
  const isValidModel = (model: any) => {
    if (!model || !model.id || !model.name) return false;
    const n = String(model.name).trim().toLowerCase();
    if (n.length <= 2) return false;
    if (n.includes('test') || n.includes('teste') || n === 'julia') return false;
    return true;
  };

  const fetchModels = async (): Promise<Model[]> => {
    try {
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
          throw new Error('Failed to load models');
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
          
          return {
            id: model.id,
            name: model.name,
            age: model.age,
            location: model.location,
            price: model.price,
            pricing: model.pricing,
            image: mainImage || '/images/placeholders/model.jpg',
            gallery: galleryImages,
            services: model.services || [],
            characteristics: model.characteristics || [],
            availability: model.availability,
            rating: model.rating,
            reviews: model.reviews,
            description: model.description,
            height: model.height || '',
            measurements: model.measurements || '',
            hair: model.hair || '',
            eyes: model.eyes || '',
            nationality: model.nationality || '',
            education: model.education || '',
            interests: model.interests || [],
            members_only: model.members_only || false,
            face_visible: model.face_visible || false
          };
        }) || [];

        return transformedModels;
      } else {
        // All other users (no user or no access) get public models only
        const { data, error: rpcError } = await supabase.rpc('get_public_models');

        if (rpcError) {
          console.error('Error fetching public models:', rpcError);
          throw new Error('Failed to load models');
        }

        console.log('Public models fetched:', data?.length || 0);

        const transformedModels = data?.filter(isValidModel).map((model: any) => {
          const rawPrice = typeof model.price === 'string' ? model.price : String(model.price ?? '');
          const baseParsed = parseInt(rawPrice.replace(/[^0-9]/g, ''), 10);
          const basePrice = Number.isFinite(baseParsed) && baseParsed > 0 ? baseParsed : 500;

          const pricing =
            (model.pricing && Object.keys(model.pricing).length > 0)
              ? model.pricing
              : {
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
            image: model.image || '/images/placeholders/model.jpg',
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

        return transformedModels;
      }
    } catch (err) {
      console.error('useModels: Unexpected error:', err);
      throw err;
    }
  };

  // Use React Query with ZERO cache for always fresh pricing data
  const { data: models = [], isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: ['models', user?.id, hasAccess],
    queryFn: fetchModels,
    staleTime: 0, // NEVER consider data stale - always refetch
    gcTime: 0, // Don't keep in memory cache (formerly cacheTime in v4)
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnReconnect: true, // Refetch when reconnecting
  });

  const error = queryError ? (queryError instanceof Error ? queryError.message : 'An error occurred') : null;

  const getModelById = (id: string): Model | null => {
    return models.find(model => model.id === id) || null;
  };

  return {
    models,
    loading,
    error,
    refetch,
    getModelById
  };
};
