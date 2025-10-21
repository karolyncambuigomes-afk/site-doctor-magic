import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAutoRefresh = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Listen to changes across all key tables that affect the website
    const channel = supabase
      .channel('auto-refresh-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'models'
        },
        async (payload) => {
          console.log('Models table changed:', payload);
          await handleDataUpdate('Models');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        async (payload) => {
          console.log('Blog posts changed:', payload);
          await handleDataUpdate('Blog Posts');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_banners'
        },
        async (payload) => {
          console.log('Site banners changed:', payload);
          await handleDataUpdate('Site Banners');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content'
        },
        async (payload) => {
          console.log('Site content changed:', payload);
          await handleDataUpdate('Site Content');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homepage_carousel'
        },
        async (payload) => {
          console.log('Homepage carousel changed:', payload);
          await handleDataUpdate('Homepage Carousel');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'model_gallery'
        },
        async (payload) => {
          console.log('Model gallery changed:', payload);
          await handleDataUpdate('Model Gallery');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        async (payload) => {
          console.log('Reviews changed:', payload);
          await handleDataUpdate('Reviews');
        }
      )
      .subscribe();

    const handleDataUpdate = async (source: string) => {
      try {
        // Clear all React Query caches to refetch data from Supabase
        await queryClient.invalidateQueries();
        await queryClient.refetchQueries();

        console.log(`Auto-refresh triggered by ${source} update`);
        
        toast({
          title: "Data Updated",
          description: `${source} updated. Content refreshed automatically.`,
        });

      } catch (error) {
        console.error('Error during auto-refresh:', error);
        toast({
          title: "Auto-refresh Warning",
          description: "Data may have updated but refresh failed. Use manual refresh if needed.",
          variant: "destructive",
        });
      }
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};