import React, { useEffect } from 'react';

export const SimpleServiceWorker: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .catch(() => {
          // Silent error handling for service worker registration
        });
    }
  }, []);

  return null;
};