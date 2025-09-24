import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Play, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { auditPerformance, exportPerformanceReport, PerformanceAuditResult } from '@/utils/performance/performanceAuditor';

export const PerformanceAuditor: React.FC = () => {
  const [audit, setAudit] = useState<PerformanceAuditResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const result = await auditPerformance();
      setAudit(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run audit');
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    if (!audit) return;
    
    const report = exportPerformanceReport(audit);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-audit-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => `${ms.toFixed(0)}ms`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Auditor</h2>
          <p className="text-muted-foreground">
            Analyze your site's performance and get optimization recommendations
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runAudit} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Running Audit...' : 'Run Audit'}
          </Button>
          {audit && (
            <Button 
              variant="outline" 
              onClick={downloadReport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Audit Failed</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <div>
                <h3 className="font-medium">Running Performance Audit</h3>
                <p className="text-sm text-muted-foreground">
                  Analyzing Core Web Vitals, resource loading, and optimization opportunities...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {audit && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold ${getScoreColor(audit.score)}`}>
                    {audit.score}
                  </span>
                  <Badge className={getGradeColor(audit.grade)}>
                    Grade {audit.grade}
                  </Badge>
                </div>
                <Progress value={audit.score} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Page Size</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">
                  {formatBytes(audit.metrics.totalSize)}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  {audit.metrics.totalRequests} requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Load Time</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">
                  {formatTime(audit.metrics.fullyLoaded)}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  DOM: {formatTime(audit.metrics.domContentLoaded)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Tabs defaultValue="vitals" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="vitals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">First Contentful Paint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className={`text-xl font-bold ${audit.metrics.fcp <= 1800 ? 'text-green-600' : audit.metrics.fcp <= 3000 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatTime(audit.metrics.fcp)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Good: ≤1.8s
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Largest Contentful Paint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className={`text-xl font-bold ${audit.metrics.lcp <= 2500 ? 'text-green-600' : audit.metrics.lcp <= 4000 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatTime(audit.metrics.lcp)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Good: ≤2.5s
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Cumulative Layout Shift</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className={`text-xl font-bold ${audit.metrics.cls <= 0.1 ? 'text-green-600' : audit.metrics.cls <= 0.25 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {audit.metrics.cls.toFixed(3)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Good: ≤0.1
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">First Input Delay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className={`text-xl font-bold ${audit.metrics.fid <= 100 ? 'text-green-600' : audit.metrics.fid <= 300 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatTime(audit.metrics.fid)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Good: ≤100ms
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">HTML</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-lg font-bold">
                      {formatBytes(audit.metrics.htmlSize)}
                    </span>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">CSS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-lg font-bold">
                      {formatBytes(audit.metrics.cssSize)}
                    </span>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">JavaScript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-lg font-bold">
                      {formatBytes(audit.metrics.jsSize)}
                    </span>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-lg font-bold">
                      {formatBytes(audit.metrics.imageSize)}
                    </span>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Fonts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-lg font-bold">
                      {formatBytes(audit.metrics.fontSize)}
                    </span>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Cache Hit Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-lg font-bold">
                      {audit.metrics.cacheHitRatio.toFixed(0)}%
                    </span>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {audit.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={rec.type === 'critical' ? 'destructive' : rec.type === 'important' ? 'default' : 'secondary'}>
                          {rec.type}
                        </Badge>
                        <Badge variant="outline">
                          +{rec.impact}% faster
                        </Badge>
                        <Badge variant="outline">
                          {rec.effort} effort
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              {audit.issues.map((issue, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {issue.severity === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
                      {issue.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                      {issue.severity === 'info' && <Info className="w-5 h-5 text-blue-500 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{issue.resource}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {issue.message}
                        </p>
                        {issue.fix && (
                          <p className="text-sm text-green-600 mt-2">
                            💡 {issue.fix}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};