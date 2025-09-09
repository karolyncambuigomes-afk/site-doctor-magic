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
    if (!isMobile) return;

    const timestamp = Date.now();
    setSyncState(prev => ({
      lastSync: timestamp,
      syncCount: prev.syncCount + 1,
      isStale: false
    }));

    // Dispatch sync event for all components
    window.dispatchEvent(new CustomEvent('mobile-force-sync', {
      detail: { 
        timestamp,
        forced: true,
        syncCount: syncState.syncCount + 1
      }
    }));

    // Clear all relevant caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(name => {
          if (name.includes('runtime') || name.includes('static')) {
            caches.delete(name);
          }
        });
      });
    }

    console.log(`[MobileSyncManager] Force sync triggered: ${timestamp}`);
  }, [isMobile, syncState.syncCount]);

  const checkStaleContent = useCallback(() => {
    if (!isMobile) return;

    const now = Date.now();
    const timeSinceSync = now - syncState.lastSync;
    const isStale = timeSinceSync > 30000; // 30 seconds

    if (isStale) {
      setSyncState(prev => ({ ...prev, isStale: true }));
      forceSync();
    }
  }, [isMobile, syncState.lastSync, forceSync]);

  useEffect(() => {
    if (!isMobile) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(checkStaleContent, 100);
      }
    };

    const handleFocus = () => {
      setTimeout(checkStaleContent, 50);
    };

    const handleNetworkChange = () => {
      if (navigator.onLine) {
        setTimeout(forceSync, 200);
      }
    };

    // Automatic periodic sync for mobile
    const syncInterval = setInterval(checkStaleContent, 15000); // Every 15 seconds

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleNetworkChange);

    return () => {
      clearInterval(syncInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleNetworkChange);
    };
  }, [isMobile, checkStaleContent, forceSync]);

  return {
    syncState,
    forceSync,
    isStale: syncState.isStale,
    lastSync: syncState.lastSync,
    syncCount: syncState.syncCount
  };
};