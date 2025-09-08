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

  useEffect(() => {
    // Check private mode
    const privateMode = isPrivateModeSync();
    setIsPrivateMode(privateMode);

    // Monitor connectivity
    const handleOnline = () => setHasConnectivity(true);
    const handleOffline = () => setHasConnectivity(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isDegradedMode = isPrivateMode || !hasConnectivity;

  return (
    <DegradedModeContext.Provider value={{ isPrivateMode, hasConnectivity, isDegradedMode }}>
      {children}
    </DegradedModeContext.Provider>
  );
};