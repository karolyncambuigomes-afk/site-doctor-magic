import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CacheClearButton: React.FC = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const clearCache = async () => {
    setIsClearing(true);
    
    try {
      // Send message to Service Worker to clear all caches
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_ALL_CACHES'
        });

        // Listen for cache cleared confirmation
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'CACHE_CLEARED') {
            toast({
              title: "Cache Cleared",
              description: "All caches have been successfully cleared.",
            });
          }
        });
      }

      // Also clear localStorage cache items
      localStorage.removeItem('user_preferences');
      localStorage.removeItem('mobile_optimization_cache');
      localStorage.removeItem('featureFlags');

      toast({
        title: "Cache Cleared",
        description: "Browser and service worker caches cleared successfully.",
      });

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: "Cache Clear Failed",
        description: "There was an error clearing the cache.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Button
      onClick={clearCache}
      disabled={isClearing}
      variant="outline"
      size="sm"
      className="fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
    >
      {isClearing ? (
        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Trash2 className="h-4 w-4 mr-2" />
      )}
      {isClearing ? 'Clearing...' : 'Clear Cache'}
    </Button>
  );
};