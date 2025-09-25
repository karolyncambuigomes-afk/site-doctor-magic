import { supabase } from '@/integrations/supabase/client';

// Test URL connectivity before applying cache busting
export const testUrlConnectivity = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Smart image URL generation with connectivity test
export const generateImageUrl = async (path: string | null, tableName?: string, recordId?: string): Promise<string | null> => {
  if (!path) return null;

  try {
    // First test if the original URL works
    const isConnected = await testUrlConnectivity(path);
    
    if (!isConnected) {
      console.warn('[ImageURL] URL not accessible:', path);
      return null; // Return null to trigger fallback
    }

    // Only apply cache busting when really needed
    const isMobile = shouldBustCache();
    const needsCacheBust = isMobile || (tableName && recordId);
    
    if (!needsCacheBust) {
      return path; // Return original URL for better performance
    }

    // For mobile or when specific table updates, apply minimal cache busting
    if (tableName && recordId && !isMobile) {
      const { data, error } = await supabase
        .from(tableName)
        .select('updated_at')
        .eq('id', recordId)
        .maybeSingle();
      
      if (data?.updated_at) {
        const timestamp = new Date(data.updated_at).getTime();
        const separator = path.includes('?') ? '&' : '?';
        return `${path}${separator}v=${timestamp}`;
      }
    }

    // Light cache busting for mobile
    if (isMobile) {
      const timestamp = Date.now();
      const separator = path.includes('?') ? '&' : '?';
      return `${path}${separator}t=${timestamp}`;
    }

    return path;
    
  } catch (error) {
    console.warn('[ImageURL] Error generating URL:', error, 'Path:', path);
    return path; // Return original path on error
  }
};

// Get Supabase storage URL with intelligent cache management
export const getStorageUrl = (bucket: string, path: string, forceRefresh = false): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  
  // Only apply cache busting when explicitly requested or on mobile
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