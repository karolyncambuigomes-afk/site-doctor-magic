import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ImageUpload';

// import { RichTextEditor } from './RichTextEditor';
import { 
  Save, 
  Eye, 
  Copy, 
  Hash, 
  Clock, 
  Target, 
  Globe,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  meta_description: string;
  seo_keywords: string;
  service_keywords: string[];
  is_published: boolean;
  read_time: number;
}

interface BlogPostFormProps {
  post: BlogPost | null;
  onSave: (data: Partial<BlogPost>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const BlogPostForm: React.FC<BlogPostFormProps> = ({
  post,
  onSave,
  onClose,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image: '',
    meta_description: '',
    seo_keywords: '',
    service_keywords: [],
    is_published: false,
    read_time: 1
  });

  const [autoSave, setAutoSave] = useState(true);
  const [seoScore, setSeoScore] = useState(0);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || '',
        category: post.category || '',
        image: post.image || '',
        meta_description: post.meta_description || '',
        seo_keywords: post.seo_keywords || '',
        service_keywords: post.service_keywords || [],
        is_published: post.is_published || false,
        read_time: post.read_time || 1
      });
    }
  }, [post]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && (!formData.slug || !post)) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, post]);

  // Calculate SEO score
  useEffect(() => {
    let score = 0;
    
    // Title (20 points)
    if (formData.title && formData.title.length >= 30 && formData.title.length <= 60) {
      score += 20;
    } else if (formData.title && formData.title.length > 0) {
      score += 10;
    }
    
    // Meta description (20 points)
    if (formData.meta_description && formData.meta_description.length >= 120 && formData.meta_description.length <= 160) {
      score += 20;
    } else if (formData.meta_description && formData.meta_description.length > 0) {
      score += 10;
    }
    
    // Content (20 points)
    if (formData.content && formData.content.length >= 300) {
      score += 20;
    } else if (formData.content && formData.content.length > 0) {
      score += 10;
    }
    
    // Keywords (15 points)
    if (formData.seo_keywords) {
      const keywords = formData.seo_keywords.split(',').filter(k => k.trim());
      if (keywords.length >= 3) score += 15;
      else if (keywords.length > 0) score += 8;
    }
    
    // Image (10 points)
    if (formData.image) score += 10;
    
    // Excerpt (10 points)
    if (formData.excerpt && formData.excerpt.length >= 100) score += 10;
    else if (formData.excerpt) score += 5;
    
    // Category (5 points)
    if (formData.category) score += 5;

    setSeoScore(Math.min(100, score));
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const duplicatePost = () => {
    setFormData(prev => ({
      ...prev,
      title: `${prev.title} - Cópia`,
      slug: `${prev.slug}-copia`,
      is_published: false
    }));
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeoScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertCircle;
    return AlertCircle;
  };

  const SeoScoreIcon = getSeoScoreIcon(seoScore);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {post ? 'Editar Post' : 'Novo Post'}
          </h2>
          <p className="text-muted-foreground">
            Crie conteúdo otimizado para SEO e engajamento
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* SEO Score */}
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <SeoScoreIcon className={`h-5 w-5 ${getSeoScoreColor(seoScore)}`} />
              <div>
                <div className="text-sm font-medium">SEO Score</div>
                <div className={`text-lg font-bold ${getSeoScoreColor(seoScore)}`}>
                  {seoScore}/100
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            {post && (
              <Button type="button" variant="outline" onClick={duplicatePost}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Title and Slug */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Post</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite um título atrativo..."
              />
              <div className="text-xs text-muted-foreground">
                {formData.title?.length || 0}/60 caracteres (ideal: 30-60)
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL (Slug)</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                  /blog/
                </div>
                <Input
                  id="slug"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-do-post"
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Breve descrição que aparecerá na listagem de posts..."
              rows={3}
            />
            <div className="text-xs text-muted-foreground">
              {formData.excerpt?.length || 0} caracteres (recomendado: 100-150)
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Escreva o conteúdo do seu post..."
              rows={15}
              className="font-mono text-sm"
            />
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Otimização SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Descrição</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Descrição que aparecerá nos resultados do Google..."
                  rows={3}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formData.meta_description?.length || 0}/160 caracteres</span>
                  <span>Ideal: 120-160 caracteres</span>
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="seo_keywords">Palavras-chave</Label>
                <Input
                  id="seo_keywords"
                  value={formData.seo_keywords || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                  placeholder="palavra1, palavra2, palavra3"
                />
                <div className="text-xs text-muted-foreground">
                  Separe por vírgulas. Recomendado: 3-5 palavras-chave relevantes
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview Google</Label>
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-1">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {formData.title || 'Título do Post'}
                    </div>
                    <div className="text-green-700 text-sm">
                      https://seusite.com/blog/{formData.slug || 'slug-do-post'}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {formData.meta_description || 'Meta descrição aparecerá aqui...'}
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <ImageUpload
            value={formData.image || ''}
            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
            label="Featured Image"
            placeholder="Main post image"
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={formData.author || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Nome do autor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Lifestyle, Reviews, Guides"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_published">Status de Publicação</Label>
                    <p className="text-xs text-muted-foreground">
                      Publicar imediatamente ou manter como rascunho
                    </p>
                  </div>
                  <Switch
                    id="is_published"
                    checked={formData.is_published || false}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estatísticas do Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tempo de leitura:</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formData.read_time || 1} min
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Palavras:</span>
                  <Badge variant="outline">
                    {formData.content?.trim().split(/\s+/).filter(word => word.length > 0).length || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">SEO Score:</span>
                  <Badge 
                    variant={seoScore >= 80 ? 'default' : seoScore >= 60 ? 'secondary' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    <SeoScoreIcon className="h-3 w-3" />
                    {seoScore}/100
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={formData.is_published ? 'default' : 'secondary'}>
                    {formData.is_published ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};