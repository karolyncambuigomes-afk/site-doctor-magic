import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Link, Loader2, ExternalLink, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { GalleryOrderManager } from './GalleryOrderManager';

interface GalleryUploadProps {
  modelId: string;
  currentGallery: string[];
  localGallery: string[];
  onGalleryUpdate: (external: string[], local: string[]) => void;
}

export const GalleryUpload: React.FC<GalleryUploadProps> = ({
  modelId,
  currentGallery,
  localGallery,
  onGalleryUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [optimizingStates, setOptimizingStates] = useState<{[key: number]: boolean}>({});
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Acesso restrito a administradores
        </p>
      </div>
    );
  }

  const uploadFileToRawStorage = useCallback(async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${modelId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('raw-uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('raw-uploads')
      .getPublicUrl(fileName);

    return publicUrl;
  }, [modelId]);

  const uploadToGallery = useCallback(async (imageUrl: string, isFile: boolean = false) => {
    try {
      setUploading(true);
      console.log('🔄 GalleryUpload: Starting upload process for:', imageUrl);

      // Get current session with proper auth handling
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        throw new Error('No authentication session found');
      }

      console.log('✅ GalleryUpload: Session verified, user ID:', currentSession.user.id);

      // Add to model_gallery table with order_index
      const { data: existingImages } = await supabase
        .from('model_gallery')
        .select('order_index')
        .eq('model_id', modelId)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = existingImages && existingImages.length > 0 
        ? existingImages[0].order_index + 1 
        : 0;

      const { error: insertError } = await supabase
        .from('model_gallery')
        .insert({
          model_id: modelId,
          image_url: imageUrl,
          order_index: nextOrderIndex,
          visibility: 'public' // Default to public
        });

      if (insertError) {
        console.error('❌ GalleryUpload: Database insert failed:', insertError);
        throw insertError;
      }

      console.log('✅ GalleryUpload: Image added to model_gallery successfully');

      // If this is the first image, update the model's main image
      if (nextOrderIndex === 0) {
        const { error: updateMainError } = await supabase
          .from('models')
          .update({ image: imageUrl })
          .eq('id', modelId);

        if (updateMainError) console.warn('Failed to update main image:', updateMainError);
      }

      // Trigger gallery update
      handleGalleryUpdate();

      toast({
        title: "Image uploaded",
        description: "Processing optimization in background...",
        variant: "default"
      });

      // Start optimization in background
      const newIndex = nextOrderIndex;
      setOptimizingStates(prev => ({ ...prev, [newIndex]: true }));
      
      console.log('🚀 GalleryUpload: Starting optimization for index:', newIndex);
      
      try {
        const { data, error } = await supabase.functions.invoke('admin-fix-one-gallery', {
          body: {
            modelId,
            sourceUrl: imageUrl,
            index: newIndex,
            dry_run: false
          },
          headers: {
            'Authorization': `Bearer ${currentSession.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (error) {
          console.error('⚠️ GalleryUpload: Optimization failed:', error);
          toast({
            title: "Optimization failed",
            description: "Image is available but not optimized",
            variant: "default"
          });
        } else {
          console.log('✅ GalleryUpload: Optimization successful:', data);
          
          // Refresh model data to get the optimized URL
          const { data: updatedModel } = await supabase
            .from('models')
            .select('gallery_external_urls, gallery_local_urls')
            .eq('id', modelId)
            .single();

          if (updatedModel) {
            onGalleryUpdate(
              updatedModel.gallery_external_urls || [], 
              updatedModel.gallery_local_urls || []
            );
          }
          
          toast({
            title: "Image optimized",
            description: "Image has been processed and optimized",
            variant: "default"
          });
        }
      } catch (optimizationError) {
        console.error('⚠️ GalleryUpload: Optimization error:', optimizationError);
        toast({
          title: "Optimization failed",
          description: "Image is available but not optimized",
          variant: "default"
        });
      } finally {
        setOptimizingStates(prev => ({ ...prev, [newIndex]: false }));
      }

    } catch (error) {
      console.error('❌ GalleryUpload: Upload failed:', error);
      toast({
        title: "Upload failed",
        description: error.message || 'Failed to upload image',
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [modelId, onGalleryUpdate, toast, setOptimizingStates]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('📁 GalleryUpload: Processing file upload:', file.name);
      
      // Upload to raw-uploads for immediate preview
      const rawUrl = await uploadFileToRawStorage(file);
      console.log('✅ GalleryUpload: File uploaded to raw-uploads:', rawUrl);
      
      // Process through gallery upload
      await uploadToGallery(rawUrl, true);

    } catch (error) {
      console.error('❌ GalleryUpload: File upload error:', error);
      toast({
        title: "File upload failed",
        description: error.message || 'Failed to upload file',
        variant: "destructive"
      });
    }

    // Reset file input
    event.target.value = '';
  }, [uploadFileToRawStorage, uploadToGallery, toast]);

  const handleUrlAdd = useCallback(async () => {
    if (!urlInput.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }

    await uploadToGallery(urlInput.trim());
    setUrlInput('');
  }, [urlInput, uploadToGallery]);

  const removeImage = useCallback(async (index: number) => {
    try {
      const updatedExternalGallery = currentGallery.filter((_, i) => i !== index);
      const updatedLocalGallery = localGallery.filter((_, i) => i !== index);
      
      // Update database
      const { error } = await supabase
        .from('models')
        .update({ 
          gallery_external_urls: updatedExternalGallery,
          gallery_local_urls: updatedLocalGallery
        })
        .eq('id', modelId);

      if (error) throw error;

      onGalleryUpdate(updatedExternalGallery, updatedLocalGallery);
      
      toast({
        title: "Image removed",
        description: "The image has been removed from the gallery",
        variant: "default"
      });
    } catch (error) {
      console.error('❌ GalleryUpload: Remove image error:', error);
      toast({
        title: "Remove failed",
        description: "Failed to remove image",
        variant: "destructive"
      });
    }
  }, [currentGallery, localGallery, modelId, onGalleryUpdate, toast]);

  const handleGalleryUpdate = useCallback(() => {
    // Refresh gallery data by calling parent update
    onGalleryUpdate(currentGallery, localGallery);
  }, [currentGallery, localGallery, onGalleryUpdate]);

  return (
    <div className="space-y-6">
      {/* Gallery Order Management - New sophisticated system */}
      <GalleryOrderManager 
        modelId={modelId} 
        onUpdate={handleGalleryUpdate}
      />

      {/* Upload Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h4 className="font-medium">Add New Images</h4>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Add Image by URL</h5>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={uploading}
              />
              <Button 
                onClick={handleUrlAdd} 
                disabled={uploading || !urlInput.trim()}
              >
                <Link className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-medium">Add Image by File</h5>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button type="button" disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Select File'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};