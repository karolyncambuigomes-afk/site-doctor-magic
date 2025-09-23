import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { performCompleteImageRefresh, CacheManager } from '@/utils/cacheManager';
import { forceImageRefresh } from '@/utils/imageCacheBuster';
import { toast } from 'sonner';

interface DataSyncOptions {
  enableNotifications?: boolean;
  enableCacheInvalidation?: boolean;
  enableImageRefresh?: boolean;
}

/**
 * Real-time data synchronization hook that handles cache invalidation
 * and notifications when admin panel makes changes
 */
export const useRealTimeDataSync = (options: DataSyncOptions = {}) => {
  const {
    enableNotifications = true,
    enableCacheInvalidation = true,
    enableImageRefresh = true
  } = options;

  const handleCacheInvalidation = useCallback(async (table: string) => {
    if (!enableCacheInvalidation) return;

    console.log(`🔄 [SYNC] Cache invalidation triggered for table: ${table}`);

    try {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          if (cacheName.includes(table) || cacheName.includes('api')) {
            await caches.delete(cacheName);
            console.log(`🗑️ [SYNC] Deleted cache: ${cacheName}`);
          }
        }
      }

      // Force refresh images if needed
      if (enableImageRefresh && ['models', 'model_gallery', 'blog_posts', 'hero_slides'].includes(table)) {
        await performCompleteImageRefresh();
        forceImageRefresh();
      }

      // Invalidate service worker cache
      await CacheManager.purge([`${table}-*`, 'api-*', 'images-*']);

    } catch (error) {
      console.error('❌ [SYNC] Cache invalidation failed:', error);
    }
  }, [enableCacheInvalidation, enableImageRefresh]);

  const showUpdateNotification = useCallback((table: string, event: string) => {
    if (!enableNotifications) return;

    const tableDisplayNames: Record<string, string> = {
      models: 'Models',
      model_gallery: 'Model Gallery',
      blog_posts: 'Blog Posts',
      faqs: 'FAQs',
      reviews: 'Reviews',
      hero_slides: 'Hero Banners',
      preference_categories: 'Categories',
      homepage_carousel: 'Homepage Carousel'
    };

    const eventDisplayNames: Record<string, string> = {
      INSERT: 'added',
      UPDATE: 'updated',
      DELETE: 'removed'
    };

    const tableName = tableDisplayNames[table] || table;
    const eventName = eventDisplayNames[event] || event.toLowerCase();

    toast.success(`${tableName} ${eventName}`, {
      description: 'Content has been automatically updated.',
      duration: 3000,
    });
  }, [enableNotifications]);

  useEffect(() => {
    console.log('🚀 [SYNC] Setting up real-time data synchronization');

    // Define all tables that need real-time sync
    const syncTables = [
      'models',
      'model_gallery', 
      'blog_posts',
      'faqs',
      'reviews',
      'hero_slides',
      'preference_categories',
      'homepage_carousel',
      'page_seo',
      'seo_settings'
    ];

    // Create a single channel for all table changes
    const channel = supabase
      .channel('admin-data-sync')
      .subscribe();

    // Set up listeners for each table
    syncTables.forEach(table => {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        async (payload) => {
          console.log(`📡 [SYNC] Change detected in ${table}:`, payload.eventType);
          
          // Handle cache invalidation
          await handleCacheInvalidation(table);
          
          // Show notification
          showUpdateNotification(table, payload.eventType);
          
          // Force page refresh for critical changes
          if (['hero_slides', 'homepage_carousel'].includes(table)) {
            setTimeout(() => {
              console.log('🔄 [SYNC] Forcing page refresh for critical content change');
              window.location.reload();
            }, 1000);
          }
        }
      );
    });

    // Listen for admin broadcast messages
    channel.on('broadcast', { event: 'admin-update' }, (payload) => {
      console.log('📢 [SYNC] Admin broadcast received:', payload);
      
      if (payload.action === 'cache-clear') {
        handleCacheInvalidation('all');
        toast.info('Cache cleared by admin', {
          description: 'All content has been refreshed.',
        });
      } else if (payload.action === 'content-update') {
        showUpdateNotification(payload.table || 'content', 'UPDATE');
      }
    });

    return () => {
      console.log('🛑 [SYNC] Cleaning up real-time data synchronization');
      supabase.removeChannel(channel);
    };
  }, [handleCacheInvalidation, showUpdateNotification]);

  // Provide manual sync functions
  const manualSync = useCallback(async () => {
    console.log('🔄 [SYNC] Manual sync triggered');
    await handleCacheInvalidation('all');
    toast.success('Data synchronized', {
      description: 'All content has been refreshed from the server.',
    });
  }, [handleCacheInvalidation]);

  const clearAllCaches = useCallback(async () => {
    console.log('🧹 [SYNC] Clearing all caches');
    
    try {
      // Clear all browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Clear localStorage related to data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('cache') || key.includes('models'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear sessionStorage
      sessionStorage.clear();

      // Force image refresh
      await performCompleteImageRefresh();
      forceImageRefresh();

      toast.success('All caches cleared', {
        description: 'Page will refresh to load fresh content.',
      });

      // Refresh page after cache clear
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      console.error('❌ [SYNC] Failed to clear caches:', error);
      toast.error('Failed to clear caches');
    }
  }, []);

  return {
    manualSync,
    clearAllCaches
  };
};