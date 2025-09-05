import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { models as fallbackModels, Model } from '@/data/models';
import { AnonymizedModel } from '@/utils/dataAnonymizer';

export interface PublicModel {
  id: string;
  name: string;
  location: string;
  price: string;
  image: string;
  services: string[];
  characteristics: string[];
  availability: string;
  rating: number;
  reviews: number;
  description: string;
  created_at: string;
}

export type DisplayModel = Model | AnonymizedModel | PublicModel;

export const useModels = () => {
  const { user } = useAuth();
  const [models, setModels] = useState<DisplayModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);

        if (user) {
          // Authenticated users get full model data from database
          const { data, error: dbError } = await supabase
            .from('models')
            .select('*')
            .order('created_at', { ascending: false });

          if (dbError) {
            console.error('Database error, falling back to static data:', dbError);
            // Fallback to static data for authenticated users
            setModels(fallbackModels);
          } else if (data && data.length > 0) {
            // Transform database data to match Model interface
            const transformedModels = data.map((dbModel: any) => ({
              ...dbModel,
              pricing: dbModel.pricing || {},
              gallery: [dbModel.image],
            })) as Model[];
            setModels(transformedModels);
          } else {
            // No data in database, use static data
            setModels(fallbackModels);
          }
        } else {
          // Unauthenticated users get anonymized data from secure function
          const { data, error: funcError } = await supabase
            .rpc('get_public_models');

          if (funcError) {
            console.error('Public function error, falling back to anonymized static data:', funcError);
            // Fallback to anonymized static data - create proper anonymized models
            const anonymizedModels = fallbackModels.map(model => ({
              id: model.id,
              name: model.name.split(' ')[0] || model.name,
              location: model.location,
              price: model.price,
              image: model.image,
              services: model.services,
              characteristics: model.characteristics,
              availability: model.availability,
              rating: model.rating,
              reviews: model.reviews,
              description: 'Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.',
              created_at: new Date().toISOString(),
              gallery: model.gallery
            })) as PublicModel[];
            setModels(anonymizedModels);
          } else if (data && data.length > 0) {
            // Transform public data to match interface
            const publicModels = data.map((publicModel: any) => ({
              ...publicModel,
              gallery: [publicModel.image],
            })) as PublicModel[];
            setModels(publicModels);
          } else {
            // No data, use anonymized static data
            const anonymizedModels = fallbackModels.map(model => ({
              id: model.id,
              name: model.name.split(' ')[0] || model.name,
              location: model.location,
              price: model.price,
              image: model.image,
              services: model.services,
              characteristics: model.characteristics,
              availability: model.availability,
              rating: model.rating,
              reviews: model.reviews,
              description: 'Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.',
              created_at: new Date().toISOString(),
              gallery: model.gallery
            })) as PublicModel[];
            setModels(anonymizedModels);
          }
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load models');
        // Always have fallback data
        if (user) {
          setModels(fallbackModels);
        } else {
          const anonymizedModels = fallbackModels.map(model => ({
            id: model.id,
            name: model.name.split(' ')[0] || model.name,
            location: model.location,
            price: model.price,
            image: model.image,
            services: model.services,
            characteristics: model.characteristics,
            availability: model.availability,
            rating: model.rating,
            reviews: model.reviews,
            description: 'Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.',
            created_at: new Date().toISOString(),
            gallery: model.gallery
          })) as PublicModel[];
          setModels(anonymizedModels);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [user]);

  return { models, loading, error, isAuthenticated: !!user };
};