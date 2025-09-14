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

interface GuideContent {
  main_title: any;
  choosing_section: any;
  etiquette_section: any;
  locations_section: any;
  discretion_section: any;
  booking_section: any;
}

export const GuideManager: React.FC = () => {
  const [content, setContent] = useState<GuideContent>({
    main_title: null,
    choosing_section: null,
    etiquette_section: null,
    locations_section: null,
    discretion_section: null,
    booking_section: null
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
          'guide_main_title',
          'guide_choosing_section',
          'guide_etiquette_section',
          'guide_locations_section',
          'guide_discretion_section',
          'guide_booking_section'
        ]);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        const key = item.section.replace('guide_', '');
        contentMap[key] = item;
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo do guia",
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
        .eq('section', `guide_${section}`);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Seção do guia atualizada com sucesso!",
      });

      loadContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar seção do guia",
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
        ...prev[section as keyof GuideContent],
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

  const sections = [
    { key: 'main_title', name: 'Título Principal da Página', description: 'Título e descrição principal do London Escort Guide' },
    { key: 'choosing_section', name: 'Choosing Your Perfect Companion', description: 'Seção sobre como escolher a acompanhante ideal' },
    { key: 'etiquette_section', name: 'Escort Service Etiquette', description: 'Seção sobre etiqueta nos serviços de escort' },
    { key: 'locations_section', name: 'London\'s Premium Venues', description: 'Seção sobre locais premium em Londres' },
    { key: 'discretion_section', name: 'Privacy and Discretion', description: 'Seção sobre privacidade e discrição' },
    { key: 'booking_section', name: 'Booking Your Experience', description: 'Seção sobre como fazer reservas' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar London Escort Guide</h2>
        <p className="text-muted-foreground">
          Edite o conteúdo de todas as seções do guia
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {sections.map((section) => (
          <AccordionItem key={section.key} value={section.key}>
            <AccordionTrigger className="text-left">
              <div>
                <div className="font-medium">{section.name}</div>
                <div className="text-sm text-muted-foreground">{section.description}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${section.key}-title`}>Título</Label>
                    <Input
                      id={`${section.key}-title`}
                      value={content[section.key as keyof GuideContent]?.title || ''}
                      onChange={(e) => updateField(section.key, 'title', e.target.value)}
                      placeholder="Digite o título da seção"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${section.key}-subtitle`}>Subtítulo</Label>
                    <Input
                      id={`${section.key}-subtitle`}
                      value={content[section.key as keyof GuideContent]?.subtitle || ''}
                      onChange={(e) => updateField(section.key, 'subtitle', e.target.value)}
                      placeholder="Digite o subtítulo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${section.key}-content`}>Conteúdo</Label>
                    <Textarea
                      id={`${section.key}-content`}
                      value={content[section.key as keyof GuideContent]?.content || ''}
                      onChange={(e) => updateField(section.key, 'content', e.target.value)}
                      placeholder="Digite o conteúdo da seção"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={() => updateContent(section.key, {
                      title: content[section.key as keyof GuideContent]?.title,
                      subtitle: content[section.key as keyof GuideContent]?.subtitle,
                      content: content[section.key as keyof GuideContent]?.content,
                      updated_at: new Date().toISOString()
                    })}
                    disabled={saving === section.key}
                  >
                    {saving === section.key ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar {section.name}
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