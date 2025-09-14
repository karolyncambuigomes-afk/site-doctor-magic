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
import { Plus, Edit, Trash2, Copy, Globe, Monitor, Smartphone } from 'lucide-react';
import { SEOPreviewCard } from '@/components/seo/SEOPreviewCard';
import { SEOScoreIndicator } from '@/components/seo/SEOScoreIndicator';
import { usePageSEO } from '@/hooks/useSEOSettings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MetaTag {
  id: string;
  page_path: string;
  page_title: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  created_at: string;
  updated_at: string;
}

export const MetaTagsManager: React.FC = () => {
  const [metaTags, setMetaTags] = useState<MetaTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTag, setSelectedTag] = useState<MetaTag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'google' | 'facebook' | 'twitter'>('google');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    page_path: '',
    page_title: '',
    meta_title: '',
    meta_description: '',
    keywords: [] as string[],
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: ''
  });

  useEffect(() => {
    loadMetaTags();
  }, []);

  const loadMetaTags = async () => {
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMetaTags(data || []);
    } catch (error) {
      console.error('Error loading meta tags:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar meta tags",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      let query = supabase.from('page_seo');
      
      if (selectedTag) {
        const { error } = await query
          .update(dataToSave)
          .eq('id', selectedTag.id);
        if (error) throw error;
      } else {
        const { error } = await query.insert([dataToSave]);
        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: `Meta tags ${selectedTag ? 'atualizadas' : 'criadas'} com sucesso!`
      });

      setIsDialogOpen(false);
      setSelectedTag(null);
      resetForm();
      loadMetaTags();
    } catch (error) {
      console.error('Error saving meta tags:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar meta tags",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('page_seo')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Meta tags removidas com sucesso!"
      });

      loadMetaTags();
    } catch (error) {
      console.error('Error deleting meta tags:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover meta tags",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      page_path: '',
      page_title: '',
      meta_title: '',
      meta_description: '',
      keywords: [],
      og_title: '',
      og_description: '',
      og_image: '',
      twitter_title: '',
      twitter_description: '',
      twitter_image: ''
    });
  };

  const openDialog = (tag?: MetaTag) => {
    if (tag) {
      setSelectedTag(tag);
      setFormData({
        page_path: tag.page_path,
        page_title: tag.page_title,
        meta_title: tag.meta_title,
        meta_description: tag.meta_description,
        keywords: tag.keywords || [],
        og_title: tag.og_title || '',
        og_description: tag.og_description || '',
        og_image: tag.og_image || '',
        twitter_title: tag.twitter_title || '',
        twitter_description: tag.twitter_description || '',
        twitter_image: tag.twitter_image || ''
      });
    } else {
      setSelectedTag(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const addKeyword = () => {
    const keyword = prompt('Digite a palavra-chave:');
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
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
        title="Gerenciar Meta Tags - Five London Admin"
        description="Gerencie meta tags SEO para todas as páginas do site"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meta Tags Manager</h1>
            <p className="text-muted-foreground">
              Gerencie meta tags SEO para todas as páginas do site
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta Tag
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedTag ? 'Editar' : 'Criar'} Meta Tags
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="social">Redes Sociais</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="score">Score SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
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
                      <Label htmlFor="page_title">Título da Página</Label>
                      <Input
                        id="page_title"
                        value={formData.page_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, page_title: e.target.value }))}
                        placeholder="Título interno da página"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="Título que aparece no Google (máx. 60 caracteres)"
                      maxLength={60}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.meta_title.length}/60 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="Descrição que aparece no Google (máx. 160 caracteres)"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.meta_description.length}/160 caracteres
                    </p>
                  </div>

                  <div>
                    <Label>Palavras-chave</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(index)}>
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addKeyword}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Palavra-chave
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Open Graph (Facebook)</h3>
                    <div>
                      <Label htmlFor="og_title">OG Title</Label>
                      <Input
                        id="og_title"
                        value={formData.og_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                        placeholder="Título para Facebook (deixe vazio para usar meta_title)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="og_description">OG Description</Label>
                      <Textarea
                        id="og_description"
                        value={formData.og_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                        placeholder="Descrição para Facebook"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="og_image">OG Image URL</Label>
                      <Input
                        id="og_image"
                        value={formData.og_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                        placeholder="URL da imagem para Facebook"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Twitter Cards</h3>
                    <div>
                      <Label htmlFor="twitter_title">Twitter Title</Label>
                      <Input
                        id="twitter_title"
                        value={formData.twitter_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter_title: e.target.value }))}
                        placeholder="Título para Twitter"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter_description">Twitter Description</Label>
                      <Textarea
                        id="twitter_description"
                        value={formData.twitter_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter_description: e.target.value }))}
                        placeholder="Descrição para Twitter"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter_image">Twitter Image URL</Label>
                      <Input
                        id="twitter_image"
                        value={formData.twitter_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter_image: e.target.value }))}
                        placeholder="URL da imagem para Twitter"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={previewType === 'google' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewType('google')}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Google
                    </Button>
                    <Button
                      variant={previewType === 'facebook' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewType('facebook')}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      variant={previewType === 'twitter' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewType('twitter')}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                  </div>

                  <SEOPreviewCard
                    title={formData.meta_title || formData.page_title}
                    description={formData.meta_description}
                    url={`https://fivelondon.com${formData.page_path}`}
                    image={formData.og_image}
                    type={previewType}
                  />
                </TabsContent>

                <TabsContent value="score" className="space-y-4">
                  <SEOScoreIndicator
                    title={formData.meta_title}
                    description={formData.meta_description}
                    keywords={formData.keywords}
                    content=""
                    url={formData.page_path}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meta Tags Existentes</CardTitle>
            <CardDescription>
              Lista de todas as meta tags configuradas no site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metaTags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{tag.page_path}</Badge>
                      <h3 className="font-semibold">{tag.page_title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {tag.meta_title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tag.meta_description}
                    </p>
                    {tag.keywords && tag.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tag.keywords.slice(0, 3).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {tag.keywords.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tag.keywords.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja remover estas meta tags?')) {
                          handleDelete(tag.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {metaTags.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma meta tag configurada ainda.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};