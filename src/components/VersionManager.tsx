import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface VersionInfo {
  version: string;
  timestamp: number;
}

export const VersionManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        // Get version info from a timestamp-based approach
        const response = await fetch('/manifest.json?v=' + Date.now(), {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const manifest = await response.json();
          const serverVersion = manifest.version || '1.0.0';
          const storedVersion = localStorage.getItem('app_version') || '0.0.0';
          
          console.log('[VersionManager] Server version:', serverVersion, 'Stored version:', storedVersion);
          
          if (serverVersion !== storedVersion && storedVersion !== '0.0.0') {
            setUpdateAvailable(true);
            setCurrentVersion(serverVersion);
            
            const message = isMobile 
              ? 'Nova versão disponível! Toque para atualizar.'
              : 'Nova versão disponível! Clique para atualizar.';
            
            toast.info(message, {
              duration: 15000,
              action: {
                label: 'Atualizar',
                onClick: () => handleUpdate(serverVersion)
              }
            });
          } else {
            // Update stored version if it's the first time
            localStorage.setItem('app_version', serverVersion);
          }
        }
      } catch (error) {
        console.warn('[VersionManager] Failed to check for updates:', error);
      }
    };

    // Initial check
    checkForUpdates();

    // Check for updates every 30 seconds for mobile, 60 seconds for desktop
    const interval = setInterval(checkForUpdates, isMobile ? 30000 : 60000);

    // Check when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMobile]);

  const handleUpdate = (version: string) => {
    console.log('[VersionManager] Updating to version:', version);
    
    // Clear all possible caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => caches.delete(cacheName));
      });
    }
    
    // Clear storage
    try {
      localStorage.removeItem('app_version');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    
    // For mobile, use more aggressive reload
    if (isMobile) {
      const url = new URL(window.location.href);
      url.searchParams.set('v', Date.now().toString());
      url.searchParams.set('force-mobile', 'true');
      window.location.href = url.toString();
    } else {
      // For desktop, try service worker first, then fallback to reload
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          });
          setTimeout(() => window.location.reload(), 500);
        });
      } else {
        window.location.reload();
      }
    }
    
    setUpdateAvailable(false);
  };

  return (
    <>
      {updateAvailable && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-card-foreground">Atualização Disponível</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Nova versão {currentVersion} pronta para instalar.
              </p>
            </div>
            <button
              onClick={() => handleUpdate(currentVersion)}
              className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 transition-colors"
            >
              {isMobile ? 'Atualizar' : 'Atualizar'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};