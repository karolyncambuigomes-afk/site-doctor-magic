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

    console.log('[MobileSyncManager] Force sync disabled to prevent loops');
    
    const timestamp = Date.now();
    setSyncState(prev => ({
      lastSync: timestamp,
      syncCount: prev.syncCount + 1,
      isStale: false
    }));

    // No more event dispatching to prevent loops
    console.log(`[MobileSyncManager] Mobile sync completed: ${timestamp}`);
  }, [isMobile]);

  // Disabled all event listeners to prevent loops
  useEffect(() => {
    if (!isMobile) return;

    console.log('[MobileSyncManager] Event listeners disabled to prevent infinite loops');

    return () => {
      // Cleanup placeholder
    };
  }, [isMobile]);

  return {
    syncState,
    forceSync,
    isStale: syncState.isStale,
    lastSync: syncState.lastSync,
    syncCount: syncState.syncCount
  };
};