import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CacheSyncOptions {
  enableNotifications?: boolean;
}

/**
 * Enhanced cache synchronization hook that invalidates React Query cache
 * when database changes occur via admin panel
 */
export const useCacheSync = (options: CacheSyncOptions = {}) => {
  const { enableNotifications = true } = options;
  const queryClient = useQueryClient();

  // Define cache key patterns for different tables
  const getCacheKeys = useCallback((table: string) => {
    const patterns: { [key: string]: string[] } = {
      'models': ['models', 'featured-models', 'homepage-carousel'],
      'model_gallery': ['models', 'model-gallery'],
      'blog_posts': ['blog-posts', 'featured-posts'],
      'faqs': ['faqs'],
      'reviews': ['reviews', 'featured-reviews'],
      'hero_slides': ['hero-slides'],
      'preference_categories': ['preference-categories'],
      'homepage_carousel': ['homepage-carousel'],
      'characteristics': ['characteristics'],
      'locations': ['locations'],
      'page_seo': ['page-seo'],
      'seo_settings': ['seo-settings']
    };
    
    return patterns[table] || [table];
  }, []);

  // Invalidate specific cache keys
  const invalidateCache = useCallback(async (table: string) => {
    const cacheKeys = getCacheKeys(table);
    
    console.log(`🔄 [CACHE-SYNC] Invalidating cache for table: ${table}`);
    console.log(`🎯 [CACHE-SYNC] Cache keys to invalidate:`, cacheKeys);

    try {
      // Invalidate all related query keys
      for (const key of cacheKeys) {
        await queryClient.invalidateQueries({ queryKey: [key] });
        console.log(`✅ [CACHE-SYNC] Invalidated cache key: ${key}`);
      }

      // Force immediate refetch of active queries
      await queryClient.refetchQueries({ 
        type: 'active',
        queryKey: cacheKeys.map(key => [key])
      });

      if (enableNotifications) {
        toast.success(`Content updated`, {
          description: `${table.replace('_', ' ')} has been refreshed.`,
          duration: 3000,
        });
      }

    } catch (error) {
      console.error('❌ [CACHE-SYNC] Cache invalidation failed:', error);
      if (enableNotifications) {
        toast.error('Cache sync failed', {
          description: 'Failed to update content. Please refresh the page.',
        });
      }
    }
  }, [queryClient, getCacheKeys, enableNotifications]);

  // Set up real-time listeners
  useEffect(() => {
    console.log('🚀 [CACHE-SYNC] Setting up real-time cache synchronization');

    // Tables that require cache synchronization
    const syncTables = [
      'models',
      'model_gallery', 
      'blog_posts',
      'faqs',
      'reviews',
      'hero_slides',
      'preference_categories',
      'homepage_carousel',
      'characteristics',
      'locations',
      'page_seo',
      'seo_settings'
    ];

    const channels = syncTables.map(table => {
      const channel = supabase
        .channel(`cache-sync-${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          async (payload) => {
            console.log(`📡 [CACHE-SYNC] Database change detected in ${table}:`, payload.eventType);
            await invalidateCache(table);
          }
        )
        .subscribe();

      return channel;
    });

    // Listen for admin broadcast messages for manual cache clearing
    const adminChannel = supabase
      .channel('admin-cache-sync')
      .on('broadcast', { event: 'cache-clear' }, async (payload) => {
        console.log('📢 [CACHE-SYNC] Admin cache clear broadcast received:', payload);
        
        if (payload.table) {
          await invalidateCache(payload.table);
        } else {
          // Clear all cache
          await queryClient.invalidateQueries();
          await queryClient.refetchQueries({ type: 'active' });
          
          if (enableNotifications) {
            toast.info('All content refreshed', {
              description: 'Cache cleared by admin.',
            });
          }
        }
      })
      .subscribe();

    return () => {
      console.log('🛑 [CACHE-SYNC] Cleaning up cache sync channels');
      channels.forEach(channel => supabase.removeChannel(channel));
      supabase.removeChannel(adminChannel);
    };
  }, [invalidateCache, queryClient, enableNotifications]);

  // Provide manual sync functions
  const manualSync = useCallback(async (table?: string) => {
    console.log('🔄 [CACHE-SYNC] Manual sync triggered', table ? `for ${table}` : 'for all');
    
    if (table) {
      await invalidateCache(table);
    } else {
      // Invalidate all queries
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries({ type: 'active' });
      
      if (enableNotifications) {
        toast.success('All content synchronized', {
          description: 'All data has been refreshed from the server.',
        });
      }
    }
  }, [invalidateCache, queryClient, enableNotifications]);

  const triggerCacheClear = useCallback(async (table?: string) => {
    // Broadcast cache clear to all connected clients
    const payload = table ? { table } : {};
    await supabase.channel('admin-cache-sync').send({
      type: 'broadcast',
      event: 'cache-clear',
      payload
    });
  }, []);

  return {
    manualSync,
    triggerCacheClear,
    invalidateCache
  };
};