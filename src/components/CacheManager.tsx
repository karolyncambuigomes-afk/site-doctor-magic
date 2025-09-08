import { useEffect } from 'react';

export const CacheManager = () => {
  useEffect(() => {
    const clearAllCaches = async () => {
      try {
        // Clear all browser caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(name => caches.delete(name))
          );
          console.log('All caches cleared');
        }

        // Force reload to get fresh content
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
          console.log('Service workers unregistered');
        }
      } catch (error) {
        console.error('Error clearing caches:', error);
      }
    };

    // Clear caches on mount to ensure fresh start
    clearAllCaches();
  }, []);

  return null;
};