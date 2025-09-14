import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PreferenceCategoriesManager } from '@/components/PreferenceCategoriesManager';

interface CharacteristicContent {
  main_title: any;
  blonde_content: any;
  brunette_content: any;
  international_content: any;
  young_content: any;
  mature_content: any;
  busty_content: any;
}

export const CharacteristicsManager: React.FC = () => {
  const [content, setContent] = useState<CharacteristicContent>({
    main_title: null,
    blonde_content: null,
    brunette_content: null,
    international_content: null,
    young_content: null,
    mature_content: null,
    busty_content: null
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
        .in('section', [
          'characteristics_main_title',
          'characteristics_blonde_content',
          'characteristics_brunette_content',
          'characteristics_international_content',
          'characteristics_young_content',
          'characteristics_mature_content',
          'characteristics_busty_content'
        ]);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        const key = item.section.replace('characteristics_', '');
        contentMap[key] = item;
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo de características",
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
        .eq('section', `characteristics_${section}`);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Característica atualizada com sucesso!",
      });

      loadContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar característica",
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
        ...prev[section as keyof CharacteristicContent],
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

  const characteristics = [
    { key: 'main_title', name: 'Título Principal da Página', description: 'Título e descrição principal da página de características' },
    { key: 'blonde_content', name: 'Blonde Escorts', description: 'Conteúdo sobre escorts loiras' },
    { key: 'brunette_content', name: 'Brunette Companions', description: 'Conteúdo sobre escorts morenas' },
    { key: 'international_content', name: 'International Escorts', description: 'Conteúdo sobre escorts internacionais' },
    { key: 'young_content', name: 'Young Escort Models', description: 'Conteúdo sobre escorts jovens' },
    { key: 'mature_content', name: 'Mature Luxury Escorts', description: 'Conteúdo sobre escorts maduras' },
    { key: 'busty_content', name: 'Curvy Escort Models', description: 'Conteúdo sobre escorts com curvas' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Site Content Manager</h2>
        <p className="text-muted-foreground">
          Manage content for different sections of the website
        </p>
      </div>

      {/* Preference Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle>Browse by Preference Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <PreferenceCategoriesManager />
        </CardContent>
      </Card>

      {/* Characteristics Content Section */}
      <Card>
        <CardHeader>
          <CardTitle>Characteristics Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {characteristics.map((characteristic) => (
          <AccordionItem key={characteristic.key} value={characteristic.key}>
            <AccordionTrigger className="text-left">
              <div>
                <div className="font-medium">{characteristic.name}</div>
                <div className="text-sm text-muted-foreground">{characteristic.description}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${characteristic.key}-title`}>Título</Label>
                    <Input
                      id={`${characteristic.key}-title`}
                      value={content[characteristic.key as keyof CharacteristicContent]?.title || ''}
                      onChange={(e) => updateField(characteristic.key, 'title', e.target.value)}
                      placeholder="Digite o título da característica"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${characteristic.key}-subtitle`}>Subtítulo</Label>
                    <Input
                      id={`${characteristic.key}-subtitle`}
                      value={content[characteristic.key as keyof CharacteristicContent]?.subtitle || ''}
                      onChange={(e) => updateField(characteristic.key, 'subtitle', e.target.value)}
                      placeholder="Digite o subtítulo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${characteristic.key}-content`}>Descrição</Label>
                    <Textarea
                      id={`${characteristic.key}-content`}
                      value={content[characteristic.key as keyof CharacteristicContent]?.content || ''}
                      onChange={(e) => updateField(characteristic.key, 'content', e.target.value)}
                      placeholder="Digite a descrição da característica"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={() => updateContent(characteristic.key, {
                      title: content[characteristic.key as keyof CharacteristicContent]?.title,
                      subtitle: content[characteristic.key as keyof CharacteristicContent]?.subtitle,
                      content: content[characteristic.key as keyof CharacteristicContent]?.content,
                      updated_at: new Date().toISOString()
                    })}
                    disabled={saving === characteristic.key}
                  >
                    {saving === characteristic.key ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar {characteristic.name}
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};