import { useQuery } from '@tanstack/react-query';
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
  const { data: sections = [], isLoading, error } = useQuery({
    queryKey: ['site_content', sectionPrefix],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('site_content')
        .select('id, section, title, subtitle, content, button_text, button_url, image_url, image_alt, is_active')
        .like('section', `${sectionPrefix}%`)
        .eq('is_active', true);

      if (fetchError) throw fetchError;
      return (data || []) as SiteContentSection[];
    },
    // Fresh data pattern - always fetch latest content
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const getSection = (sectionId: string): SiteContentSection | undefined => {
    return sections.find(s => s.section === sectionId);
  };

  const getSectionValue = (sectionId: string, field: keyof SiteContentSection, fallback: string = ''): string => {
    const section = sections.find(s => s.section === sectionId);
    if (!section) return fallback;
    const value = section[field];
    return (value as string) || fallback;
  };

  return {
    sections,
    loading: isLoading,
    error: error?.message || null,
    getSection,
    getSectionValue
  };
};

// Hook for getting a single section
export const useSingleSiteContent = (sectionId: string) => {
  const { data: section, isLoading, error } = useQuery({
    queryKey: ['site_content_single', sectionId],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('site_content')
        .select('id, section, title, subtitle, content, button_text, button_url, image_url, image_alt, is_active')
        .eq('section', sectionId)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return data as SiteContentSection | null;
    },
    // Fresh data pattern
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const getValue = (field: keyof SiteContentSection, fallback: string = ''): string => {
    if (!section) return fallback;
    const value = section[field];
    return (value as string) || fallback;
  };

  return {
    section: section || null,
    loading: isLoading,
    error: error?.message || null,
    getValue
  };
};
