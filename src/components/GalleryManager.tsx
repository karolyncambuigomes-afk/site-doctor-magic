import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Images, ArrowUp, ArrowDown, Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Model {
  id: string;
  name: string;
  image: string | null;
}

interface CarouselItem {
  id: string;
  model_id: string;
  model_name: string;
  image_url: string;
  order_index: number;
  is_active: boolean;
}

export const GalleryManager: React.FC = () => {
  const { toast } = useToast();
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load models
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('id, name, image')
        .order('name');

      if (modelsError) throw modelsError;
      setModels(modelsData || []);

      // Load carousel items
      const { data: carouselData, error: carouselError } = await supabase
        .from('homepage_carousel')
        .select('*')
        .order('order_index');

      if (carouselError) throw carouselError;
      setCarouselItems(carouselData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da galeria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCarousel = async () => {
    if (!selectedModel) return;

    const model = models.find(m => m.id === selectedModel);
    if (!model || !model.image) {
      toast({
        title: "Erro",
        description: "Modelo selecionado não tem imagem",
        variant: "destructive"
      });
      return;
    }

    // Check if model is already in carousel
    if (carouselItems.some(item => item.model_id === selectedModel)) {
      toast({
        title: "Erro",
        description: "Esta modelo já está no carrossel",
        variant: "destructive"
      });
      return;
    }

    try {
      const maxOrder = Math.max(...carouselItems.map(item => item.order_index), 0);
      
      const { error } = await supabase
        .from('homepage_carousel')
        .insert({
          model_id: selectedModel,
          model_name: model.name,
          image_url: model.image,
          order_index: maxOrder + 1,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Modelo adicionada ao carrossel"
      });

      setSelectedModel('');
      setShowAddDialog(false);
      loadData();
    } catch (error) {
      console.error('Error adding to carousel:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar ao carrossel",
        variant: "destructive"
      });
    }
  };

  const removeFromCarousel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('homepage_carousel')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Modelo removida do carrossel"
      });

      loadData();
    } catch (error) {
      console.error('Error removing from carousel:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover do carrossel",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('homepage_carousel')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: isActive ? "Item desativado" : "Item ativado"
      });

      loadData();
    } catch (error) {
      console.error('Error toggling active:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status",
        variant: "destructive"
      });
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = carouselItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= carouselItems.length) return;

    try {
      const item1 = carouselItems[currentIndex];
      const item2 = carouselItems[newIndex];

      // Swap order_index values
      await supabase
        .from('homepage_carousel')
        .update({ order_index: item2.order_index })
        .eq('id', item1.id);

      await supabase
        .from('homepage_carousel')
        .update({ order_index: item1.order_index })
        .eq('id', item2.id);

      toast({
        title: "Sucesso",
        description: "Ordem atualizada"
      });

      loadData();
    } catch (error) {
      console.error('Error moving item:', error);
      toast({
        title: "Erro",
        description: "Erro ao mover item",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const availableModels = models.filter(model => 
    model.image && !carouselItems.some(item => item.model_id === model.id)
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Images className="w-5 h-5" />
                Homepage Carousel
              </CardTitle>
              <CardDescription>
                Manage the order of model photos that appear on the homepage
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Model
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Modelo ao Carrossel</DialogTitle>
                  <DialogDescription>
                    Selecione uma modelo para adicionar ao carrossel da página principal
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Modelo</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={addToCarousel} disabled={!selectedModel}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="space-y-4 bg-white">
            {carouselItems.length === 0 ? (
              <div className="text-center py-12">
                <Images className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma modelo no carrossel</h3>
                <p className="text-muted-foreground mb-4">
                  Adicione modelos ao carrossel para exibi-las na página principal
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Modelo
                </Button>
              </div>
            ) : (
              carouselItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-4 p-4 border rounded-lg bg-white ${
                    !item.is_active ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-background border border-foreground text-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveItem(item.id, 'down')}
                        disabled={index === carouselItems.length - 1}
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Posição {index + 1} no carrossel
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => toggleActive(item.id, item.is_active)}
                      />
                      <span className="text-sm">Ativo</span>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCarousel(item.id)}
                      title="Remover do carrossel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {availableModels.length === 0 && models.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Todas as modelos com fotos já estão no carrossel.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};