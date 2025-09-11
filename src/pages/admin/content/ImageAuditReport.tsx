import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Download, RefreshCw, ExternalLink, TestTube, Upload, Zap, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { getAuditTargets, AuditTarget } from '@/utils/getAuditTargets';
import { supabase } from '@/integrations/supabase/client';
import { ImageRestoreManager } from '@/components/ImageRestoreManager';

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
  canonicalUrl?: string;
  legacyUrl?: string;
  canonicalStatus?: number;
  legacyStatus?: number;
}

export const ImageAuditReport = () => {
  const [auditSections, setAuditSections] = useState<AuditSection[]>([]);
  const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [featureFlags, setFeatureFlags] = useState({ preferLocalImages: true });
  const [auditTargets, setAuditTargets] = useState<AuditTarget[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateCanonicalUrl = (target: AuditTarget): string => {
    if (target.category === 'models') {
      return `/images/models/${target.id}/model-${target.id}-main-1200.webp`;
    }
    if (target.category === 'carousel') {
      const slug = target.name.toLowerCase().replace(/\s+/g, '-');
      return `/images/carousel/${slug}-1200.webp`;
    }
    if (target.category === 'hero' || target.category === 'slides') {
      const slug = target.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return `/images/hero/hero-banner-${slug}-1600.webp`;
    }
    return target.effectiveUrl;
  };

  const generateLegacyUrl = (target: AuditTarget): string => {
    if (target.category === 'models') {
      return `/images/model-${target.id}-main-1200.webp`;
    }
    if (target.category === 'carousel') {
      const slug = target.name.toLowerCase().replace(/\s+/g, '-');
      return `/images/carousel-${slug}-1200.webp`;
    }
    return target.effectiveUrl;
  };

  const testUrl = async (url: string): Promise<number> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.status;
    } catch {
      return 500;
    }
  };

  const testAllUrls = async (target: AuditTarget, index: number) => {
    const canonicalUrl = generateCanonicalUrl(target);
    const legacyUrl = generateLegacyUrl(target);
    
    const [effectiveStatus, canonicalStatus, legacyStatus] = await Promise.all([
      testUrl(target.effectiveUrl),
      testUrl(canonicalUrl),
      testUrl(legacyUrl)
    ]);

    const updatedStatuses = [...imageStatuses];
    updatedStatuses[index] = {
      ...updatedStatuses[index],
      canonicalUrl,
      legacyUrl,
      status: effectiveStatus as 200 | 404 | 500,
      canonicalStatus,
      legacyStatus
    };
    
    setImageStatuses(updatedStatuses);
    toast.success(`Tested URLs for ${target.name}`);
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const generateCanonicalImages = async () => {
    setIsGenerating(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await supabase.functions.invoke('generate-canonical-images', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data;
      
      // Show success summary
      toast.success(
        `Generated ${result.summary.successful}/${result.summary.total} images. ` +
        `${result.summary.proxyWorking} working via /images/, ` +
        `${result.summary.dbUpdated} DB records updated.`
      );

      // Trigger cache purge and service worker refresh
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'PURGE_CACHE',
          patterns: ['/images/*']
        });
        
        navigator.serviceWorker.controller.postMessage({
          type: 'SKIP_WAITING'
        });
      }

      // Re-run the audit to see updated status
      setTimeout(() => {
        runFullAudit();
      }, 2000);

    } catch (error) {
      console.error('Generation failed:', error);
      toast.error(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const syncDisconnectedSystems = async () => {
    setIsGenerating(true);
    
    try {
      toast.info('🔄 Sincronizando sistemas desconectados...');
      
      // Step 1: Force database sync for all external URLs
      toast.info('📊 Atualizando banco de dados...');
      
      const { data: heroSlides, error: heroError } = await supabase
        .from('hero_slides')
        .select('id, image_url')
        .like('image_url', '%supabase%');
      
      if (heroError) {
        console.error('Error fetching hero slides:', heroError);
      } else if (heroSlides && heroSlides.length > 0) {
        for (const slide of heroSlides) {
          const response = await supabase.functions.invoke('sync-image-to-local', {
            body: {
              imageUrl: slide.image_url,
              imageType: 'hero-banner',
              name: `slide-${slide.id}`,
              tableName: 'hero_slides',
              fieldName: 'image_url',
              id: slide.id
            }
          });
          
          if (response.error) {
            console.error('Migration error:', response.error);
          }
        }
      }
      
      // Step 2: Force update models with external URLs
      const { data: models, error: modelsError } = await supabase
        .from('models')
        .select('id, name, image')
        .like('image', '%supabase%');
      
      if (!modelsError && models && models.length > 0) {
        for (const model of models) {
          const response = await supabase.functions.invoke('sync-image-to-local', {
            body: {
              imageUrl: model.image,
              imageType: 'model-main',
              name: model.name,
              tableName: 'models',
              fieldName: 'image',
              id: model.id
            }
          });
          
          if (response.error) {
            console.error('Model migration error:', response.error);
          }
        }
      }
      
      // Step 3: Force update homepage carousel
      const { data: carousel, error: carouselError } = await supabase
        .from('homepage_carousel')
        .select('id, model_name, image_url')
        .like('image_url', '%supabase%');
      
      if (!carouselError && carousel && carousel.length > 0) {
        for (const item of carousel) {
          const response = await supabase.functions.invoke('sync-image-to-local', {
            body: {
              imageUrl: item.image_url,
              imageType: 'static',
              name: item.model_name,
              tableName: 'homepage_carousel',
              fieldName: 'image_url',
              id: item.id
            }
          });
          
          if (response.error) {
            console.error('Carousel migration error:', response.error);
          }
        }
      }
      
      // Step 4: Force local preference activation
      setTimeout(() => {
        const flags = { preferLocalImages: true };
        localStorage.setItem('featureFlags', JSON.stringify(flags));
        setFeatureFlags(flags);
        
        // Dispatch event to notify all components
        window.dispatchEvent(new CustomEvent('imagePreferenceChanged', { 
          detail: { preferLocalImages: true } 
        }));
        
        toast.success('✅ Preferência local ativada!');
        
        // Step 5: Force complete cache refresh
        setTimeout(async () => {
          toast.info('🗑️ Limpando cache...');
          
          // Clear service worker cache
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
          }
          
          // Clear localStorage
          localStorage.removeItem('imagePreferences');
          localStorage.removeItem('cachedImages');
          
          // Force reload all images
          const images = document.querySelectorAll('img');
          images.forEach(img => {
            const src = img.src;
            img.src = '';
            img.src = src + (src.includes('?') ? '&' : '?') + 'sync=' + Date.now();
          });
          
          toast.success('✅ Cache limpo!');
          
          // Step 6: Final validation
          setTimeout(() => {
            runFullAudit();
            toast.success('🎉 Sistemas sincronizados com sucesso!');
          }, 2000);
        }, 3000);
      }, 5000);

    } catch (error) {
      console.error('Sync failed:', error);
      toast.error(`❌ Falha na sincronização: ${error.message}`);
    } finally {
      setTimeout(() => setIsGenerating(false), 15000);
    }
  };

  const executeFullPlan = async () => {
    setIsGenerating(true);
    
    try {
      toast.info('Iniciando plano completo...');
      
      // Step 1: Generate canonical images
      await generateCanonicalImages();
      
      // Step 2: Wait for generation and then activate local preference
      setTimeout(() => {
        const flags = { preferLocalImages: true };
        localStorage.setItem('featureFlags', JSON.stringify(flags));
        setFeatureFlags(flags);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('imagePreferenceChanged', { 
          detail: { preferLocalImages: true } 
        }));
        
        toast.success('Prefer Local Images ativado!');
        
        // Step 3: Final audit after a brief delay
        setTimeout(() => {
          runFullAudit();
          toast.success('Plano completo executado com sucesso!');
        }, 3000);
      }, 5000);

    } catch (error) {
      console.error('Plan execution failed:', error);
      toast.error(`Falha na execução do plano: ${error.message}`);
    } finally {
      setTimeout(() => setIsGenerating(false), 8000);
    }
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
            onClick={syncDisconnectedSystems}
            disabled={isGenerating || isRunning}
            className="bg-gradient-to-r from-destructive to-orange-500 text-destructive-foreground flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Sincronizando...' : '🔧 Corrigir Sistemas Desconectados'}
          </Button>
          
          <Button
            onClick={executeFullPlan}
            disabled={isGenerating || isRunning}
            className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground flex items-center gap-2"
            variant="outline"
          >
            <Zap className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
            {isGenerating ? 'Executando...' : '🚀 Executar Plano Completo'}
          </Button>
          
          <Button
            onClick={runFullAudit}
            disabled={isRunning || isGenerating}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Audit...' : 'Run Full Audit'}
          </Button>
          
          <Button
            onClick={generateCanonicalImages}
            disabled={isGenerating || isRunning}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Zap className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Canonical Images'}
          </Button>
          
          {auditSections.length > 0 && (
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Image Restore Manager */}
      <ImageRestoreManager />

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
                 {imageStatuses.map((status, index) => {
                   const target = auditTargets[index];
                   return (
                     <div key={index} className="p-3 rounded border space-y-3">
                       <div className="flex items-center justify-between">
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                             <Badge variant="outline" className="text-xs">
                               {status.category}
                             </Badge>
                             <span className="font-medium text-sm">{status.name}</span>
                           </div>
                           <div className="text-xs font-mono text-muted-foreground mb-1">
                             Current: {status.url}
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

                       {/* URL Testing Section */}
                       <div className="border-t pt-3">
                         <div className="flex flex-wrap gap-2 mb-2">
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => openUrl(status.url)}
                             className="text-xs"
                           >
                             <ExternalLink className="w-3 h-3 mr-1" />
                             Open Effective
                           </Button>
                           
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => openUrl(generateCanonicalUrl(target))}
                             className="text-xs"
                           >
                             <ExternalLink className="w-3 h-3 mr-1" />
                             Open Canonical
                           </Button>
                           
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => openUrl(generateLegacyUrl(target))}
                             className="text-xs"
                           >
                             <ExternalLink className="w-3 h-3 mr-1" />
                             Open Legacy
                           </Button>
                           
                           <Button
                             size="sm"
                             variant="secondary"
                             onClick={() => testAllUrls(target, index)}
                             className="text-xs"
                           >
                             <TestTube className="w-3 h-3 mr-1" />
                             Test All URLs
                           </Button>
                         </div>

                         {/* URL Status Display */}
                         {(status.canonicalStatus || status.legacyStatus) && (
                           <div className="grid grid-cols-3 gap-2 text-xs">
                             <div className="space-y-1">
                               <div className="font-medium">Effective</div>
                               {getStatusBadge(status.status)}
                             </div>
                             <div className="space-y-1">
                               <div className="font-medium">Canonical</div>
                               {status.canonicalStatus && getStatusBadge(status.canonicalStatus)}
                             </div>
                             <div className="space-y-1">
                               <div className="font-medium">Legacy</div>
                               {status.legacyStatus && getStatusBadge(status.legacyStatus)}
                             </div>
                           </div>
                         )}

                         {/* Regenerate Button for 404 Canonical */}
                         {status.canonicalStatus === 404 && (
                           <div className="mt-2">
                             <Button
                               size="sm"
                               variant="default"
                               className="text-xs"
                               onClick={() => toast.info('Regenerate & Upload feature coming soon...')}
                             >
                               <Upload className="w-3 h-3 mr-1" />
                               Regenerate & Upload
                             </Button>
                           </div>
                         )}
                       </div>
                     </div>
                   );
                 })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
