import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CustomScript {
  id: string;
  name: string;
  description: string | null;
  code: string;
  position: 'head' | 'body_start' | 'body_end' | 'footer';
  is_active: boolean;
  order_index: number;
  pages: string[] | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export const useCustomScripts = (position: 'head' | 'body_start' | 'body_end' | 'footer') => {
  return useQuery({
    queryKey: ['custom_scripts', position],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('custom_scripts')
          .select('*')
          .eq('is_active', true)
          .eq('position', position)
          .order('order_index', { ascending: true });

        if (error) {
          console.error('Error fetching custom scripts:', error);
          return [];
        }

        return (data || []) as CustomScript[];
      } catch (err) {
        console.error('Exception fetching custom scripts:', err);
        return [];
      }
    },
    staleTime: 0,
    gcTime: 0,
  });
};
