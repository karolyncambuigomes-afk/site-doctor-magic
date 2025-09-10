import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SEOSettings {
  [key: string]: any;
}

export const useSEOSettings = () => {
  const [settings, setSettings] = useState<SEOSettings>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*');

      if (error) throw error;

      const settingsMap = data.reduce((acc: SEOSettings, item: any) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {});

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      toast({
        title: "Error",
        description: "Failed to load SEO settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any, category: string = 'global') => {
    try {
      const { error } = await supabase
        .from('seo_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          category: category
        }, { onConflict: 'setting_key' });

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        [key]: value
      }));

      toast({
        title: "Success",
        description: "SEO setting updated successfully"
      });
    } catch (error) {
      console.error('Error updating SEO setting:', error);
      toast({
        title: "Error",
        description: "Failed to update SEO setting",
        variant: "destructive"
      });
    }
  };

  const getSetting = (key: string, defaultValue: any = null) => {
    return settings[key] || defaultValue;
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    getSetting,
    loadSettings
  };
};

export const usePageSEO = (pagePath: string) => {
  const [pageSEO, setPageSEO] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPageSEO = async () => {
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_path', pagePath)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      setPageSEO(data || {});
    } catch (error) {
      console.error('Error loading page SEO:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePageSEO = async (seoData: any) => {
    try {
      const { error } = await supabase
        .from('page_seo')
        .upsert({
          page_path: pagePath,
          ...seoData
        }, { onConflict: 'page_path' });

      if (error) throw error;

      setPageSEO(prev => ({
        ...prev,
        ...seoData
      }));

      toast({
        title: "Success",
        description: "Page SEO updated successfully"
      });
    } catch (error) {
      console.error('Error updating page SEO:', error);
      toast({
        title: "Error",
        description: "Failed to update page SEO",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (pagePath) {
      loadPageSEO();
    }
  }, [pagePath]);

  return {
    pageSEO,
    loading,
    updatePageSEO,
    loadPageSEO
  };
};