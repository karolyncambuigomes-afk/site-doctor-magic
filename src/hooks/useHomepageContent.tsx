import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBannerContent } from './useBannerContent';

export interface HeroContent {
  title: string;
  subtitle: string;
  content: string;
  image_url?: string;
  image_url_desktop?: string;
  image_url_mobile?: string;
  image_url_local_desktop?: string;
  image_url_local_mobile?: string;
  image_url_local_fallback?: string;
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
  
  // Get banners from new system
  const { banners: heroBanners, loading: bannersLoading } = useBannerContent('hero');

  const loadHeroContent = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'homepage_hero_main')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      // Get banner images from new system
      const getImageUrls = () => {
        if (heroBanners?.length > 0) {
          const allBanner = heroBanners.find(b => b.device_type === 'all');
          const desktopBanner = heroBanners.find(b => b.device_type === 'desktop') || allBanner;
          const mobileBanner = heroBanners.find(b => b.device_type === 'mobile') || allBanner;
          
          return {
            image_url: allBanner?.image_url,
            image_url_desktop: desktopBanner?.image_url,
            image_url_mobile: mobileBanner?.image_url,
            image_url_local_desktop: desktopBanner?.image_url,
            image_url_local_mobile: mobileBanner?.image_url,
            image_url_local_fallback: allBanner?.image_url
          };
        }

        // Fallback to old system
        if (data) {
          return {
            image_url: data.image_url || heroContent.image_url,
            image_url_desktop: data.image_url_desktop || heroContent.image_url_desktop,
            image_url_mobile: data.image_url_mobile || heroContent.image_url_mobile,
            image_url_local_desktop: data.image_url_local_desktop || heroContent.image_url_local_desktop,
            image_url_local_mobile: data.image_url_local_mobile || heroContent.image_url_local_mobile,
            image_url_local_fallback: data.image_url_local_fallback || heroContent.image_url_local_fallback
          };
        }
        
        return {};
      };

      const imageUrls = getImageUrls();

      if (data) {
        setHeroContent({
          title: data.title || heroContent.title,
          subtitle: data.subtitle || heroContent.subtitle,
          content: data.content || heroContent.content,
          ...imageUrls,
          button_primary_text: data.button_text || heroContent.button_primary_text,
          button_primary_url: data.button_url || heroContent.button_primary_url,
          button_secondary_text: heroContent.button_secondary_text,
          button_secondary_url: heroContent.button_secondary_url
        });
      } else {
        setHeroContent(prev => ({
          ...prev,
          ...imageUrls
        }));
      }
      
      setError(null);
    } catch (err) {
      setError('Erro ao carregar conteúdo da hero section');
    } finally {
      setLoading(false);
    }
  };

  const updateHeroContent = async (updates: Partial<HeroContent>) => {
    try {
      const updateData = {
        section: 'homepage_hero_main',
        title: updates.title || heroContent.title,
        subtitle: updates.subtitle || heroContent.subtitle,
        content: updates.content || heroContent.content,
        image_url: updates.image_url !== undefined ? updates.image_url : heroContent.image_url,
        image_url_desktop: updates.image_url_desktop !== undefined ? updates.image_url_desktop : heroContent.image_url_desktop,
        image_url_mobile: updates.image_url_mobile !== undefined ? updates.image_url_mobile : heroContent.image_url_mobile,
        image_url_local_desktop: updates.image_url_local_desktop !== undefined ? updates.image_url_local_desktop : heroContent.image_url_local_desktop,
        image_url_local_mobile: updates.image_url_local_mobile !== undefined ? updates.image_url_local_mobile : heroContent.image_url_local_mobile,
        image_url_local_fallback: updates.image_url_local_fallback !== undefined ? updates.image_url_local_fallback : heroContent.image_url_local_fallback,
        button_text: updates.button_primary_text || heroContent.button_primary_text,
        button_url: updates.button_primary_url || heroContent.button_primary_url,
        is_active: true,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
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
        description: "Configuração de banners atualizada com sucesso!",
      });

      return true;
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração de banners",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (!bannersLoading) {
      loadHeroContent();
    }
  }, [bannersLoading]);

  return {
    heroContent,
    loading: loading || bannersLoading,
    error,
    updateHeroContent,
    refetch: loadHeroContent
  };
};
