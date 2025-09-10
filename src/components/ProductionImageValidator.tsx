import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle, RefreshCw, CheckCircle, Globe, HardDrive, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { performCompleteImageRefresh } from '@/utils/cacheManager';

interface ImageValidationResult {
  category: string;
  items: Array<{
    id: string;
    name: string;
    effectiveUrl: string;
    status: 'local-200' | 'local-404' | 'external-200' | 'external-404' | 'error';
    responseTime: number;
    reprocessed?: boolean;
  }>;
  summary: {
    total: number;
    local200: number;
    local404: number;
    external200: number;
    external404: number;
    errors: number;
    reprocessed: number;
  };
}

interface FeatureFlags {
  preferLocalImages: boolean;
}

export const ProductionImageValidator: React.FC = () => {
  const [validationResults, setValidationResults] = useState<ImageValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({ preferLocalImages: true });
  const [hasIssues, setHasIssues] = useState(false);

  // Validate actual image URLs with HTTP requests
  const validateImageUrl = async (url: string): Promise<{ status: string; responseTime: number }> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const status = url.includes('/images/') ? 'local-200' : 'external-200';
        return { status, responseTime };
      } else {
        const status = url.includes('/images/') ? 'local-404' : 'external-404';
        return { status, responseTime };
      }
    } catch (error) {
      console.error('❌ Error validating image:', url, error);
      return { status: 'error', responseTime: Date.now() - startTime };
    }
  };

  const reprocessImage = async (item: any, category: string): Promise<boolean> => {
    try {
      console.log(`🔧 Reprocessing ${category} image:`, item.name);
      
      // Call fix-image-to-local Edge Function
      const { data: result, error } = await supabase.functions.invoke('fix-image-to-local', {
        body: {
          imageUrl: item.effectiveUrl,
          category: category.toLowerCase(),
          itemId: item.id,
          tableName: category === 'Models' ? 'models' : 
                    category === 'Carousel' ? 'homepage_carousel' : 'site_content',
          fieldName: category === 'Models' ? 'image' : 
                     category === 'Carousel' ? 'image_url' : 'image_url_local_desktop',
          itemName: `${category.toLowerCase()}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
          altText: `Optimized ${category} image: ${item.name}`
        }
      });

      if (error) throw error;
      
      if (result?.success) {
        console.log(`✅ Successfully reprocessed ${category}:`, item.name);
        return true;
      } else {
        console.error(`❌ Failed to reprocess ${category}:`, result?.error);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error reprocessing ${category}:`, error);
      return false;
    }
  };

  const runProductionValidation = async () => {
    setIsValidating(true);
    
    try {
      console.log('🔍 Starting production image validation...');
      
      const results: ImageValidationResult[] = [];
      
      // Validate Hero Banner
      const heroImages = document.querySelectorAll('[data-hero-image]') as NodeListOf<HTMLImageElement>;
      const heroItems = [];
      
      for (let i = 0; i < heroImages.length; i++) {
        const img = heroImages[i];
        const effectiveUrl = img.currentSrc || img.src;
        const imageType = img.getAttribute('data-image-type') || 'unknown';
        
        const { status, responseTime } = await validateImageUrl(effectiveUrl);
        
        heroItems.push({
          id: `hero-${i}`,
          name: `Banner ${imageType}`,
          effectiveUrl,
          status,
          responseTime
        });
      }
      
      const heroSummary = calculateSummary(heroItems);
      results.push({
        category: 'Hero Banner',
        items: heroItems,
        summary: heroSummary
      });

      // Validate Models
      const modelImages = document.querySelectorAll('[data-model-image]') as NodeListOf<HTMLImageElement>;
      const modelItems = [];
      
      for (let i = 0; i < modelImages.length; i++) {
        const img = modelImages[i];
        const effectiveUrl = img.currentSrc || img.src;
        const modelName = img.getAttribute('data-model-name') || `Model ${i + 1}`;
        const modelId = img.closest('[data-model-id]')?.getAttribute('data-model-id') || `model-${i}`;
        
        const { status, responseTime } = await validateImageUrl(effectiveUrl);
        
        modelItems.push({
          id: modelId,
          name: modelName,
          effectiveUrl,
          status,
          responseTime
        });
      }
      
      const modelSummary = calculateSummary(modelItems);
      results.push({
        category: 'Models',
        items: modelItems,
        summary: modelSummary
      });

      // Validate Carousel
      const carouselImages = document.querySelectorAll('[data-carousel-image]') as NodeListOf<HTMLImageElement>;
      const carouselItems = [];
      
      for (let i = 0; i < carouselImages.length; i++) {
        const img = carouselImages[i];
        const effectiveUrl = img.currentSrc || img.src;
        const modelName = img.getAttribute('data-model-name') || `Carousel ${i + 1}`;
        const carouselId = img.closest('[data-carousel-id]')?.getAttribute('data-carousel-id') || `carousel-${i}`;
        
        const { status, responseTime } = await validateImageUrl(effectiveUrl);
        
        carouselItems.push({
          id: carouselId,
          name: modelName,
          effectiveUrl,
          status,
          responseTime
        });
      }
      
      const carouselSummary = calculateSummary(carouselItems);
      results.push({
        category: 'Carousel',
        items: carouselItems,
        summary: carouselSummary
      });

      setValidationResults(results);
      
      // Check if there are any issues
      const totalIssues = results.reduce((sum, cat) => 
        sum + cat.summary.local404 + cat.summary.external404 + cat.summary.errors, 0
      );
      setHasIssues(totalIssues > 0);
      
      // Auto-disable preferLocalImages if there are local 404s
      if (results.some(cat => cat.summary.local404 > 0)) {
        setFeatureFlags(prev => ({ ...prev, preferLocalImages: false }));
        toast.warning('⚠️ Local images have issues. Temporarily switched to external fallback.');
      }
      
      console.log('✅ Production validation complete', { results, totalIssues });
      
    } catch (error) {
      console.error('❌ Production validation failed:', error);
      toast.error('Failed to validate production images');
    } finally {
      setIsValidating(false);
    }
  };

  const autoFixIssues = async () => {
    setIsReprocessing(true);
    
    try {
      toast.info('🔧 Auto-fixing image issues...');
      let totalReprocessed = 0;
      
      for (const category of validationResults) {
        const itemsToFix = category.items.filter(item => 
          item.status === 'local-404' || item.status === 'external-404' || item.status === 'error'
        );
        
        for (const item of itemsToFix) {
          const success = await reprocessImage(item, category.category);
          if (success) {
            item.reprocessed = true;
            totalReprocessed++;
          }
          
          // Small delay between reprocessing
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      // Refresh cache after reprocessing
      await performCompleteImageRefresh({ 
        patterns: ['/images/*', 'hero-*', 'model-*', 'carousel-*'], 
        force: true 
      });
      
      toast.success(`✅ Auto-fix complete! ${totalReprocessed} images reprocessed.`);
      
      // Re-validate after fixing
      setTimeout(() => {
        runProductionValidation();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Auto-fix failed:', error);
      toast.error('Auto-fix failed');
    } finally {
      setIsReprocessing(false);
    }
  };

  const calculateSummary = (items: any[]) => {
    return {
      total: items.length,
      local200: items.filter(i => i.status === 'local-200').length,
      local404: items.filter(i => i.status === 'local-404').length,
      external200: items.filter(i => i.status === 'external-200').length,
      external404: items.filter(i => i.status === 'external-404').length,
      errors: items.filter(i => i.status === 'error').length,
      reprocessed: items.filter(i => i.reprocessed).length
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'local-200': return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      case 'external-200': return { icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'local-404': 
      case 'external-404': return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' };
      case 'error': return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' };
      default: return { icon: HardDrive, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'local-200': return { variant: 'default' as const, text: '🟢 Local OK' };
      case 'external-200': return { variant: 'secondary' as const, text: '🔵 External OK' };
      case 'local-404': return { variant: 'destructive' as const, text: '🔴 Local 404' };
      case 'external-404': return { variant: 'destructive' as const, text: '🔴 External 404' };
      case 'error': return { variant: 'outline' as const, text: '🟠 Error' };
      default: return { variant: 'outline' as const, text: '⚪ Unknown' };
    }
  };

  const updateFeatureFlag = async (key: keyof FeatureFlags, value: boolean) => {
    setFeatureFlags(prev => ({ ...prev, [key]: value }));
    
    // Save to localStorage for persistence
    localStorage.setItem('featureFlags', JSON.stringify({ ...featureFlags, [key]: value }));
    
    toast.success(`Feature "${key}" ${value ? 'enabled' : 'disabled'}`);
  };

  useEffect(() => {
    // Load feature flags from localStorage
    const saved = localStorage.getItem('featureFlags');
    if (saved) {
      try {
        setFeatureFlags(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load feature flags:', error);
      }
    }
    
    // Auto-validate on mount
    runProductionValidation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Image Resolution Settings
          </CardTitle>
          <CardDescription>
            Control how images are resolved and displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="prefer-local">Prefer Local Images</Label>
              <p className="text-sm text-muted-foreground">
                Prioritize local optimized images over external URLs
              </p>
            </div>
            <Switch
              id="prefer-local"
              checked={featureFlags.preferLocalImages}
              onCheckedChange={(checked) => updateFeatureFlag('preferLocalImages', checked)}
            />
          </div>
          
          {!featureFlags.preferLocalImages && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-sm text-amber-800">
                ⚠️ Local image preference is disabled. Using external fallback strategy.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Production Validation */}
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
                Production Image Validation
              </CardTitle>
              <CardDescription>
                Real-time HTTP validation of effective image URLs in production
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={runProductionValidation}
                disabled={isValidating}
                variant="outline"
                size="sm"
              >
                {isValidating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Validate
              </Button>
              {hasIssues && (
                <Button
                  onClick={autoFixIssues}
                  disabled={isReprocessing}
                  variant="destructive"
                  size="sm"
                >
                  {isReprocessing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mr-2" />
                  )}
                  Auto-Fix Issues
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {validationResults.length > 0 ? (
            <div className="space-y-6">
              {validationResults.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{category.category}</h4>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="default">✅ {category.summary.local200 + category.summary.external200}</Badge>
                      {category.summary.local404 + category.summary.external404 > 0 && (
                        <Badge variant="destructive">❌ {category.summary.local404 + category.summary.external404}</Badge>
                      )}
                      {category.summary.reprocessed > 0 && (
                        <Badge variant="outline">🔧 {category.summary.reprocessed} fixed</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    {category.items.slice(0, 5).map((item, idx) => {
                      const statusInfo = getStatusIcon(item.status);
                      const badge = getStatusBadge(item.status);
                      
                      return (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-card">
                          <div className={`p-1 rounded-full ${statusInfo.bg}`}>
                            <statusInfo.icon className={`w-3 h-3 ${statusInfo.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{item.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.effectiveUrl}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.responseTime}ms
                          </div>
                          <Badge variant={badge.variant} className="text-xs">
                            {badge.text}
                          </Badge>
                          {item.reprocessed && (
                            <Badge variant="outline" className="text-xs">🔧 Fixed</Badge>
                          )}
                        </div>
                      );
                    })}
                    {category.items.length > 5 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{category.items.length - 5} more items
                      </div>
                    )}
                  </div>
                  
                  {category !== validationResults[validationResults.length - 1] && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Click "Validate" to check production image status
            </div>
          )}
          
          {hasIssues && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-800">
                🔴 Issues detected in production. Run auto-fix to reprocess and update problematic images.
              </div>
            </div>
          )}

          {!hasIssues && validationResults.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                ✅ All production images are working correctly!
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};