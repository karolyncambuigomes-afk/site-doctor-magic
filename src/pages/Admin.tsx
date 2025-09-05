import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, Image, Settings, FileText, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { characteristics } from '@/data/characteristics';
import { ImageUpload } from '@/components/ImageUpload';
import { GalleryManager } from '@/components/GalleryManager';
import { SiteContentManager } from '@/components/SiteContentManager';

interface Model {
  id: string;
  name: string;
  age: number | null;
  location: string | null;
  price: string | null;
  image: string | null;
  characteristics: string[] | null;
  services: string[] | null;
  availability: string | null;
  description: string | null;
  height: string | null;
  measurements: string | null;
  hair: string | null;
  eyes: string | null;
  nationality: string | null;
  interests: string[] | null;
  education: string | null;
  pricing: any;
  rating: number | null;
  reviews: number | null;
}

interface Profile {
  id: string;
  email: string;
  role: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  category: string | null;
  image: string | null;
  meta_description: string | null;
  seo_keywords: string | null;
  service_keywords: string[] | null;
  is_published: boolean;
  published_at: string | null;
  read_time: number | null;
  created_at: string;
  updated_at: string;
}

export const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<Array<{id?: string, image_url: string, caption: string, order_index: number}>>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<Model>>({
    name: '',
    age: null,
    location: '',
    price: '',
    image: '',
    characteristics: [],
    services: [],
    availability: '',
    description: '',
    height: '',
    measurements: '',
    hair: '',
    eyes: '',
    nationality: '',
    interests: [],
    education: ''
  });

  // Blog form state
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({
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
    read_time: null
  });

  // Available service keywords that can be linked
  const availableServiceKeywords = [
    "Michelin-starred restaurants",
    "Corporate event experience", 
    "International experience",
    "Theatre knowledge",
    "Event experience",
    "Wine knowledge",
    "Music appreciation",
    "Customized experiences"
  ];

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        console.log('No user found');
        setIsAdmin(false);
        setLoadingData(false);
        return;
      }
      
      console.log('Checking admin status for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setLoadingData(false);
          return;
        }

        console.log('Profile data:', data);
        const adminStatus = data?.role === 'admin';
        console.log('Is admin:', adminStatus);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoadingData(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) {
        console.log('User is not admin, skipping data fetch');
        return;
      }

      console.log('Fetching admin data...');

      try {
        const [modelsResponse, profilesResponse, blogResponse] = await Promise.all([
          supabase.from('models').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
        ]);

        if (modelsResponse.error) {
          console.error('Error fetching models:', modelsResponse.error);
          toast({
            title: "Erro",
            description: "Erro ao carregar modelos",
            variant: "destructive"
          });
        } else {
          setModels(modelsResponse.data || []);
        }

        if (profilesResponse.error) {
          console.error('Error fetching profiles:', profilesResponse.error);
        } else {
          setProfiles(profilesResponse.data || []);
        }

        if (blogResponse.error) {
          console.error('Error fetching blog posts:', blogResponse.error);
        } else {
          setBlogPosts(blogResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isAdmin, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let modelId: string;
      
      if (editingModel) {
        // Update existing model
        const { error } = await supabase
          .from('models')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingModel.id);

        if (error) throw error;
        
        modelId = editingModel.id;

        setModels(models.map(model => 
          model.id === editingModel.id 
            ? { ...model, ...formData } as Model
            : model
        ));

        toast({
          title: "Sucesso",
          description: "Modelo atualizado com sucesso"
        });
      } else {
        // Create new model
        const { data, error } = await supabase
          .from('models')
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        
        modelId = data.id;
        setModels([data, ...models]);

        toast({
          title: "Sucesso",
          description: "Modelo criado com sucesso"
        });
      }

      // Save gallery images
      if (galleryImages.length > 0) {
        // First, delete existing gallery images for this model
        await supabase
          .from('model_gallery')
          .delete()
          .eq('model_id', modelId);

        // Then insert new gallery images
        const galleryData = galleryImages.map((img, index) => ({
          model_id: modelId,
          image_url: img.image_url,
          caption: img.caption,
          order_index: index
        }));

        const { error: galleryError } = await supabase
          .from('model_gallery')
          .insert(galleryData);

        if (galleryError) {
          console.error('Error saving gallery:', galleryError);
          toast({
            title: "Aviso",
            description: "Modelo salvo, mas houve erro ao salvar as imagens da galeria",
            variant: "destructive"
          });
        }
      }

      // Reset form
      setFormData({
        name: '',
        age: null,
        location: '',
        price: '',
        image: '',
        characteristics: [],
        services: [],
        availability: '',
        description: '',
        height: '',
        measurements: '',
        hair: '',
        eyes: '',
        nationality: '',
        interests: [],
        education: ''
      });
      setGalleryImages([]);
      setEditingModel(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving model:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar modelo",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (model: Model) => {
    setEditingModel(model);
    setFormData(model);
    
    // Load gallery images for this model
    try {
      const { data, error } = await supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', model.id)
        .order('order_index');
      
      if (error) throw error;
      
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    }
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;

    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setModels(models.filter(model => model.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Modelo excluído com sucesso"
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir modelo",
        variant: "destructive"
      });
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBlogPost) {
        // Update existing blog post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...blogFormData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingBlogPost.id);

        if (error) throw error;

        setBlogPosts(blogPosts.map(post => 
          post.id === editingBlogPost.id 
            ? { ...post, ...blogFormData } as BlogPost
            : post
        ));

        toast({
          title: "Sucesso",
          description: "Post atualizado com sucesso"
        });
      } else {
        // Create new blog post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{
            ...blogFormData,
            published_at: blogFormData.is_published ? new Date().toISOString() : null
          }])
          .select()
          .single();

        if (error) throw error;

        setBlogPosts([data, ...blogPosts]);

        toast({
          title: "Sucesso",
          description: "Post criado com sucesso"
        });
      }

      // Reset form
      setBlogFormData({
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
        read_time: null
      });
      setEditingBlogPost(null);
      setIsBlogDialogOpen(false);
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar post",
        variant: "destructive"
      });
    }
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogFormData(post);
    setIsBlogDialogOpen(true);
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBlogPosts(blogPosts.filter(post => post.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Post excluído com sucesso"
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir post",
        variant: "destructive"
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleCharacteristicToggle = (characteristicId: string) => {
    const currentCharacteristics = formData.characteristics || [];
    const isSelected = currentCharacteristics.includes(characteristicId);
    
    if (isSelected) {
      setFormData({
        ...formData,
        characteristics: currentCharacteristics.filter(id => id !== characteristicId)
      });
    } else {
      setFormData({
        ...formData,
        characteristics: [...currentCharacteristics, characteristicId]
      });
    }
  };

  // Gallery management functions
  const addGalleryImage = () => {
    setGalleryImages([
      ...galleryImages,
      {
        image_url: '',
        caption: '',
        order_index: galleryImages.length
      }
    ]);
  };

  const updateGalleryImage = (index: number, field: 'image_url' | 'caption', value: string) => {
    setGalleryImages(
      galleryImages.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    );
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(
      galleryImages
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order_index: i }))
    );
  };

  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...galleryImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    // Update order indexes
    setGalleryImages(
      newImages.map((img, i) => ({ ...img, order_index: i }))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-20 pb-16">
          <div className="container-width">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Acesso Negado</CardTitle>
                <CardDescription>
                  Você precisa ser administrador para acessar esta página.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Administração - Five London"
        description="Painel de administração do Five London"
        keywords="admin, administração, modelos, gerenciamento"
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container-width">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Painel de Administração</h1>
              <p className="text-muted-foreground">Gerencie conteúdo, usuários e configurações</p>
            </div>
          </div>

          <Tabs defaultValue="models" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Modelos
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Galeria
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Conteúdo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gerenciar Modelos</h2>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingModel(null);
                        setGalleryImages([]);
                        setFormData({
                          name: '',
                          age: null,
                          location: '',
                          price: '',
                          image: '',
                          characteristics: [],
                          services: [],
                          availability: '',
                          description: '',
                          height: '',
                          measurements: '',
                          hair: '',
                          eyes: '',
                          nationality: '',
                          interests: [],
                          education: ''
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Modelo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingModel ? 'Editar' : 'Adicionar'} Modelo</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do modelo
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome *</Label>
                          <Input
                            id="name"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age">Idade</Label>
                          <Input
                            id="age"
                            type="number"
                            value={formData.age || ''}
                            onChange={(e) => setFormData({...formData, age: e.target.value ? parseInt(e.target.value) : null})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Localização</Label>
                          <Input
                            id="location"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="price">Preço</Label>
                          <Input
                            id="price"
                            value={formData.price || ''}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="height">Altura</Label>
                          <Input
                            id="height"
                            value={formData.height || ''}
                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hair">Cor do Cabelo</Label>
                          <Input
                            id="hair"
                            value={formData.hair || ''}
                            onChange={(e) => setFormData({...formData, hair: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eyes">Cor dos Olhos</Label>
                          <Input
                            id="eyes"
                            value={formData.eyes || ''}
                            onChange={(e) => setFormData({...formData, eyes: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nacionalidade</Label>
                          <Input
                            id="nationality"
                            value={formData.nationality || ''}
                            onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                          />
                        </div>
                      </div>

                      <ImageUpload
                        value={formData.image || ''}
                        onChange={(url) => setFormData({...formData, image: url})}
                        label="Imagem do Modelo"
                        placeholder="URL da imagem ou faça upload da sua galeria"
                      />

                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={formData.description || ''}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Características</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {characteristics.map((characteristic) => (
                            <label
                              key={characteristic.id}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={(formData.characteristics || []).includes(characteristic.id)}
                                onChange={() => handleCharacteristicToggle(characteristic.id)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{characteristic.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Gallery Images Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Galeria de Imagens do Modelo</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addGalleryImage}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Foto à Galeria
                          </Button>
                        </div>
                        
                        {galleryImages.length > 0 && (
                          <div className="space-y-4 border rounded-lg p-4">
                            {galleryImages.map((image, index) => (
                              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border rounded-lg bg-muted/20">
                                <div className="md:col-span-6">
                                  <ImageUpload
                                    value={image.image_url}
                                    onChange={(url) => updateGalleryImage(index, 'image_url', url)}
                                    label={`Imagem ${index + 1}`}
                                    placeholder="URL da imagem da galeria"
                                  />
                                </div>
                                
                                <div className="md:col-span-4">
                                  <Label htmlFor={`caption-${index}`}>Legenda</Label>
                                  <Input
                                    id={`caption-${index}`}
                                    value={image.caption}
                                    onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)}
                                    placeholder="Legenda opcional"
                                  />
                                </div>
                                
                                <div className="md:col-span-2 flex gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveGalleryImage(index, Math.max(0, index - 1))}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => moveGalleryImage(index, Math.min(galleryImages.length - 1, index + 1))}
                                    disabled={index === galleryImages.length - 1}
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeGalleryImage(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {galleryImages.length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                            <Image className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">
                              Nenhuma imagem na galeria. Clique em "Adicionar Foto à Galeria" para começar.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingModel ? 'Atualizar' : 'Criar'} Modelo
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Características</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {models.map((model) => (
                        <TableRow key={model.id}>
                          <TableCell className="font-medium">{model.name}</TableCell>
                          <TableCell>{model.location || '-'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(model.characteristics || []).slice(0, 3).map((charId) => {
                                const char = characteristics.find(c => c.id === charId);
                                return char ? (
                                  <Badge key={charId} variant="secondary" className="text-xs">
                                    {char.name}
                                  </Badge>
                                ) : null;
                              })}
                              {(model.characteristics || []).length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(model.characteristics || []).length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{model.price || '-'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(model)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(model.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gerenciar Blog</h2>
                
                <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingBlogPost(null);
                        setBlogFormData({
                          title: '',
                          slug: '',
                          excerpt: '',
                          content: '',
                          author: '',
                          category: '',
                          image: '',
                          meta_description: '',
                          seo_keywords: '',
                          is_published: false,
                          read_time: null
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingBlogPost ? 'Editar' : 'Adicionar'} Post</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do post do blog
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleBlogSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="blog-title">Título *</Label>
                          <Input
                            id="blog-title"
                            value={blogFormData.title || ''}
                            onChange={(e) => {
                              const title = e.target.value;
                              setBlogFormData({
                                ...blogFormData, 
                                title,
                                slug: generateSlug(title)
                              });
                            }}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blog-slug">Slug</Label>
                          <Input
                            id="blog-slug"
                            value={blogFormData.slug || ''}
                            onChange={(e) => setBlogFormData({...blogFormData, slug: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blog-author">Autor</Label>
                          <Input
                            id="blog-author"
                            value={blogFormData.author || ''}
                            onChange={(e) => setBlogFormData({...blogFormData, author: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blog-category">Categoria</Label>
                          <Input
                            id="blog-category"
                            value={blogFormData.category || ''}
                            onChange={(e) => setBlogFormData({...blogFormData, category: e.target.value})}
                          />
                        </div>
                      </div>

                      <ImageUpload
                        value={blogFormData.image || ''}
                        onChange={(url) => setBlogFormData({...blogFormData, image: url})}
                        label="Imagem do Post"
                        placeholder="URL da imagem ou faça upload da sua galeria"
                      />

                      <div className="space-y-2">
                        <Label htmlFor="blog-excerpt">Resumo</Label>
                        <Textarea
                          id="blog-excerpt"
                          value={blogFormData.excerpt || ''}
                          onChange={(e) => setBlogFormData({...blogFormData, excerpt: e.target.value})}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="blog-content">Conteúdo</Label>
                        <Textarea
                          id="blog-content"
                          value={blogFormData.content || ''}
                          onChange={(e) => setBlogFormData({...blogFormData, content: e.target.value})}
                          rows={10}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="blog-meta-description">Meta Descrição</Label>
                        <Textarea
                          id="blog-meta-description"
                          value={blogFormData.meta_description || ''}
                          onChange={(e) => setBlogFormData({...blogFormData, meta_description: e.target.value})}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="blog-seo-keywords">Palavras-chave SEO</Label>
                        <Input
                          id="blog-seo-keywords"
                          value={blogFormData.seo_keywords || ''}
                          onChange={(e) => setBlogFormData({...blogFormData, seo_keywords: e.target.value})}
                          placeholder="palavra1, palavra2, palavra3"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Palavras-chave de Serviços (para vincular aos links da página Services)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableServiceKeywords.map((keyword) => (
                            <label
                              key={keyword}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={(blogFormData.service_keywords || []).includes(keyword)}
                                onChange={(e) => {
                                  const currentKeywords = blogFormData.service_keywords || [];
                                  if (e.target.checked) {
                                    setBlogFormData({
                                      ...blogFormData,
                                      service_keywords: [...currentKeywords, keyword]
                                    });
                                  } else {
                                    setBlogFormData({
                                      ...blogFormData,
                                      service_keywords: currentKeywords.filter(k => k !== keyword)
                                    });
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{keyword}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Selecione as palavras-chave que devem linkar para este post na página de serviços
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="blog-published"
                          checked={blogFormData.is_published || false}
                          onCheckedChange={(checked) => setBlogFormData({...blogFormData, is_published: checked})}
                        />
                        <Label htmlFor="blog-published">Publicar imediatamente</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsBlogDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingBlogPost ? 'Atualizar' : 'Criar'} Post
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.author || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={post.is_published ? "default" : "secondary"}>
                              {post.is_published ? 'Publicado' : 'Rascunho'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBlogPost(post)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteBlogPost(post.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <h2 className="text-xl font-semibold">Gerenciar Serviços</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Palavras-chave dos Serviços</CardTitle>
                  <CardDescription>
                    Configure quais posts do blog devem ser linkados nas palavras-chave da página de serviços
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableServiceKeywords.map((keyword) => {
                        const linkedBlog = blogPosts.find(post => 
                          post.service_keywords?.includes(keyword) && post.is_published
                        );
                        
                        return (
                          <div key={keyword} className="p-4 border rounded-lg bg-card">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{keyword}</h4>
                                {linkedBlog ? (
                                  <div className="mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      Linkado: {linkedBlog.title}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Slug: /blog/{linkedBlog.slug}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      Sem link - usando link padrão
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2">Como linkar palavras-chave:</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Vá para a aba "Blog" e edite ou crie um novo post</li>
                        <li>• No campo "Service Keywords", selecione as palavras-chave que devem linkar para este post</li>
                        <li>• Publique o post para que o link apareça na página de serviços</li>
                        <li>• Se nenhum post estiver linkado, será usado o link padrão estático</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.email}</TableCell>
                          <TableCell>
                            <Badge variant={profile.role === 'admin' ? "default" : "secondary"}>
                              {profile.role}
                            </Badge>
                          </TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryManager />
            </TabsContent>

            <TabsContent value="content">
              <SiteContentManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </>
  );
};