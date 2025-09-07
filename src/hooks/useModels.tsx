import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { getImageUrl } from '@/utils/imageMapper';

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
  gallery: string[];
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
}

export const useModels = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, hasAccess } = useAuth();

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        // For non-authenticated users, use the public function
        const { data, error: rpcError } = await supabase
          .rpc('get_public_models');

        if (rpcError) {
          console.error('Error fetching public models:', rpcError);
          setError('Failed to load models');
          return;
        }

        console.log('Models Hook - Raw public models data:', data);

        // Transform the public data to match our Model interface
        const transformedModels = data?.map((model: any) => {
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
            age: null, // Limited data for public
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
            interests: []
          };
        }) || [];

        console.log('Models Hook - Transformed models:', transformedModels);
        setModels(transformedModels);
      } else if (hasAccess) {
        // For premium users, get full data including gallery
        const { data, error: queryError } = await supabase
          .from('models')
          .select(`
            *,
            model_gallery(image_url, order_index)
          `)
          .order('created_at', { ascending: false });

        if (queryError) {
          console.error('Error fetching premium models:', queryError);
          setError('Failed to load models');
          return;
        }

        // Transform database data to match our Model interface
        const transformedModels = data?.map((model: any) => {
          // Sort gallery images by order_index and extract URLs
          const galleryImages = model.model_gallery
            ?.sort((a: any, b: any) => a.order_index - b.order_index)
            ?.map((img: any) => img.image_url) || [];
          
          // Use first gallery image as main image, or keep existing image field as fallback
          const mainImage = galleryImages[0] || model.image;
          
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
            image: mainImage, // Use first gallery image as main
            gallery: galleryImages.slice(1), // Rest of gallery images
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
            interests: model.interests || []
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

        const transformedModels = data?.map((model: any) => {
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
    } catch (err) {
      console.error('Unexpected error fetching models:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [user, hasAccess]);

  const getModelById = (id: string): Model | null => {
    return models.find(model => model.id === id) || null;
  };

  return {
    models,
    loading,
    error,
    refetch: fetchModels,
    getModelById
  };
};