import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageUpload } from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Image, Settings, Eye, EyeOff } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  order_index: number;
  active: boolean;
  created_at: string;
}

interface HeroSettings {
  auto_play: boolean;
  slide_duration: number;
  show_dots: boolean;
  show_scroll_indicator: boolean;
  overlay_opacity: number;
}

export const HeroAdmin = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<HeroSettings>({
    auto_play: true,
    slide_duration: 5000,
    show_dots: true,
    show_scroll_indicator: true,
    overlay_opacity: 30
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for slide editing
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button_text: 'View Our Models',
    button_link: '/models',
    active: true
  });

  useEffect(() => {
    fetchSlides();
    fetchSettings();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar slides do hero",
        variant: "destructive"
      });
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSlide = async () => {
    setSaving(true);
    try {
      const slideData = {
        ...slideForm,
        order_index: editingSlide ? editingSlide.order_index : slides.length
      };

      let error;
      if (editingSlide) {
        ({ error } = await supabase
          .from('hero_slides')
          .update(slideData)
          .eq('id', editingSlide.id));
      } else {
        ({ error } = await supabase
          .from('hero_slides')
          .insert(slideData));
      }

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Slide ${editingSlide ? 'atualizado' : 'criado'} com sucesso`
      });

      fetchSlides();
      setIsDialogOpen(false);
      setEditingSlide(null);
      setSlideForm({
        title: '',
        subtitle: '',
        image_url: '',
        button_text: 'View Our Models',
        button_link: '/models',
        active: true
      });
    } catch (error) {
      console.error('Error saving slide:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar slide",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Slide excluído com sucesso"
      });

      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir slide",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ active })
        .eq('id', id);

      if (error) throw error;

      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do slide",
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('hero_settings')
        .upsert(settings);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setSlideForm({
        title: slide.title,
        subtitle: slide.subtitle,
        image_url: slide.image_url,
        button_text: slide.button_text,
        button_link: slide.button_link,
        active: slide.active
      });
    } else {
      setEditingSlide(null);
      setSlideForm({
        title: '',
        subtitle: '',
        image_url: '',
        button_text: 'View Our Models',
        button_link: '/models',
        active: true
      });
    }
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações do hero...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hero Section</h1>
          <p className="text-muted-foreground">
            Gerencie os slides e configurações da seção hero da página inicial
          </p>
        </div>
      </div>

      <Tabs defaultValue="slides" className="space-y-4">
        <TabsList>
          <TabsTrigger value="slides">Slides</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="slides" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Slides do Hero</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openEditDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Slide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSlide ? 'Editar Slide' : 'Novo Slide'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure o conteúdo e aparência do slide
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={slideForm.title}
                        onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                        placeholder="Five London"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtítulo</Label>
                      <Input
                        id="subtitle"
                        value={slideForm.subtitle}
                        onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                        placeholder="Sophisticated Companions in London"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Imagem de Fundo</Label>
                    <ImageUpload
                      value={slideForm.image_url}
                      onChange={(url) => setSlideForm({ ...slideForm, image_url: url })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="button_text">Texto do Botão</Label>
                      <Input
                        id="button_text"
                        value={slideForm.button_text}
                        onChange={(e) => setSlideForm({ ...slideForm, button_text: e.target.value })}
                        placeholder="View Our Models"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="button_link">Link do Botão</Label>
                      <Input
                        id="button_link"
                        value={slideForm.button_link}
                        onChange={(e) => setSlideForm({ ...slideForm, button_link: e.target.value })}
                        placeholder="/models"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={slideForm.active}
                      onCheckedChange={(checked) => setSlideForm({ ...slideForm, active: checked })}
                    />
                    <Label htmlFor="active">Slide ativo</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveSlide} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Subtítulo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slides.map((slide) => (
                    <TableRow key={slide.id}>
                      <TableCell>
                        <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                          {slide.image_url ? (
                            <img
                              src={slide.image_url}
                              alt={slide.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{slide.title}</TableCell>
                      <TableCell className="text-muted-foreground">{slide.subtitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={slide.active ? "default" : "secondary"}>
                            {slide.active ? "Ativo" : "Inativo"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(slide.id, !slide.active)}
                          >
                            {slide.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{slide.order_index + 1}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(slide)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSlide(slide.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure o comportamento e aparência do carousel hero
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reprodução Automática</Label>
                      <p className="text-sm text-muted-foreground">
                        Avança automaticamente pelos slides
                      </p>
                    </div>
                    <Switch
                      checked={settings.auto_play}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, auto_play: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slide_duration">Duração do Slide (ms)</Label>
                    <Input
                      id="slide_duration"
                      type="number"
                      value={settings.slide_duration}
                      onChange={(e) => 
                        setSettings({ ...settings, slide_duration: parseInt(e.target.value) })
                      }
                      min="1000"
                      max="10000"
                      step="500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mostrar Indicadores</Label>
                      <p className="text-sm text-muted-foreground">
                        Pontos de navegação na parte inferior
                      </p>
                    </div>
                    <Switch
                      checked={settings.show_dots}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, show_dots: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Indicador de Scroll</Label>
                      <p className="text-sm text-muted-foreground">
                        Seta animada indicando scroll
                      </p>
                    </div>
                    <Switch
                      checked={settings.show_scroll_indicator}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, show_scroll_indicator: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlay_opacity">Opacidade do Overlay (%)</Label>
                    <Input
                      id="overlay_opacity"
                      type="number"
                      value={settings.overlay_opacity}
                      onChange={(e) => 
                        setSettings({ ...settings, overlay_opacity: parseInt(e.target.value) })
                      }
                      min="0"
                      max="80"
                      step="5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};