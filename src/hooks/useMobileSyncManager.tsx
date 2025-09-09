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

  // Enhanced logging for debugging
  console.log('[MobileSyncManager] Current state:', {
    isMobile,
    syncState,
    timestamp: new Date().toISOString()
  });

  const forceSync = useCallback(() => {
    console.log('[MobileSyncManager] FORÇANDO SYNC SEMPRE - forceSync called, isMobile:', isMobile);
    
    // SEMPRE força sync independente de mobile detection
    const timestamp = Date.now();
    setSyncState(prev => ({
      lastSync: timestamp,
      syncCount: prev.syncCount + 1,
      isStale: false
    }));

    console.log('[MobileSyncManager] Dispatching ultra-aggressive sync events...');

    // Multiple sync events for maximum compatibility
    const events = [
      'mobile-force-sync',
      'mobile-force-refresh', 
      'mobile-cache-clear',
      'preference-categories-refresh',
      'models-refresh',
      'data-refresh'
    ];

    events.forEach(eventType => {
      window.dispatchEvent(new CustomEvent(eventType, {
        detail: { 
          timestamp,
          forced: true,
          syncCount: syncState.syncCount + 1,
          ultra: true,
          source: 'syncManager'
        }
      }));
    });

    // Ultra-aggressive cache clearing
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        console.log('[MobileSyncManager] Clearing caches:', cacheNames);
        Promise.all(cacheNames.map(name => caches.delete(name))).then(() => {
          console.log('[MobileSyncManager] All caches cleared');
        });
      });
    }

    // Clear all storage
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('[MobileSyncManager] Storage cleared');
    } catch (e) {
      console.warn('[MobileSyncManager] Storage clear failed:', e);
    }

    // Send message to service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'FORCE_MOBILE_REFRESH',
        timestamp
      });
    }

    console.log(`[MobileSyncManager] Ultra force sync completed: ${timestamp}`);
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

    // ULTRA-AGGRESSIVE sync SEMPRE - ignora mobile detection
    const syncInterval = setInterval(() => {
      console.log('[MobileSyncManager] SYNC FORÇADO a cada 3 segundos');
      forceSync(); // Sempre força independente de mobile
    }, 3000); // A cada 3 segundos SEMPRE

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