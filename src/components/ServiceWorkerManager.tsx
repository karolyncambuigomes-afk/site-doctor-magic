import React, { useEffect } from 'react';

export const ServiceWorkerManager: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      (async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
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

          // Safety timeout: force reload if not refreshed after 2 seconds
          setTimeout(() => {
            const hasRefreshed = sessionStorage.getItem('sw_hard_refreshed');
            if (!hasRefreshed) {
              console.log('SW: Safety timeout triggered, forcing reload');
              sessionStorage.setItem('sw_hard_refreshed', '1');
              window.location.reload();
            }
          }, 2000);

        } catch (error) {
          console.error('SW: Registration failed:', error);
        }
      })();
    }
  }, []);

  return null;
};