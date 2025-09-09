import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileRefreshButton: React.FC = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const handleForceRefresh = () => {
    console.log('[MobileRefresh] Force refreshing mobile browser');
    
    // Clear all possible caches
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    
    // Clear browser storage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    
    // Clear browser cache if available
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => caches.delete(cacheName));
      });
    }
    
    // Force reload with cache busting
    const url = new URL(window.location.href);
    url.searchParams.set('t', Date.now().toString());
    url.searchParams.set('mobile-refresh', 'true');
    window.location.href = url.toString();
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={handleForceRefresh}
        variant="outline"
        size="sm"
        className="bg-primary/10 border-primary/20 hover:bg-primary/20"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Atualizar
      </Button>
    </div>
  );
};