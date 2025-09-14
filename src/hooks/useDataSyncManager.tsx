import { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface DataSyncState {
  lastSync: number;
  dataHash: string;
  syncCount: number;
  isStale: boolean;
}

interface DataVersions {
  preferenceCategories: string;
  models: string;
  locations: string;
}

export const useDataSyncManager = () => {
  const isMobile = useIsMobile();
  const [syncState, setSyncState] = useState<DataSyncState>({
    lastSync: Date.now(),
    dataHash: '',
    syncCount: 0,
    isStale: false
  });

  // Disabled to prevent loops - simplified version
  const getDataVersions = useCallback(async (): Promise<DataVersions> => {
    console.log('[DataSync] Data version checking disabled to prevent loops');
    return {
      preferenceCategories: Date.now().toString(),
      models: Date.now().toString(),
      locations: Date.now().toString()
    };
  }, []);

  // Generate hash from data versions
  const generateDataHash = useCallback((versions: DataVersions): string => {
    const combined = `${versions.preferenceCategories}|${versions.models}|${versions.locations}`;
    return btoa(combined).substring(0, 16); // Simple hash
  }, []);

  // Check if data has actually changed
  const checkForDataChanges = useCallback(async (): Promise<boolean> => {
    const versions = await getDataVersions();
    const newHash = generateDataHash(versions);
    
    console.log('[DataSync] Checking changes:', {
      oldHash: syncState.dataHash,
      newHash,
      hasChanged: newHash !== syncState.dataHash,
      isMobile
    });

    if (newHash !== syncState.dataHash) {
      setSyncState(prev => ({
        ...prev,
        dataHash: newHash,
        lastSync: Date.now(),
        syncCount: prev.syncCount + 1,
        isStale: false
      }));
      return true;
    }

    return false;
  }, [syncState.dataHash, generateDataHash, getDataVersions, isMobile]);

  // Force sync with real change detection
  const forceSync = useCallback(async () => {
    console.log('[DataSync] Force sync requested, checking for real changes...');
    
    const hasChanges = await checkForDataChanges();
    
    if (hasChanges || syncState.isStale) {
      console.log('[DataSync] Changes detected, dispatching sync events...');
      
      // Only dispatch events if there are actual changes
      const events = isMobile ? [
        'mobile-data-changed',
        'preference-categories-refresh',
        'models-refresh',
        'locations-refresh'
      ] : [
        'data-changed',
        'preference-categories-refresh'
      ];

      const detail = {
        timestamp: Date.now(),
        hasChanges,
        dataHash: syncState.dataHash,
        syncCount: syncState.syncCount,
        isMobile,
        source: 'data-sync-manager'
      };

      events.forEach(eventType => {
        window.dispatchEvent(new CustomEvent(eventType, { detail }));
      });

      // Clear relevant caches only
      if (isMobile && 'caches' in window) {
        try {
          const cache = await caches.open('runtime-cache');
          const keys = await cache.keys();
          const imageKeys = keys.filter(req => 
            req.url.includes('preference_categories') || 
            req.url.includes('models') ||
            req.url.includes('storage/v1/object')
          );
          
          await Promise.all(imageKeys.map(key => cache.delete(key)));
          console.log('[DataSync] Cleared relevant caches:', imageKeys.length);
        } catch (error) {
          console.warn('[DataSync] Cache clear failed:', error);
        }
      }

      return true;
    } else {
      console.log('[DataSync] No changes detected, skipping sync');
      return false;
    }
  }, [checkForDataChanges, syncState.isStale, syncState.dataHash, syncState.syncCount, isMobile]);

  // Disabled all sync mechanisms to prevent loops
  useEffect(() => {
    console.log('[DataSync] All sync mechanisms disabled to prevent infinite loops');
    
    return () => {
      // Cleanup placeholder
    };
  }, []);

  return {
    syncState,
    forceSync,
    checkForDataChanges,
    isStale: syncState.isStale,
    lastSync: syncState.lastSync,
    syncCount: syncState.syncCount,
    dataHash: syncState.dataHash
  };
};