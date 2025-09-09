import React, { useEffect, useState } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { usePreferenceCategories } from '@/hooks/usePreferenceCategories';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileSyncManager } from '@/hooks/useMobileSyncManager';

export const CategoryFilters: React.FC = () => {
  const { categories, loading, fetchCategories } = usePreferenceCategories();
  const isMobile = useIsMobile();
  const { syncCount, forceSync } = useMobileSyncManager();
  const [mobileRefreshKey, setMobileRefreshKey] = useState(0);
  
  // Enhanced logging for debugging
  console.log('[CategoryFilters] Render state:', {
    isMobile,
    categoriesCount: categories.length,
    loading,
    mobileRefreshKey,
    syncCount,
    timestamp: new Date().toISOString()
  });

  // Ultra-aggressive mobile refresh handling
  useEffect(() => {
    if (!isMobile) return;

    const handleMobileRefresh = () => {
      const newKey = Date.now();
      setMobileRefreshKey(newKey);
      console.log(`[CategoryFilters] Mobile refresh triggered: ${newKey}`);
    };

    const handleMobileSync = () => {
      const newKey = Date.now();
      setMobileRefreshKey(newKey);
      fetchCategories(); // Force data refresh
      console.log(`[CategoryFilters] Mobile sync triggered: ${newKey}`);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isMobile) {
        setTimeout(() => {
          handleMobileRefresh();
          fetchCategories();
        }, 50);
      }
    };

    const handleFocus = () => {
      if (isMobile) {
        setTimeout(handleMobileRefresh, 25);
      }
    };

    const handleNetworkChange = () => {
      if (navigator.onLine && isMobile) {
        setTimeout(handleMobileSync, 100);
      }
    };

    // Listen for all possible refresh events
    window.addEventListener('mobile-force-refresh', handleMobileRefresh);
    window.addEventListener('mobile-force-sync', handleMobileSync);
    window.addEventListener('mobile-status-change', handleMobileRefresh);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleNetworkChange);

    return () => {
      window.removeEventListener('mobile-force-refresh', handleMobileRefresh);
      window.removeEventListener('mobile-force-sync', handleMobileSync);
      window.removeEventListener('mobile-status-change', handleMobileRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleNetworkChange);
    };
  }, [isMobile, fetchCategories]);

  // Update refresh key when sync count changes
  useEffect(() => {
    if (isMobile && syncCount > 0) {
      setMobileRefreshKey(Date.now());
    }
  }, [isMobile, syncCount]);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16" key={`mobile-refresh-${mobileRefreshKey}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="luxury-heading-lg text-black mb-4">
            Browse by Preference
          </h2>
          <p className="luxury-body-md text-black max-w-2xl mx-auto">
            Discover your perfect companion from our carefully curated selection of elite London models
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <SafeLink 
              key={`${category.id}-${mobileRefreshKey}`}
              to={category.path} 
              className="group relative aspect-[3/4] overflow-hidden bg-muted hover:shadow-lg transition-all duration-300"
            >
              <img 
                src={`${category.image_url}${isMobile ? `?mobile-refresh=${mobileRefreshKey}&sync=${syncCount}&t=${Date.now()}` : ''}`}
                alt={category.image_alt || `${category.name} companions in London`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                key={`img-${category.id}-${mobileRefreshKey}-${syncCount}`}
                loading="eager"
                onError={(e) => {
                  // Force reload on error for mobile
                  if (isMobile) {
                    const target = e.target as HTMLImageElement;
                    setTimeout(() => {
                      target.src = `${category.image_url}?retry=${Date.now()}`;
                    }, 100);
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-center tracking-wide">
                  {category.name}
                </h3>
              </div>
            </SafeLink>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a href="https://wa.me/447436190679" target="_blank" rel="noopener noreferrer" className="inline-block border border-border hover:border-foreground px-8 py-3 transition-all duration-300">
            <span className="luxury-body-sm tracking-[0.3em] uppercase font-light text-black">BOOK NOW</span>
          </a>
        </div>
      </div>
    </section>
  );
};