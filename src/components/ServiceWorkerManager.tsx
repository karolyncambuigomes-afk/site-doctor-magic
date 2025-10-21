import React, { useEffect } from 'react';

export const ServiceWorkerManager: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Check for manual force update trigger
      const urlHasForce = window.location.search.includes('forceUpdate=1') || 
                          window.location.hash.includes('forceupdate');
      
      (async () => {
        try {
          // If manual trigger detected, execute nuclear cleanup immediately (regardless of env)
          if (urlHasForce) {
            console.log('SW: Manual force update detected, executing nuclear cleanup');
            
            try {
              // Unregister all service workers
              const registrations = await navigator.serviceWorker.getRegistrations();
              await Promise.all(registrations.map(reg => reg.unregister()));
              console.log('SW: All service workers unregistered');
              
              // Clear all caches
              const cacheNames = await window.caches.keys();
              await Promise.all(cacheNames.map(name => window.caches.delete(name)));
              console.log('SW: All caches cleared');
              
              // Set flag and reload without query params
              sessionStorage.setItem('sw_hard_refreshed', '1');
              window.location.replace(window.location.pathname);
            } catch (error) {
              console.error('SW: Manual force update failed:', error);
              sessionStorage.setItem('sw_hard_refreshed', '1');
              window.location.reload();
            }
            return;
          }
          
          // Only register SW in production
          if (!import.meta.env.PROD) {
            console.log('SW: Skipping registration in dev/preview mode');
            return;
          }
          
          // Register with cache-busting to ensure fresh SW
          const registration = await navigator.serviceWorker.register(`/sw.js?ts=${Date.now()}`);
          
          // Force immediate update check
          await registration.update();
          console.log('SW: Update check completed');

          // Handle new SW waiting to activate
          const handleNewSW = () => {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              console.log('SW: SKIP_WAITING sent to waiting SW');
            }
          };

          // Handle controller change (new SW activated)
          const handleControllerChange = () => {
            const hasRefreshed = sessionStorage.getItem('sw_hard_refreshed');
            if (!hasRefreshed) {
              console.log('SW: New controller detected, reloading page');
              sessionStorage.setItem('sw_hard_refreshed', '1');
              window.location.reload();
            }
          };

          navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

          // If there's a waiting SW, activate it immediately
          handleNewSW();

          // Wait for SW to be ready and clear all caches
          await navigator.serviceWorker.ready;
          
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_ALL_CACHES' });
            console.log('SW: CLEAR_ALL_CACHES sent');
          }

          // Nuclear fallback: if controller doesn't change within 2.5s, force complete cleanup
          setTimeout(async () => {
            const hasRefreshed = sessionStorage.getItem('sw_hard_refreshed');
            if (!hasRefreshed) {
              console.log('SW: Nuclear fallback - unregistering all SWs and clearing caches');
              
              try {
                // Unregister all service workers
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(reg => reg.unregister()));
                console.log('SW: All service workers unregistered');
                
                // Clear all caches via window.caches
                const cacheNames = await window.caches.keys();
                await Promise.all(cacheNames.map(name => window.caches.delete(name)));
                console.log('SW: All caches cleared via window.caches');
                
                // Set flag and reload
                sessionStorage.setItem('sw_hard_refreshed', '1');
                window.location.reload();
              } catch (error) {
                console.error('SW: Nuclear fallback failed:', error);
                // Force reload anyway
                sessionStorage.setItem('sw_hard_refreshed', '1');
                window.location.reload();
              }
            }
          }, 2500);

        } catch (error) {
          console.error('SW: Registration failed:', error);
        }
      })();
    }
  }, []);

  return null;
};