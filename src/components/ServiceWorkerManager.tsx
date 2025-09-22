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

    </div>
  );
};