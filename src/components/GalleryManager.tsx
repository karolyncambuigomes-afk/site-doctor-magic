import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Star, Eye, Images, ArrowUp, ArrowDown } from 'lucide-react';

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

interface CarouselModel {
  id: string;
  model_id: string;
  model_name: string;
  image_url: string;
  caption: string | null;
  order_index: number;
  is_featured: boolean;
}

export const GalleryManager: React.FC = () => {
  const { toast } = useToast();
  const [modelImages, setModelImages] = useState<ModelImage[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [carouselModels, setCarouselModels] = useState<CarouselModel[]>([]);
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

      // Load carousel models from public_gallery
      const { data: carouselData, error: carouselError } = await supabase
        .from('public_gallery')
        .select('*')
        .order('order_index', { ascending: true });

      if (carouselError) throw carouselError;
      setCarouselModels(carouselData || []);

      // Load public gallery for checking which images are already public
      const { data: publicGalleryData, error: publicGalleryError } = await supabase
        .from('public_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (publicGalleryError) throw publicGalleryError;

      // Load model gallery images
      const { data: galleryData, error: galleryError } = await supabase
        .from('model_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (galleryError) throw galleryError;

      // Process model images
      const processedImages: ModelImage[] = [];

      // Add model profile images
      models?.forEach(model => {
        if (model.image) {
          processedImages.push({
            id: `profile-${model.id}`,
            image_url: model.image,
            model_id: model.id,
            model_name: model.name,
            source: 'profile',
            is_in_public_gallery: publicGalleryData?.some(pg => pg.image_url === model.image) || false,
            is_featured: publicGalleryData?.find(pg => pg.image_url === model.image)?.is_featured || false,
            public_gallery_id: publicGalleryData?.find(pg => pg.image_url === model.image)?.id
          });
        }
      });

      // Add gallery images
      galleryData?.forEach(gallery => {
        processedImages.push({
          id: gallery.id,
          image_url: gallery.image_url,
          model_id: gallery.model_id,
          model_name: models?.find(m => m.id === gallery.model_id)?.name || 'Unknown',
          source: 'gallery',
          caption: gallery.caption,
          is_in_public_gallery: publicGalleryData?.some(pg => pg.image_url === gallery.image_url) || false,
          is_featured: publicGalleryData?.find(pg => pg.image_url === gallery.image_url)?.is_featured || false,
          public_gallery_id: publicGalleryData?.find(pg => pg.image_url === gallery.image_url)?.id
        });
      });

      setModelImages(processedImages);
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

  const togglePublicGallery = async (image: ModelImage) => {
    try {
      if (image.is_in_public_gallery && image.public_gallery_id) {
        // Remove from public gallery
        const { error } = await supabase
          .from('public_gallery')
          .delete()
          .eq('id', image.public_gallery_id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Imagem removida da galeria pública"
        });
      } else {
        // Add to public gallery with next order index
        const maxOrder = Math.max(...carouselModels.map(item => item.order_index || 0), 0);
        
        const { error } = await supabase
          .from('public_gallery')
          .insert({
            model_id: image.model_id,
            model_name: image.model_name,
            image_url: image.image_url,
            caption: image.caption || '',
            is_featured: false,
            order_index: maxOrder + 1
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Imagem adicionada à galeria pública"
        });
      }

      loadData();
    } catch (error) {
      console.error('Error toggling public gallery:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar galeria pública",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (image: ModelImage) => {
    if (!image.public_gallery_id) return;

    try {
      const { error } = await supabase
        .from('public_gallery')
        .update({ is_featured: !image.is_featured })
        .eq('id', image.public_gallery_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: image.is_featured ? "Imagem removida dos destaques" : "Imagem destacada"
      });

      loadData();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar destaque",
        variant: "destructive"
      });
    }
  };

  const moveCarouselItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = carouselModels.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= carouselModels.length) return;

    try {
      // Get the two items to swap
      const item1 = carouselModels[currentIndex];
      const item2 = carouselModels[newIndex];

      // Swap their order_index values
      await supabase
        .from('public_gallery')
        .update({ order_index: item2.order_index })
        .eq('id', item1.id);

      await supabase
        .from('public_gallery')
        .update({ order_index: item1.order_index })
        .eq('id', item2.id);

      toast({
        title: "Sucesso",
        description: "Ordem atualizada com sucesso"
      });

      loadData();
    } catch (error) {
      console.error('Error moving carousel item:', error);
      toast({
        title: "Erro",
        description: "Erro ao mover item do carrossel",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Carrossel da Tela Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="w-5 h-5" />
            Carrossel da Tela Principal
          </CardTitle>
          <CardDescription>
            Organize a ordem das modelos que aparecem no carrossel da página inicial (numeração 1, 2, 3, 4, 5...)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {carouselModels.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma modelo no carrossel. Adicione imagens à galeria pública abaixo.
              </p>
            ) : (
              carouselModels.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveCarouselItem(item.id, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveCarouselItem(item.id, 'down')}
                        disabled={index === carouselModels.length - 1}
                        className="h-8 w-8 p-0"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <img
                    src={item.image_url}
                    alt={item.model_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.model_name}</h4>
                    {item.caption && (
                      <p className="text-sm text-muted-foreground">{item.caption}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Posição {index + 1} no carrossel
                    </p>
                  </div>

                  {item.is_featured && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="w-3 h-3" />
                      Destaque
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Galeria de Imagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Galeria de Imagens
          </CardTitle>
          <CardDescription>
            Gerencie todas as imagens das modelos e controle quais aparecem na galeria pública e no carrossel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.model_name}
                    className="w-full h-full object-cover"
                  />
                  {image.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="gap-1">
                        <Star className="w-3 h-3" />
                        Destaque
                      </Badge>
                    </div>
                  )}
                  {image.is_in_public_gallery && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="default" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Público
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{image.model_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {image.source === 'profile' ? 'Foto de perfil' : 'Galeria'}
                      </p>
                      {image.caption && (
                        <p className="text-sm text-muted-foreground mt-1">{image.caption}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={image.is_in_public_gallery}
                          onCheckedChange={() => togglePublicGallery(image)}
                        />
                        <span className="text-sm">Galeria Pública</span>
                      </div>
                      
                      {image.is_in_public_gallery && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(image)}
                          className={image.is_featured ? "bg-yellow-50 border-yellow-200" : ""}
                          title={image.is_featured ? "Remover destaque" : "Destacar imagem"}
                        >
                          <Star className={`w-4 h-4 ${image.is_featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </Button>
                      )}
                    </div>
                    
                    {image.is_in_public_gallery && (
                      <p className="text-xs text-muted-foreground">
                        Esta imagem aparece no carrossel da tela principal
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {modelImages.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma imagem encontrada</h3>
              <p className="text-muted-foreground">
                Adicione imagens às modelos na aba "Modelos" para gerenciá-las aqui.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};