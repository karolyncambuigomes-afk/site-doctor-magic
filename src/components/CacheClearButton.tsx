import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const CacheClearButton: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const refreshData = async () => {
    setIsRefreshing(true);
    
    try {
      // Clear all React Query caches to refetch data from Supabase
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries();

      // Send message to Service Worker to clear all caches
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_ALL_CACHES'
        });

        // Listen for cache cleared confirmation
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'CACHE_CLEARED') {
            toast({
              title: "Data Refreshed",
              description: "All data has been refreshed from the database.",
            });
          }
        });
      }

      // Clear localStorage cache items
      localStorage.removeItem('user_preferences');
      localStorage.removeItem('mobile_optimization_cache');
      localStorage.removeItem('featureFlags');

      toast({
        title: "Data Refreshed",
        description: "All data has been refreshed from the database.",
      });

    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      onClick={refreshData}
      disabled={isRefreshing}
      variant="outline"
      size="sm"
      className="fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
      title="Refresh data from database"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
};