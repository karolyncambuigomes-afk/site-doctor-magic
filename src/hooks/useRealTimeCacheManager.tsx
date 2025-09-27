import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { purgeImageCache, performCompleteImageRefresh } from '@/utils/cacheManager';

export const useRealTimeCacheManager = () => {
  useEffect(() => {
    
    // Create a comprehensive real-time subscription for all tables that affect cache
    const channel = supabase
      .channel('cache-invalidation')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'models'
        },
        (payload) => {
          performCompleteImageRefresh({ force: true }).catch(console.error);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'model_gallery'
        },
        (payload) => {
          purgeImageCache(['*']).catch(console.error);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_banners'
        },
        (payload) => {
          purgeImageCache(['hero-banner-*', 'banner-*', '*']).catch(console.error);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homepage_carousel'
        },
        (payload) => {
          purgeImageCache(['*']).catch(console.error);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        (payload) => {
          // Clear browser cache for blog-related content
          if ('caches' in window) {
            caches.keys().then(cacheNames => {
              cacheNames.forEach(cacheName => {
                if (cacheName.includes('blog') || cacheName.includes('post')) {
                  caches.delete(cacheName);
                }
              });
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          // Force refresh for review data
          window.dispatchEvent(new CustomEvent('cache-invalidated', { 
            detail: { table: 'reviews', payload } 
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content'
        },
        (payload) => {
          // Clear any content-related cache
          window.dispatchEvent(new CustomEvent('cache-invalidated', { 
            detail: { table: 'site_content', payload } 
          }));
        }
      )
      .subscribe();

    // Also listen for manual cache clear events
    const handleManualCacheClear = (event: CustomEvent) => {
      performCompleteImageRefresh({ force: true }).catch(console.error);
    };

    window.addEventListener('manual-cache-clear', handleManualCacheClear as EventListener);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('manual-cache-clear', handleManualCacheClear as EventListener);
    };
  }, []);
};