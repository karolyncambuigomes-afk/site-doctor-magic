import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Star, Eye, Images } from 'lucide-react';
import { PhotoSelector } from './PhotoSelector';

interface Model {
  id: string;
  name: string;
  image: string | null;
}

interface ModelImage {
  id: string;
  image_url: string;
  model_id: string;
  model_name: string;
  source: 'profile' | 'gallery';
  caption?: string;
  is_in_public_gallery: boolean;
  is_featured: boolean;
  public_gallery_id?: string;
}

export const GalleryManager: React.FC = () => {
  const { toast } = useToast();
  const [modelImages, setModelImages] = useState<ModelImage[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load models
      const { data: models, error: modelsError } = await supabase
        .from('models')
        .select('id, name, image')
        .order('created_at', { ascending: false });

      if (modelsError) throw modelsError;
      setModels(models || []);

      // Load public gallery for checking which images are already public
      const { data: publicGallery, error: publicError } = await supabase
        .from('public_gallery')
        .select('*');

      if (publicError) throw publicError;

      // Build comprehensive image list
      await buildImageList(models || [], publicGallery || []);
    } catch (error) {
      console.error('Error loading gallery data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da galeria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const buildImageList = async (models: Model[], publicGallery: any[]) => {
    const images: ModelImage[] = [];
    
    for (const model of models) {
      // Add main profile image
      if (model.image) {
        const publicItem = publicGallery.find(pg => pg.image_url === model.image);
        images.push({
          id: `profile-${model.id}`,
          image_url: model.image,
          model_id: model.id,
          model_name: model.name,
          source: 'profile',
          is_in_public_gallery: !!publicItem,
          is_featured: publicItem?.is_featured || false,
          public_gallery_id: publicItem?.id
        });
      }
      
      // Add gallery images
      try {
        const { data: galleryData, error } = await supabase
          .from('model_gallery')
          .select('*')
          .eq('model_id', model.id)
          .order('order_index');
        
        if (!error && galleryData) {
          galleryData.forEach(img => {
            const publicItem = publicGallery.find(pg => pg.image_url === img.image_url);
            images.push({
              id: `gallery-${img.id}`,
              image_url: img.image_url,
              model_id: model.id,
              model_name: model.name,
              source: 'gallery',
              caption: img.caption,
              is_in_public_gallery: !!publicItem,
              is_featured: publicItem?.is_featured || false,
              public_gallery_id: publicItem?.id
            });
          });
        }
      } catch (error) {
        console.error('Error loading gallery for model:', model.id, error);
      }
    }
    
    setModelImages(images);
  };

  const togglePublicGallery = async (image: ModelImage) => {
    try {
      if (image.is_in_public_gallery) {
        // Remove from public gallery
        if (image.public_gallery_id) {
          const { error } = await supabase
            .from('public_gallery')
            .delete()
            .eq('id', image.public_gallery_id);

          if (error) throw error;
        }

        // Update local state
        setModelImages(modelImages.map(img => 
          img.id === image.id 
            ? { ...img, is_in_public_gallery: false, is_featured: false, public_gallery_id: undefined }
            : img
        ));

        toast({
          title: "Sucesso",
          description: "Imagem removida da galeria pública"
        });
      } else {
        // Add to public gallery
        const { data, error } = await supabase
          .from('public_gallery')
          .insert([{
            image_url: image.image_url,
            model_id: image.model_id,
            model_name: image.model_name,
            caption: image.caption || '',
            order_index: modelImages.filter(img => img.is_in_public_gallery).length
          }])
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setModelImages(modelImages.map(img => 
          img.id === image.id 
            ? { ...img, is_in_public_gallery: true, public_gallery_id: data.id }
            : img
        ));

        toast({
          title: "Sucesso",
          description: "Imagem adicionada à galeria pública"
        });
      }
    } catch (error) {
      console.error('Error toggling public gallery:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar galeria pública",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (image: ModelImage) => {
    if (!image.is_in_public_gallery || !image.public_gallery_id) return;

    try {
      const { error } = await supabase
        .from('public_gallery')
        .update({ is_featured: !image.is_featured })
        .eq('id', image.public_gallery_id);

      if (error) throw error;

      setModelImages(modelImages.map(img => 
        img.id === image.id 
          ? { ...img, is_featured: !img.is_featured }
          : img
      ));

      toast({
        title: "Sucesso",
        description: `Imagem ${!image.is_featured ? 'marcada como destaque' : 'removida dos destaques'}`
      });
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar destaque",
        variant: "destructive"
      });
    }
  };

  const handleImageClick = (modelId: string) => {
    window.open(`/model/${modelId}`, '_blank');
  };

  const handlePhotoSelection = async (modelId: string, selectedPhotos: string[]) => {
    try {
      // First, remove all existing public gallery entries for this model
      await supabase
        .from('public_gallery')
        .delete()
        .eq('model_id', modelId);

      // If there are selected photos, add them to public gallery
      if (selectedPhotos.length > 0) {
        const model = models.find(m => m.id === modelId);
        if (!model) return;

        const galleryEntries = selectedPhotos.map((imageUrl, index) => ({
          image_url: imageUrl,
          model_id: modelId,
          model_name: model.name,
          caption: '',
          order_index: index,
          is_featured: false
        }));

        const { error } = await supabase
          .from('public_gallery')
          .insert(galleryEntries);

        if (error) throw error;
      }

      // Reload data to reflect changes
      await loadData();

      toast({
        title: "Sucesso",
        description: `Galeria atualizada: ${selectedPhotos.length} fotos selecionadas`
      });
    } catch (error) {
      console.error('Error updating photo selection:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar seleção de fotos",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const publicImages = modelImages.filter(img => img.is_in_public_gallery);
  const featuredImages = publicImages.filter(img => img.is_featured);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Galeria Pública</h2>
          <p className="text-muted-foreground">
            Gerencie quais fotos das modelos aparecem na galeria pública do site
          </p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div>{publicImages.length} fotos na galeria pública</div>
          <div>{featuredImages.length} fotos em destaque</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Fotos das Modelos</CardTitle>
          <CardDescription>
            Use os controles para gerenciar quais fotos aparecem na galeria pública
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Model Selection Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Selecionar fotos por modelo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model) => {
                const modelPublicPhotos = modelImages.filter(img => 
                  img.model_id === model.id && img.is_in_public_gallery
                );
                
                return (
                  <Card key={model.id} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {model.image && (
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {modelPublicPhotos.length} fotos na galeria
                        </p>
                      </div>
                    </div>
                    
                    <PhotoSelector
                      modelId={model.id}
                      modelName={model.name}
                      selectedPhotos={modelPublicPhotos.map(img => img.image_url)}
                      onSelectionChange={(selectedPhotos) => 
                        handlePhotoSelection(model.id, selectedPhotos)
                      }
                    />
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Current Gallery Overview */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Galeria Pública Atual</h3>
            {modelImages.filter(img => img.is_in_public_gallery).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {modelImages.filter(img => img.is_in_public_gallery).map((image) => (
                  <div key={image.id} className="border rounded-lg p-3 space-y-3">
                    {/* Image */}
                    <div className="relative">
                      <img 
                        src={image.image_url} 
                        alt={image.model_name}
                        className="w-full aspect-square object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => handleImageClick(image.model_id)}
                        title="Clique para ver a página da modelo"
                      />
                      {image.is_featured && (
                        <Badge className="absolute top-2 right-2" variant="default">
                          <Star className="w-3 h-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>

                    {/* Model Info */}
                    <div>
                      <h4 className="font-medium text-sm">{image.model_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {image.source === 'profile' ? 'Foto de perfil' : 'Galeria'}
                      </p>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Destaque</span>
                      <Switch
                        checked={image.is_featured}
                        onCheckedChange={() => toggleFeatured(image)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Nenhuma foto selecionada para a galeria pública ainda.
                </p>
              </div>
            )}
          </div>
          
          {models.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Nenhuma modelo encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Adicione modelos com fotos para começar a gerenciar a galeria pública.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/admin'}>
                Ir para Modelos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Como funciona</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Seletor de Fotos:</strong> Escolha quais fotos de cada modelo aparecem na galeria pública</li>
                <li>• <strong>Álbum Personalizado:</strong> Crie um álbum exclusivo para cada modelo sem duplicar fotos do perfil</li>
                <li>• <strong>Destaque:</strong> Marque fotos importantes para aparecerem primeiro na galeria</li>
                <li>• <strong>Organização Inteligente:</strong> As fotos são organizadas automaticamente por modelo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};