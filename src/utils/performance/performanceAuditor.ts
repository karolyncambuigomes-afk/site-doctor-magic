// Performance auditing and optimization recommendations

export interface PerformanceAuditResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: PerformanceMetrics;
  recommendations: Recommendation[];
  issues: Issue[];
}

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number;        // First Contentful Paint
  lcp: number;        // Largest Contentful Paint
  cls: number;        // Cumulative Layout Shift
  fid: number;        // First Input Delay
  
  // Loading metrics
  domContentLoaded: number;
  fullyLoaded: number;
  totalRequests: number;
  totalSize: number;
  
  // Resource breakdown
  htmlSize: number;
  cssSize: number;
  jsSize: number;
  imageSize: number;
  fontSize: number;
  
  // Cache performance
  cacheHitRatio: number;
  compressionRatio: number;
}

export interface Recommendation {
  type: 'critical' | 'important' | 'minor';
  category: 'images' | 'css' | 'js' | 'caching' | 'compression' | 'fonts';
  title: string;
  description: string;
  impact: number; // Estimated performance improvement (0-100)
  effort: 'low' | 'medium' | 'high';
}

export interface Issue {
  severity: 'error' | 'warning' | 'info';
  resource: string;
  message: string;
  fix?: string;
}

/**
 * Conduct comprehensive performance audit
 */
export const auditPerformance = async (): Promise<PerformanceAuditResult> => {
  const metrics = await collectDetailedMetrics();
  const recommendations = generateRecommendations(metrics);
  const issues = detectIssues(metrics);
  const score = calculateOverallScore(metrics);
  const grade = getPerformanceGrade(score);
  
  return {
    score,
    grade,
    metrics,
    recommendations,
    issues
  };
};

/**
 * Collect detailed performance metrics
 */
const collectDetailedMetrics = async (): Promise<PerformanceMetrics> => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const paint = performance.getEntriesByType('paint');
  
  // Calculate resource sizes by type
  const resourceBreakdown = analyzeResources(resources);
  
  return {
    // Core Web Vitals
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    lcp: await measureLCP(),
    cls: await measureCLS(),
    fid: await measureFID(),
    
    // Loading metrics
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    fullyLoaded: navigation.loadEventEnd - navigation.fetchStart,
    totalRequests: resources.length,
    totalSize: resources.reduce((total, resource) => total + (resource.transferSize || 0), 0),
    
    // Resource breakdown
    htmlSize: resourceBreakdown.html,
    cssSize: resourceBreakdown.css,
    jsSize: resourceBreakdown.js,
    imageSize: resourceBreakdown.images,
    fontSize: resourceBreakdown.fonts,
    
    // Performance ratios
    cacheHitRatio: calculateCacheHitRatio(resources),
    compressionRatio: calculateCompressionRatio(resources)
  };
};

/**
 * Analyze resources by type and size
 */
const analyzeResources = (resources: PerformanceResourceTiming[]) => {
  const breakdown = {
    html: 0,
    css: 0,
    js: 0,
    images: 0,
    fonts: 0,
    other: 0
  };
  
  resources.forEach(resource => {
    const size = resource.transferSize || 0;
    const url = resource.name;
    
    if (url.match(/\.html?$/)) breakdown.html += size;
    else if (url.match(/\.css$/)) breakdown.css += size;
    else if (url.match(/\.js$/)) breakdown.js += size;
    else if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) breakdown.images += size;
    else if (url.match(/\.(woff|woff2|ttf|otf|eot)$/)) breakdown.fonts += size;
    else breakdown.other += size;
  });
  
  return breakdown;
};

/**
 * Measure Largest Contentful Paint
 */
const measureLCP = (): Promise<number> => {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry ? lastEntry.startTime : 0);
        observer.disconnect();
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(0);
        }, 10000);
      } catch {
        resolve(0);
      }
    } else {
      resolve(0);
    }
  });
};

/**
 * Measure Cumulative Layout Shift
 */
const measureCLS = (): Promise<number> => {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] });
        // Resolve after page load
        window.addEventListener('load', () => {
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1000);
        });
      } catch {
        resolve(0);
      }
    } else {
      resolve(0);
    }
  });
};

/**
 * Measure First Input Delay
 */
const measureFID = (): Promise<number> => {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        resolve(firstEntry ? (firstEntry as any).processingStart - firstEntry.startTime : 0);
        observer.disconnect();
      });
      
      try {
        observer.observe({ entryTypes: ['first-input'] });
        // Timeout for pages without user interaction
        setTimeout(() => {
          observer.disconnect();
          resolve(0);
        }, 30000);
      } catch {
        resolve(0);
      }
    } else {
      resolve(0);
    }
  });
};

/**
 * Calculate cache hit ratio
 */
const calculateCacheHitRatio = (resources: PerformanceResourceTiming[]): number => {
  if (resources.length === 0) return 0;
  
  const cachedResources = resources.filter(resource => 
    resource.transferSize === 0 || // From cache
    resource.transferSize < resource.decodedBodySize * 0.1 // Highly compressed (likely cached)
  );
  
  return (cachedResources.length / resources.length) * 100;
};

/**
 * Calculate compression ratio
 */
const calculateCompressionRatio = (resources: PerformanceResourceTiming[]): number => {
  const totalDecodedSize = resources.reduce((total, resource) => 
    total + (resource.decodedBodySize || 0), 0);
  const totalTransferSize = resources.reduce((total, resource) => 
    total + (resource.transferSize || 0), 0);
  
  if (totalDecodedSize === 0) return 0;
  return ((totalDecodedSize - totalTransferSize) / totalDecodedSize) * 100;
};

/**
 * Generate performance recommendations
 */
const generateRecommendations = (metrics: PerformanceMetrics): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Image optimization
  if (metrics.imageSize > 1024 * 1024) { // > 1MB
    recommendations.push({
      type: 'critical',
      category: 'images',
      title: 'Optimize images',
      description: `Images total ${(metrics.imageSize / 1024 / 1024).toFixed(1)}MB. Consider WebP format and responsive images.`,
      impact: 30,
      effort: 'medium'
    });
  }
  
  // JavaScript bundle size
  if (metrics.jsSize > 512 * 1024) { // > 512KB
    recommendations.push({
      type: 'important',
      category: 'js',
      title: 'Reduce JavaScript bundle size',
      description: `JavaScript bundle is ${(metrics.jsSize / 1024).toFixed(0)}KB. Consider code splitting and tree shaking.`,
      impact: 25,
      effort: 'high'
    });
  }
  
  // CSS optimization
  if (metrics.cssSize > 100 * 1024) { // > 100KB
    recommendations.push({
      type: 'important',
      category: 'css',
      title: 'Optimize CSS',
      description: `CSS size is ${(metrics.cssSize / 1024).toFixed(0)}KB. Remove unused styles and minify.`,
      impact: 15,
      effort: 'medium'
    });
  }
  
  // Caching
  if (metrics.cacheHitRatio < 70) {
    recommendations.push({
      type: 'important',
      category: 'caching',
      title: 'Improve caching strategy',
      description: `Cache hit ratio is ${metrics.cacheHitRatio.toFixed(0)}%. Add proper cache headers.`,
      impact: 20,
      effort: 'low'
    });
  }
  
  // Compression
  if (metrics.compressionRatio < 50) {
    recommendations.push({
      type: 'critical',
      category: 'compression',
      title: 'Enable compression',
      description: `Compression ratio is ${metrics.compressionRatio.toFixed(0)}%. Enable gzip/brotli compression.`,
      impact: 35,
      effort: 'low'
    });
  }
  
  // Core Web Vitals
  if (metrics.fcp > 1800) {
    recommendations.push({
      type: 'critical',
      category: 'css',
      title: 'Improve First Contentful Paint',
      description: `FCP is ${metrics.fcp.toFixed(0)}ms. Inline critical CSS and preload key resources.`,
      impact: 40,
      effort: 'medium'
    });
  }
  
  if (metrics.lcp > 2500) {
    recommendations.push({
      type: 'critical',
      category: 'images',
      title: 'Improve Largest Contentful Paint',
      description: `LCP is ${metrics.lcp.toFixed(0)}ms. Optimize hero images and reduce server response time.`,
      impact: 35,
      effort: 'medium'
    });
  }
  
  return recommendations.sort((a, b) => b.impact - a.impact);
};

/**
 * Detect performance issues
 */
const detectIssues = (metrics: PerformanceMetrics): Issue[] => {
  const issues: Issue[] = [];
  
  // Render-blocking resources
  const renderBlockingCSS = document.querySelectorAll('link[rel="stylesheet"]:not([media])');
  if (renderBlockingCSS.length > 2) {
    issues.push({
      severity: 'warning',
      resource: 'CSS',
      message: `${renderBlockingCSS.length} render-blocking CSS files found`,
      fix: 'Inline critical CSS and load non-critical CSS asynchronously'
    });
  }
  
  // Large images without optimization
  const images = document.querySelectorAll('img:not([loading="lazy"])');
  if (images.length > 5) {
    issues.push({
      severity: 'warning',
      resource: 'Images',
      message: `${images.length} images without lazy loading`,
      fix: 'Add loading="lazy" to non-critical images'
    });
  }
  
  // Missing WebP support
  const jpegImages = document.querySelectorAll('img[src*=".jpg"], img[src*=".jpeg"]');
  if (jpegImages.length > 0) {
    issues.push({
      severity: 'info',
      resource: 'Images',
      message: `${jpegImages.length} JPEG images could be converted to WebP`,
      fix: 'Use WebP format with JPEG fallback in <picture> elements'
    });
  }
  
  return issues;
};

/**
 * Calculate overall performance score
 */
const calculateOverallScore = (metrics: PerformanceMetrics): number => {
  let score = 100;
  
  // Core Web Vitals (50% weight)
  if (metrics.fcp > 3000) score -= 20;
  else if (metrics.fcp > 1800) score -= 10;
  
  if (metrics.lcp > 4000) score -= 20;
  else if (metrics.lcp > 2500) score -= 10;
  
  if (metrics.cls > 0.25) score -= 15;
  else if (metrics.cls > 0.1) score -= 8;
  
  // Resource sizes (30% weight)
  if (metrics.totalSize > 2 * 1024 * 1024) score -= 15; // > 2MB
  else if (metrics.totalSize > 1 * 1024 * 1024) score -= 8; // > 1MB
  
  // Optimization (20% weight)
  if (metrics.cacheHitRatio < 50) score -= 10;
  else if (metrics.cacheHitRatio < 70) score -= 5;
  
  if (metrics.compressionRatio < 30) score -= 10;
  else if (metrics.compressionRatio < 50) score -= 5;
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Get performance grade from score
 */
const getPerformanceGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

/**
 * Export performance report
 */
export const exportPerformanceReport = (audit: PerformanceAuditResult): string => {
  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    score: audit.score,
    grade: audit.grade,
    metrics: audit.metrics,
    recommendations: audit.recommendations,
    issues: audit.issues,
    userAgent: navigator.userAgent,
    connection: (navigator as any).connection ? {
      effectiveType: (navigator as any).connection.effectiveType,
      downlink: (navigator as any).connection.downlink,
      rtt: (navigator as any).connection.rtt
    } : null
  };
  
  return JSON.stringify(report, null, 2);
};