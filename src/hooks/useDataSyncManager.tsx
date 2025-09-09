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

  // Get data versions from Supabase to detect changes
  const getDataVersions = useCallback(async (): Promise<DataVersions> => {
    try {
      const [categoriesResult, modelsResult, locationsResult] = await Promise.all([
        supabase.from('preference_categories').select('updated_at').order('updated_at', { ascending: false }).limit(1),
        supabase.from('models').select('updated_at').order('updated_at', { ascending: false }).limit(1),
        supabase.from('locations').select('updated_at').order('updated_at', { ascending: false }).limit(1)
      ]);

      return {
        preferenceCategories: categoriesResult.data?.[0]?.updated_at || '0',
        models: modelsResult.data?.[0]?.updated_at || '0',
        locations: locationsResult.data?.[0]?.updated_at || '0'
      };
    } catch (error) {
      console.warn('[DataSync] Error getting data versions:', error);
      return {
        preferenceCategories: Date.now().toString(),
        models: Date.now().toString(),
        locations: Date.now().toString()
      };
    }
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

  // Smart polling based on mobile/desktop
  useEffect(() => {
    if (!isMobile) return; // Only mobile needs aggressive sync

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[DataSync] App became visible, checking for changes...');
        setTimeout(checkForDataChanges, 200);
      }
    };

    const handleFocus = () => {
      console.log('[DataSync] App focused, checking for changes...');
      setTimeout(checkForDataChanges, 100);
    };

    // Smart polling - more frequent on mobile
    const pollInterval = setInterval(() => {
      console.log('[DataSync] Polling for changes...');
      checkForDataChanges();
    }, 15000); // 15 seconds on mobile

    // Listen for manual sync requests
    const handleSyncRequest = () => {
      console.log('[DataSync] Manual sync requested');
      forceSync();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('mobile-sync-request', handleSyncRequest);

    // Initial check
    checkForDataChanges();

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('mobile-sync-request', handleSyncRequest);
    };
  }, [isMobile, checkForDataChanges, forceSync]);

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