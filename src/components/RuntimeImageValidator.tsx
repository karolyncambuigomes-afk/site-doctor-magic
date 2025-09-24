import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { performCompleteImageRefresh } from '@/utils/cacheManager';

interface RuntimeImageStatus {
  category: string;
  items: Array<{
    name: string;
    effectiveUrl: string;
    status: 'local' | 'external' | 'error';
  }>;
}

export const RuntimeImageValidator: React.FC = () => {
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeImageStatus[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [hasIssues, setHasIssues] = useState(false);

  const validateRuntimeImages = async () => {
    setIsValidating(true);
    
    try {
      console.log('🔍 Starting runtime image validation...');
      
      const status: RuntimeImageStatus[] = [];
      
      // Check Hero Banner images
      const heroImages = document.querySelectorAll('[data-hero-image]') as NodeListOf<HTMLImageElement>;
      const heroStatus: RuntimeImageStatus = {
        category: 'Hero Banner',
        items: []
      };
      
      heroImages.forEach((img, idx) => {
        const effectiveUrl = img.currentSrc || img.src;
        heroStatus.items.push({
          name: `Banner ${idx + 1}`,
          effectiveUrl,
          status: effectiveUrl.includes('/images/') ? 'local' : 
                  effectiveUrl.includes('supabase.co') ? 'external' : 'error'
        });
      });
      status.push(heroStatus);

      // Check Model images
      const modelImages = document.querySelectorAll('[data-model-image]') as NodeListOf<HTMLImageElement>;
      const modelStatus: RuntimeImageStatus = {
        category: 'Models',
        items: []
      };
      
      modelImages.forEach((img) => {
        const modelName = img.getAttribute('data-model-name') || 'Unknown';
        const effectiveUrl = img.currentSrc || img.src;
        modelStatus.items.push({
          name: modelName,
          effectiveUrl,
          status: effectiveUrl.includes('/images/') ? 'local' : 
                  effectiveUrl.includes('supabase.co') ? 'external' : 'error'
        });
      });
      status.push(modelStatus);

      // Check Carousel images
      const carouselImages = document.querySelectorAll('[data-carousel-image]') as NodeListOf<HTMLImageElement>;
      const carouselStatus: RuntimeImageStatus = {
        category: 'Carousel',
        items: []
      };
      
      carouselImages.forEach((img) => {
        const modelName = img.getAttribute('data-model-name') || 'Unknown';
        const effectiveUrl = img.currentSrc || img.src;
        carouselStatus.items.push({
          name: modelName,
          effectiveUrl,
          status: effectiveUrl.includes('/images/') ? 'local' : 
                  effectiveUrl.includes('supabase.co') ? 'external' : 'error'
        });
      });
      status.push(carouselStatus);

      // Check Blog images
      const blogImages = document.querySelectorAll('[data-blog-image]') as NodeListOf<HTMLImageElement>;
      const blogStatus: RuntimeImageStatus = {
        category: 'Blog',
        items: []
      };
      
      blogImages.forEach((img) => {
        const postTitle = img.getAttribute('data-post-title') || 'Unknown';
        const effectiveUrl = img.currentSrc || img.src;
        blogStatus.items.push({
          name: postTitle,
          effectiveUrl,
          status: effectiveUrl.includes('/images/') ? 'local' : 
                  effectiveUrl.includes('supabase.co') ? 'external' : 'error'
        });
      });
      status.push(blogStatus);

      setRuntimeStatus(status);
      
      // Check if there are any issues
      const issues = status.some(cat => 
        cat.items.some(item => item.status !== 'local')
      );
      setHasIssues(issues);
      
      console.log('✅ Runtime validation complete', { status, hasIssues: issues });
      
    } catch (error) {
      console.error('❌ Runtime validation failed:', error);
      toast.error('Failed to validate runtime images');
    } finally {
      setIsValidating(false);
    }
  };

  const autoFixRemainingIssues = async () => {
    try {
      toast.info('🔧 Auto-fixing remaining image issues...');
      
      // Navigate to bulk migration for auto-fix
      window.location.href = '/admin/content/bulk-migration';
      
    } catch (error) {
      console.error('❌ Auto-fix failed:', error);
      toast.error('Auto-fix failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'local': return 'bg-green-500';
      case 'external': return 'bg-red-500';
      case 'error': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'local': return { variant: 'secondary' as const, text: '🟢 Local' };
      case 'external': return { variant: 'destructive' as const, text: '🔴 External' };
      case 'error': return { variant: 'outline' as const, text: '🟠 Error' };
      default: return { variant: 'outline' as const, text: '⚪ Unknown' };
    }
  };

  useEffect(() => {
    // Auto-validate on mount
    validateRuntimeImages();
  }, []);

  return (
    <Card className={hasIssues ? 'border-red-200 bg-red-50/50' : 'border-green-200 bg-green-50/50'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {hasIssues ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              Active Runtime Source Monitor
            </CardTitle>
            <CardDescription>
              Real-time validation of effective image URLs loaded in the browser
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={validateRuntimeImages}
              disabled={isValidating}
              variant="outline"
              size="sm"
            >
              {isValidating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
            {hasIssues && (
              <Button
                onClick={autoFixRemainingIssues}
                variant="destructive"
                size="sm"
              >
                Auto-Fix Issues
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {runtimeStatus.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="font-medium text-sm flex items-center gap-2">
                {category.category}
                <Badge variant="outline" className="text-xs">
                  {category.items.length}
                </Badge>
              </div>
              <div className="space-y-1">
                {category.items.slice(0, 4).map((item, idx) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                      <span className="truncate flex-1" title={item.name}>
                        {item.name}
                      </span>
                      <Badge variant={badge.variant} className="ml-auto text-xs">
                        {badge.text}
                      </Badge>
                    </div>
                  );
                })}
                {category.items.length > 4 && (
                  <div className="text-xs text-muted-foreground">
                    +{category.items.length - 4} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {hasIssues && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-red-800">
                🔴 Some images are still using external URLs or have errors. Auto-fix recommended.
              </div>
              <Button
                onClick={autoFixRemainingIssues}
                variant="destructive"
                size="sm"
              >
                Fix All Issues
              </Button>
            </div>
          </div>
        )}

        {!hasIssues && runtimeStatus.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              ✅ All images are using local optimized WebP versions!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};