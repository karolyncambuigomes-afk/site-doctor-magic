import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Image, Images, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { processAnastasiaPhotos } from '@/utils/processAnastasiaPhotos';

const ANASTASIA_ID = 'd851677c-b1cc-43ac-bb9a-a65f83bf9e5b';

export const AnastasiaFixManager: React.FC = () => {
  const [fixingMain, setFixingMain] = useState(false);
  const [fixingGallery, setFixingGallery] = useState(false);
  const [processingAll, setProcessingAll] = useState(false);
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

  // Process all Anastasia photos
  const processAllPhotos = async () => {
    setProcessingAll(true);
    setMainImageStatus('pending');
    setGalleryStatus('pending');
    
    try {
      console.log('🔄 Processing all Anastasia photos...');
      const result = await processAnastasiaPhotos();
      
      if (result.success) {
        setMainImageStatus('success');
        setGalleryStatus('success');
        toast({
          title: "Sucesso!",
          description: "Todas as fotos da Anastasia foram processadas com sucesso",
        });
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Error processing photos:', error);
      setMainImageStatus('error');
      setGalleryStatus('error');
      toast({
        title: "Erro",
        description: "Falha ao processar as fotos",
        variant: "destructive",
      });
    } finally {
      setProcessingAll(false);
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

          {/* Process All Photos */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
            <div className="flex items-center gap-3">
              <Images className="h-5 w-5" />
              <div>
                <div className="font-medium">Processar Todas as Fotos</div>
                <div className="text-sm text-muted-foreground">
                  Corrige foto principal + processa galeria existente
                </div>
              </div>
              {processingAll && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <Button
              onClick={processAllPhotos}
              disabled={processingAll}
              variant="default"
              size="lg"
            >
              {processingAll ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Processar Tudo'
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
          <div>✅ <strong>RECOMENDADO:</strong> Clique em "Processar Tudo" para corrigir automaticamente</div>
          <div>• Processa foto principal (image_url_local_main)</div>
          <div>• Converte fotos da galeria (gallery_external_urls → gallery_local_urls)</div>
          <div>• Verifica se as imagens locais estão acessíveis</div>
          <div className="mt-3 pt-3 border-t">
            <strong>Alternativa manual:</strong> Use os botões individuais acima
          </div>
        </CardContent>
      </Card>
    </div>
  );
};