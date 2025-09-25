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

  // Invalidate specific cache keys and clear all related caches
  const invalidateCache = useCallback(async (table: string) => {
    const cacheKeys = getCacheKeys(table);
    
    console.log(`🔄 [CACHE-SYNC] Invalidating cache for table: ${table}`);
    console.log(`🎯 [CACHE-SYNC] Cache keys to invalidate:`, cacheKeys);

    try {
      // 1. Clear browser caches first
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          if (cacheName.includes(table) || cacheName.includes('api') || cacheName.includes('images')) {
            await caches.delete(cacheName);
            console.log(`🗑️ [CACHE-SYNC] Deleted browser cache: ${cacheName}`);
          }
        }
      }

      // 2. Clear service worker caches
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_CACHE',
          table: table
        });
      }

      // 3. Force image cache refresh for image-related tables
      if (['models', 'model_gallery', 'blog_posts', 'hero_slides'].includes(table)) {
        // Force refresh all images by adding cache busting
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (img.src && !img.src.includes('?v=')) {
            const separator = img.src.includes('?') ? '&' : '?';
            img.src = `${img.src}${separator}v=${Date.now()}`;
          }
        });
      }

      // 4. Clear localStorage entries related to the table
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes(table) || key.includes('supabase-cache'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // 5. Invalidate React Query cache
      for (const key of cacheKeys) {
        await queryClient.invalidateQueries({ queryKey: [key] });
        console.log(`✅ [CACHE-SYNC] Invalidated cache key: ${key}`);
      }

      // 6. Force immediate refetch of active queries
      await queryClient.refetchQueries({ 
        type: 'active',
        stale: true
      });

      // 7. Clear and refetch all queries for critical tables
      if (['blog_posts', 'models', 'hero_slides'].includes(table)) {
        await queryClient.clear();
        await queryClient.refetchQueries({ type: 'active' });
      }

      if (enableNotifications) {
        toast.success(`Content updated`, {
          description: `${table.replace('_', ' ')} cache cleared and data refreshed.`,
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
      // Clear all browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('🗑️ [CACHE-SYNC] Cleared all browser caches');
      }

      // Clear all localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('cache') || key.includes('query'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Force refresh all images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.src) {
          const url = new URL(img.src);
          url.searchParams.set('v', Date.now().toString());
          img.src = url.toString();
        }
      });

      // Clear and refetch all React Query cache
      await queryClient.clear();
      await queryClient.refetchQueries({ type: 'all' });
      
      if (enableNotifications) {
        toast.success('All content synchronized', {
          description: 'All caches cleared and data refreshed from server.',
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