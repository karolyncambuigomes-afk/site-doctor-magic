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

interface LocationContent {
  main_title: any;
  mayfair_content: any;
  knightsbridge_content: any;
  chelsea_content: any;
  belgravia_content: any;
  kensington_content: any;
  canary_wharf_content: any;
}

export const LocationsManager: React.FC = () => {
  const [content, setContent] = useState<LocationContent>({
    main_title: null,
    mayfair_content: null,
    knightsbridge_content: null,
    chelsea_content: null,
    belgravia_content: null,
    kensington_content: null,
    canary_wharf_content: null
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
          'locations_main_title',
          'locations_mayfair_content',
          'locations_knightsbridge_content',
          'locations_chelsea_content',
          'locations_belgravia_content',
          'locations_kensington_content',
          'locations_canary_wharf_content'
        ]);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        const key = item.section.replace('locations_', '');
        contentMap[key] = item;
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo de localizações",
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
        .eq('section', `locations_${section}`);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Localização atualizada com sucesso!",
      });

      loadContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar localização",
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
        ...prev[section as keyof LocationContent],
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

  const locations = [
    { key: 'main_title', name: 'Título Principal da Página', description: 'Título e descrição principal da página de localizações' },
    { key: 'mayfair_content', name: 'Mayfair', description: 'Conteúdo sobre escorts em Mayfair' },
    { key: 'knightsbridge_content', name: 'Knightsbridge', description: 'Conteúdo sobre escorts em Knightsbridge' },
    { key: 'chelsea_content', name: 'Chelsea', description: 'Conteúdo sobre escorts em Chelsea' },
    { key: 'belgravia_content', name: 'Belgravia', description: 'Conteúdo sobre escorts em Belgravia' },
    { key: 'kensington_content', name: 'Kensington', description: 'Conteúdo sobre escorts em Kensington' },
    { key: 'canary_wharf_content', name: 'Canary Wharf', description: 'Conteúdo sobre escorts em Canary Wharf' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar Localizações</h2>
        <p className="text-muted-foreground">
          Edite o conteúdo de todas as localizações em Londres
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {locations.map((location) => (
          <AccordionItem key={location.key} value={location.key}>
            <AccordionTrigger className="text-left">
              <div>
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-muted-foreground">{location.description}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${location.key}-title`}>Título</Label>
                    <Input
                      id={`${location.key}-title`}
                      value={content[location.key as keyof LocationContent]?.title || ''}
                      onChange={(e) => updateField(location.key, 'title', e.target.value)}
                      placeholder="Digite o título da localização"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${location.key}-subtitle`}>Subtítulo</Label>
                    <Input
                      id={`${location.key}-subtitle`}
                      value={content[location.key as keyof LocationContent]?.subtitle || ''}
                      onChange={(e) => updateField(location.key, 'subtitle', e.target.value)}
                      placeholder="Digite o subtítulo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${location.key}-content`}>Descrição</Label>
                    <Textarea
                      id={`${location.key}-content`}
                      value={content[location.key as keyof LocationContent]?.content || ''}
                      onChange={(e) => updateField(location.key, 'content', e.target.value)}
                      placeholder="Digite a descrição da localização"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={() => updateContent(location.key, {
                      title: content[location.key as keyof LocationContent]?.title,
                      subtitle: content[location.key as keyof LocationContent]?.subtitle,
                      content: content[location.key as keyof LocationContent]?.content,
                      updated_at: new Date().toISOString()
                    })}
                    disabled={saving === location.key}
                  >
                    {saving === location.key ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar {location.name}
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};