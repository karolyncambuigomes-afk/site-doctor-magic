import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ModelDiagnostic {
  id: string;
  name: string;
  gallery_external_urls: string[];
  gallery_local_urls: string[];
  effectiveGallery: string[];
  localStatuses: { [key: string]: number };
  externalStatuses: { [key: string]: number };
}

interface BannerDiagnostic {
  section: string;
  title?: string;
  image_url_desktop?: string;
  image_url_mobile?: string;
  image_url?: string;
  image_url_local_desktop?: string;
  image_url_local_mobile?: string;
  image_url_local_fallback?: string;
  statuses: { [key: string]: number };
}

export const GalleryDiagnostics: React.FC = () => {
  const [models, setModels] = useState<ModelDiagnostic[]>([]);
  const [banners, setBanners] = useState<BannerDiagnostic[]>([]);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState<{ [key: string]: boolean }>({});
  

  const checkImageStatus = async (url: string): Promise<number> => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD', 
        cache: 'no-store' 
      });
      return response.status;
    } catch {
      return 0;
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      // Fetch all models with gallery data
      const { data: modelsData, error } = await supabase
        .from('models')
        .select('id, name, gallery_external_urls, gallery_local_urls')
        .order('name');

      if (error) throw error;

      const diagnostics: ModelDiagnostic[] = [];

      for (const model of modelsData || []) {
        const externalUrls = model.gallery_external_urls || [];
        const localUrls = model.gallery_local_urls || [];
        const effectiveGallery = [...localUrls, ...externalUrls].filter(Boolean);

        // Check status of local URLs
        const localStatuses: { [key: string]: number } = {};
        for (const url of localUrls) {
          localStatuses[url] = await checkImageStatus(url);
        }

        // Check status of external URLs  
        const externalStatuses: { [key: string]: number } = {};
        for (const url of externalUrls) {
          externalStatuses[url] = await checkImageStatus(url);
        }

        diagnostics.push({
          id: model.id,
          name: model.name,
          gallery_external_urls: externalUrls,
          gallery_local_urls: localUrls,
          effectiveGallery,
          localStatuses,
          externalStatuses
        });
      }

      setModels(diagnostics);

      // Fetch banner data from site_content
      const { data: bannersData, error: bannersError } = await supabase
        .from('site_content')
        .select(`
          section, title, 
          image_url_desktop, image_url_mobile, image_url,
          image_url_local_desktop, image_url_local_mobile, image_url_local_fallback
        `)
        .order('section');

      if (bannersError) throw bannersError;

      const bannerDiagnostics: BannerDiagnostic[] = [];

      for (const banner of bannersData || []) {
        const statuses: { [key: string]: number } = {};
        
        // Check all URLs
        const urlsToCheck = [
          banner.image_url_desktop,
          banner.image_url_mobile, 
          banner.image_url,
          banner.image_url_local_desktop,
          banner.image_url_local_mobile,
          banner.image_url_local_fallback
        ].filter(Boolean);

        for (const url of urlsToCheck) {
          statuses[url] = await checkImageStatus(url);
        }

        bannerDiagnostics.push({
          ...banner,
          statuses
        });
      }

      setBanners(bannerDiagnostics);
      toast.success('Diagnostics completed');
    } catch (error) {
      console.error('Diagnostics error:', error);
      toast.error('Failed to run diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const fixGalleryForModel = async (modelId: string) => {
    setFixing(prev => ({ ...prev, [modelId]: true }));
    
    try {
      const model = models.find(m => m.id === modelId);
      if (!model) return;

      let fixCount = 0;
      
      // Fix external URLs that don't have local equivalents
      for (let i = 0; i < model.gallery_external_urls.length; i++) {
        const externalUrl = model.gallery_external_urls[i];
        const expectedLocalUrl = `/images/models/${modelId}/gallery-${i}-1200.webp`;
        
        // Check if local version exists
        const localStatus = await checkImageStatus(expectedLocalUrl);
        
        if (localStatus !== 200) {
          try {
            const { data: fixResult } = await supabase.functions.invoke('fix-one-gallery', {
              body: {
                modelId: modelId,
                sourceUrl: externalUrl,
                index: i,
                dry_run: false
              }
            });

            if (fixResult?.ok) {
              fixCount++;
            }
          } catch (fixError) {
            console.error(`Failed to fix image ${i}:`, fixError);
          }
        }
      }

      toast.success(`Fixed ${fixCount} gallery images for ${model.name}`);
      
      // Re-run diagnostics for this model
      await runDiagnostics();
      
    } catch (error) {
      console.error('Fix error:', error);
      toast.error('Failed to fix gallery');
    } finally {
      setFixing(prev => ({ ...prev, [modelId]: false }));
    }
  };

  const fixBannerImage = async (sectionId: string, sourceUrl: string, imageType: 'desktop' | 'mobile' | 'fallback') => {
    const fixKey = `${sectionId}-${imageType}`;
    setFixing(prev => ({ ...prev, [fixKey]: true }));
    
    try {
      const { data: fixResult } = await supabase.functions.invoke('fix-banner-image', {
        body: {
          sectionId,
          sourceUrl,
          imageType,
          dry_run: false
        }
      });

      if (fixResult?.success) {
        toast.success(`Fixed banner image for ${sectionId} (${imageType})`);
        await runDiagnostics();
      } else {
        toast.error(`Failed to fix banner image: ${fixResult?.error}`);
      }
      
    } catch (error) {
      console.error('Banner fix error:', error);
      toast.error('Failed to fix banner image');
    } finally {
      setFixing(prev => ({ ...prev, [fixKey]: false }));
    }
  };

  const getStatusIcon = (status: number) => {
    if (status === 200) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 404) return <XCircle className="w-4 h-4 text-red-500" />;
    if (status === 0) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-orange-500" />;
  };

  const getStatusColor = (status: number) => {
    if (status === 200) return 'bg-green-100 text-green-800';
    if (status === 404) return 'bg-red-100 text-red-800';
    if (status === 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Banner Diagnostics
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runDiagnostics}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Running diagnostics...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map(banner => (
                <div key={banner.section} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{banner.section}</h3>
                      <p className="text-sm text-muted-foreground">
                        {banner.title || 'Banner Section'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Desktop Image */}
                    {(banner.image_url_desktop || banner.image_url_local_desktop) && (
                      <div className="border rounded p-3">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          Desktop Image
                          {banner.image_url_desktop && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fixBannerImage(banner.section, banner.image_url_desktop!, 'desktop')}
                              disabled={fixing[`${banner.section}-desktop`]}
                            >
                              {fixing[`${banner.section}-desktop`] ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : 'Fix'}
                            </Button>
                          )}
                        </h4>
                        <div className="space-y-1">
                          {banner.image_url_local_desktop && (
                            <div className="flex items-center gap-2 text-xs">
                              {getStatusIcon(banner.statuses[banner.image_url_local_desktop])}
                              <Badge variant="outline" className={getStatusColor(banner.statuses[banner.image_url_local_desktop])}>
                                {banner.statuses[banner.image_url_local_desktop]}
                              </Badge>
                              <span className="text-green-600 font-medium">LOCAL:</span>
                              <span className="truncate">{banner.image_url_local_desktop}</span>
                            </div>
                          )}
                          {banner.image_url_desktop && (
                            <div className="flex items-center gap-2 text-xs">
                              {getStatusIcon(banner.statuses[banner.image_url_desktop])}
                              <Badge variant="outline" className={getStatusColor(banner.statuses[banner.image_url_desktop])}>
                                {banner.statuses[banner.image_url_desktop]}
                              </Badge>
                              <span className="text-blue-600 font-medium">EXTERNAL:</span>
                              <span className="truncate">{banner.image_url_desktop}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mobile Image */}
                    {(banner.image_url_mobile || banner.image_url_local_mobile) && (
                      <div className="border rounded p-3">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          Mobile Image
                          {banner.image_url_mobile && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fixBannerImage(banner.section, banner.image_url_mobile!, 'mobile')}
                              disabled={fixing[`${banner.section}-mobile`]}
                            >
                              {fixing[`${banner.section}-mobile`] ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : 'Fix'}
                            </Button>
                          )}
                        </h4>
                        <div className="space-y-1">
                          {banner.image_url_local_mobile && (
                            <div className="flex items-center gap-2 text-xs">
                              {getStatusIcon(banner.statuses[banner.image_url_local_mobile])}
                              <Badge variant="outline" className={getStatusColor(banner.statuses[banner.image_url_local_mobile])}>
                                {banner.statuses[banner.image_url_local_mobile]}
                              </Badge>
                              <span className="text-green-600 font-medium">LOCAL:</span>
                              <span className="truncate">{banner.image_url_local_mobile}</span>
                            </div>
                          )}
                          {banner.image_url_mobile && (
                            <div className="flex items-center gap-2 text-xs">
                              {getStatusIcon(banner.statuses[banner.image_url_mobile])}
                              <Badge variant="outline" className={getStatusColor(banner.statuses[banner.image_url_mobile])}>
                                {banner.statuses[banner.image_url_mobile]}
                              </Badge>
                              <span className="text-blue-600 font-medium">EXTERNAL:</span>
                              <span className="truncate">{banner.image_url_mobile}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* General/Fallback Image */}
                    {(banner.image_url || banner.image_url_local_fallback) && (
                      <div className="border rounded p-3">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          General Image
                          {banner.image_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fixBannerImage(banner.section, banner.image_url!, 'fallback')}
                              disabled={fixing[`${banner.section}-fallback`]}
                            >
                              {fixing[`${banner.section}-fallback`] ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : 'Fix'}
                            </Button>
                          )}
                        </h4>
                        <div className="space-y-1">
                          {banner.image_url_local_fallback && (
                            <div className="flex items-center gap-2 text-xs">
                              {getStatusIcon(banner.statuses[banner.image_url_local_fallback])}
                              <Badge variant="outline" className={getStatusColor(banner.statuses[banner.image_url_local_fallback])}>
                                {banner.statuses[banner.image_url_local_fallback]}
                              </Badge>
                              <span className="text-green-600 font-medium">LOCAL:</span>
                              <span className="truncate">{banner.image_url_local_fallback}</span>
                            </div>
                          )}
                          {banner.image_url && (
                            <div className="flex items-center gap-2 text-xs">
                              {getStatusIcon(banner.statuses[banner.image_url])}
                              <Badge variant="outline" className={getStatusColor(banner.statuses[banner.image_url])}>
                                {banner.statuses[banner.image_url]}
                              </Badge>
                              <span className="text-blue-600 font-medium">EXTERNAL:</span>
                              <span className="truncate">{banner.image_url}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Gallery Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle>Model Gallery Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Running diagnostics...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {models.map(model => (
                <div key={model.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {model.effectiveGallery.length} total images
                      </p>
                    </div>
                    <Button
                      onClick={() => fixGalleryForModel(model.id)}
                      disabled={fixing[model.id]}
                      size="sm"
                    >
                      {fixing[model.id] ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Fix Gallery
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Local URLs ({model.gallery_local_urls.length})</h4>
                      <div className="space-y-1">
                        {model.gallery_local_urls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {getStatusIcon(model.localStatuses[url])}
                            <Badge variant="outline" className={getStatusColor(model.localStatuses[url])}>
                              {model.localStatuses[url]}
                            </Badge>
                            <span className="truncate">{url}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">External URLs ({model.gallery_external_urls.length})</h4>
                      <div className="space-y-1">
                        {model.gallery_external_urls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {getStatusIcon(model.externalStatuses[url])}
                            <Badge variant="outline" className={getStatusColor(model.externalStatuses[url])}>
                              {model.externalStatuses[url]}
                            </Badge>
                            <span className="truncate">{url}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};