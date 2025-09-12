import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  RefreshCw, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  Download,
  Globe,
  Server,
  Clock
} from 'lucide-react';
import { useServiceWorkerManager } from '@/hooks/useServiceWorkerManager';

export const CacheMonitor: React.FC = () => {
  const {
    serviceWorker,
    cacheStats,
    clearAllCaches,
    invalidateCache,
    forceUpdate,
    requestCacheStats,
    auditAdminCaching,
    cacheHitRate,
    isOptimal
  } = useServiceWorkerManager();

  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Run admin cache audit periodically
  useEffect(() => {
    const runAudit = async () => {
      setIsAuditing(true);
      const result = await auditAdminCaching();
      setAuditResult(result);
      setIsAuditing(false);
    };

    runAudit();
    const interval = setInterval(runAudit, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [auditAdminCaching]);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  const getCacheGrade = (hitRate: number) => {
    if (hitRate >= 0.8) return { grade: 'A', color: 'bg-green-100 text-green-800' };
    if (hitRate >= 0.6) return { grade: 'B', color: 'bg-blue-100 text-blue-800' };
    if (hitRate >= 0.4) return { grade: 'C', color: 'bg-yellow-100 text-yellow-800' };
    return { grade: 'D', color: 'bg-red-100 text-red-800' };
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cache & CDN Monitor</h2>
          <p className="text-muted-foreground">
            Monitor cache performance and CDN behavior
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={requestCacheStats}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Stats
          </Button>
          <Button 
            variant="destructive" 
            onClick={clearAllCaches}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Service Worker Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Service Worker Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Supported</p>
              <p className={`font-medium ${getStatusColor(serviceWorker.isSupported)}`}>
                {serviceWorker.isSupported ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registered</p>
              <p className={`font-medium ${getStatusColor(serviceWorker.isRegistered)}`}>
                {serviceWorker.isRegistered ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className={`font-medium ${getStatusColor(serviceWorker.isActive)}`}>
                {serviceWorker.isActive ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="font-medium">
                {serviceWorker.version || 'Unknown'}
              </p>
            </div>
          </div>

          {serviceWorker.updateAvailable && (
            <Alert className="mt-4">
              <Download className="h-4 w-4" />
              <AlertTitle>Update Available</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                A new version of the service worker is available.
                <Button onClick={forceUpdate} size="sm">
                  Update Now
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Cache Performance */}
      {cacheStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                  {(cacheHitRate * 100).toFixed(1)}%
                </span>
                <Badge className={getCacheGrade(cacheHitRate).color}>
                  Grade {getCacheGrade(cacheHitRate).grade}
                </Badge>
              </div>
              <Progress value={cacheHitRate * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Cache Hits</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">
                {formatNumber(cacheStats.hits)}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                Successful cache retrievals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Cache Misses</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-orange-600">
                {formatNumber(cacheStats.misses)}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                Network requests required
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Cache Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-red-600">
                {formatNumber(cacheStats.errors)}
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                Failed operations
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Audit
          </CardTitle>
          <CardDescription>
            Ensures admin pages are never cached
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuditing ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running security audit...</span>
            </div>
          ) : auditResult ? (
            <Alert className={auditResult.safe ? "border-green-200" : "border-red-200"}>
              {auditResult.safe ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle>
                {auditResult.safe ? 'Security Check Passed' : 'Security Issue Detected'}
              </AlertTitle>
              <AlertDescription>
                {auditResult.reason}
                {!auditResult.safe && auditResult.url && (
                  <div className="mt-2">
                    <Button 
                      onClick={() => invalidateCache(auditResult.url)}
                      size="sm"
                      variant="destructive"
                    >
                      Clear This Cache Entry
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-muted-foreground">Audit not run yet</p>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="caching">Caching Strategy</TabsTrigger>
          <TabsTrigger value="cdn">CDN Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cache Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                {cacheStats ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Requests:</span>
                      <span className="font-medium">
                        {formatNumber(cacheStats.hits + cacheStats.misses)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache Updates:</span>
                      <span className="font-medium">
                        {formatNumber(cacheStats.updates)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate:</span>
                      <span className="font-medium">
                        {cacheStats.hits + cacheStats.misses > 0 
                          ? ((cacheStats.errors / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(2)
                          : '0'
                        }%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No cache statistics available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Optimization Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {isOptimal ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className="text-sm">
                      Cache hit rate {isOptimal ? 'optimal' : 'needs improvement'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {serviceWorker.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      Service Worker {serviceWorker.isActive ? 'active' : 'inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {auditResult?.safe ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      Admin pages {auditResult?.safe ? 'secure' : 'may be cached'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="caching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Strategy Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Static Assets (1 year)</h4>
                  <p className="text-sm text-muted-foreground">
                    JavaScript, CSS, images with hash-based cache busting
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => invalidateCache('assets/')}
                    >
                      Invalidate Static Cache
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Runtime Content (1 day)</h4>
                  <p className="text-sm text-muted-foreground">
                    HTML pages and API responses with background updates
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => invalidateCache('runtime')}
                    >
                      Invalidate Runtime Cache
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Dynamic Content (No cache)</h4>
                  <p className="text-sm text-muted-foreground">
                    Admin pages, authentication, and API endpoints
                  </p>
                  <Badge variant="outline">Never Cached</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cdn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                CDN Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Supabase Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    Images and media files with automatic optimization
                  </p>
                  <Badge variant="secondary">WebP + JPEG fallback</Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Google Fonts</h4>
                  <p className="text-sm text-muted-foreground">
                    Font files served via Google CDN with cross-origin headers
                  </p>
                  <Badge variant="secondary">Cached 1 week</Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Cache Headers</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Static Assets:</span>
                      <code className="text-xs">max-age=31536000, immutable</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Images:</span>
                      <code className="text-xs">max-age=31536000, public</code>
                    </div>
                    <div className="flex justify-between">
                      <span>HTML:</span>
                      <code className="text-xs">max-age=3600, public</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};