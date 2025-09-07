import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';
import { VideoUpload } from '@/components/VideoUpload';
import { Save, Video, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroMain from '@/assets/hero-main.jpg';

interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_url: string;
  video_url: string | null;
  media_type: 'image' | 'video';
  overlay_opacity: number;
  show_scroll_indicator: boolean;
}

export const SimpleHeroManager: React.FC = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<HeroContent>({
    id: 'main-hero',
    title: 'Five London',
    subtitle: 'Premier luxury companion services',
    button_text: 'View Our Models',
    button_link: '/models',
    image_url: heroMain,
    video_url: null,
    media_type: 'image',
    overlay_opacity: 70,
    show_scroll_indicator: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = async () => {
    try {
      // Vamos usar o localStorage temporariamente para o novo sistema simplificado
      const saved = localStorage.getItem('simple-hero-content');
      if (saved) {
        setContent(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading hero content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo do hero",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveHeroContent = async () => {
    setSaving(true);
    try {
      // Salvar no localStorage (pode ser migrado para Supabase depois)
      localStorage.setItem('simple-hero-content', JSON.stringify(content));
      
      toast({
        title: "Sucesso",
        description: "Conteúdo do hero salvo com sucesso"
      });
    } catch (error) {
      console.error('Error saving hero content:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar conteúdo",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof HeroContent, value: any) => {
    setContent({ ...content, [field]: value });
  };

  const resetToDefault = () => {
    const defaultContent = {
      id: 'main-hero',
      title: 'Five London',
      subtitle: 'Premier luxury companion services',
      button_text: 'View Our Models',
      button_link: '/models',
      image_url: heroMain,
      video_url: null,
      media_type: 'image' as const,
      overlay_opacity: 70,
      show_scroll_indicator: true
    };
    setContent(defaultContent);
    toast({
      title: "Configurações Resetadas",
      description: "As configurações foram restauradas para o padrão"
    });
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {content.media_type === 'video' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            Configuração do Hero Principal
          </CardTitle>
          <CardDescription>
            Configure o conteúdo e mídia da seção hero da página inicial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conteúdo de Texto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">CONTEÚDO DE TEXTO</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Título Principal</Label>
                <Input
                  id="title"
                  value={content.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Ex: Five London"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={content.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="Ex: Premier luxury companion services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_text">Texto do Botão</Label>
                <Input
                  id="button_text"
                  value={content.button_text}
                  onChange={(e) => updateField('button_text', e.target.value)}
                  placeholder="Ex: View Our Models"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_link">Link do Botão</Label>
                <Input
                  id="button_link"
                  value={content.button_link}
                  onChange={(e) => updateField('button_link', e.target.value)}
                  placeholder="Ex: /models"
                />
              </div>
            </div>

            {/* Configurações Visuais */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">CONFIGURAÇÕES VISUAIS</h3>
              
              <div className="space-y-2">
                <Label htmlFor="overlay_opacity">Opacidade da Sobreposição (%)</Label>
                <Input
                  id="overlay_opacity"
                  type="number"
                  min="0"
                  max="100"
                  value={content.overlay_opacity}
                  onChange={(e) => updateField('overlay_opacity', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Controla a transparência da sobreposição escura sobre a mídia
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show_scroll">Mostrar Indicador de Scroll</Label>
                <Switch
                  id="show_scroll"
                  checked={content.show_scroll_indicator}
                  onCheckedChange={(checked) => updateField('show_scroll_indicator', checked)}
                />
              </div>
            </div>
          </div>

          {/* Configuração de Mídia */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">MÍDIA DE FUNDO</h3>
            
            <div className="space-y-2">
              <Label htmlFor="media_type">Tipo de Mídia</Label>
              <Select 
                value={content.media_type} 
                onValueChange={(value: 'image' | 'video') => updateField('media_type', value)}
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
            </div>

            {/* Upload de Imagem (sempre necessário como fallback) */}
            <div>
              <ImageUpload
                value={content.image_url}
                onChange={(url) => updateField('image_url', url)}
                label="Imagem de Fundo"
                placeholder="Imagem que aparece sempre (como fallback do vídeo)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Esta imagem aparece imediatamente enquanto o vídeo carrega (se selecionado)
              </p>
            </div>

            {/* Upload de Vídeo (se selecionado) */}
            {content.media_type === 'video' && (
              <div>
                <VideoUpload
                  value={content.video_url || ''}
                  onChange={(url) => updateField('video_url', url)}
                  label="Vídeo de Fundo"
                  placeholder="URL do vídeo ou faça upload"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O vídeo será reproduzido automaticamente em loop, silenciado
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
              {content.media_type === 'video' && content.video_url ? (
                <video
                  src={content.video_url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={content.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <div 
                className="absolute inset-0 flex items-center justify-center text-white"
                style={{backgroundColor: `rgba(0, 0, 0, ${content.overlay_opacity / 100})`}}
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
                  <p className="text-sm opacity-90 mb-4">{content.subtitle}</p>
                  <button className="px-4 py-2 bg-white text-black text-sm rounded">
                    {content.button_text}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Salvar */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button 
              onClick={resetToDefault}
              variant="outline"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
            
            <Button 
              onClick={saveHeroContent}
              disabled={saving}
              size="lg"
            >
              {saving ? (
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
        </CardContent>
      </Card>
    </div>
  );
};