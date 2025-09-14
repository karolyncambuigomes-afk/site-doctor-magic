import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { performCompleteImageRefresh } from '@/utils/cacheManager';

interface ImageReprocessorProps {
  currentImageUrl?: string;
  onImageReprocessed?: (localUrl: string) => void;
  section: string;
  disabled?: boolean;
}

interface ProcessingStatus {
  downloading: boolean;
  optimizing: boolean;
  saving: boolean;
  updating: boolean;
  completed: boolean;
  error?: string;
}

export const ImageReprocessor: React.FC<ImageReprocessorProps> = ({
  currentImageUrl,
  onImageReprocessed,
  section,
  disabled = false
}) => {
  const [processing, setProcessing] = useState<ProcessingStatus>({
    downloading: false,
    optimizing: false,
    saving: false,
    updating: false,
    completed: false
  });

  const generateLocalFilename = (section: string, width: number): string => {
    const timestamp = Date.now();
    const slug = section.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `hero-banner-${slug}-${width}.webp`;
  };

  const downloadAndOptimizeImage = async (imageUrl: string): Promise<Blob> => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create canvas for optimization
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Optimize to 1200px width max, maintain aspect ratio
        const maxWidth = 1200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (optimizedBlob) => {
            if (optimizedBlob) {
              resolve(optimizedBlob);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          'image/webp',
          0.85 // High quality WebP
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image for optimization'));
      img.src = URL.createObjectURL(blob);
    });
  };

  const saveImageLocally = async (blob: Blob, filename: string): Promise<string> => {
    try {
      // Convert blob to base64 for edge function
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Call edge function to save image locally
      const { data, error } = await supabase.functions.invoke('sync-image-to-local', {
        body: {
          imageData: base64,
          filename: filename,
          mimeType: 'image/webp'
        }
      });
      
      if (error) throw error;
      
      return `/images/${filename}`;
    } catch (error) {
      console.error('Failed to save image locally:', error);
      throw error;
    }
  };

  const reprocessImage = async () => {
    if (!currentImageUrl) {
      toast.error('Nenhuma imagem encontrada para reprocessar');
      return;
    }

    try {
      setProcessing({
        downloading: true,
        optimizing: false,
        saving: false,
        updating: false,
        completed: false
      });

      toast.info('🔄 Iniciando reprocessamento da imagem...');

      // Step 1: Download image
      console.log('📥 [REPROCESS] Downloading image:', currentImageUrl);
      setProcessing(prev => ({ ...prev, downloading: true }));
      
      const optimizedBlob = await downloadAndOptimizeImage(currentImageUrl);
      
      // Step 2: Optimize (already done in download step)
      setProcessing(prev => ({ 
        ...prev, 
        downloading: false, 
        optimizing: true 
      }));
      
      toast.info('⚡ Otimizando imagem para WebP...');
      
      // Step 3: Save locally
      setProcessing(prev => ({ 
        ...prev, 
        optimizing: false, 
        saving: true 
      }));
      
      const filename = generateLocalFilename(section, 1200);
      console.log('💾 [REPROCESS] Saving as:', filename);
      
      toast.info('💾 Salvando imagem otimizada localmente...');
      
      const localUrl = await saveImageLocally(optimizedBlob, filename);
      
      // Step 4: Update database
      setProcessing(prev => ({ 
        ...prev, 
        saving: false, 
        updating: true 
      }));
      
      toast.info('🗄️ Atualizando banco de dados...');
      
      const updateField = section.includes('desktop') ? 'image_url_local_desktop' :
                         section.includes('mobile') ? 'image_url_local_mobile' :
                         'image_url_local_fallback';
      
      const { error: updateError } = await supabase
        .from('site_content')
        .update({ [updateField]: localUrl })
        .eq('section', section);
      
      if (updateError) throw updateError;
      
      // Step 5: Refresh cache
      setProcessing(prev => ({ 
        ...prev, 
        updating: false 
      }));
      
      toast.info('🧹 Limpando cache...');
      await performCompleteImageRefresh({ patterns: ['hero-banner-*', 'banner-*'] });
      
      // Complete
      setProcessing({
        downloading: false,
        optimizing: false,
        saving: false,
        updating: false,
        completed: true
      });
      
      toast.success(`✅ Imagem reprocessada com sucesso! Salva como: ${filename}`);
      
      // Notify parent component
      onImageReprocessed?.(localUrl);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setProcessing(prev => ({ ...prev, completed: false }));
      }, 3000);
      
    } catch (error) {
      console.error('❌ [REPROCESS] Failed:', error);
      setProcessing({
        downloading: false,
        optimizing: false,
        saving: false,
        updating: false,
        completed: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      toast.error(`❌ Falha no reprocessamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const isProcessing = processing.downloading || processing.optimizing || processing.saving || processing.updating;
  const hasError = !!processing.error;

  return (
    <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <RefreshCw className="h-4 w-4 text-purple-600" />
          Reprocessador de Imagem
          {processing.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
          {hasError && <AlertCircle className="h-4 w-4 text-red-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status indicators */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant={processing.downloading ? "default" : processing.completed ? "secondary" : "outline"}>
            📥 Download
          </Badge>
          <Badge variant={processing.optimizing ? "default" : processing.completed ? "secondary" : "outline"}>
            ⚡ WebP
          </Badge>
          <Badge variant={processing.saving ? "default" : processing.completed ? "secondary" : "outline"}>
            💾 Local
          </Badge>
          <Badge variant={processing.updating ? "default" : processing.completed ? "secondary" : "outline"}>
            🗄️ Database
          </Badge>
        </div>

        {/* Error message */}
        {hasError && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            ❌ {processing.error}
          </div>
        )}

        {/* Current image info */}
        {currentImageUrl && (
          <div className="text-xs text-gray-600 bg-white p-2 rounded border">
            <strong>Imagem atual:</strong> {currentImageUrl.length > 60 ? `${currentImageUrl.substring(0, 60)}...` : currentImageUrl}
          </div>
        )}

        {/* Action button */}
        <Button
          onClick={reprocessImage}
          disabled={disabled || isProcessing || !currentImageUrl}
          size="sm"
          className="w-full"
          variant={processing.completed ? "secondary" : "default"}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
              {processing.downloading && 'Baixando...'}
              {processing.optimizing && 'Otimizando...'}
              {processing.saving && 'Salvando...'}
              {processing.updating && 'Atualizando...'}
            </>
          ) : processing.completed ? (
            <>
              <CheckCircle className="h-3 w-3 mr-2" />
              Reprocessado com Sucesso
            </>
          ) : (
            <>
              <Download className="h-3 w-3 mr-2" />
              Reprocessar como WebP Local
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500">
          💡 <strong>Função:</strong> Baixa a imagem atual, otimiza para WebP, salva em /public/images/ e atualiza o banco para usar a versão local.
        </p>
      </CardContent>
    </Card>
  );
};