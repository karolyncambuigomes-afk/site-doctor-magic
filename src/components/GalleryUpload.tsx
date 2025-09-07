import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Galeria ({galleryImages.length} fotos)</h3>
        <Button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="bg-purple-600 text-white hover:bg-purple-700 border-2 border-purple-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          🎭 Adicionar Foto EXTRA à Galeria
        </Button>
      </div>

      {isAdding && (
        <div className="border-4 border-purple-500 rounded-lg p-6 space-y-4 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="flex items-center justify-center gap-3 mb-4 bg-purple-100 p-3 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-purple-900 text-lg">🎭 GALERIA EXTRA - NÃO É FOTO PRINCIPAL</h4>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg border-2 border-purple-300">
            <div className="text-center mb-3">
              <div className="text-2xl mb-2">🚨</div>
              <p className="text-sm text-purple-900 font-bold mb-2">
                ATENÇÃO: Esta seção é APENAS para fotos EXTRAS da galeria
              </p>
              <p className="text-xs text-purple-800">
                • Estas fotos NÃO substituem a foto principal<br/>
                • São fotos adicionais que aparecem na página de detalhes<br/>
                • A foto principal fica na seção azul acima
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
            <Label className="text-purple-900 font-bold text-lg flex items-center gap-2 mb-3">
              🎯 NOVA FOTO PARA GALERIA EXTRA
              <span className="text-xs bg-purple-200 px-2 py-1 rounded">NÃO é principal</span>
            </Label>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded border border-purple-200">
                <p className="text-xs text-purple-700 font-medium mb-2">📍 Upload para GALERIA EXTRA:</p>
                <ImageUpload
                  value={newImageUrl}
                  onChange={(url) => {
                    console.log('🎭 GALERIA: ImageUpload onChange chamado com URL:', url);
                    setNewImageUrl(url);
                  }}
                  label="🖼️ Foto EXTRA da Galeria (não é principal)"
                  placeholder="🎭 URL da imagem EXTRA ou faça upload para GALERIA"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square">
                <img
                  src={image.image_url}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 space-y-2">
                <Input
                  value={image.caption || ''}
                  onChange={(e) => updateCaption(image.id, e.target.value)}
                  placeholder="Adicionar legenda..."
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImage(image.id)}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma imagem na galeria</p>
          <p className="text-sm">Use o botão "Adicionar Foto" para começar</p>
        </div>
      )}
    </div>
  );
};