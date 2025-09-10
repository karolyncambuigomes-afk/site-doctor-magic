import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Link, Loader2, ExternalLink, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

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

      // Get current model data
      const { data: model, error: fetchError } = await supabase
        .from('models')
        .select('gallery_external_urls, gallery_local_urls')
        .eq('id', modelId)
        .single();

      if (fetchError) {
        console.error('❌ GalleryUpload: Error fetching model:', fetchError);
        throw fetchError;
      }

      console.log('📊 GalleryUpload: Current model data:', {
        external: model?.gallery_external_urls?.length || 0,
        local: model?.gallery_local_urls?.length || 0
      });

      // Update arrays with new image
      const updatedExternalUrls = [...(model.gallery_external_urls || []), imageUrl];
      const updatedLocalUrls = [...(model.gallery_local_urls || [])];
      
      // Update database immediately for preview
      const { error: updateError } = await supabase
        .from('models')
        .update({
          gallery_external_urls: updatedExternalUrls
        })
        .eq('id', modelId);

      if (updateError) {
        console.error('❌ GalleryUpload: Database update failed:', updateError);
        throw updateError;
      }

      console.log('✅ GalleryUpload: Database updated successfully');

      // Update parent component with immediate preview
      onGalleryUpdate(updatedExternalUrls, updatedLocalUrls);

      toast({
        title: "Image uploaded",
        description: "Processing optimization in background...",
        variant: "default"
      });

      // Start optimization in background
      const newIndex = updatedExternalUrls.length - 1;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gallery Management</h3>
        <div className="text-sm text-muted-foreground">
          {currentGallery.length} images
        </div>
      </div>

      {/* Upload Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Add Image by URL</h4>
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
            <h4 className="font-medium">Add Image by File</h4>
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

      {/* Gallery Grid */}
      {currentGallery.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-4">Current Gallery</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentGallery.map((imageUrl, index) => {
                const localUrl = localGallery[index];
                const isOptimizing = optimizingStates[index];
                const displayUrl = localUrl || imageUrl;
                
                return (
                  <div key={index} className="relative group">
                    <img
                      src={displayUrl}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {isOptimizing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                    {localUrl && !isOptimizing && (
                      <div className="absolute top-2 left-2">
                        <Check className="h-5 w-5 text-green-500 bg-white rounded-full p-1" />
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2">
                      <a 
                        href={displayUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4 text-white bg-black/50 rounded p-1" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {currentGallery.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No images in gallery. Add your first image above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};