import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Bug, Smartphone, Monitor } from 'lucide-react';

export const MobileDebugPanel: React.FC = () => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    events: [] as string[],
    refreshCount: 0,
    lastRefresh: null as Date | null,
    cacheCleared: 0
  });

  useEffect(() => {
    const handleMobileEvent = (event: CustomEvent) => {
      setDebugInfo(prev => ({
        ...prev,
        events: [`${event.type}: ${JSON.stringify(event.detail)}`, ...prev.events].slice(0, 10),
        refreshCount: event.type.includes('refresh') ? prev.refreshCount + 1 : prev.refreshCount,
        lastRefresh: event.type.includes('refresh') ? new Date() : prev.lastRefresh,
        cacheCleared: event.type.includes('cache') ? prev.cacheCleared + 1 : prev.cacheCleared
      }));
    };

    const events = ['mobile-force-refresh', 'mobile-force-sync', 'mobile-status-change', 'mobile-cache-clear'];
    events.forEach(eventType => {
      window.addEventListener(eventType, handleMobileEvent as EventListener);
    });

    return () => {
      events.forEach(eventType => {
        window.removeEventListener(eventType, handleMobileEvent as EventListener);
      });
    };
  }, []);

  const forceUltraRefresh = () => {
    console.log('[MobileDebug] Ultra refresh triggered manually');
    
    // Clear all possible caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(name => caches.delete(name));
      });
    }

    // Clear storage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Storage clear failed:', e);
    }

    // Dispatch all events
    window.dispatchEvent(new CustomEvent('mobile-force-refresh', {
      detail: { timestamp: Date.now(), forced: true, manual: true, ultra: true }
    }));
    
    window.dispatchEvent(new CustomEvent('mobile-force-sync', {
      detail: { timestamp: Date.now(), forced: true, manual: true, ultra: true }
    }));

    // Force reload with cache busting
    setTimeout(() => {
      window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + `force-mobile-refresh=${Date.now()}`;
    }, 1000);
  };

  if (!isMobile && !isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-50 max-w-sm">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-background/90 backdrop-blur-sm"
        >
          <Bug className="w-4 h-4" />
        </Button>
      ) : (
        <Card className="p-4 bg-background/95 backdrop-blur-sm border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isMobile ? (
                <Smartphone className="w-4 h-4 text-green-500" />
              ) : (
                <Monitor className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-sm font-medium">
                Mobile Debug
              </span>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex gap-2">
              <Badge variant={isMobile ? "default" : "secondary"}>
                {isMobile ? "Mobile" : "Desktop"}
              </Badge>
              <Badge variant="outline">
                {debugInfo.refreshCount} Refreshes
              </Badge>
              <Badge variant="outline">
                {debugInfo.cacheCleared} Cache Clears
              </Badge>
            </div>
            
            {debugInfo.lastRefresh && (
              <p className="text-xs text-muted-foreground">
                Last: {debugInfo.lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>

          <Button
            onClick={forceUltraRefresh}
            size="sm"
            className="w-full mb-3"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Ultra Refresh
          </Button>

          <div className="max-h-32 overflow-y-auto text-xs space-y-1">
            {debugInfo.events.map((event, i) => (
              <div key={i} className="text-muted-foreground font-mono truncate">
                {event}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};