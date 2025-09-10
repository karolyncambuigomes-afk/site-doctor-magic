import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HeroContent {
  title: string;
  subtitle: string;
  content: string;
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
    button_primary_text: "View Models",
    button_primary_url: "/models",
    button_secondary_text: "Book Now",
    button_secondary_url: "https://wa.me/447436190679"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadHeroContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'homepage_hero_main')
        .eq('is_active', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setHeroContent({
          title: data.title || heroContent.title,
          subtitle: data.subtitle || heroContent.subtitle,
          content: data.content || heroContent.content,
          button_primary_text: data.button_text || heroContent.button_primary_text,
          button_primary_url: data.button_url || heroContent.button_primary_url,
          button_secondary_text: heroContent.button_secondary_text,
          button_secondary_url: heroContent.button_secondary_url
        });
      }
    } catch (err) {
      console.error('Error loading hero content:', err);
      setError('Erro ao carregar conteúdo da hero section');
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const updateHeroContent = async (updates: Partial<HeroContent>) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .upsert({
          section: 'homepage_hero_main',
          title: updates.title || heroContent.title,
          subtitle: updates.subtitle || heroContent.subtitle,
          content: updates.content || heroContent.content,
          button_text: updates.button_primary_text || heroContent.button_primary_text,
          button_url: updates.button_primary_url || heroContent.button_primary_url,
          is_active: true,
          updated_at: new Date().toISOString()
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
