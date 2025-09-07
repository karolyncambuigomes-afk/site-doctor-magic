import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LegalContent {
  privacy_main_title: any;
  privacy_data_collection: any;
  privacy_data_usage: any;
  privacy_data_security: any;
  terms_main_title: any;
  terms_service_scope: any;
  terms_client_responsibilities: any;
  terms_booking_policy: any;
}

export const LegalPagesManager: React.FC = () => {
  const [content, setContent] = useState<LegalContent>({
    privacy_main_title: null,
    privacy_data_collection: null,
    privacy_data_usage: null,
    privacy_data_security: null,
    terms_main_title: null,
    terms_service_scope: null,
    terms_client_responsibilities: null,
    terms_booking_policy: null
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
          'privacy_main_title',
          'privacy_data_collection',
          'privacy_data_usage',
          'privacy_data_security',
          'terms_main_title',
          'terms_service_scope',
          'terms_client_responsibilities',
          'terms_booking_policy'
        ]);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.section] = item;
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo das páginas legais",
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
        .eq('section', section);

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
        ...prev[section as keyof LegalContent],
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

  const privacySections = [
    { key: 'privacy_main_title', name: 'Título Principal', description: 'Título e descrição principal da política de privacidade' },
    { key: 'privacy_data_collection', name: 'Coleta de Informações', description: 'Seção sobre coleta de dados' },
    { key: 'privacy_data_usage', name: 'Uso das Informações', description: 'Seção sobre como usamos os dados' },
    { key: 'privacy_data_security', name: 'Segurança dos Dados', description: 'Seção sobre segurança das informações' }
  ];

  const termsSections = [
    { key: 'terms_main_title', name: 'Título Principal', description: 'Título e descrição principal dos termos de serviço' },
    { key: 'terms_service_scope', name: 'Escopo dos Serviços', description: 'Seção sobre descrição dos serviços' },
    { key: 'terms_client_responsibilities', name: 'Responsabilidades do Cliente', description: 'Seção sobre obrigações dos clientes' },
    { key: 'terms_booking_policy', name: 'Política de Reservas', description: 'Seção sobre políticas de reserva e cancelamento' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manage Legal Pages</h2>
        <p className="text-muted-foreground">
          Edit the content of Privacy Policy and Terms of Service pages
        </p>
      </div>

      <Tabs defaultValue="privacy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          <Accordion type="single" collapsible className="w-full">
            {privacySections.map((section) => (
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
                          value={content[section.key as keyof LegalContent]?.title || ''}
                          onChange={(e) => updateField(section.key, 'title', e.target.value)}
                          placeholder="Digite o título da seção"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${section.key}-subtitle`}>Subtítulo</Label>
                        <Input
                          id={`${section.key}-subtitle`}
                          value={content[section.key as keyof LegalContent]?.subtitle || ''}
                          onChange={(e) => updateField(section.key, 'subtitle', e.target.value)}
                          placeholder="Digite o subtítulo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${section.key}-content`}>Conteúdo</Label>
                        <Textarea
                          id={`${section.key}-content`}
                          value={content[section.key as keyof LegalContent]?.content || ''}
                          onChange={(e) => updateField(section.key, 'content', e.target.value)}
                          placeholder="Digite o conteúdo da seção"
                          rows={6}
                        />
                      </div>

                      <Button
                        onClick={() => updateContent(section.key, {
                          title: content[section.key as keyof LegalContent]?.title,
                          subtitle: content[section.key as keyof LegalContent]?.subtitle,
                          content: content[section.key as keyof LegalContent]?.content,
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
        </TabsContent>

        <TabsContent value="terms">
          <Accordion type="single" collapsible className="w-full">
            {termsSections.map((section) => (
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
                          value={content[section.key as keyof LegalContent]?.title || ''}
                          onChange={(e) => updateField(section.key, 'title', e.target.value)}
                          placeholder="Digite o título da seção"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${section.key}-subtitle`}>Subtítulo</Label>
                        <Input
                          id={`${section.key}-subtitle`}
                          value={content[section.key as keyof LegalContent]?.subtitle || ''}
                          onChange={(e) => updateField(section.key, 'subtitle', e.target.value)}
                          placeholder="Digite o subtítulo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${section.key}-content`}>Conteúdo</Label>
                        <Textarea
                          id={`${section.key}-content`}
                          value={content[section.key as keyof LegalContent]?.content || ''}
                          onChange={(e) => updateField(section.key, 'content', e.target.value)}
                          placeholder="Digite o conteúdo da seção"
                          rows={6}
                        />
                      </div>

                      <Button
                        onClick={() => updateContent(section.key, {
                          title: content[section.key as keyof LegalContent]?.title,
                          subtitle: content[section.key as keyof LegalContent]?.subtitle,
                          content: content[section.key as keyof LegalContent]?.content,
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
        </TabsContent>
      </Tabs>
    </div>
  );
};