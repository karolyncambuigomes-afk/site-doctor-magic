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

      // Get banner images from new system if available
      const getImageUrls = () => {
        if (heroBanners?.length > 0) {
          const banner = heroBanners[0];
          console.log('useHomepageContent: Using image from site_banners:', banner.image_url);
          return {
            image_url: banner.image_url,
            image_url_desktop: banner.image_url,
            image_url_mobile: banner.image_url,
            image_url_local_desktop: banner.image_url,
            image_url_local_mobile: banner.image_url,
            image_url_local_fallback: banner.image_url
          };
        }
        
        // Fallback to old system
        if (data) {
          console.log('useHomepageContent: Using images from site_content');
          return {
            image_url: data.image_url || heroContent.image_url,
            image_url_desktop: data.image_url_desktop || heroContent.image_url_desktop,
            image_url_mobile: data.image_url_mobile || heroContent.image_url_mobile,
            image_url_local_desktop: data.image_url_local_desktop || heroContent.image_url_local_desktop,
            image_url_local_mobile: data.image_url_local_mobile || heroContent.image_url_local_mobile,
            image_url_local_fallback: data.image_url_local_fallback || heroContent.image_url_local_fallback
          };
        }
        
        return {
          image_url: heroContent.image_url,
          image_url_desktop: heroContent.image_url_desktop,
          image_url_mobile: heroContent.image_url_mobile,
          image_url_local_desktop: heroContent.image_url_local_desktop,
          image_url_local_mobile: heroContent.image_url_local_mobile,
          image_url_local_fallback: heroContent.image_url_local_fallback
        };
      };

      const imageUrls = getImageUrls();

      if (data) {
        console.log('useHomepageContent: Setting hero content with data');
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
        console.log('useHomepageContent: No data found, using defaults with banner images');
        setHeroContent(prev => ({
          ...prev,
          ...imageUrls
        }));
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
      console.log('🔄 [HOOK] updateHeroContent iniciado');
      console.log('🔄 [HOOK] Updates recebidos:', updates);
      console.log('🔄 [HOOK] HeroContent atual:', heroContent);
      
      // Validação específica dos campos de imagem
      console.log('🖼️ [HOOK] Validando imagens:');
      console.log('🖼️ [HOOK] - Desktop:', updates.image_url_desktop);
      console.log('🖼️ [HOOK] - Mobile:', updates.image_url_mobile);
      console.log('🖼️ [HOOK] - Fallback:', updates.image_url);
      
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

      console.log('💾 [HOOK] Dados preparados para Supabase:', updateData);
      console.log('💾 [HOOK] Verificação final:');
      console.log('💾 [HOOK] - image_url_desktop:', updateData.image_url_desktop);
      console.log('💾 [HOOK] - image_url_mobile:', updateData.image_url_mobile);
      console.log('💾 [HOOK] - image_url (fallback):', updateData.image_url);
      
      const { data, error } = await supabase
        .from('site_content')
        .upsert(updateData, {
          onConflict: 'section'
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ [HOOK] Erro do Supabase:', error);
        throw error;
      }

      console.log('✅ [HOOK] Dados salvos no Supabase:', data);
      console.log('✅ [HOOK] Verificação pós-salvamento:');
      console.log('✅ [HOOK] - Desktop salvo:', data?.image_url_desktop);
      console.log('✅ [HOOK] - Mobile salvo:', data?.image_url_mobile);
      console.log('✅ [HOOK] - Fallback salvo:', data?.image_url);

      setHeroContent(prev => ({ ...prev, ...updates }));
      
      toast({
        title: "Sucesso",
        description: "Configuração de banners atualizada com sucesso!",
      });

      return true;
    } catch (err) {
      console.error('❌ [HOOK] Erro ao atualizar hero content:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração de banners",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('useHomepageContent: useEffect triggered');
    loadHeroContent();
  }, []);

  // Reload when banners change
  useEffect(() => {
    if (!bannersLoading) {
      console.log('useHomepageContent: Banner data updated, reloading content');
      loadHeroContent();
    }
  }, [heroBanners, bannersLoading]);

  return {
    heroContent,
    loading: loading || bannersLoading,
    error,
    updateHeroContent,
    refetch: loadHeroContent
  };
};
