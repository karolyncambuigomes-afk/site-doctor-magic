import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  image: string | null;
}

interface AvailableImage {
  id: string;
  image_url: string;
  model_id: string;
  model_name: string;
  source: 'profile' | 'gallery';
  caption?: string;
}

interface PublicGalleryItem {
  id: string;
  image_url: string;
  model_id: string;
  model_name: string;
  is_featured: boolean;
}

export const GalleryManager: React.FC = () => {
  const { toast } = useToast();
  const [availableImages, setAvailableImages] = useState<AvailableImage[]>([]);
  const [publicGallery, setPublicGallery] = useState<PublicGalleryItem[]>([]);
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

      // Load available images from models and their galleries
      await loadAvailableImages(models || []);

      // Load public gallery
      const { data: publicGalleryData, error: galleryError } = await supabase
        .from('public_gallery')
        .select('*')
        .order('order_index');

      if (galleryError) throw galleryError;

      setPublicGallery(publicGalleryData || []);
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

  const loadAvailableImages = async (models: Model[]) => {
    const images: AvailableImage[] = [];
    
    for (const model of models) {
      // Add main profile image
      if (model.image) {
        images.push({
          id: `profile-${model.id}`,
          image_url: model.image,
          model_id: model.id,
          model_name: model.name,
          source: 'profile'
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
            images.push({
              id: `gallery-${img.id}`,
              image_url: img.image_url,
              model_id: model.id,
              model_name: model.name,
              source: 'gallery',
              caption: img.caption
            });
          });
        }
      } catch (error) {
        console.error('Error loading gallery for model:', model.id, error);
      }
    }
    
    setAvailableImages(images);
  };

  const addToPublicGallery = async (image: AvailableImage) => {
    try {
      const { data, error } = await supabase
        .from('public_gallery')
        .insert([{
          image_url: image.image_url,
          model_id: image.model_id,
          model_name: image.model_name,
          caption: image.caption || '',
          order_index: publicGallery.length
        }])
        .select()
        .single();

      if (error) throw error;

      setPublicGallery([...publicGallery, data]);

      toast({
        title: "Sucesso",
        description: "Imagem adicionada à galeria pública"
      });
    } catch (error) {
      console.error('Error adding to public gallery:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar imagem à galeria",
        variant: "destructive"
      });
    }
  };

  const removeFromPublicGallery = async (id: string) => {
    try {
      const { error } = await supabase
        .from('public_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPublicGallery(publicGallery.filter(img => img.id !== id));

      toast({
        title: "Sucesso",
        description: "Imagem removida da galeria pública"
      });
    } catch (error) {
      console.error('Error removing from public gallery:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem da galeria",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('public_gallery')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setPublicGallery(publicGallery.map(img => 
        img.id === id ? { ...img, is_featured: !currentStatus } : img
      ));

      toast({
        title: "Sucesso",
        description: `Imagem ${!currentStatus ? 'marcada como destaque' : 'removida dos destaques'}`
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gerenciar Galeria Pública</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Images */}
        <Card>
          <CardHeader>
            <CardTitle>Fotos Disponíveis</CardTitle>
            <CardDescription>
              Todas as fotos das modelos ({availableImages.length} fotos)
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {availableImages.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {availableImages.map((image) => {
                  const isInPublicGallery = publicGallery.some(pg => pg.image_url === image.image_url);
                  
                  return (
                    <div key={image.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <img 
                          src={image.image_url} 
                          alt={image.model_name}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => handleImageClick(image.model_id)}
                          title="Clique para ver a página da modelo"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{image.model_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {image.source === 'profile' ? 'Foto de perfil' : 'Galeria'}
                          </p>
                          {image.caption && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {image.caption}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!isInPublicGallery ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => addToPublicGallery(image)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar à Galeria
                          </Button>
                        ) : (
                          <div className="w-full text-center text-sm text-muted-foreground py-2">
                            ✓ Já está na galeria pública
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Nenhuma foto encontrada. Adicione modelos com fotos primeiro.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Public Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Galeria Pública</CardTitle>
            <CardDescription>
              Imagens que aparecem na galeria do site ({publicGallery.length} fotos)
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {publicGallery.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {publicGallery.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <img 
                        src={item.image_url} 
                        alt={item.model_name}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => handleImageClick(item.model_id)}
                        title="Clique para ver a página da modelo"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.model_name}</h4>
                        {item.is_featured && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFeatured(item.id, item.is_featured)}
                      >
                        {item.is_featured ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Remover Destaque
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Destacar
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromPublicGallery(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Nenhuma imagem na galeria pública. Adicione fotos da lista ao lado.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};