import React, { createContext, useContext, useEffect, useState } from 'react';
import { isPrivateModeSync } from '@/lib/utils';

interface DegradedModeContextType {
  isPrivateMode: boolean;
  hasConnectivity: boolean;
  isDegradedMode: boolean;
}

const DegradedModeContext = createContext<DegradedModeContextType>({
  isPrivateMode: false,
  hasConnectivity: true,
  isDegradedMode: false,
});

export const useDegradedMode = () => useContext(DegradedModeContext);

interface DegradedModeProviderProps {
  children: React.ReactNode;
}

export const DegradedModeProvider: React.FC<DegradedModeProviderProps> = ({ children }) => {
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [hasConnectivity, setHasConnectivity] = useState(navigator.onLine);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Enhanced private mode detection with multiple fallbacks
    let privateMode = false;
    
    try {
      // Primary check - sync localStorage test
      privateMode = isPrivateModeSync();
      
      // Additional checks for enhanced reliability
      if (!privateMode) {
        // Check storage quota (private mode usually has very limited quota)
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          navigator.storage.estimate().then(estimate => {
            if (estimate.quota && estimate.quota < 120000000) { // Less than ~120MB
              setIsPrivateMode(true);
            }
          }).catch(() => {
            // If storage estimate fails, likely private mode
            setIsPrivateMode(true);
          });
        }
        
        // Check indexedDB availability
        if (!window.indexedDB) {
          privateMode = true;
        }
      }
    } catch (error) {
      console.log('Private mode detection error, assuming private mode:', error);
      privateMode = true;
    }
    
    setIsPrivateMode(privateMode);
    console.log('DegradedModeProvider - Private mode detected:', privateMode);

    // Monitor connectivity with enhanced checks
    const updateConnectivity = () => {
      const online = navigator.onLine;
      setHasConnectivity(online);
      console.log('DegradedModeProvider - Connectivity changed:', online);
    };

    const handleOnline = () => updateConnectivity();
    const handleOffline = () => updateConnectivity();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Mark as ready after initial checks
    setIsReady(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isDegradedMode = isPrivateMode || !hasConnectivity;

  // Show loading state until detection is complete
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <DegradedModeContext.Provider value={{ isPrivateMode, hasConnectivity, isDegradedMode }}>
      {children}
    </DegradedModeContext.Provider>
  );
};