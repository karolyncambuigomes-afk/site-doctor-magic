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
      // 1. AGGRESSIVE: Clear ALL browser caches including specific cache names
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log(`🔍 [CACHE-SYNC] Found cache names:`, cacheNames);
        
        // Clear all caches including the ones shown in browser DevTools
        for (const cacheName of cacheNames) {
          try {
            const deleted = await caches.delete(cacheName);
            console.log(`🗑️ [CACHE-SYNC] Cache '${cacheName}' deleted: ${deleted}`);
          } catch (error) {
            console.error(`❌ [CACHE-SYNC] Failed to delete cache '${cacheName}':`, error);
          }
        }
        
        // Also try to clear specific cache patterns that might exist
        const commonCacheNames = [
          'five-london-runtime-v2.0.0',
          'five-london-static-v2.0.0', 
          'five-london-cdn-v2.0.0',
          'runtime-cache',
          'static-cache',
          'cdn-cache',
          'assets-cache',
          'images-cache'
        ];
        
        for (const cacheName of commonCacheNames) {
          try {
            await caches.delete(cacheName);
            console.log(`🗑️ [CACHE-SYNC] Attempted to delete common cache: ${cacheName}`);
          } catch (error) {
            // Ignore errors for non-existent caches
          }
        }
      }

      // 2. Send aggressive clear message to service worker FIRST
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'FORCE_CACHE_CLEAR',
          timestamp: Date.now()
        });
        
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_ALL_CACHES'
        });
        
        console.log('📤 [CACHE-SYNC] Sent cache clear commands to service worker');
      }

      // 3. Update service worker registration
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('🔄 [CACHE-SYNC] Service worker registration updated');
          
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            console.log('⏭️ [CACHE-SYNC] Activated waiting service worker');
          }
        }
      }

      // 4. AGGRESSIVE: Force refresh ALL images with unique cache busting
      const timestamp = Date.now();
      const randomSalt = Math.random().toString(36).substr(2, 9);
      const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
      
      images.forEach((img, index) => {
        if (img.src) {
          // Remove all existing query parameters and add aggressive cache busting
          const baseUrl = img.src.split('?')[0].split('#')[0];
          img.src = `${baseUrl}?cb=${timestamp}&salt=${randomSalt}&idx=${index}&force=1`;
          console.log(`🔄 [CACHE-SYNC] Force refreshed image: ${baseUrl}`);
        }
      });

      // 5. Force refresh CSS and JS files
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]') as NodeListOf<HTMLLinkElement>;
      stylesheets.forEach(link => {
        const href = link.href.split('?')[0];
        link.href = `${href}?v=${timestamp}&force=1`;
      });
      
      const scripts = document.querySelectorAll('script[src]') as NodeListOf<HTMLScriptElement>;
      scripts.forEach(script => {
        if (script.src && !script.src.includes('?')) {
          script.src = `${script.src}?v=${timestamp}`;
        }
      });

      // 6. Clear ALL localStorage and sessionStorage
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log(`🗑️ [CACHE-SYNC] Cleared all localStorage and sessionStorage`);
      } catch (e) {
        console.warn('Could not clear storage:', e);
      }

      // 7. Clear ALL React Query cache
      await queryClient.clear();
      console.log(`🗑️ [CACHE-SYNC] Cleared ALL React Query cache`);

      // 8. Wait for caches to clear, then refetch everything
      await new Promise(resolve => setTimeout(resolve, 500));
      await queryClient.refetchQueries({ type: 'all' });
      console.log(`✅ [CACHE-SYNC] Refetched all queries`);

      // 8. For blog posts and critical tables, force a page reload after a delay
      if (['blog_posts', 'models', 'hero_slides', 'model_gallery'].includes(table)) {
        // For blog posts, immediately trigger cache invalidation and reload
        if (table === 'blog_posts') {
          console.log(`🔄 [CACHE-SYNC] Blog posts changed - forcing immediate cache clear and reload`);
          
          // Force immediate refresh of React Query cache for blog-related data
          await queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
          await queryClient.invalidateQueries({ queryKey: ['featured-posts'] });
          await queryClient.refetchQueries({ queryKey: ['blog-posts'] });
          
          setTimeout(() => {
            console.log(`🔄 [CACHE-SYNC] Force reloading page for ${table} changes`);
            window.location.reload();
          }, 500); // Faster reload for blog changes
        } else {
          setTimeout(() => {
            console.log(`🔄 [CACHE-SYNC] Force reloading page for ${table} changes`);
            window.location.reload();
          }, 1000);
        }
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
            console.log(`📡 [CACHE-SYNC] Change payload:`, payload);
            
            // Add small delay to ensure database changes are committed
            setTimeout(async () => {
              await invalidateCache(table);
              
              // Show user notification for critical changes
              if (['blog_posts', 'models', 'hero_slides'].includes(table)) {
                if (enableNotifications) {
                  toast.info(`Content Updated`, {
                    description: `${table.replace('_', ' ')} has been updated. Page will refresh to show changes.`,
                    duration: 3000,
                  });
                }
              }
            }, 500);
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
    console.log('📢 [CACHE-SYNC] Manual cache clear triggered for:', table || 'all tables');
    
    // If it's specifically for blog posts, force aggressive clearing
    if (table === 'blog_posts') {
      await invalidateCache('blog_posts');
      return;
    }
    
    // Broadcast cache clear to all connected clients
    const payload = table ? { table } : {};
    await supabase.channel('admin-cache-sync').send({
      type: 'broadcast',
      event: 'cache-clear',
      payload
    });
  }, [invalidateCache]);

  return {
    manualSync,
    triggerCacheClear,
    invalidateCache
  };
};