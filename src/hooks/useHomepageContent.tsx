import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HeroContent {
  title: string;
  subtitle: string;
  content: string;
  image_url?: string;
  image_url_desktop?: string;
  image_url_mobile?: string;
  button_primary_text?: string;
  button_primary_url?: string;
  button_secondary_text?: string;
  button_secondary_url?: string;
}

interface HomepageContentData {
  section: string;
  title: string;
  subtitle: string;
  content: string;
  button_text?: string;
  button_url?: string;
  is_active: boolean;
}

export const useHomepageContent = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Premium London Escort Agency",
    subtitle: "Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea",
    content: "Elite companions for discerning gentlemen in London's most prestigious areas. Available 24/7 for dinner dates, business events, and sophisticated social occasions with complete discretion and professionalism.",
    image_url: "",
    button_primary_text: "View Models",
    button_primary_url: "/models",
    button_secondary_text: "Book Now",
    button_secondary_url: "https://wa.me/447436190679"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadHeroContent = async () => {
    console.log('useHomepageContent: Starting loadHeroContent');
    try {
      setLoading(true);
      console.log('useHomepageContent: Loading set to true');
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'homepage_hero_main')
        .eq('is_active', true)
        .maybeSingle();

      console.log('useHomepageContent: Query completed', { data, error });

      if (error) {
        console.error('useHomepageContent: Database error:', error);
        throw error;
      }

      if (data) {
        console.log('useHomepageContent: Setting hero content with data');
        setHeroContent({
          title: data.title || heroContent.title,
          subtitle: data.subtitle || heroContent.subtitle,
          content: data.content || heroContent.content,
          image_url: data.image_url || heroContent.image_url,
          image_url_desktop: data.image_url_desktop || heroContent.image_url_desktop,
          image_url_mobile: data.image_url_mobile || heroContent.image_url_mobile,
          button_primary_text: data.button_text || heroContent.button_primary_text,
          button_primary_url: data.button_url || heroContent.button_primary_url,
          button_secondary_text: heroContent.button_secondary_text,
          button_secondary_url: heroContent.button_secondary_url
        });
      } else {
        console.log('useHomepageContent: No data found, using defaults');
      }
      
      setError(null);
    } catch (err) {
      console.error('useHomepageContent: Error in loadHeroContent:', err);
      setError('Erro ao carregar conteúdo da hero section');
      // Keep default values on error
    } finally {
      console.log('useHomepageContent: Setting loading to false');
      setLoading(false);
    }
  };

  const updateHeroContent = async (updates: Partial<HeroContent>) => {
    try {
      console.log('useHomepageContent: updateHeroContent called with updates:', updates);
      console.log('useHomepageContent: Current heroContent:', heroContent);
      
      const updateData = {
        section: 'homepage_hero_main',
        title: updates.title || heroContent.title,
        subtitle: updates.subtitle || heroContent.subtitle,
        content: updates.content || heroContent.content,
        image_url: updates.image_url !== undefined ? updates.image_url : heroContent.image_url,
        image_url_desktop: updates.image_url_desktop !== undefined ? updates.image_url_desktop : heroContent.image_url_desktop,
        image_url_mobile: updates.image_url_mobile !== undefined ? updates.image_url_mobile : heroContent.image_url_mobile,
        button_text: updates.button_primary_text || heroContent.button_primary_text,
        button_url: updates.button_primary_url || heroContent.button_primary_url,
        is_active: true,
        updated_at: new Date().toISOString()
      };

      console.log('useHomepageContent: Data being sent to Supabase:', updateData);
      
      const { data, error } = await supabase
        .from('site_content')
        .upsert(updateData, {
          onConflict: 'section'
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      setHeroContent(prev => ({ ...prev, ...updates }));
      
      toast({
        title: "Sucesso",
        description: "Conteúdo da Hero Section atualizado com sucesso!",
      });

      return true;
    } catch (err) {
      console.error('Error updating hero content:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar conteúdo da Hero Section",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('useHomepageContent: useEffect triggered');
    loadHeroContent();
  }, []);

  return {
    heroContent,
    loading,
    error,
    updateHeroContent,
    refetch: loadHeroContent
  };
};
