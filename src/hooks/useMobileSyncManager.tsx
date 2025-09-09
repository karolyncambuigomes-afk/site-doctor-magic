import { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SyncState {
  lastSync: number;
  syncCount: number;
  isStale: boolean;
}

export const useMobileSyncManager = () => {
  const isMobile = useIsMobile();
  const [syncState, setSyncState] = useState<SyncState>({
    lastSync: Date.now(),
    syncCount: 0,
    isStale: false
  });

  const forceSync = useCallback(() => {
    if (!isMobile) {
      console.log('[MobileSyncManager] Not mobile, skipping force sync');
      return;
    }

    console.log('[MobileSyncManager] Force sync for mobile device');
    
    const timestamp = Date.now();
    setSyncState(prev => ({
      lastSync: timestamp,
      syncCount: prev.syncCount + 1,
      isStale: false
    }));

    // Smart cache clearing - only relevant caches
    if ('caches' in window) {
      caches.open('runtime-cache').then(cache => {
        cache.keys().then(keys => {
          const relevantKeys = keys.filter(req => 
            req.url.includes('preference_categories') || 
            req.url.includes('models') ||
            req.url.includes('storage/v1/object')
          );
          
          console.log('[MobileSyncManager] Clearing relevant cache entries:', relevantKeys.length);
          Promise.all(relevantKeys.map(key => cache.delete(key)));
        });
      });
    }

    // Dispatch targeted sync events
    const events = [
      'mobile-force-sync',
      'preference-categories-refresh'
    ];

    events.forEach(eventType => {
      window.dispatchEvent(new CustomEvent(eventType, {
        detail: { 
          timestamp,
          syncCount: syncState.syncCount + 1,
          source: 'mobile-sync-manager'
        }
      }));
    });

    console.log(`[MobileSyncManager] Mobile sync completed: ${timestamp}`);
  }, [isMobile, syncState.syncCount]);

  useEffect(() => {
    if (!isMobile) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[MobileSyncManager] App visible, triggering sync');
        setTimeout(forceSync, 200);
      }
    };

    const handleFocus = () => {
      console.log('[MobileSyncManager] App focused, triggering sync');
      setTimeout(forceSync, 100);
    };

    const handleNetworkChange = () => {
      if (navigator.onLine) {
        console.log('[MobileSyncManager] Network restored, triggering sync');
        setTimeout(forceSync, 300);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleNetworkChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleNetworkChange);
    };
  }, [isMobile, forceSync]);

  return {
    syncState,
    forceSync,
    isStale: syncState.isStale,
    lastSync: syncState.lastSync,
    syncCount: syncState.syncCount
  };
};