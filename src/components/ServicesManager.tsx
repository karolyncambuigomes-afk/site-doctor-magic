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

interface ServiceContent {
  main_title: any;
  dinner_dates: any;
  social_events: any;
  business_functions: any;
  travel_companion: any;
  private_meetings: any;
}

export const ServicesManager: React.FC = () => {
  const [content, setContent] = useState<ServiceContent>({
    main_title: null,
    dinner_dates: null,
    social_events: null,
    business_functions: null,
    travel_companion: null,
    private_meetings: null
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
          'services_main_title',
          'services_dinner_dates',
          'services_social_events',
          'services_business_functions',
          'services_travel_companion',
          'services_private_meetings'
        ]);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        const key = item.section.replace('services_', '');
        contentMap[key] = item;
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo de serviços",
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
        .eq('section', `services_${section}`);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso!",
      });

      loadContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar serviço",
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
        ...prev[section as keyof ServiceContent],
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

  const services = [
    { key: 'main_title', name: 'Título Principal da Página', description: 'Título e descrição principal da página de serviços' },
    { key: 'dinner_dates', name: 'Elegant Dinner Dates', description: 'Serviço de acompanhantes para jantares elegantes' },
    { key: 'social_events', name: 'Exclusive Social Events', description: 'Acompanhantes para eventos sociais exclusivos' },
    { key: 'business_functions', name: 'Business & Corporate Events', description: 'Acompanhantes para eventos corporativos' },
    { key: 'travel_companion', name: 'Travel Companionship', description: 'Serviços de acompanhantes de viagem' },
    { key: 'private_meetings', name: 'Private Consultations', description: 'Consultas e encontros privados' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar Serviços</h2>
        <p className="text-muted-foreground">
          Edite o conteúdo de todos os serviços oferecidos
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {services.map((service) => (
          <AccordionItem key={service.key} value={service.key}>
            <AccordionTrigger className="text-left">
              <div>
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-muted-foreground">{service.description}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${service.key}-title`}>Título</Label>
                    <Input
                      id={`${service.key}-title`}
                      value={content[service.key as keyof ServiceContent]?.title || ''}
                      onChange={(e) => updateField(service.key, 'title', e.target.value)}
                      placeholder="Digite o título do serviço"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${service.key}-subtitle`}>Subtítulo</Label>
                    <Input
                      id={`${service.key}-subtitle`}
                      value={content[service.key as keyof ServiceContent]?.subtitle || ''}
                      onChange={(e) => updateField(service.key, 'subtitle', e.target.value)}
                      placeholder="Digite o subtítulo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${service.key}-content`}>Descrição</Label>
                    <Textarea
                      id={`${service.key}-content`}
                      value={content[service.key as keyof ServiceContent]?.content || ''}
                      onChange={(e) => updateField(service.key, 'content', e.target.value)}
                      placeholder="Digite a descrição do serviço"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={() => updateContent(service.key, {
                      title: content[service.key as keyof ServiceContent]?.title,
                      subtitle: content[service.key as keyof ServiceContent]?.subtitle,
                      content: content[service.key as keyof ServiceContent]?.content,
                      updated_at: new Date().toISOString()
                    })}
                    disabled={saving === service.key}
                  >
                    {saving === service.key ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar {service.name}
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