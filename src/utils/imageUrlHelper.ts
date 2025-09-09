import { supabase } from '@/integrations/supabase/client';

// Generate cache-busting URL with real timestamp
export const generateImageUrl = async (path: string | null, tableName?: string, recordId?: string): Promise<string | null> => {
  if (!path) return null;

  try {
    // For Supabase storage URLs, get the real updated timestamp
    if (tableName && recordId) {
      const { data } = await supabase
        .from(tableName)
        .select('updated_at')
        .eq('id', recordId)
        .single();
      
      if (data?.updated_at) {
        const timestamp = new Date(data.updated_at).getTime();
        const separator = path.includes('?') ? '&' : '?';
        return `${path}${separator}v=${timestamp}`;
      }
    }

    // Fallback to current timestamp for cache busting
    const timestamp = Date.now();
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}v=${timestamp}`;
    
  } catch (error) {
    console.warn('[ImageURL] Error generating URL:', error);
    return path;
  }
};

// Get Supabase storage URL with proper cache busting
export const getStorageUrl = (bucket: string, path: string, forceRefresh = false): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  
  if (forceRefresh) {
    const timestamp = Date.now();
    const separator = data.publicUrl.includes('?') ? '&' : '?';
    return `${data.publicUrl}${separator}v=${timestamp}`;
  }
  
  return data.publicUrl;
};

// Check if URL needs cache busting for mobile
export const shouldBustCache = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
  const forceMobile = new URLSearchParams(window.location.search).get('force-mobile') === 'true';
  
  return isMobile || forceMobile;
};