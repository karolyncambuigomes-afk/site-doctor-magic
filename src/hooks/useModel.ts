import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { models as fallbackModels, Model } from '@/data/models';
import { DisplayModel } from './useModels';

export const useModel = (id: string | undefined) => {
  const { user } = useAuth();
  const [model, setModel] = useState<DisplayModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      if (!id) {
        setModel(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (user) {
          // Authenticated users get full model data from database
          const { data, error: dbError } = await supabase
            .from('models')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          if (dbError) {
            console.error('Database error, falling back to static data:', dbError);
            // Fallback to static data for authenticated users
            const fallbackModel = fallbackModels.find(m => m.id === id);
            setModel(fallbackModel || null);
          } else if (data) {
            // Transform database data to match Model interface
            const transformedModel = {
              ...data,
              pricing: (data.pricing as any) || { oneHour: '', twoHours: '', threeHours: '', additionalHour: '' },
              gallery: [data.image],
            } as unknown as Model;
            setModel(transformedModel);
          } else {
            // No data in database, use static data
            const fallbackModel = fallbackModels.find(m => m.id === id);
            setModel(fallbackModel || null);
          }
        } else {
          // Unauthenticated users get anonymized data from secure function
          const { data, error: funcError } = await supabase
            .rpc('get_public_models');

          if (funcError) {
            console.error('Public function error, falling back to anonymized static data:', funcError);
            // Fallback to anonymized static data
            const fallbackModel = fallbackModels.find(m => m.id === id);
            if (fallbackModel) {
              const anonymizedModel = {
                id: fallbackModel.id,
                name: fallbackModel.name.split(' ')[0] || fallbackModel.name,
                location: fallbackModel.location,
                price: fallbackModel.price,
                image: fallbackModel.image,
                services: fallbackModel.services,
                characteristics: fallbackModel.characteristics,
                availability: fallbackModel.availability,
                rating: fallbackModel.rating,
                reviews: fallbackModel.reviews,
                description: 'Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.',
                created_at: new Date().toISOString(),
                gallery: fallbackModel.gallery
              };
              setModel(anonymizedModel);
            } else {
              setModel(null);
            }
          } else if (data) {
            // Find the specific model from public data
            const publicModel = data.find((item: any) => item.id === id);
            if (publicModel) {
              const transformedModel = {
                ...publicModel,
                gallery: [publicModel.image],
              };
              setModel(transformedModel);
            } else {
              setModel(null);
            }
          } else {
            // No data, use anonymized static data
            const fallbackModel = fallbackModels.find(m => m.id === id);
            if (fallbackModel) {
              const anonymizedModel = {
                id: fallbackModel.id,
                name: fallbackModel.name.split(' ')[0] || fallbackModel.name,
                location: fallbackModel.location,
                price: fallbackModel.price,
                image: fallbackModel.image,
                services: fallbackModel.services,
                characteristics: fallbackModel.characteristics,
                availability: fallbackModel.availability,
                rating: fallbackModel.rating,
                reviews: fallbackModel.reviews,
                description: 'Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.',
                created_at: new Date().toISOString(),
                gallery: fallbackModel.gallery
              };
              setModel(anonymizedModel);
            } else {
              setModel(null);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching model:', err);
        setError('Failed to load model');
        // Always have fallback data
        const fallbackModel = fallbackModels.find(m => m.id === id);
        if (fallbackModel) {
          if (user) {
            setModel(fallbackModel);
          } else {
            const anonymizedModel = {
              id: fallbackModel.id,
              name: fallbackModel.name.split(' ')[0] || fallbackModel.name,
              location: fallbackModel.location,
              price: fallbackModel.price,
              image: fallbackModel.image,
              services: fallbackModel.services,
              characteristics: fallbackModel.characteristics,
              availability: fallbackModel.availability,
              rating: fallbackModel.rating,
              reviews: fallbackModel.reviews,
              description: 'Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.',
              created_at: new Date().toISOString(),
              gallery: fallbackModel.gallery
            };
            setModel(anonymizedModel);
          }
        } else {
          setModel(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id, user]);

  return { model, loading, error, isAuthenticated: !!user };
};