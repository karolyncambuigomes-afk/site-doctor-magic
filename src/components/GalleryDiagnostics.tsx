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

export const GalleryDiagnostics: React.FC = () => {
  const [models, setModels] = useState<ModelDiagnostic[]>([]);
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Gallery Diagnostics
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