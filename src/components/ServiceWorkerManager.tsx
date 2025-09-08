import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isPrivateMode } from '@/lib/utils';

export const ServiceWorkerManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [swDisabled, setSwDisabled] = useState(false);

  useEffect(() => {
    // Check for private mode and disable SW if needed
    isPrivateMode().then((privateMode) => {
      setIsPrivate(privateMode);
      if (privateMode) {
        setSwDisabled(true);
        console.log('Private mode detected, Service Worker disabled');
        return;
      }
    });
    
    // Also disable SW if there are connectivity issues
    const isOffline = !navigator.onLine;
    if (isOffline) {
      setSwDisabled(true);
      console.log('Offline detected, Service Worker disabled');
      return;
    }
    
    if ('serviceWorker' in navigator && !swDisabled) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registered successfully');
          setRegistration(reg);

          // Check for updates every 30 seconds
          setInterval(() => {
            reg.update();
          }, 30000);

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  toast.info('Nova versão disponível! Clique para atualizar.', {
                    duration: 10000,
                    action: {
                      label: 'Atualizar',
                      onClick: () => handleUpdate()
                    }
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
          setSwDisabled(true);
        });

      // Listen for controller change (when new SW takes control)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, [swDisabled]);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    } else {
      console.warn('ServiceWorker: No waiting worker available for update');
    }
  };

  const clearCache = () => {
    if (registration) {
      registration.active?.postMessage({ type: 'CLEAR_CACHE' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Debug mode - only show in development
  const isDev = import.meta.env.DEV;

  return (
    <>
      {updateAvailable && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg p-4 shadow-luxury max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-card-foreground">Atualização Disponível</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Uma nova versão do site está pronta.
              </p>
            </div>
            <button
              onClick={handleUpdate}
              className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 transition-smooth"
            >
              Atualizar
            </button>
          </div>
        </div>
      )}
      
      {isDev && (
        <div className="fixed bottom-4 left-4 z-50 bg-card border border-border rounded-lg p-2 shadow-luxury">
          <button
            onClick={clearCache}
            className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs hover:bg-destructive/90 transition-smooth"
          >
            Clear Cache
          </button>
        </div>
      )}
    </>
  );
};