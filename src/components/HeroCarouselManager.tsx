import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { VideoUpload } from '@/components/VideoUpload';
import { Save, Plus, Trash2, Image as ImageIcon, Settings, Video, ArrowUp, ArrowDown } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  video_url: string | null;
  media_type: 'image' | 'video';
  button_text: string | null;
  button_link: string | null;
  order_index: number;
  active: boolean;
}

interface HeroSettings {
  id: string;
  auto_play: boolean;
  slide_duration: number;
  show_dots: boolean;
  show_scroll_indicator: boolean;
  overlay_opacity: number;
}

export const HeroCarouselManager: React.FC = () => {
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      console.log('Loading hero data...');
      
      // Load slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index');

      if (slidesError) {
        console.error('Slides error:', slidesError);
        throw slidesError;
      }

      console.log('Raw slides data:', slidesData);

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1);

      if (settingsError) {
        console.error('Settings error:', settingsError);
        throw settingsError;
      }

      const processedSlides = slidesData?.map(slide => ({
        ...slide,
        media_type: slide.media_type || 'image',
        video_url: slide.video_url || null
      })) || [];

      console.log('Processed slides:', processedSlides);
      
      setSlides(processedSlides);
      setSettings(settingsData?.[0] || null);
    } catch (error) {
      console.error('Error loading hero data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do hero",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSlide = async (slide: HeroSlide) => {
    setSaving(slide.id);
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({
          title: slide.title,
          subtitle: slide.subtitle,
          image_url: slide.image_url,
          video_url: slide.video_url,
          media_type: slide.media_type,
          button_text: slide.button_text,
          button_link: slide.button_link,
          active: slide.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', slide.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Slide atualizado com sucesso"
      });
    } catch (error) {
      console.error('Error saving slide:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar slide",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving('settings');
    try {
      const { error } = await supabase
        .from('hero_settings')
        .update({
          auto_play: settings.auto_play,
          slide_duration: settings.slide_duration,
          show_dots: settings.show_dots,
          show_scroll_indicator: settings.show_scroll_indicator,
          overlay_opacity: settings.overlay_opacity,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

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
      setSaving(null);
    }
  };

  const updateSlideField = (slideId: string, field: keyof HeroSlide, value: any) => {
    setSlides(slides.map(slide => 
      slide.id === slideId ? { ...slide, [field]: value } : slide
    ));
  };

  const updateSettingsField = (field: keyof HeroSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const addNewSlide = async () => {
    try {
      const maxOrder = Math.max(...slides.map(s => s.order_index), -1);
      const { data, error } = await supabase
        .from('hero_slides')
        .insert({
          title: 'Novo Slide',
          subtitle: 'Subtítulo do slide',
          image_url: '',
          video_url: null,
          media_type: 'image',
          button_text: 'View Our Models',
          button_link: '/models',
          order_index: maxOrder + 1,
          active: true
        })
        .select()
        .single();

      if (error) throw error;

      setSlides([...slides, data]);
      toast({
        title: "Sucesso",
        description: "Novo slide criado"
      });
    } catch (error) {
      console.error('Error adding slide:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar slide",
        variant: "destructive"
      });
    }
  };

  const deleteSlide = async (slideId: string) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;

      setSlides(slides.filter(s => s.id !== slideId));
      toast({
        title: "Sucesso",
        description: "Slide removido"
      });
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover slide",
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
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* Settings */}
        {settings && (
          <AccordionItem value="settings" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Configurações do Carousel</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto_play">Reprodução Automática</Label>
                    <Switch
                      id="auto_play"
                      checked={settings.auto_play}
                      onCheckedChange={(checked) => updateSettingsField('auto_play', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slide_duration">Duração do Slide (ms)</Label>
                    <Input
                      id="slide_duration"
                      type="number"
                      value={settings.slide_duration}
                      onChange={(e) => updateSettingsField('slide_duration', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_dots">Mostrar Indicadores</Label>
                    <Switch
                      id="show_dots"
                      checked={settings.show_dots}
                      onCheckedChange={(checked) => updateSettingsField('show_dots', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_scroll">Mostrar Indicador de Scroll</Label>
                    <Switch
                      id="show_scroll"
                      checked={settings.show_scroll_indicator}
                      onCheckedChange={(checked) => updateSettingsField('show_scroll_indicator', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overlay_opacity">Opacidade da Sobreposição (%)</Label>
                    <Input
                      id="overlay_opacity"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.overlay_opacity}
                      onChange={(e) => updateSettingsField('overlay_opacity', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={saveSettings}
                  disabled={saving === 'settings'}
                >
                  {saving === 'settings' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Slides */}
        {slides.map((slide, index) => (
          <AccordionItem key={slide.id} value={slide.id} className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                {slide.media_type === 'video' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                <span className="font-medium">Slide {index + 1}: {slide.title}</span>
                {!slide.active && <span className="text-xs bg-muted px-2 py-1 rounded">Inativo</span>}
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded capitalize">{slide.media_type}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Texto do Slide */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Conteúdo do Slide</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`title-${slide.id}`}>Título</Label>
                      <Input
                        id={`title-${slide.id}`}
                        value={slide.title}
                        onChange={(e) => updateSlideField(slide.id, 'title', e.target.value)}
                        placeholder="Título do slide"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`subtitle-${slide.id}`}>Subtítulo</Label>
                      <Input
                        id={`subtitle-${slide.id}`}
                        value={slide.subtitle || ''}
                        onChange={(e) => updateSlideField(slide.id, 'subtitle', e.target.value)}
                        placeholder="Subtítulo do slide"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`button_text-${slide.id}`}>Texto do Botão</Label>
                      <Input
                        id={`button_text-${slide.id}`}
                        value={slide.button_text || ''}
                        onChange={(e) => updateSlideField(slide.id, 'button_text', e.target.value)}
                        placeholder="Texto do botão"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`button_link-${slide.id}`}>Link do Botão</Label>
                      <Input
                        id={`button_link-${slide.id}`}
                        value={slide.button_link || ''}
                        onChange={(e) => updateSlideField(slide.id, 'button_link', e.target.value)}
                        placeholder="/models ou URL externa"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`active-${slide.id}`}>Slide Ativo</Label>
                      <Switch
                        id={`active-${slide.id}`}
                        checked={slide.active}
                        onCheckedChange={(checked) => updateSlideField(slide.id, 'active', checked)}
                      />
                    </div>
                  </div>

                  {/* Mídia do Slide */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Mídia do Slide</h4>

                    <div className="space-y-2">
                      <Label htmlFor={`media_type-${slide.id}`}>Tipo de Mídia</Label>
                      <Select 
                        value={slide.media_type || 'image'} 
                        onValueChange={(value: 'image' | 'video') => {
                          console.log(`Changing media type for slide ${slide.id} to:`, value);
                          updateSlideField(slide.id, 'media_type', value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" />
                              Imagem
                            </div>
                          </SelectItem>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              Vídeo
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground">
                        Tipo atual: {slide.media_type || 'image'}
                      </div>
                    </div>

                    {slide.media_type === 'image' && (
                      <ImageUpload
                        value={slide.image_url}
                        onChange={(url) => updateSlideField(slide.id, 'image_url', url)}
                        label="Imagem"
                        placeholder="URL da imagem ou faça upload"
                      />
                    )}

                    {slide.media_type === 'video' && (
                      <div className="space-y-4">
                        <VideoUpload
                          value={slide.video_url || ''}
                          onChange={(url) => updateSlideField(slide.id, 'video_url', url)}
                          label="Vídeo"
                          placeholder="URL do vídeo ou faça upload"
                        />
                        
                        <div className="space-y-2">
                          <Label htmlFor={`poster-${slide.id}`}>Imagem de Poster (opcional)</Label>
                          <ImageUpload
                            value={slide.image_url}
                            onChange={(url) => updateSlideField(slide.id, 'image_url', url)}
                            label="Poster"
                            placeholder="Imagem mostrada antes do vídeo carregar"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview da Mídia */}
                {(slide.image_url || slide.video_url) && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h5 className="font-medium mb-2">Preview do Slide</h5>
                    {slide.media_type === 'video' && slide.video_url ? (
                      <video 
                        src={slide.video_url}
                        poster={slide.image_url}
                        controls
                        className="max-w-full h-40 object-cover rounded-lg"
                      />
                    ) : slide.image_url ? (
                      <img 
                        src={slide.image_url} 
                        alt={slide.title}
                        className="max-w-full h-40 object-cover rounded-lg"
                      />
                    ) : null}
                  </div>
                )}

                {/* Ações */}
                <div className="flex justify-between">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteSlide(slide.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover Slide
                  </Button>

                  <Button 
                    onClick={() => saveSlide(slide)}
                    disabled={saving === slide.id}
                  >
                    {saving === slide.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Slide
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* Adicionar Novo Slide */}
        <AccordionItem value="add-new" className="border rounded-lg border-dashed">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Adicionar Novo Slide</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Adicione um novo slide ao carousel</p>
              <Button onClick={addNewSlide}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Slide
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};