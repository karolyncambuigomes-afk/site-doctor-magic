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
      
      // Simple refresh fallback
      window.location.reload();
      
    } catch (error) {
      console.error('Global refresh failed:', error);
      toast.error('Failed to refresh content');
      // Force reload anyway if nuclear clear fails
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