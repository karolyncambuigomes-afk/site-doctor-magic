import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon, Edit3 } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  onEditClick?: () => void;
  showEditButton?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Imagem",
  placeholder = "URL da imagem ou faça upload",
  onEditClick,
  showEditButton = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `models/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      
      // Auto-sync logic for different image types
      const shouldSync = label?.toLowerCase().includes('banner') || 
                        label?.toLowerCase().includes('hero') ||
                        label?.toLowerCase().includes('model') ||
                        label?.toLowerCase().includes('blog') ||
                        label?.toLowerCase().includes('main');
      
      let finalUrl = imageUrl;
      
      if (shouldSync) {
        try {
          console.log('🎯 Auto-sync eligible image detected, syncing to local...');
          
          // Determine image type from context
          let imageType = 'general';
          if (label?.toLowerCase().includes('banner') || label?.toLowerCase().includes('hero')) {
            imageType = 'hero-banner';
          } else if (label?.toLowerCase().includes('model')) {
            imageType = 'model-main';
          } else if (label?.toLowerCase().includes('blog')) {
            imageType = 'blog';
          } else if (label?.toLowerCase().includes('static')) {
            imageType = 'static';
          }
          
          toast({
            title: "Processando",
            description: "Otimizando imagem para melhor performance..."
          });
          
          // Call Edge Function to fix image to local with proper parameters
          const { data: syncData, error: syncError } = await supabase.functions
            .invoke('sync-image-to-local', {
              body: { 
                imageUrl: imageUrl,
                imageType: imageType,
                itemId: `upload-${Date.now()}`,
                tableName: imageType === 'hero-banner' ? 'site_content' : 
                          imageType === 'model-main' ? 'models' :
                          imageType === 'blog' ? 'blog_posts' : 'site_content',
                fieldName: imageType === 'hero-banner' ? 'image_url_local_desktop' : 'image',
                itemName: `${imageType}-${Date.now()}`,
                altText: `Optimized ${imageType} image`
              }
            });

          if (syncError) {
            console.error('❌ Sync error:', syncError);
            // Continue with original URL if sync fails
          } else if (syncData?.success) {
            console.log('✅ Image fixed successfully:', syncData);
            // Use local path as final URL
            finalUrl = syncData.localUrl;
            
            toast({
              title: "Sucesso",
              description: "Imagem otimizada e salva localmente com cache refresh"
            });

            // Auto-purge cache and refresh SW after successful sync
            try {
              const { performCompleteImageRefresh } = await import('@/utils/cacheManager');
              await performCompleteImageRefresh({ 
                patterns: [`${imageType}-*`, '/images/*'], 
                force: true 
              });
              console.log('✅ Cache purged and SW refreshed after image sync');
            } catch (cacheError) {
              console.warn('⚠️ Cache refresh failed:', cacheError);
            }
          }
        } catch (syncError) {
          console.error('❌ Error syncing to local:', syncError);
          // Continue with original URL if sync fails
        }
      }
      
      setPreviewUrl(finalUrl);
      onChange(finalUrl);

      if (!shouldSync) {
        toast({
          title: "Sucesso",
          description: "Imagem enviada com sucesso"
        });
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar imagem",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de imagem",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "Arquivo muito grande. Máximo 10MB",
        variant: "destructive"
      });
      return;
    }

    uploadFile(file);
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onChange('');
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          type="url"
          value={value || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* File Upload */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Escolher arquivo
                  </>
                )}
              </span>
            </Button>
          </Label>
        </div>
        
        <div className="text-sm text-muted-foreground">
          ou digite a URL acima
        </div>
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{previewUrl}</p>
              <p className="text-xs text-muted-foreground">Preview da imagem</p>
            </div>
          </div>
          
          {/* Preview Image */}
          <div className="mt-2 relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className={`max-w-full h-32 object-cover rounded-lg border transition-all duration-200 ${
                showEditButton ? 'cursor-pointer hover:brightness-75' : ''
              }`}
              onClick={showEditButton ? onEditClick : undefined}
              onError={() => {
                toast({
                  title: "Erro",
                  description: "Não foi possível carregar a imagem",
                  variant: "destructive"
                });
              }}
            />
            {showEditButton && onEditClick && (
              <div 
                className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center rounded-lg cursor-pointer"
                onClick={onEditClick}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-gray-700"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};