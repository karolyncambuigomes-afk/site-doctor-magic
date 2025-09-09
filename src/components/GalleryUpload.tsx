import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageEditor } from '@/components/ImageEditor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Edit3 } from 'lucide-react';

interface GalleryImage {
  id: string;
  model_id: string;
  image_url: string;
  caption?: string;
  order_index: number;
  created_at: string;
}

interface GalleryUploadProps {
  modelId: string;
}

export const GalleryUpload: React.FC<GalleryUploadProps> = ({ modelId }) => {
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);

  useEffect(() => {
    loadGalleryImages();
  }, [modelId]);

  const loadGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', modelId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar galeria",
        variant: "destructive",
      });
    }
  };

  const addImage = async () => {
    console.log('🎭 GALERIA: Tentando adicionar imagem à GALERIA');
    console.log('🎭 GALERIA: newImageUrl =', newImageUrl);
    console.log('🎭 GALERIA: modelId =', modelId);
    
    if (!newImageUrl) {
      console.log('🎭 GALERIA: Erro - sem URL de imagem');
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem",
        variant: "destructive",
      });
      return;
    }

    if (!modelId) {
      console.log('🎭 GALERIA: Erro - sem modelId');
      toast({
        title: "Erro",
        description: "ID do modelo não encontrado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const nextOrderIndex = Math.max(...galleryImages.map(img => img.order_index), -1) + 1;
      console.log('🎭 GALERIA: nextOrderIndex =', nextOrderIndex);

      const insertData = {
        model_id: modelId,
        image_url: newImageUrl,
        caption: newImageCaption || null,
        order_index: nextOrderIndex
      };
      console.log('🎭 GALERIA: Inserindo na tabela model_gallery:', insertData);

      const { error } = await supabase
        .from('model_gallery')
        .insert([insertData]);

      if (error) {
        console.error('🎭 GALERIA: Erro do Supabase:', error);
        throw error;
      }

      console.log('🎭 GALERIA: Sucesso! Imagem adicionada à model_gallery');
      toast({
        title: "Sucesso",
        description: "Imagem adicionada à galeria",
      });

      setNewImageUrl('');
      setNewImageCaption('');
      setIsAdding(false);
      loadGalleryImages();
      
      // Dispatch custom event to notify ModelGallery component
      console.log('🎭 GALERIA: Disparando evento galleryUpdated');
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar imagem",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (imageId: string) => {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) return;

    try {
      const { error } = await supabase
        .from('model_gallery')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Imagem removida da galeria",
      });

      loadGalleryImages();
      
      // Dispatch custom event to notify ModelGallery component
      console.log('🎭 GALERIA: Disparando evento galleryUpdated (remoção)');
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem",
        variant: "destructive",
      });
    }
  };

  const updateCaption = async (imageId: string, newCaption: string) => {
    try {
      const { error } = await supabase
        .from('model_gallery')
        .update({ caption: newCaption || null })
        .eq('id', imageId);

      if (error) throw error;

      setGalleryImages(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, caption: newCaption } : img
        )
      );

      toast({
        title: "Sucesso",
        description: "Legenda atualizada",
      });
    } catch (error) {
      console.error('Error updating caption:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar legenda",
        variant: "destructive",
      });
    }
  };

  const handleImageEdited = async (imageId: string, editedBlob: Blob) => {
    try {
      // Upload the edited image
      const fileExt = 'png';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(filePath, editedBlob);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);

      // Update the gallery image URL
      const { error: updateError } = await supabase
        .from('model_gallery')
        .update({ image_url: data.publicUrl })
        .eq('id', imageId);

      if (updateError) throw updateError;

      await loadGalleryImages();
      setEditingImage(null);
      
      toast({
        title: "Sucesso",
        description: "Imagem ajustada com sucesso"
      });

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    } catch (error) {
      console.error('Error updating edited image:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar imagem editada",
        variant: "destructive"
      });
    }
  };

  const updateOrder = async (imageId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('model_gallery')
        .update({ order_index: newOrder })
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ordem atualizada",
      });

      loadGalleryImages();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ordem",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Galeria de Fotos ({galleryImages.length} fotos)</h3>
        <Button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Foto
        </Button>
      </div>

      <div className="bg-white border-2 border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
            <span className="text-foreground text-sm font-bold">!</span>
          </div>
          <h4 className="font-bold text-foreground">Sistema de Ordenação</h4>
        </div>
        <p className="text-sm text-foreground">
          • A primeira foto será exibida como destaque<br/>
          • Use os seletores de ordem para reorganizar as fotos<br/>
          • Adicione pelo menos 1 foto para que o modelo apareça no site
        </p>
      </div>

      {isAdding && (
        <div className="border-2 border-border rounded-lg p-6 space-y-4 bg-white">
          <div className="flex items-center justify-center gap-3 mb-4 bg-muted p-3 rounded-lg">
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-background" />
            </div>
            <h4 className="font-bold text-foreground text-lg">Adicionar Nova Foto</h4>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-2 border-border">
            <Label className="text-foreground font-bold text-lg flex items-center gap-2 mb-3">
              📸 Upload da Foto
            </Label>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded border border-border">
                <ImageUpload
                  value={newImageUrl}
                  onChange={(url) => {
                    console.log('🎭 GALERIA: ImageUpload onChange chamado com URL:', url);
                    setNewImageUrl(url);
                  }}
                  label="Selecionar foto ou fazer upload"
                  placeholder="URL da imagem ou faça upload"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="caption">Legenda (opcional)</Label>
            <Input
              id="caption"
              value={newImageCaption}
              onChange={(e) => setNewImageCaption(e.target.value)}
              placeholder="Adicione uma legenda para esta imagem"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={addImage}
              disabled={loading || !newImageUrl}
              className="bg-black text-white hover:bg-gray-800"
            >
              {loading ? 'Adicionando...' : 'Adicionar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewImageUrl('');
                setNewImageCaption('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {galleryImages.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id} 
                className="border-2 rounded-lg overflow-hidden border-border"
              >
                <div className="aspect-square">
                  <img
                    src={image.image_url}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4 space-y-3">
                  {/* Order selector */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Posição:</Label>
                    <select
                      value={image.order_index}
                      onChange={(e) => updateOrder(image.id, parseInt(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {Array.from({ length: Math.max(5, galleryImages.length + 1) }, (_, i) => (
                        <option key={i} value={i}>{i + 1}</option>
                      ))}
                    </select>
                    {index === 0 && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Destaque
                      </span>
                    )}
                  </div>
                  
                  {/* Caption */}
                  <Input
                    value={image.caption || ''}
                    onChange={(e) => updateCaption(image.id, e.target.value)}
                    placeholder="Adicionar legenda..."
                    className="text-sm"
                  />
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingImage(image.image_url)}
                      className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Ajustar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-medium">Nenhuma foto adicionada</p>
          <p className="text-sm">Adicione pelo menos uma foto para que o modelo apareça no site</p>
        </div>
      )}

      {/* Image Editor */}
      {editingImage && (
        <ImageEditor
          imageUrl={editingImage}
          isOpen={true}
          onClose={() => setEditingImage(null)}
          onSave={(blob) => {
            const imageToEdit = galleryImages.find(img => img.image_url === editingImage);
            if (imageToEdit) {
              handleImageEdited(imageToEdit.id, blob);
            }
          }}
          aspectRatio={1} // Square aspect ratio
        />
      )}
    </div>
  );
};