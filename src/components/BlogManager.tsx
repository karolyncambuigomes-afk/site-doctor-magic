import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, Eye } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  published_at: string;
  author: string;
  category: string;
  read_time: number;
  seo_keywords: string;
  meta_description: string;
  is_published: boolean;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    category: '',
    read_time: '',
    seo_keywords: '',
    meta_description: '',
    is_published: false
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar posts');
    } else {
      setPosts(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_published: checked }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('model-images')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Erro ao fazer upload da imagem');
    } else {
      const { data } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      toast.success('Imagem carregada com sucesso!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      ...formData,
      read_time: parseInt(formData.read_time) || 5,
      published_at: formData.is_published ? new Date().toISOString() : null
    };

    if (editingPost) {
      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', editingPost.id);

      if (error) {
        toast.error('Erro ao atualizar post');
      } else {
        toast.success('Post atualizado com sucesso!');
        setEditingPost(null);
        fetchPosts();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .insert([postData]);

      if (error) {
        toast.error('Erro ao criar post');
      } else {
        toast.success('Post criado com sucesso!');
        setIsCreating(false);
        fetchPosts();
        resetForm();
      }
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content || '',
      image: post.image || '',
      author: post.author || '',
      category: post.category || '',
      read_time: post.read_time?.toString() || '5',
      seo_keywords: post.seo_keywords || '',
      meta_description: post.meta_description || '',
      is_published: post.is_published
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir post');
    } else {
      toast.success('Post excluído com sucesso!');
      fetchPosts();
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: '',
      category: '',
      read_time: '',
      seo_keywords: '',
      meta_description: '',
      is_published: false
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Blog</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPost ? 'Editar Post' : 'Novo Post'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="read_time">Tempo de Leitura (min)</Label>
                  <Input
                    id="read_time"
                    name="read_time"
                    type="number"
                    value={formData.read_time}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Upload de Imagem</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="mt-2 h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Conteúdo (HTML)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                />
              </div>
              
              <div>
                <Label htmlFor="meta_description">Meta Descrição (SEO)</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="seo_keywords">Palavras-chave SEO</Label>
                <Input
                  id="seo_keywords"
                  name="seo_keywords"
                  value={formData.seo_keywords}
                  onChange={handleInputChange}
                  placeholder="palavra1, palavra2, palavra3"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_published">Publicar post</Label>
              </div>
              
              <div className="flex gap-4">
                <Button type="submit">
                  {editingPost ? 'Atualizar' : 'Criar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPost(null);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold flex-1">{post.title}</h3>
                {post.is_published ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {post.category} • {post.read_time || 5} min de leitura
              </p>
              <p className="text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(post)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}