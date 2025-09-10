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
  gallery_external_urls?: string[];
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
  const [isInitialized, setIsInitialized] = useState(false);
  const auth = useAuth();
  const { user, hasAccess } = auth || {};

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !models.length) {
        console.log('useModels - Safety timeout triggered, stopping loading');
        setLoading(false);
        setError('Loading timeout - please refresh the page');
        setIsInitialized(true);
      }
    }, 15000);

    return () => clearTimeout(timeout);
  }, [loading, models.length]);

  const fetchModels = async () => {
    console.log('useModels: Starting fetchModels', { loading, isInitialized });
    
    if (loading && isInitialized) {
      console.log('useModels: Preventing concurrent calls');
      return; // Prevent concurrent calls
    }
    
    try {
      console.log('useModels: Setting loading to true');
      setLoading(true);
      setError(null);

      // Data validation helper
      const isValidModel = (model: any) => {
        return model && 
               model.id && 
               model.name && 
               model.name.trim() !== '' &&
               model.name !== 'Teste';
      };

      console.log('useModels: Checking user state', { user: !!user });

      if (!user) {
        console.log('useModels: User not authenticated, fetching public models');
        // For non-authenticated users, use the public function (only non-exclusive models)
        const { data, error: rpcError } = await supabase
          .rpc('get_public_models');

        if (rpcError) {
          console.error('Error fetching public models:', rpcError);
          setError('Failed to load models');
          return;
        }

        console.log('Models Hook - Raw public models data:', data);

        // Transform the public data to match our Model interface
        const transformedModels = data?.filter(isValidModel).map((model: any) => {
          console.log('Models Hook - Processing model:', model.name, 'price:', model.price);
          
          // Create pricing structure from base price
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
            age: model.age, // Show age for public models
            location: model.location,
            price: model.price,
            pricing: pricing, // Always provide pricing structure
            image: getImageUrl(model.image),
            gallery: [], // Limited data for public
            services: model.services || [],
            characteristics: model.characteristics || [],
            availability: model.availability,
            rating: model.rating,
            reviews: model.reviews,
            description: model.description, // Public description
            height: null, // Limited data for public
            measurements: null, // Limited data for public
            hair: null, // Limited data for public
            eyes: null, // Limited data for public
            nationality: null, // Limited data for public
            education: null, // Limited data for public
            interests: [],
            members_only: false // Public models are never exclusive
          };
        }) || [];

        console.log('Models Hook - Transformed models:', transformedModels);
        setModels(transformedModels);
      } else if (hasAccess) {
        // For premium users, get ALL models (both exclusive and non-exclusive)
        const { data, error: queryError } = await supabase
          .from('models')
          .select(`
            *,
            model_gallery(image_url, order_index)
          `)
          .order('members_only', { ascending: false }) // Show exclusive models first
          .order('created_at', { ascending: false });

        if (queryError) {
          console.error('Error fetching all models:', queryError);
          setError('Failed to load models');
          return;
        }

        // Validation function to filter out invalid models
        const isValidModel = (model: any) => {
          if (!model.name || model.name.trim() === '') {
            console.warn(`⚠️ [MODELS] Skipping model with empty name:`, model);
            return false;
          }
          return true;
        };

        // Transform database data to match our Model interface
        const transformedModels = data?.filter(isValidModel).map((model: any) => {
          // Sort gallery images by order_index and extract URLs
          const galleryImages = model.model_gallery
            ?.sort((a: any, b: any) => a.order_index - b.order_index)
            ?.map((img: any) => img.image_url) || [];
          
          // Robust fallback logic for main image
          let mainImage = model.image;
          
          if (!mainImage || mainImage.trim() === '') {
            console.log(`🔍 [MODELS] Model ${model.name} sem imagem principal, usando primeira da galeria`);
            mainImage = galleryImages[0];
            if (mainImage) {
              console.log(`✅ [MODELS] Fallback image found for ${model.name}:`, mainImage);
            } else {
              console.warn(`⚠️ [MODELS] Nenhuma imagem encontrada para ${model.name}`);
            }
          } else {
            console.log(`✅ [MODELS] Model ${model.name} tem imagem principal:`, mainImage);
          }
          
          // Apply aggressive cache busting
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
            image: mainImage ? getImageUrl(mainImage) : null, // Use processed main image with fallback
            gallery: galleryImages, // All gallery images with metadata
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
        // For authenticated but non-premium users, show limited data
        const { data, error: rpcError } = await supabase
          .rpc('get_public_models');

        if (rpcError) {
          console.error('Error fetching public models:', rpcError);
          setError('Failed to load models');
          return;
        }

        const transformedModels = data?.filter(isValidModel).map((model: any) => {
          // Create pricing structure from base price
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
            age: null,
            location: model.location,
            price: model.price,
            pricing: pricing, // Always provide pricing structure
            image: getImageUrl(model.image),
            gallery: [],
            services: model.services || [],
            characteristics: model.characteristics || [],
            availability: model.availability,
            rating: model.rating,
            reviews: model.reviews,
            description: model.description,
            height: null,
            measurements: null,
            hair: null,
            eyes: null,
            nationality: null,
            education: null,
            interests: []
          };
        }) || [];

        setModels(transformedModels);
      }
      
      setIsInitialized(true);
    } catch (err) {
      console.error('useModels: Unexpected error fetching models:', err);
      setError('An unexpected error occurred');
      setIsInitialized(true);
    } finally {
      console.log('useModels: Setting loading to false in finally block');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      console.log('useModels - Initializing fetch, user:', user?.id, 'hasAccess:', hasAccess);
      fetchModels();
    }
  }, [user?.id, hasAccess]); // Use stable IDs instead of object references

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