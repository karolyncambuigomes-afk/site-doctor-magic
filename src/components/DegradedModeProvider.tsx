import React, { createContext, useContext, useEffect, useState } from 'react';

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

// Ultra-simple synchronous private mode detection
const detectPrivateMode = (): boolean => {
  try {
    const test = 'privateModeTest_' + Date.now();
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return false;
  } catch {
    return true;
  }
};

export const DegradedModeProvider: React.FC<DegradedModeProviderProps> = ({ children }) => {
  const [isPrivateMode, setIsPrivateMode] = useState<boolean | null>(null);
  const [hasConnectivity, setHasConnectivity] = useState(navigator.onLine);

  useEffect(() => {
    console.log('DegradedModeProvider: Starting private mode detection');
    
    // Ultra-fast detection with reduced timeout
    const maxDetectionTime = 50; // Reduced to 50ms max
    let detected = false;
    
    try {
      // Primary sync check
      const privateModeDetected = detectPrivateMode();
      detected = true;
      setIsPrivateMode(privateModeDetected);
      console.log('DegradedModeProvider - Private mode detected (sync):', privateModeDetected);
    } catch (error) {
      console.log('DegradedModeProvider - Detection error, assuming normal mode:', error);
      detected = true;
      setIsPrivateMode(false); // Assume normal mode on error
    }
    
    // Aggressive fallback timeout
    const timeoutId = setTimeout(() => {
      if (!detected) {
        console.log('DegradedModeProvider - Detection timeout, assuming normal mode');
        setIsPrivateMode(false); // Assume normal mode to prevent blocking
      }
    }, maxDetectionTime);
    
    if (detected) {
      clearTimeout(timeoutId);
    }

    // Simple connectivity monitoring
    const updateConnectivity = () => {
      setHasConnectivity(navigator.onLine);
    };

    window.addEventListener('online', updateConnectivity);
    window.addEventListener('offline', updateConnectivity);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', updateConnectivity);
      window.removeEventListener('offline', updateConnectivity);
    };
  }, []);

  const isDegradedMode = isPrivateMode || !hasConnectivity;

  // Show simple loading only for a very short time, with shorter timeout
  if (isPrivateMode === null) {
    console.log('DegradedModeProvider: Still detecting private mode, showing minimal loading');
    
    // Force resolve after 100ms to prevent blocking
    setTimeout(() => {
      if (isPrivateMode === null) {
        console.log('DegradedModeProvider: Force resolving private mode detection');
        setIsPrivateMode(false);
      }
    }, 100);
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground text-sm">Iniciando...</p>
        </div>
      </div>
    );
  }

  return (
    <DegradedModeContext.Provider value={{ 
      isPrivateMode: isPrivateMode ?? false, 
      hasConnectivity, 
      isDegradedMode 
    }}>
      {children}
    </DegradedModeContext.Provider>
  );
};