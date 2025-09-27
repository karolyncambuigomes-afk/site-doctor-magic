import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { purgeImageCache, performCompleteImageRefresh } from '@/utils/cacheManager';

export const useRealTimeCacheManager = () => {
  useEffect(() => {
    console.log('🔄 Setting up real-time cache manager...');
    
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
          console.log('🔄 Models table changed, clearing cache:', payload);
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
          console.log('🔄 Model gallery changed, clearing image cache:', payload);
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
          console.log('🔄 Site banners changed, clearing banner cache:', payload);
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
          console.log('🔄 Homepage carousel changed, clearing carousel cache:', payload);
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
          console.log('🔄 Blog posts changed, clearing blog cache:', payload);
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
          console.log('🔄 Reviews changed, clearing review cache:', payload);
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
          console.log('🔄 Site content changed, clearing content cache:', payload);
          // Clear any content-related cache
          window.dispatchEvent(new CustomEvent('cache-invalidated', { 
            detail: { table: 'site_content', payload } 
          }));
        }
      )
      .subscribe();

    // Also listen for manual cache clear events
    const handleManualCacheClear = (event: CustomEvent) => {
      console.log('🔄 Manual cache clear requested:', event.detail);
      performCompleteImageRefresh({ force: true }).catch(console.error);
    };

    window.addEventListener('manual-cache-clear', handleManualCacheClear as EventListener);

    return () => {
      console.log('🔄 Cleaning up real-time cache manager...');
      supabase.removeChannel(channel);
      window.removeEventListener('manual-cache-clear', handleManualCacheClear as EventListener);
    };
  }, []);
};