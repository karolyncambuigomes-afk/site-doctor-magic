import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { testUrlConnectivity } from '@/utils/imageUrlHelper';
import { useHomepageContent } from '@/hooks/useHomepageContent';

interface UrlStatus {
  url: string;
  isConnected: boolean;
  testing: boolean;
}

export const DebugPanel: React.FC = () => {
  const { heroContent } = useHomepageContent();
  const [urlStatuses, setUrlStatuses] = useState<UrlStatus[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const testAllUrls = async () => {
    if (!heroContent) return;

    const urls = [
      heroContent.image_url_desktop,
      heroContent.image_url_mobile,
      heroContent.image_url
    ].filter(Boolean) as string[];

    setUrlStatuses(urls.map(url => ({ url, isConnected: false, testing: true })));

    const results = await Promise.all(
      urls.map(async (url) => ({
        url,
        isConnected: await testUrlConnectivity(url),
        testing: false
      }))
    );

    setUrlStatuses(results);
  };

  useEffect(() => {
    if (heroContent && isVisible) {
      testAllUrls();
    }
  }, [heroContent, isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-background/90 backdrop-blur"
        >
          🔧 Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            🔧 Debug Panel
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">URL Connectivity</span>
            <Button size="sm" variant="outline" onClick={testAllUrls}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Test
            </Button>
          </div>
          
          <div className="space-y-2">
            {urlStatuses.map((status, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {status.testing ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : status.isConnected ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
                <span className="truncate flex-1">{status.url}</span>
                <Badge variant={status.isConnected ? "default" : "destructive"} className="text-xs">
                  {status.testing ? "..." : status.isConnected ? "OK" : "FAIL"}
                </Badge>
              </div>
            ))}
          </div>

          {heroContent && (
            <div className="border-t pt-2 space-y-1 text-xs">
              <div className="font-medium">Current Selection:</div>
              <div>Desktop: {heroContent.image_url_desktop ? "✅" : "❌"}</div>
              <div>Mobile: {heroContent.image_url_mobile ? "✅" : "❌"}</div>
              <div>Fallback: {heroContent.image_url ? "✅" : "❌"}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};