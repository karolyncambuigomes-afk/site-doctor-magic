import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageEditor } from '@/components/ImageEditor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Crop, Download, Sparkles } from 'lucide-react';

interface EnhancedImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: number;
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  value,
  onChange,
  label = "Imagem do Post",
  placeholder = "URL da imagem ou faça upload",
  aspectRatio = 16/9
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageEdit = () => {
    if (value) {
      setIsEditorOpen(true);
    }
  };

  const handleEditorSave = async (editedBlob: Blob) => {
    try {
      setIsUploading(true);
      
      // Generate unique filename for edited image
      const timestamp = Date.now();
      const fileName = `blog-edited-${timestamp}.png`;
      const filePath = `blog/${fileName}`;

      // Upload edited image to Supabase
      const { error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(filePath, editedBlob);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);

      // Auto-sync blog image to local
      let finalImageUrl = data.publicUrl;
      try {
        const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-image-to-local', {
          body: { 
            imageUrl: data.publicUrl,
            imageType: 'blog',
            category: label?.toLowerCase().includes('blog') ? 'content' : 'general'
          }
        });

        if (syncError) {
          console.error('Blog image sync error:', syncError);
        } else if (syncData?.success) {
          console.log('✅ Blog image synced to local:', syncData.localPath);
          finalImageUrl = syncData.localPath;
        }
      } catch (syncError) {
        console.error('Blog image sync function error:', syncError);
      }

      onChange(finalImageUrl);
      setIsEditorOpen(false);
      
      toast({
        title: "Sucesso!",
        description: finalImageUrl !== data.publicUrl ? "Imagem editada e otimizada" : "Imagem editada e salva com sucesso",
      });
    } catch (error) {
      console.error('Error saving edited image:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar imagem editada",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      
      <ImageUpload
        value={value}
        onChange={onChange}
        label=""
        placeholder={placeholder}
        showEditButton={!!value}
        onEditClick={handleImageEdit}
      />

      {value && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleImageEdit}
            className="flex-1"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Editar Imagem
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(value, '_blank')}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Ver Original
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-2">
          <Crop className="h-3 w-3 mt-0.5 text-primary" />
          <div>
            <p className="font-medium">Dicas para melhor resultado:</p>
            <ul className="mt-1 space-y-1">
              <li>• Resolução recomendada: 1200x675px (16:9)</li>
              <li>• Formato: JPG ou PNG</li>
              <li>• Tamanho máximo: 10MB</li>
              <li>• Use o editor para ajustar crop e posicionamento</li>
            </ul>
          </div>
        </div>
      </div>

      {value && isEditorOpen && (
        <ImageEditor
          imageUrl={value}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleEditorSave}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
};