import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Trash2, 
  Globe, 
  Crown, 
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MultipleImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  maxFiles?: number;
  visibility: 'public' | 'members_only' | 'admin_only';
}

interface SelectedImage {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesUploaded,
  maxFiles = 10,
  visibility
}) => {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Tipo de arquivo inválido. Selecione apenas imagens.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'Arquivo muito grande. Máximo 10MB por imagem.';
    }
    return null;
  };

  const addImages = (files: FileList) => {
    const validFiles: File[] = [];
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      
      if (error) {
        errorCount++;
        continue;
      }

      if (selectedImages.length + validFiles.length >= maxFiles) {
        toast({
          title: "Limite atingido",
          description: `Máximo ${maxFiles} imagens por vez`,
          variant: "destructive"
        });
        break;
      }

      validFiles.push(file);
    }

    if (errorCount > 0) {
      toast({
        title: "Alguns arquivos foram ignorados",
        description: `${errorCount} arquivo(s) inválido(s) foram ignorados`,
        variant: "destructive"
      });
    }

    const newImages: SelectedImage[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setSelectedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearAll = () => {
    selectedImages.forEach(img => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setSelectedImages([]);
  };

  const uploadSingleImage = async (image: SelectedImage): Promise<string> => {
    // Update status to uploading
    setSelectedImages(prev => 
      prev.map(img => 
        img.id === image.id 
          ? { ...img, status: 'uploading', progress: 10 } 
          : img
      )
    );

    try {
      // Generate unique filename
      const fileExt = image.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `models/${fileName}`;

      // Update progress
      setSelectedImages(prev => 
        prev.map(img => 
          img.id === image.id 
            ? { ...img, progress: 30 } 
            : img
        )
      );

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(filePath, image.file);

      if (uploadError) {
        throw uploadError;
      }

      // Update progress
      setSelectedImages(prev => 
        prev.map(img => 
          img.id === image.id 
            ? { ...img, progress: 70 } 
            : img
        )
      );

      // Get public URL
      const { data } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      // Update progress and status
      setSelectedImages(prev => 
        prev.map(img => 
          img.id === image.id 
            ? { ...img, status: 'success', progress: 100, url: imageUrl } 
            : img
        )
      );

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setSelectedImages(prev => 
        prev.map(img => 
          img.id === image.id 
            ? { ...img, status: 'error', progress: 0, error: errorMessage } 
            : img
        )
      );
      
      throw error;
    }
  };

  const uploadAllImages = async () => {
    if (selectedImages.length === 0) return;

    setIsUploading(true);
    const uploadPromises: Promise<string>[] = [];
    const successUrls: string[] = [];

    try {
      // Upload images in batches of 3
      const batchSize = 3;
      for (let i = 0; i < selectedImages.length; i += batchSize) {
        const batch = selectedImages.slice(i, i + batchSize);
        const batchPromises = batch.map(uploadSingleImage);
        
        try {
          const batchResults = await Promise.allSettled(batchPromises);
          batchResults.forEach(result => {
            if (result.status === 'fulfilled') {
              successUrls.push(result.value);
            }
          });
        } catch (error) {
          console.error('Batch upload error:', error);
        }
      }

      const successCount = successUrls.length;
      const errorCount = selectedImages.length - successCount;

      if (successCount > 0) {
        onImagesUploaded(successUrls);
        toast({
          title: "Upload concluído",
          description: `${successCount} imagem(ns) enviada(s) com sucesso${errorCount > 0 ? ` (${errorCount} com erro)` : ''}`,
        });
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Erro no upload",
          description: "Nenhuma imagem foi enviada com sucesso",
          variant: "destructive"
        });
      }

    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addImages(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      addImages(files);
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-600" />;
      case 'members_only':
        return <Crown className="w-4 h-4 text-amber-600" />;
      case 'admin_only':
        return <Lock className="w-4 h-4 text-red-600" />;
    }
  };

  const getVisibilityLabel = () => {
    switch (visibility) {
      case 'public':
        return 'Públicas';
      case 'members_only':
        return 'Apenas Membros';
      case 'admin_only':
        return 'Apenas Admin';
    }
  };

  const successCount = selectedImages.filter(img => img.status === 'success').length;
  const errorCount = selectedImages.filter(img => img.status === 'error').length;
  const pendingCount = selectedImages.filter(img => img.status === 'pending').length;
  const uploadingCount = selectedImages.filter(img => img.status === 'uploading').length;

  return (
    <div className="space-y-4">
      {/* Visibility Badge */}
      <div className="flex items-center gap-2">
        {getVisibilityIcon()}
        <Badge variant="outline" className="text-sm">
          Upload em lote: {getVisibilityLabel()}
        </Badge>
      </div>

      {/* Drag & Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          Arraste e solte suas imagens aqui
        </h3>
        <p className="text-muted-foreground mb-4">
          ou clique no botão abaixo para selecioná-las
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Selecionar Múltiplas Imagens
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          Máximo {maxFiles} imagens • 10MB por imagem • JPG, PNG, WEBP
        </p>
      </div>

      {/* Selected Images Grid */}
      {selectedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              Imagens Selecionadas ({selectedImages.length})
            </h4>
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <Button
                  onClick={uploadAllImages}
                  disabled={isUploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Todas ({pendingCount})
                </Button>
              )}
              <Button
                variant="outline"
                onClick={clearAll}
                disabled={isUploading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Todas
              </Button>
            </div>
          </div>

          {/* Status Summary */}
          {(successCount > 0 || errorCount > 0 || uploadingCount > 0) && (
            <div className="flex gap-4 text-sm">
              {uploadingCount > 0 && (
                <span className="text-blue-600">
                  {uploadingCount} enviando...
                </span>
              )}
              {successCount > 0 && (
                <span className="text-green-600">
                  {successCount} enviadas
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-red-600">
                  {errorCount} com erro
                </span>
              )}
            </div>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedImages.map((image) => (
              <div key={image.id} className="relative group">
                {/* Image Preview */}
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Status Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors">
                  {image.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg">
                      <div className="w-8 h-8 animate-spin rounded-full border-2 border-white border-t-transparent mb-2" />
                      <Progress value={image.progress} className="w-16 h-1" />
                    </div>
                  )}
                  
                  {image.status === 'success' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                  
                  {image.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-lg">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(image.id)}
                  disabled={image.status === 'uploading'}
                >
                  <X className="w-3 h-3" />
                </Button>

                {/* File Name */}
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {image.file.name}
                </p>

                {/* Error Message */}
                {image.status === 'error' && image.error && (
                  <p className="text-xs text-red-600 mt-1">
                    {image.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};