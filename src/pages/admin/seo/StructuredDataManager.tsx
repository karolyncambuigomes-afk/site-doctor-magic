import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Code, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StructuredData {
  id: string;
  page_path: string;
  schema_type: string;
  schema_data: any;
  is_valid: boolean;
  validation_errors?: string[];
  created_at: string;
  updated_at: string;
}

const SCHEMA_TEMPLATES = {
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Five London",
    "url": "https://fivelondon.com",
    "logo": "https://fivelondon.com/logo.png",
    "description": "Premium escort services in London",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "UK"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-XX-XXXX-XXXX",
      "contactType": "customer service"
    }
  },
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Título do Artigo",
    "description": "Descrição do artigo",
    "author": {
      "@type": "Person",
      "name": "Nome do Autor"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Five London",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fivelondon.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "image": "https://fivelondon.com/article-image.jpg",
    "url": "https://fivelondon.com/article-url"
  },
  LocalBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Five London",
    "description": "Premium escort services in London",
    "url": "https://fivelondon.com",
    "telephone": "+44-XX-XXXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Street Address",
      "addressLocality": "London",
      "postalCode": "Postal Code",
      "addressCountry": "UK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.5074",
      "longitude": "-0.1278"
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "priceRange": "£££"
  },
  WebPage: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Título da Página",
    "description": "Descrição da página",
    "url": "https://fivelondon.com/page-url",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Five London",
      "url": "https://fivelondon.com"
    },
    "inLanguage": "en-GB",
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString()
  },
  FAQ: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Pergunta 1?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Resposta 1"
        }
      },
      {
        "@type": "Question",
        "name": "Pergunta 2?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Resposta 2"
        }
      }
    ]
  }
};

export const StructuredDataManager: React.FC = () => {
  const [structuredData, setStructuredData] = useState<StructuredData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedData, setSelectedData] = useState<StructuredData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    page_path: '',
    schema_type: '',
    schema_data: ''
  });

  useEffect(() => {
    loadStructuredData();
  }, []);

  const loadStructuredData = async () => {
    try {
      const { data, error } = await supabase
        .from('structured_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStructuredData(data || []);
    } catch (error) {
      console.error('Error loading structured data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados estruturados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateStructuredData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      
      // Validação básica de schema.org
      const errors: string[] = [];
      
      if (!parsed['@context'] || !parsed['@context'].includes('schema.org')) {
        errors.push('@context deve incluir "https://schema.org"');
      }
      
      if (!parsed['@type']) {
        errors.push('@type é obrigatório');
      }
      
      if (parsed['@type'] === 'Organization' && !parsed.name) {
        errors.push('Nome da organização é obrigatório');
      }
      
      if (parsed['@type'] === 'Article') {
        if (!parsed.headline) errors.push('Headline é obrigatório para artigos');
        if (!parsed.author) errors.push('Autor é obrigatório para artigos');
        if (!parsed.datePublished) errors.push('Data de publicação é obrigatória para artigos');
      }
      
      setValidationResult({
        isValid: errors.length === 0,
        errors
      });
      
      return { isValid: errors.length === 0, errors };
    } catch (error) {
      const errors = ['JSON inválido: ' + (error as Error).message];
      setValidationResult({ isValid: false, errors });
      return { isValid: false, errors };
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const validation = validateStructuredData(formData.schema_data);
      
      const dataToSave = {
        page_path: formData.page_path,
        schema_type: formData.schema_type,
        schema_data: JSON.parse(formData.schema_data),
        is_valid: validation.isValid,
        validation_errors: validation.errors.length > 0 ? validation.errors : null,
        updated_at: new Date().toISOString()
      };

      let query = supabase.from('structured_data');
      
      if (selectedData) {
        const { error } = await query
          .update(dataToSave)
          .eq('id', selectedData.id);
        if (error) throw error;
      } else {
        const { error } = await query.insert([dataToSave]);
        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: `Dados estruturados ${selectedData ? 'atualizados' : 'criados'} com sucesso!`
      });

      setIsDialogOpen(false);
      setSelectedData(null);
      resetForm();
      loadStructuredData();
    } catch (error) {
      console.error('Error saving structured data:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados estruturados",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('structured_data')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dados estruturados removidos com sucesso!"
      });

      loadStructuredData();
    } catch (error) {
      console.error('Error deleting structured data:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover dados estruturados",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      page_path: '',
      schema_type: '',
      schema_data: ''
    });
    setValidationResult(null);
  };

  const openDialog = (data?: StructuredData) => {
    if (data) {
      setSelectedData(data);
      setFormData({
        page_path: data.page_path,
        schema_type: data.schema_type,
        schema_data: JSON.stringify(data.schema_data, null, 2)
      });
    } else {
      setSelectedData(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const loadTemplate = (templateType: string) => {
    const template = SCHEMA_TEMPLATES[templateType as keyof typeof SCHEMA_TEMPLATES];
    if (template) {
      setFormData(prev => ({
        ...prev,
        schema_type: templateType,
        schema_data: JSON.stringify(template, null, 2)
      }));
      validateStructuredData(JSON.stringify(template, null, 2));
    }
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast({
      title: "Copiado",
      description: "JSON copiado para a área de transferência"
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO 
        title="Dados Estruturados - Five London Admin"
        description="Gerencie dados estruturados schema.org para SEO"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dados Estruturados</h1>
            <p className="text-muted-foreground">
              Gerencie markup schema.org para melhorar SEO e rich snippets
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Schema
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedData ? 'Editar' : 'Criar'} Dados Estruturados
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="editor" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="validation">Validação</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="page_path">Caminho da Página</Label>
                      <Input
                        id="page_path"
                        value={formData.page_path}
                        onChange={(e) => setFormData(prev => ({ ...prev, page_path: e.target.value }))}
                        placeholder="/sobre, /contato, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="schema_type">Tipo de Schema</Label>
                      <Select
                        value={formData.schema_type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, schema_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Organization">Organization</SelectItem>
                          <SelectItem value="Article">Article</SelectItem>
                          <SelectItem value="LocalBusiness">LocalBusiness</SelectItem>
                          <SelectItem value="WebPage">WebPage</SelectItem>
                          <SelectItem value="FAQ">FAQ</SelectItem>
                          <SelectItem value="Person">Person</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="schema_data">JSON Schema</Label>
                    <Textarea
                      id="schema_data"
                      value={formData.schema_data}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, schema_data: e.target.value }));
                        if (e.target.value) {
                          validateStructuredData(e.target.value);
                        }
                      }}
                      placeholder="Cole ou edite o JSON schema aqui..."
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(SCHEMA_TEMPLATES).map((template) => (
                      <Card key={template} className="cursor-pointer hover:bg-muted/50" onClick={() => loadTemplate(template)}>
                        <CardHeader>
                          <CardTitle className="text-lg">{template}</CardTitle>
                          <CardDescription>
                            Template para {template.toLowerCase()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" size="sm">
                            <Code className="h-4 w-4 mr-2" />
                            Usar Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="validation" className="space-y-4">
                  {validationResult && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {validationResult.isValid ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                          Resultado da Validação
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {validationResult.isValid ? (
                          <p className="text-green-600">Schema válido! ✓</p>
                        ) : (
                          <div>
                            <p className="text-red-600 mb-2">Erros encontrados:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {validationResult.errors.map((error, index) => (
                                <li key={index} className="text-sm text-red-600">
                                  {error}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Teste Externo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use as ferramentas do Google para validar seus dados estruturados:
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href="https://search.google.com/test/rich-results" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Rich Results Test
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href="https://validator.schema.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Schema.org Validator
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving || (validationResult && !validationResult.isValid)}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schemas Configurados</CardTitle>
            <CardDescription>
              Lista de todos os dados estruturados configurados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {structuredData.map((data) => (
                <div key={data.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{data.page_path}</Badge>
                      <Badge variant={data.is_valid ? "default" : "destructive"}>
                        {data.schema_type}
                      </Badge>
                      {data.is_valid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    {!data.is_valid && data.validation_errors && (
                      <div className="text-sm text-red-600">
                        Erros: {data.validation_errors.join(', ')}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Criado em: {new Date(data.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(data.schema_data)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog(data)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja remover este schema?')) {
                          handleDelete(data.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {structuredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum dado estruturado configurado ainda.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};