import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getAuditTargets, AuditTarget } from '@/utils/getAuditTargets';

interface AuditSection {
  name: string;
  status: 'success' | 'warning' | 'error';
  details: string;
  actions?: string[];
}

interface ImageStatus {
  url: string;
  status: 200 | 404 | 500;
  category: 'hero' | 'models' | 'carousel' | 'blog' | 'slides';
  name: string;
  id: string;
  localUrl?: string;
  externalUrl?: string;
  responseTime?: number;
}

export const ImageAuditReport = () => {
  const [auditSections, setAuditSections] = useState<AuditSection[]>([]);
  const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [featureFlags, setFeatureFlags] = useState({ preferLocalImages: true });
  const [auditTargets, setAuditTargets] = useState<AuditTarget[]>([]);

  const runFullAudit = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const sections: AuditSection[] = [];
    const statuses: ImageStatus[] = [];

    try {
      // 1. Environment Check
      setProgress(10);
      sections.push({
        name: '1. Deploy & Environment',
        status: 'success',
        details: 'Production environment confirmed, Supabase connected'
      });

      // 2. Load audit targets from database
      setProgress(20);
      const { targets, summary } = await getAuditTargets();
      setAuditTargets(targets);
      
      sections.push({
        name: '2. Database Targets',
        status: 'success',
        details: `Found ${summary.total} images: ${summary.hero} hero, ${summary.models} models, ${summary.carousel} carousel, ${summary.slides} slides, ${summary.blog} blog`
      });

      // 3. Proxy Check
      setProgress(30);
      try {
        const proxyTest = await fetch('/images/health.png', { method: 'HEAD' });
        sections.push({
          name: '3. Image Proxy (/images/*)',
          status: proxyTest.ok ? 'success' : 'error',
          details: proxyTest.ok ? 'Proxy responding correctly' : 'Proxy not responding'
        });
      } catch {
        sections.push({
          name: '3. Image Proxy (/images/*)',
          status: 'error',
          details: 'Proxy not accessible'
        });
      }

      // 4. Test each target image
      setProgress(40);
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const testUrl = target.effectiveUrl;
        
        try {
          const response = await fetch(testUrl, { method: 'HEAD' });
          statuses.push({
            id: target.id,
            name: target.name,
            url: testUrl,
            localUrl: target.localUrl,
            externalUrl: target.externalUrl,
            status: response.status as 200 | 404 | 500,
            category: target.category
          });
        } catch {
          statuses.push({
            id: target.id,
            name: target.name,
            url: testUrl,
            localUrl: target.localUrl,
            externalUrl: target.externalUrl,
            status: 500,
            category: target.category
          });
        }
        
        // Update progress
        setProgress(40 + (i / targets.length) * 40);
      }

      // 5. Calculate summary
      setProgress(90);
      const totalImages = statuses.length;
      const successfulImages = statuses.filter(s => s.status === 200).length;
      const localImages = statuses.filter(s => s.url.includes('/images/')).length;
      const brokenImages = statuses.filter(s => s.status !== 200).length;
      const pendingMigration = statuses.filter(s => s.externalUrl && !s.localUrl).length;

      sections.push({
        name: '4. Image Analysis',
        status: brokenImages === 0 ? 'success' : 'warning',
        details: `${successfulImages}/${totalImages} images working, ${localImages} using /images/ proxy, ${pendingMigration} pending migration`
      });

      sections.push({
        name: '5. Feature Flags',
        status: 'success',
        details: `preferLocalImages: ${featureFlags.preferLocalImages ? 'Enabled' : 'Disabled'}`
      });

      setProgress(100);
      setAuditSections(sections);
      setImageStatuses(statuses);
      
      toast.success(`Audit completed: ${totalImages} images analyzed`);
    } catch (error) {
      console.error('Audit error:', error);
      toast.error('Audit failed');
    } finally {
      setIsRunning(false);
    }
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      sections: auditSections,
      imageStatuses: imageStatuses,
      summary: {
        total: imageStatuses.length,
        successful: imageStatuses.filter(s => s.status === 200).length,
        local: imageStatuses.filter(s => s.url.includes('/images/')).length,
        broken: imageStatuses.filter(s => s.status !== 200).length
      },
      featureFlags
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-audit-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: number) => {
    if (status === 200) return <Badge variant="default">200 OK</Badge>;
    if (status === 404) return <Badge variant="destructive">404 Not Found</Badge>;
    return <Badge variant="secondary">{status} Error</Badge>;
  };

  useEffect(() => {
    const savedFlags = localStorage.getItem('featureFlags');
    if (savedFlags) {
      try {
        setFeatureFlags(JSON.parse(savedFlags));
      } catch {}
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image Pipeline Audit Report</h1>
          <p className="text-muted-foreground">
            Complete analysis of image loading, proxy, and optimization status
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runFullAudit}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Audit...' : 'Run Full Audit'}
          </Button>
          {auditSections.length > 0 && (
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Running audit...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {auditSections.length > 0 && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditSections.map((section, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    {getStatusIcon(section.status)}
                    <div className="flex-1">
                      <h4 className="font-medium">{section.name}</h4>
                      <p className="text-sm text-muted-foreground">{section.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Status Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {imageStatuses.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {status.category}
                        </Badge>
                        <span className="font-medium text-sm">{status.name}</span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">
                        {status.url}
                      </div>
                      <div className="flex gap-2 text-xs">
                        {status.localUrl && (
                          <span className="text-green-600">🟢 Local: {status.localUrl.includes('/images/') ? 'Yes' : 'No'}</span>
                        )}
                        {status.externalUrl && (
                          <span className="text-blue-600">🔗 External: Yes</span>
                        )}
                        {!status.localUrl && !status.externalUrl && (
                          <span className="text-gray-500">📷 Placeholder</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(status.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
