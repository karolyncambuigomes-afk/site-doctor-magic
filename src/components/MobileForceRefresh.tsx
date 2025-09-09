import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const MobileForceRefresh: React.FC = () => {
  const isMobile = useIsMobile();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isMobile) return null;

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Clear storage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn('Storage clear failed:', e);
      }

      // Dispatch refresh event
      window.dispatchEvent(new CustomEvent('mobile-force-refresh', {
        detail: { timestamp: Date.now(), forced: true }
      }));

      // Force reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Force refresh failed:', error);
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <Button
        onClick={handleForceRefresh}
        disabled={isRefreshing}
        size="sm"
        variant="outline"
        className="bg-background/80 backdrop-blur-sm border-primary/20"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </Button>
    </div>
  );
};