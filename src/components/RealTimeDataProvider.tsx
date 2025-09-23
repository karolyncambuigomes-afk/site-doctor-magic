import React, { createContext, useContext, useState } from 'react';
import { useRealTimeDataSync } from '@/hooks/useRealTimeDataSync';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface RealTimeDataContextType {
  isOnline: boolean;
  lastSync: Date | null;
  manualSync: () => Promise<void>;
  clearAllCaches: () => Promise<void>;
}

const RealTimeDataContext = createContext<RealTimeDataContextType | null>(null);

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within RealTimeDataProvider');
  }
  return context;
};

interface RealTimeDataProviderProps {
  children: React.ReactNode;
  showControls?: boolean;
}

export const RealTimeDataProvider: React.FC<RealTimeDataProviderProps> = ({ 
  children, 
  showControls = false 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const { manualSync: syncData, clearAllCaches: clearCaches } = useRealTimeDataSync({
    enableNotifications: true,
    enableCacheInvalidation: true,
    enableImageRefresh: true
  });

  const manualSync = async () => {
    try {
      await syncData();
      setLastSync(new Date());
    } catch (error) {
      console.error('Manual sync failed:', error);
      toast.error('Sync failed');
    }
  };

  const clearAllCaches = async () => {
    try {
      await clearCaches();
      setLastSync(new Date());
    } catch (error) {
      console.error('Cache clear failed:', error);
      toast.error('Failed to clear caches');
    }
  };

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online', {
        description: 'Data sync will resume automatically.',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline', {
        description: 'Some features may not work properly.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const contextValue: RealTimeDataContextType = {
    isOnline,
    lastSync,
    manualSync,
    clearAllCaches
  };

  return (
    <RealTimeDataContext.Provider value={contextValue}>
      {children}
      
      {showControls && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={manualSync}
            className="bg-background/80 backdrop-blur-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllCaches}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Trash className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            {isOnline ? (
              <span className="text-green-600">● Online</span>
            ) : (
              <span className="text-red-600">● Offline</span>
            )}
          </div>
          
          {lastSync && (
            <div className="text-xs text-muted-foreground text-center">
              Last sync: {lastSync.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </RealTimeDataContext.Provider>
  );
};