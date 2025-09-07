import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Video, X, ExternalLink } from 'lucide-react';

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  value = '',
  onChange,
  label = 'Vídeo',
  placeholder = 'URL do vídeo ou faça upload',
  className = ''
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Apenas arquivos MP4, WebM e OGV são suportados",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 50MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('model-images')
        .upload(`videos/${fileName}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('model-images')
        .getPublicUrl(data.path);

      onChange(publicUrl);
      setUrlInput(publicUrl);

      toast({
        title: "Sucesso",
        description: "Vídeo enviado com sucesso"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar vídeo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    onChange(url);
  };

  const clearVideo = () => {
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        {urlInput && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={clearVideo}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload de Vídeo
            </>
          )}
        </Button>
        
        <span className="text-sm text-muted-foreground">
          MP4, WebM, OGV (máx. 50MB)
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Video Preview */}
      {urlInput && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Preview do Vídeo</span>
              {urlInput.startsWith('http') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(urlInput, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
            <video
              src={urlInput}
              controls
              className="w-full max-h-48 rounded-lg bg-muted"
              onError={() => {
                toast({
                  title: "Erro",
                  description: "Não foi possível carregar o vídeo",
                  variant: "destructive"
                });
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};