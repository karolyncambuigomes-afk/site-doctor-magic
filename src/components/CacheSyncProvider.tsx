import React, { createContext, useContext, ReactNode } from 'react';
import { useCacheSync } from '@/hooks/useCacheSync';

interface CacheSyncContextType {
  manualSync: (table?: string) => Promise<void>;
  triggerCacheClear: (table?: string) => Promise<void>;
  invalidateCache: (table: string) => Promise<void>;
}

const CacheSyncContext = createContext<CacheSyncContextType | undefined>(undefined);

export const useCacheSyncContext = () => {
  const context = useContext(CacheSyncContext);
  if (!context) {
    throw new Error('useCacheSyncContext must be used within CacheSyncProvider');
  }
  return context;
};

interface CacheSyncProviderProps {
  children: ReactNode;
}

export const CacheSyncProvider: React.FC<CacheSyncProviderProps> = ({ children }) => {
  const { manualSync, triggerCacheClear, invalidateCache } = useCacheSync();

  return (
    <CacheSyncContext.Provider value={{ manualSync, triggerCacheClear, invalidateCache }}>
      {children}
    </CacheSyncContext.Provider>
  );
};