import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteContentSection {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  button_text: string | null;
  button_url: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_active: boolean;
}

interface UseSiteContentResult {
  sections: SiteContentSection[];
  loading: boolean;
  error: string | null;
  getSection: (sectionId: string) => SiteContentSection | undefined;
  getSectionValue: (sectionId: string, field: keyof SiteContentSection, fallback?: string) => string;
}

export const useSiteContent = (sectionPrefix: string): UseSiteContentResult => {
  const [sections, setSections] = useState<SiteContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('site_content')
          .select('id, section, title, subtitle, content, button_text, button_url, image_url, image_alt, is_active')
          .like('section', `${sectionPrefix}%`)
          .eq('is_active', true);

        if (fetchError) throw fetchError;

        setSections(data || []);
      } catch (err) {
        console.error('Error fetching site content:', err);
        setError('Failed to load content');
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [sectionPrefix]);

  const getSection = useMemo(() => {
    return (sectionId: string): SiteContentSection | undefined => {
      return sections.find(s => s.section === sectionId);
    };
  }, [sections]);

  const getSectionValue = useMemo(() => {
    return (sectionId: string, field: keyof SiteContentSection, fallback: string = ''): string => {
      const section = sections.find(s => s.section === sectionId);
      if (!section) return fallback;
      const value = section[field];
      return (value as string) || fallback;
    };
  }, [sections]);

  return {
    sections,
    loading,
    error,
    getSection,
    getSectionValue
  };
};

// Hook for getting a single section
export const useSingleSiteContent = (sectionId: string) => {
  const [section, setSection] = useState<SiteContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('site_content')
          .select('id, section, title, subtitle, content, button_text, button_url, image_url, image_alt, is_active')
          .eq('section', sectionId)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        setSection(data);
      } catch (err) {
        console.error('Error fetching site content section:', err);
        setError('Failed to load content');
        setSection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [sectionId]);

  const getValue = (field: keyof SiteContentSection, fallback: string = ''): string => {
    if (!section) return fallback;
    const value = section[field];
    return (value as string) || fallback;
  };

  return {
    section,
    loading,
    error,
    getValue
  };
};
