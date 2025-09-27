import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

import { toast } from 'sonner';

export const FixedRefreshButton = () => {
  const [refreshing, setRefreshing] = useState(false);
  const handleGlobalRefresh = async () => {
    setRefreshing(true);
    try {
      toast.info('Clearing all caches and refreshing from database...', {
        duration: 2000,
      });
      
      // Clear all browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Dispatch cache clear event for real-time components
      window.dispatchEvent(new CustomEvent('manual-cache-clear', { 
        detail: { timestamp: Date.now() } 
      }));
      
      // Wait a moment for cache clearing to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force reload to refetch everything
      window.location.reload();
      
    } catch (error) {
      console.error('Global refresh failed:', error);
      toast.error('Failed to refresh content');
      // Force reload anyway if cache clear fails
      window.location.reload();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <Button
        onClick={handleGlobalRefresh}
        disabled={refreshing}
        size="sm"
        className="shadow-elegant hover:shadow-luxury transition-all duration-300 bg-secondary text-secondary-foreground hover:bg-secondary/90"
        title="Refresh content from database"
      >
        {refreshing ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <RefreshCw className="w-4 h-4 mr-2" />
        )}
        Refresh
      </Button>
    </div>
  );
};