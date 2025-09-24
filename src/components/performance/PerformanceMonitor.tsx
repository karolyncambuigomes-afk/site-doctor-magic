import React, { useEffect, useState } from 'react';
import { collectPerformanceMetrics } from '@/utils/performance/assetOptimizer';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  domContentLoaded: number;
  loadComplete: number;
  totalTime: number;
  dnsTime: number;
  connectTime: number;
  requestTime: number;
  responseTime: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  } | null;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  reportEndpoint?: string;
  onMetricsCollected?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  reportEndpoint,
  onMetricsCollected
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const collectMetrics = () => {
      const performanceData = collectPerformanceMetrics();
      if (performanceData) {
        setMetrics(performanceData);
        onMetricsCollected?.(performanceData);
        
        // Send to analytics endpoint if provided
        if (reportEndpoint) {
          fetch(reportEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              metrics: performanceData,
              url: window.location.href,
              userAgent: navigator.userAgent,
              timestamp: Date.now()
            })
          }).catch(console.error);
        }
      }
    };

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    // Observe LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry && metrics) {
            setMetrics(prev => prev ? { ...prev, lcp: lastEntry.startTime } : null);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        return () => lcpObserver.disconnect();
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    return () => {
      window.removeEventListener('load', collectMetrics);
    };
  }, [enabled, reportEndpoint, onMetricsCollected, metrics]);

  if (!enabled || !metrics) return null;

  const getScoreColor = (score: number, thresholds: [number, number]) => {
    if (score <= thresholds[0]) return 'text-green-600';
    if (score <= thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (time: number) => `${time.toFixed(0)}ms`;
  const formatBytes = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Metrics"
      >
        📊
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            {/* Core Web Vitals */}
            <div className="border-b pb-2">
              <h4 className="font-medium text-gray-700 mb-1">Core Web Vitals</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">FCP:</span>
                  <span className={`ml-1 ${getScoreColor(metrics.fcp, [1800, 3000])}`}>
                    {formatTime(metrics.fcp)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">LCP:</span>
                  <span className={`ml-1 ${getScoreColor(metrics.lcp, [2500, 4000])}`}>
                    {formatTime(metrics.lcp)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Load Times */}
            <div className="border-b pb-2">
              <h4 className="font-medium text-gray-700 mb-1">Load Times</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">DOM Ready:</span>
                  <span>{formatTime(metrics.domContentLoaded)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Load:</span>
                  <span>{formatTime(metrics.totalTime)}</span>
                </div>
              </div>
            </div>
            
            {/* Network Times */}
            <div className="border-b pb-2">
              <h4 className="font-medium text-gray-700 mb-1">Network</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">DNS:</span>
                  <span>{formatTime(metrics.dnsTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connect:</span>
                  <span>{formatTime(metrics.connectTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response:</span>
                  <span>{formatTime(metrics.responseTime)}</span>
                </div>
              </div>
            </div>
            
            {/* Memory Usage */}
            {metrics.memoryUsage && (
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Memory</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Used:</span>
                    <span>{formatBytes(metrics.memoryUsage.used)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span>{formatBytes(metrics.memoryUsage.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-2 border-t text-xs text-gray-500">
            Refresh page to recalculate metrics
          </div>
        </div>
      )}
    </div>
  );
};