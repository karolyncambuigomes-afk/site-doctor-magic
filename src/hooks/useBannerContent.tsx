import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteBanner {
  id: string;
  section: string;
  image_url: string;
  caption?: string;
  order_index: number;
  visibility: string;
  device_type: string;
  alt_text?: string;
  is_active: boolean;
  created_at: string;
}

interface UseBannerContentReturn {
  banners: SiteBanner[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useBannerContent = (section?: string): UseBannerContentReturn => {
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('site_banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (section) {
        query = query.eq('section', section);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setBanners(data || []);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    
    // Set up real-time subscription for banner changes
    const channel = supabase
      .channel('site-banners-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_banners'
        },
        (payload) => {
          console.log('Site banners change detected:', payload);
          fetchBanners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [section]);

  return {
    banners,
    loading,
    error,
    refetch: fetchBanners
  };
};