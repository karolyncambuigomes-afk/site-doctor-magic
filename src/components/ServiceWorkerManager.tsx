import React, { useEffect, useState } from 'react';
import { useServiceWorkerManager } from '@/hooks/useServiceWorkerManager';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export const ServiceWorkerManager: React.FC = () => {
  const {
    serviceWorker,
    cacheStats,
    clearAllCaches,
    forceUpdate,
    invalidateOnDeploy,
    auditAdminCaching,
    cacheHitRate,
    isOptimal
  } = useServiceWorkerManager();

  const [auditResult, setAuditResult] = useState<any>(null);

  // Run security audit on mount
  useEffect(() => {
    const runAudit = async () => {
      const result = await auditAdminCaching();
      setAuditResult(result);
    };
    
    if (serviceWorker.isActive) {
      runAudit();
    }
  }, [serviceWorker.isActive, auditAdminCaching]);

  // Don't render if service worker not supported
  if (!serviceWorker.isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      {/* Update Available Alert */}
      {serviceWorker.updateAvailable && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Download className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>App update available</span>
            <Button onClick={forceUpdate} size="sm">
              Update
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Cache Performance Alert */}
      {cacheStats && !isOptimal && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cache hit rate: {(cacheHitRate * 100).toFixed(1)}% (Low)
            <Button 
              onClick={clearAllCaches} 
              size="sm" 
              variant="outline" 
              className="ml-2"
            >
              Clear Cache
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Security Alert */}
      {auditResult && !auditResult.safe && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Security issue: {auditResult.reason}
            <Button 
              onClick={clearAllCaches} 
              size="sm" 
              variant="destructive" 
              className="ml-2"
            >
              Fix Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Development Controls */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-white border rounded-lg p-3 shadow-lg">
          <h4 className="font-medium mb-2">SW Controls</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <span className={serviceWorker.isActive ? 'text-green-600' : 'text-red-600'}>
                {serviceWorker.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {cacheStats && (
              <div className="flex justify-between items-center">
                <span>Hit Rate:</span>
                <span>{(cacheHitRate * 100).toFixed(1)}%</span>
              </div>
            )}
            
            <div className="flex gap-2 mt-3">
              <Button 
                onClick={() => invalidateOnDeploy()} 
                size="sm" 
                variant="outline"
                className="flex-1"
              >
                Simulate Deploy
              </Button>
              <Button 
                onClick={clearAllCaches} 
                size="sm" 
                variant="outline"
                className="flex-1"
              >
                Clear Cache
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};