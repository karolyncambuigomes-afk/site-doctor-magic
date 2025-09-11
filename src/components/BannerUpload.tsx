import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BannerUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  section?: string;
}

export const BannerUpload: React.FC<BannerUploadProps> = ({
  value = '',
  onChange,
  label = 'Banner Image',
  placeholder = 'Enter image URL or upload file',
  section = 'hero'
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${section}-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      console.log('📤 Uploading banner file:', fileName);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      console.log('✅ File uploaded successfully:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;
      console.log('🔗 Generated public URL:', imageUrl);

      // Call sync-image-to-local for optimization
      try {
        console.log('🔄 Starting image optimization...');
        const { data: syncData, error: syncError } = await supabase.functions.invoke(
          'sync-image-to-local', 
          {
            body: {
              imageUrl: imageUrl,
              imageType: 'hero-banner',
              section: section
            }
          }
        );

        if (syncError) {
          console.warn('⚠️ Image optimization failed, using original URL:', syncError);
        } else {
          console.log('✅ Image optimization completed:', syncData);
        }
      } catch (syncError) {
        console.warn('⚠️ Sync function call failed, using original URL:', syncError);
      }

      // Update state with original URL (optimization runs in background)
      setPreviewUrl(imageUrl);
      onChange(imageUrl);

      toast({
        title: "Upload successful",
        description: "Banner image uploaded and optimization started",
      });

    } catch (error) {
      console.error('❌ Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
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
    setPreviewUrl('');
    onChange('');
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="banner-input" className="text-sm font-medium">
        {label}
      </Label>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="banner-input"
            type="text"
            placeholder={placeholder}
            value={previewUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="pr-10"
          />
          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImage}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="relative">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="whitespace-nowrap"
            onClick={() => document.getElementById('banner-file-input')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          <input
            id="banner-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {previewUrl && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="w-3 h-3" />
            <span className="truncate">{previewUrl}</span>
          </div>
          
          <div className="relative rounded-lg border overflow-hidden bg-muted">
            <img
              src={previewUrl}
              alt="Banner preview"
              className="w-full h-32 object-cover"
              onError={(e) => {
                console.error('❌ Image failed to load:', previewUrl);
                e.currentTarget.src = '/placeholder.svg';
              }}
              onLoad={() => {
                console.log('✅ Image loaded successfully:', previewUrl);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};