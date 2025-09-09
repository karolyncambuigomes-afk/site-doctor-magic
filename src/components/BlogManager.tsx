import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  RefreshCw
} from 'lucide-react';

interface BlogPost {
  id: string;
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
  created_at: string;
}

export const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar posts do blog",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    try {
      if (editingPost?.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Post do blog atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Post do blog criado com sucesso"
        });
      }

      setIsDialogOpen(false);
      setEditingPost(null);
      loadBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar post do blog",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja deletar este post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Post do blog deletado com sucesso"
      });
      
      loadBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar post do blog",
        variant: "destructive"
      });
    }
  };

  const calculateSEOScore = (post: BlogPost) => {
    let score = 0;
    if (post.title && post.title.length >= 30 && post.title.length <= 60) score += 25;
    if (post.meta_description && post.meta_description.length >= 120 && post.meta_description.length <= 160) score += 25;
    if (post.seo_keywords && post.seo_keywords.length > 0) score += 25;
    if (post.excerpt && post.excerpt.length >= 120) score += 25;
    return score;
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Gerenciar Blog
          </h2>
          <p className="text-muted-foreground">
            Crie e gerencie posts do blog com otimização SEO avançada.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPost(null)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Post
            </Button>
          </DialogTrigger>
          <BlogPostDialog 
            post={editingPost} 
            onSave={handleSavePost}
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts do Blog</CardTitle>
          <CardDescription>
            Gerencie seus posts do blog com insights de otimização SEO.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum post encontrado. Crie seu primeiro post para começar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score SEO</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Criado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getSEOScoreColor(calculateSEOScore(post))}`}>
                        {calculateSEOScore(post)}/100
                      </span>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPost(post);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const BlogPostDialog: React.FC<{
  post: BlogPost | null;
  onSave: (data: Partial<BlogPost>) => void;
  onClose: () => void;
}> = ({ post, onSave, onClose }) => {
  const [formData, setFormData] = useState({
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
    read_time: 5
  });

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
        read_time: post.read_time || 5
      });
    } else {
      setFormData({
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
        read_time: 5
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {post ? 'Editar Post do Blog' : 'Criar Novo Post do Blog'}
        </DialogTitle>
        <DialogDescription>
          Crie e otimize seu post do blog para máximo impacto SEO.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do post"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="slug-do-post"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Breve descrição do post"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Conteúdo completo do post"
                rows={10}
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Descrição</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="Meta descrição para SEO"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Comprimento: {formData.meta_description.length}/160 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_keywords">Palavras-chave SEO</Label>
              <Input
                id="seo_keywords"
                value={formData.seo_keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                placeholder="palavra1, palavra2, palavra3"
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Nome do autor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Categoria do blog"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="is_published">Publicar imediatamente</Label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Salvar Post
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};