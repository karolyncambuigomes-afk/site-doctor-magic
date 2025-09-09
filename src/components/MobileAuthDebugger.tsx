import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AuthDebugInfo {
  userAgent: string;
  isMobile: boolean;
  lastAuthError?: string;
  requestCount: number;
  timestamp: number;
}

export const MobileAuthDebugger: React.FC = () => {
  const isMobile = useIsMobile();
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo>({
    userAgent: navigator.userAgent,
    isMobile,
    requestCount: 0,
    timestamp: Date.now()
  });
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    // Listen for auth debug events
    const handleAuthDebug = (event: CustomEvent) => {
      setDebugInfo(prev => ({
        ...prev,
        lastAuthError: event.detail.error,
        requestCount: prev.requestCount + 1,
        timestamp: Date.now()
      }));
    };

    // Listen for fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      try {
        const response = await originalFetch(...args);
        
        // Track auth-related requests
        if (typeof url === 'string' && (url.includes('/auth/') || url.includes('supabase'))) {
          console.log('[AuthDebug] Request:', {
            url,
            method: options?.method || 'GET',
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
          });
          
          if (!response.ok) {
            window.dispatchEvent(new CustomEvent('auth-debug', {
              detail: { 
                error: `HTTP ${response.status}`,
                url,
                method: options?.method || 'GET'
              }
            }));
          }
        }
        
        return response;
      } catch (error) {
        if (typeof url === 'string' && (url.includes('/auth/') || url.includes('supabase'))) {
          console.error('[AuthDebug] Request failed:', error);
          window.dispatchEvent(new CustomEvent('auth-debug', {
            detail: { 
              error: error instanceof Error ? error.message : 'Network error',
              url,
              method: options?.method || 'GET'
            }
          }));
        }
        throw error;
      }
    };

    window.addEventListener('auth-debug', handleAuthDebug as EventListener);

    return () => {
      window.removeEventListener('auth-debug', handleAuthDebug as EventListener);
      window.fetch = originalFetch;
    };
  }, [isMobile]);

  const clearDebugInfo = () => {
    setDebugInfo(prev => ({
      ...prev,
      lastAuthError: undefined,
      requestCount: 0,
      timestamp: Date.now()
    }));
  };

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        size="sm"
        variant="outline"
        className="mb-2"
      >
        Auth Debug {debugInfo.lastAuthError && <Badge variant="destructive" className="ml-1">!</Badge>}
      </Button>
      
      {isVisible && (
        <Card className="w-80 max-h-96 overflow-y-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mobile Auth Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div>
              <strong>Device:</strong> {debugInfo.isMobile ? 'Mobile' : 'Desktop'}
            </div>
            <div>
              <strong>Requests:</strong> {debugInfo.requestCount}
            </div>
            {debugInfo.lastAuthError && (
              <div className="p-2 bg-destructive/10 rounded">
                <strong>Last Error:</strong> {debugInfo.lastAuthError}
              </div>
            )}
            <div>
              <strong>User Agent:</strong>
              <div className="text-muted-foreground break-all">
                {debugInfo.userAgent.substring(0, 100)}...
              </div>
            </div>
            <Button onClick={clearDebugInfo} size="sm" variant="outline" className="w-full">
              Clear Debug Info
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};