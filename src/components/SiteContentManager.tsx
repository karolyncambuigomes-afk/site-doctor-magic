import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { Save, FileText, Image as ImageIcon, Info } from 'lucide-react';

interface SiteContent {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  button_text: string | null;
  button_url: string | null;
  is_active: boolean;
}

export const SiteContentManager: React.FC = () => {
  const { toast } = useToast();
  const [contentSections, setContentSections] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section');

      if (error) throw error;

      setContentSections(data || []);
    } catch (error) {
      console.error('Error loading site content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo do site",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (section: SiteContent) => {
    setSaving(section.id);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          title: section.title,
          subtitle: section.subtitle,
          content: section.content,
          image_url: section.image_url,
          image_alt: section.image_alt,
          button_text: section.button_text,
          button_url: section.button_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conteúdo atualizado com sucesso"
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar conteúdo",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  const updateSectionField = (sectionId: string, field: keyof SiteContent, value: string) => {
    setContentSections(contentSections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    ));
  };

  const getSectionDisplayName = (sectionKey: string): string => {
    const sectionNames: Record<string, string> = {
      'about_intro': 'About Us - Introdução',
      'about_mission': 'About Us - Nossa Missão',
      'about_values': 'About Us - Nossos Valores'
    };
    return sectionNames[sectionKey] || sectionKey;
  };

  const getSectionIcon = (sectionKey: string) => {
    if (sectionKey === 'hero') {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
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
        {contentSections.filter(section => section.section !== 'hero').map((section) => (
          <AccordionItem key={section.id} value={section.id} className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                {getSectionIcon(section.section)}
                <span className="font-medium">{getSectionDisplayName(section.section)}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Conteúdo de Texto */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      Conteúdo de Texto
                    </h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`title-${section.id}`}>Título</Label>
                      <Input
                        id={`title-${section.id}`}
                        value={section.title || ''}
                        onChange={(e) => updateSectionField(section.id, 'title', e.target.value)}
                        placeholder="Título da seção"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`subtitle-${section.id}`}>Subtítulo</Label>
                      <Input
                        id={`subtitle-${section.id}`}
                        value={section.subtitle || ''}
                        onChange={(e) => updateSectionField(section.id, 'subtitle', e.target.value)}
                        placeholder="Subtítulo da seção"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`content-${section.id}`}>Conteúdo</Label>
                      <Textarea
                        id={`content-${section.id}`}
                        value={section.content || ''}
                        onChange={(e) => updateSectionField(section.id, 'content', e.target.value)}
                        placeholder="Conteúdo principal da seção"
                        rows={4}
                      />
                    </div>

                    {/* Botão (se aplicável) */}
                    {(section.button_text || section.button_url) && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor={`button-text-${section.id}`}>Texto do Botão</Label>
                          <Input
                            id={`button-text-${section.id}`}
                            value={section.button_text || ''}
                            onChange={(e) => updateSectionField(section.id, 'button_text', e.target.value)}
                            placeholder="Texto do botão"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`button-url-${section.id}`}>URL do Botão</Label>
                          <Input
                            id={`button-url-${section.id}`}
                            value={section.button_url || ''}
                            onChange={(e) => updateSectionField(section.id, 'button_url', e.target.value)}
                            placeholder="/pagina ou https://..."
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Imagem */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2 text-sm">
                      <ImageIcon className="w-4 h-4" />
                      Imagem da Seção
                    </h4>

                    <ImageUpload
                      value={section.image_url || ''}
                      onChange={(url) => updateSectionField(section.id, 'image_url', url)}
                      label="Imagem"
                      placeholder="URL da imagem ou faça upload"
                    />

                    <div className="space-y-2">
                      <Label htmlFor={`alt-${section.id}`}>Texto Alternativo da Imagem</Label>
                      <Input
                        id={`alt-${section.id}`}
                        value={section.image_alt || ''}
                        onChange={(e) => updateSectionField(section.id, 'image_alt', e.target.value)}
                        placeholder="Descrição da imagem para acessibilidade"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview da Imagem */}
                {section.image_url && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h5 className="font-medium mb-2">Preview da Imagem</h5>
                    <img 
                      src={section.image_url} 
                      alt={section.image_alt || section.title || 'Preview'}
                      className="max-w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Botão Salvar */}
                <div className="flex justify-end">
                  <Button 
                    onClick={() => updateContent(section)}
                    disabled={saving === section.id}
                  >
                    {saving === section.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* Instruções */}
        <AccordionItem value="instructions" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="font-medium">Como usar</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <ul className="text-sm text-muted-foreground space-y-2">
                
                <li>• <strong>About Us:</strong> Seções da página sobre a empresa</li>
                <li>• <strong>Imagens:</strong> Faça upload ou use URLs de imagens existentes</li>
                <li>• <strong>Texto Alternativo:</strong> Importante para acessibilidade e SEO</li>
                <li>• <strong>Salvar:</strong> Clique em "Salvar Alterações" para aplicar as mudanças</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};