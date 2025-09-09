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
      console.log('[MobileForceRefresh] Starting ultra-aggressive refresh...');
      
      // Clear all possible caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('[MobileForceRefresh] All caches cleared');
      }

      // Clear all storage
      try {
        localStorage.clear();
        sessionStorage.clear();
        if ('indexedDB' in window) {
          // Clear IndexedDB if available
          indexedDB.databases?.().then(databases => {
            databases.forEach(db => {
              if (db.name) indexedDB.deleteDatabase(db.name);
            });
          });
        }
      } catch (e) {
        console.warn('Storage clear failed:', e);
      }

      // Send message to Service Worker to clear cache
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_CACHE'
        });
      }

      // Dispatch multiple refresh events
      window.dispatchEvent(new CustomEvent('mobile-force-refresh', {
        detail: { timestamp: Date.now(), forced: true, ultra: true }
      }));
      
      window.dispatchEvent(new CustomEvent('mobile-force-sync', {
        detail: { timestamp: Date.now(), forced: true, ultra: true }
      }));

      // Force DOM refresh
      document.body.style.display = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';

      console.log('[MobileForceRefresh] All refresh events dispatched');

      // Force reload after ensuring events are processed
      setTimeout(() => {
        window.location.href = window.location.href + '?force-refresh=' + Date.now();
      }, 500);
    } catch (error) {
      console.error('Force refresh failed:', error);
      // Fallback: direct reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
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
        className="bg-background/90 backdrop-blur-sm border-primary/30 shadow-lg hover:bg-background/95 hover:border-primary/50 transition-all duration-200"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Force Sync'}
      </Button>
    </div>
  );
};