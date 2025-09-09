import { useEffect } from 'react';

export const ServiceWorkerKiller = () => {
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile && 'serviceWorker' in navigator) {
      console.log('[ServiceWorkerKiller] Unregistering service worker for mobile auth');
      
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          console.log('[ServiceWorkerKiller] Unregistering SW:', registration.scope);
          registration.unregister();
        });
        
        // Force reload to ensure clean state
        setTimeout(() => {
          console.log('[ServiceWorkerKiller] Reloading page for clean mobile auth');
          window.location.reload();
        }, 500);
      });
    }
  }, []);

  return null;
};