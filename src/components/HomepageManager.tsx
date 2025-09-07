import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HomepageContent {
  hero_main: any;
  about_preview: any;
  services_preview: any;
}

export const HomepageManager: React.FC = () => {
  const [content, setContent] = useState<HomepageContent>({
    hero_main: null,
    about_preview: null,
    services_preview: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .in('section', ['homepage_hero_main', 'homepage_about_preview', 'homepage_services_preview']);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        const key = item.section.replace('homepage_', '');
        contentMap[key] = item;
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo da homepage",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (section: string, updates: any) => {
    setSaving(section);
    try {
      const { error } = await supabase
        .from('site_content')
        .update(updates)
        .eq('section', `homepage_${section}`);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conteúdo atualizado com sucesso!",
      });

      loadContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar conteúdo",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const updateField = (section: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof HomepageContent],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar Homepage</h2>
        <p className="text-muted-foreground">
          Edite o conteúdo das principais seções da homepage
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">Sobre Preview</TabsTrigger>
          <TabsTrigger value="services">Serviços Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Principal</CardTitle>
              <CardDescription>
                Seção principal da homepage com título, subtítulo e descrição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Título Principal</Label>
                <Input
                  id="hero-title"
                  value={content.hero_main?.title || ''}
                  onChange={(e) => updateField('hero_main', 'title', e.target.value)}
                  placeholder="Digite o título principal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtítulo</Label>
                <Input
                  id="hero-subtitle"
                  value={content.hero_main?.subtitle || ''}
                  onChange={(e) => updateField('hero_main', 'subtitle', e.target.value)}
                  placeholder="Digite o subtítulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-content">Descrição</Label>
                <Textarea
                  id="hero-content"
                  value={content.hero_main?.content || ''}
                  onChange={(e) => updateField('hero_main', 'content', e.target.value)}
                  placeholder="Digite a descrição principal"
                  rows={4}
                />
              </div>

              <Button
                onClick={() => updateContent('hero_main', {
                  title: content.hero_main?.title,
                  subtitle: content.hero_main?.subtitle,
                  content: content.hero_main?.content,
                  updated_at: new Date().toISOString()
                })}
                disabled={saving === 'hero_main'}
              >
                {saving === 'hero_main' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Hero Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Seção Sobre</CardTitle>
              <CardDescription>
                Prévia da seção sobre exibida na homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Título</Label>
                <Input
                  id="about-title"
                  value={content.about_preview?.title || ''}
                  onChange={(e) => updateField('about_preview', 'title', e.target.value)}
                  placeholder="Digite o título da seção sobre"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about-subtitle">Subtítulo</Label>
                <Input
                  id="about-subtitle"
                  value={content.about_preview?.subtitle || ''}
                  onChange={(e) => updateField('about_preview', 'subtitle', e.target.value)}
                  placeholder="Digite o subtítulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about-content">Descrição</Label>
                <Textarea
                  id="about-content"
                  value={content.about_preview?.content || ''}
                  onChange={(e) => updateField('about_preview', 'content', e.target.value)}
                  placeholder="Digite a descrição da seção sobre"
                  rows={4}
                />
              </div>

              <Button
                onClick={() => updateContent('about_preview', {
                  title: content.about_preview?.title,
                  subtitle: content.about_preview?.subtitle,
                  content: content.about_preview?.content,
                  updated_at: new Date().toISOString()
                })}
                disabled={saving === 'about_preview'}
              >
                {saving === 'about_preview' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Sobre Preview
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Seção Serviços</CardTitle>
              <CardDescription>
                Prévia da seção serviços exibida na homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="services-title">Título</Label>
                <Input
                  id="services-title"
                  value={content.services_preview?.title || ''}
                  onChange={(e) => updateField('services_preview', 'title', e.target.value)}
                  placeholder="Digite o título da seção serviços"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services-subtitle">Subtítulo</Label>
                <Input
                  id="services-subtitle"
                  value={content.services_preview?.subtitle || ''}
                  onChange={(e) => updateField('services_preview', 'subtitle', e.target.value)}
                  placeholder="Digite o subtítulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services-content">Descrição</Label>
                <Textarea
                  id="services-content"
                  value={content.services_preview?.content || ''}
                  onChange={(e) => updateField('services_preview', 'content', e.target.value)}
                  placeholder="Digite a descrição da seção serviços"
                  rows={4}
                />
              </div>

              <Button
                onClick={() => updateContent('services_preview', {
                  title: content.services_preview?.title,
                  subtitle: content.services_preview?.subtitle,
                  content: content.services_preview?.content,
                  updated_at: new Date().toISOString()
                })}
                disabled={saving === 'services_preview'}
              >
                {saving === 'services_preview' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Serviços Preview
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};