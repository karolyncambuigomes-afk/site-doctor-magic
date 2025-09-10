import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Image, Images, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ANASTASIA_ID = 'd851677c-b1cc-43ac-bb9a-a65f83bf9e5b';

export const AnastasiaFixManager: React.FC = () => {
  const [fixingMain, setFixingMain] = useState(false);
  const [fixingGallery, setFixingGallery] = useState(false);
  const [mainImageStatus, setMainImageStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [galleryStatus, setGalleryStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const { toast } = useToast();

  // Fix main image using admin-fix-one-image endpoint
  const fixMainImage = async () => {
    setFixingMain(true);
    setMainImageStatus('pending');

    try {
      console.log('🖼️ Fixing Anastasia main image...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authentication session');
      }

      // Call the admin-fix-one-image function
      const { data, error } = await supabase.functions.invoke('admin-fix-one-image', {
        body: {
          entity: 'model',
          id: ANASTASIA_ID,
          dry_run: false
        },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        throw new Error(`Fix image failed: ${error.message}`);
      }

      console.log('✅ Main image fix result:', data);
      setMainImageStatus('success');
      
      toast({
        title: "Main image fixed",
        description: "Anastasia's main image has been processed successfully",
        variant: "default"
      });

      // Validate the local image is accessible
      const localPath = `/images/models/${ANASTASIA_ID}/model-${ANASTASIA_ID}-main-1200.webp`;
      try {
        const response = await fetch(localPath, { method: 'HEAD' });
        if (response.ok) {
          console.log('✅ Local main image is accessible:', localPath);
        } else {
          console.warn('⚠️ Local main image not yet accessible:', response.status);
        }
      } catch (checkError) {
        console.warn('⚠️ Could not validate local image:', checkError);
      }

    } catch (error) {
      console.error('❌ Main image fix failed:', error);
      setMainImageStatus('error');
      toast({
        title: "Main image fix failed",
        description: error.message || 'Failed to fix main image',
        variant: "destructive"
      });
    } finally {
      setFixingMain(false);
    }
  };

  // Add a test gallery image
  const addTestGalleryImage = async () => {
    setFixingGallery(true);
    setGalleryStatus('pending');

    try {
      console.log('🖼️ Adding test gallery image for Anastasia...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authentication session');
      }

      // Example image URL for testing
      const testImageUrl = 'https://images.unsplash.com/photo-1494790108755-2616c5a79e78?q=80&w=400&h=600';

      // First, add to gallery_external_urls for immediate preview
      const { data: model, error: fetchError } = await supabase
        .from('models')
        .select('gallery_external_urls, gallery_local_urls')
        .eq('id', ANASTASIA_ID)
        .single();

      if (fetchError) throw fetchError;

      const updatedExternalUrls = [...(model.gallery_external_urls || []), testImageUrl];
      
      // Update database for immediate preview
      const { error: updateError } = await supabase
        .from('models')
        .update({
          gallery_external_urls: updatedExternalUrls
        })
        .eq('id', ANASTASIA_ID);

      if (updateError) throw updateError;

      console.log('✅ Gallery updated with external URL');

      // Now call admin-fix-one-gallery to optimize
      const { data, error } = await supabase.functions.invoke('admin-fix-one-gallery', {
        body: {
          modelId: ANASTASIA_ID,
          sourceUrl: testImageUrl,
          index: updatedExternalUrls.length - 1,
          dry_run: false
        },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.warn('⚠️ Gallery optimization failed but image is added:', error);
      } else {
        console.log('✅ Gallery optimization result:', data);
      }

      setGalleryStatus('success');
      
      toast({
        title: "Gallery image added",
        description: "Test image has been added to Anastasia's gallery",
        variant: "default"
      });

      // Validate the local gallery image
      const localPath = `/images/models/${ANASTASIA_ID}/gallery-${updatedExternalUrls.length - 1}-1200.webp`;
      setTimeout(async () => {
        try {
          const response = await fetch(localPath, { method: 'HEAD' });
          if (response.ok) {
            console.log('✅ Local gallery image is accessible:', localPath);
          } else {
            console.warn('⚠️ Local gallery image not yet accessible:', response.status);
          }
        } catch (checkError) {
          console.warn('⚠️ Could not validate local gallery image:', checkError);
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Gallery image add failed:', error);
      setGalleryStatus('error');
      toast({
        title: "Gallery image add failed",
        description: error.message || 'Failed to add gallery image',
        variant: "destructive"
      });
    } finally {
      setFixingGallery(false);
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Corrigir Fotos da Anastasia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            ID da Anastasia: {ANASTASIA_ID}
          </div>

          {/* Main Image Fix */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Image className="h-5 w-5" />
              <div>
                <div className="font-medium">Foto Principal</div>
                <div className="text-sm text-muted-foreground">
                  Corrigir imagem principal usando admin-fix-one-image
                </div>
              </div>
              {getStatusIcon(mainImageStatus)}
            </div>
            <Button
              onClick={fixMainImage}
              disabled={fixingMain}
              variant={mainImageStatus === 'success' ? 'outline' : 'default'}
            >
              {fixingMain ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Corrigindo...
                </>
              ) : (
                'Corrigir Principal'
              )}
            </Button>
          </div>

          {/* Gallery Image Test */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Images className="h-5 w-5" />
              <div>
                <div className="font-medium">Foto de Galeria (Teste)</div>
                <div className="text-sm text-muted-foreground">
                  Adicionar uma foto de teste na galeria
                </div>
              </div>
              {getStatusIcon(galleryStatus)}
            </div>
            <Button
              onClick={addTestGalleryImage}
              disabled={fixingGallery}
              variant={galleryStatus === 'success' ? 'outline' : 'default'}
            >
              {fixingGallery ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                'Adicionar Teste'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>1. Clique em "Corrigir Principal" para processar a foto principal</div>
          <div>2. Clique em "Adicionar Teste" para adicionar uma foto na galeria</div>
          <div>3. Verifique se as imagens aparecem corretamente no card da Anastasia</div>
          <div>4. Acesse o perfil da Anastasia para ver as mudanças</div>
        </CardContent>
      </Card>
    </div>
  );
};