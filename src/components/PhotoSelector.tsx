import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Images, Check, X } from 'lucide-react';

interface Photo {
  id: string;
  image_url: string;
  source: 'profile' | 'gallery';
  caption?: string;
}

interface PhotoSelectorProps {
  modelId: string;
  modelName: string;
  selectedPhotos: string[];
  onSelectionChange: (selectedPhotos: string[]) => void;
}

export const PhotoSelector: React.FC<PhotoSelectorProps> = ({
  modelId,
  modelName,
  selectedPhotos,
  onSelectionChange
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [availablePhotos, setAvailablePhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [localSelection, setLocalSelection] = useState<string[]>(selectedPhotos);

  useEffect(() => {
    setLocalSelection(selectedPhotos);
  }, [selectedPhotos]);

  const loadPhotos = async () => {
    if (!modelId) return;

    setLoading(true);
    try {
      const photos: Photo[] = [];

      // Get model profile image
      const { data: model, error: modelError } = await supabase
        .from('models')
        .select('image')
        .eq('id', modelId)
        .maybeSingle();

      if (!modelError && model?.image) {
        photos.push({
          id: `profile-${modelId}`,
          image_url: model.image,
          source: 'profile'
        });
      }

      // Get model gallery images
      const { data: galleryImages, error: galleryError } = await supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', modelId)
        .order('order_index');

      if (!galleryError && galleryImages) {
        galleryImages.forEach(img => {
          photos.push({
            id: `gallery-${img.id}`,
            image_url: img.image_url,
            source: 'gallery',
            caption: img.caption
          });
        });
      }

      setAvailablePhotos(photos);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar fotos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    loadPhotos();
  };

  const handlePhotoToggle = (photoUrl: string) => {
    setLocalSelection(prev => 
      prev.includes(photoUrl)
        ? prev.filter(url => url !== photoUrl)
        : [...prev, photoUrl]
    );
  };

  const handleSave = () => {
    onSelectionChange(localSelection);
    setIsOpen(false);
    toast({
      title: "Sucesso",
      description: `${localSelection.length} fotos selecionadas para a galeria pública`
    });
  };

  const handleCancel = () => {
    setLocalSelection(selectedPhotos);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          <Images className="w-4 h-4 mr-2" />
          Selecionar Fotos ({selectedPhotos.length})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Fotos - {modelName}</DialogTitle>
          <DialogDescription>
            Escolha quais fotos desta modelo devem aparecer na galeria pública
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {localSelection.length} de {availablePhotos.length} fotos selecionadas
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocalSelection([])}
                >
                  Desmarcar Todas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocalSelection(availablePhotos.map(p => p.image_url))}
                >
                  Selecionar Todas
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availablePhotos.map((photo) => (
                <Card 
                  key={photo.id} 
                  className={`cursor-pointer transition-all ${
                    localSelection.includes(photo.image_url) 
                      ? 'ring-2 ring-primary' 
                      : ''
                  }`}
                  onClick={() => handlePhotoToggle(photo.image_url)}
                >
                  <CardContent className="p-2">
                    <div className="relative">
                      <img
                        src={photo.image_url}
                        alt={photo.caption || 'Foto da modelo'}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      
                      {/* Selection indicator */}
                      <div className="absolute top-2 right-2">
                        <Checkbox
                          checked={localSelection.includes(photo.image_url)}
                          onChange={() => handlePhotoToggle(photo.image_url)}
                          className="bg-white/90"
                        />
                      </div>

                      {/* Source badge */}
                      <Badge
                        variant={photo.source === 'profile' ? 'default' : 'secondary'}
                        className="absolute bottom-2 left-2 text-xs"
                      >
                        {photo.source === 'profile' ? 'Perfil' : 'Galeria'}
                      </Badge>
                    </div>
                    
                    {photo.caption && (
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        {photo.caption}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {availablePhotos.length === 0 && (
              <div className="text-center py-12">
                <Images className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Nenhuma foto encontrada</h3>
                <p className="text-muted-foreground">
                  Esta modelo ainda não possui fotos. Adicione uma foto de perfil ou fotos na galeria primeiro.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                Salvar Seleção
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};