import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Nuclear cache clearing - bypasses everything and forces fresh data
 */
export const useNuclearCacheClear = () => {
  const queryClient = useQueryClient();

  const nuclearClear = async () => {
    console.log('☢️ [NUCLEAR] Starting nuclear cache clear');
    
    try {
      // 1. Completely destroy React Query cache
      queryClient.clear();
      queryClient.removeQueries();
      queryClient.invalidateQueries();
      console.log('☢️ [NUCLEAR] React Query cache destroyed');
      
      // 2. Clear ALL browser APIs
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => {
          console.log(`☢️ [NUCLEAR] Nuking cache: ${name}`);
          return caches.delete(name);
        }));
      }
      
      // 3. Clear all storage
      try {
        localStorage.clear();
        sessionStorage.clear();
        // Clear indexedDB if present
        if ('indexedDB' in window) {
          const databases = await indexedDB.databases();
          databases.forEach(db => {
            if (db.name) {
              const deleteReq = indexedDB.deleteDatabase(db.name);
              deleteReq.onsuccess = () => console.log(`☢️ [NUCLEAR] Deleted DB: ${db.name}`);
            }
          });
        }
      } catch (e) {
        console.warn('☢️ [NUCLEAR] Storage clear warning:', e);
      }
      
      // 4. Kill service worker completely
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => {
          console.log('☢️ [NUCLEAR] Unregistering service worker');
          return reg.unregister();
        }));
      }
      
      // 5. Force refresh ALL images and resources
      const allImages = document.querySelectorAll('img');
      const timestamp = Date.now();
      allImages.forEach((img, i) => {
        if (img.src) {
          const url = new URL(img.src);
          // Remove all existing cache params
          url.searchParams.forEach((_, key) => {
            if (key.includes('cache') || key.includes('v') || key.includes('t')) {
              url.searchParams.delete(key);
            }
          });
          url.searchParams.set('nuclear', timestamp.toString());
          url.searchParams.set('idx', i.toString());
          img.src = url.toString();
        }
      });
      
      // 6. Force refresh stylesheets
      const links = document.querySelectorAll('link[rel="stylesheet"]') as NodeListOf<HTMLLinkElement>;
      links.forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('nuclear', timestamp.toString());
        link.href = url.toString();
      });
      
      console.log('☢️ [NUCLEAR] Nuclear cache clear completed');
      
      // 7. Force complete page reload with cache bypass
      setTimeout(() => {
        console.log('☢️ [NUCLEAR] Executing nuclear reload');
        // Multiple reload strategies
        if ('location' in window) {
          window.location.replace(window.location.href + '?nuclear=' + timestamp);
        }
      }, 1000);
      
    } catch (error) {
      console.error('☢️ [NUCLEAR] Nuclear clear failed:', error);
      // Force reload anyway
      window.location.reload();
    }
  };

  const forceFreshBlogData = async () => {
    console.log('📰 [NUCLEAR] Forcing fresh blog data');
    
    try {
      // Direct database query bypassing all caches
      const { data: freshBlogPosts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('📰 [NUCLEAR] Failed to fetch fresh blog data:', error);
        throw error;
      }
      
      console.log('📰 [NUCLEAR] Fresh blog data:', freshBlogPosts);
      
      // Force update React Query with fresh data
      queryClient.setQueryData(['blog-posts'], freshBlogPosts);
      queryClient.setQueryData(['featured-posts'], freshBlogPosts?.filter(post => post.is_featured));
      
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      await queryClient.refetchQueries({ queryKey: ['blog-posts'] });
      
      toast.success('Fresh blog data loaded!', {
        description: `Found ${freshBlogPosts?.length || 0} published posts`,
      });
      
      return freshBlogPosts;
      
    } catch (error) {
      console.error('📰 [NUCLEAR] Force fresh blog data failed:', error);
      toast.error('Failed to load fresh blog data');
      throw error;
    }
  };

  return {
    nuclearClear,
    forceFreshBlogData
  };
};