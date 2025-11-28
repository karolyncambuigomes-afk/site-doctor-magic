import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SeoTextData {
  title: string | null;
  content: string | null;
}

export const useSeoText = (sectionName: string) => {
  const [data, setData] = useState<SeoTextData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeoText = async () => {
      try {
        const { data: seoData, error } = await supabase
          .from('site_content')
          .select('title, content')
          .eq('section', sectionName)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.error('Error fetching SEO text:', error);
          setData(null);
        } else {
          setData(seoData);
        }
      } catch (err) {
        console.error('Error fetching SEO text:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoText();
  }, [sectionName]);

  return { data, loading };
};
