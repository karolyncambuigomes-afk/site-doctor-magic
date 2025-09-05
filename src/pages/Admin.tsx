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
  const [publicGallery, setPublicGallery] = useState<Array<{id: string, image_url: string, model_id: string, model_name: string, is_featured: boolean}>>([]);
  const [availableImages, setAvailableImages] = useState<Array<{id: string, image_url: string, model_id: string, model_name: string, source: 'profile' | 'gallery', caption?: string}>>([]);

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
    is_published: false,
    read_time: null
  });

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
        const [modelsResponse, profilesResponse, blogResponse, galleryResponse] = await Promise.all([
          supabase.from('models').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
          supabase.from('public_gallery').select('*').order('order_index')
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
          await loadAvailableImages(modelsResponse.data || []);
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

        if (galleryResponse.error) {
          console.error('Error fetching public gallery:', galleryResponse.error);
        } else {
          setPublicGallery(galleryResponse.data || []);
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

  // Load available images from models for gallery selection
  const loadAvailableImages = async (modelsData: Model[]) => {
    try {
      const images: Array<{id: string, image_url: string, model_id: string, model_name: string, source: 'profile' | 'gallery', caption?: string}> = [];
      
      // Add profile images
      modelsData.forEach(model => {
        if (model.image) {
          images.push({
            id: `profile-${model.id}`,
            image_url: model.image,
            model_id: model.id,
            model_name: model.name,
            source: 'profile'
          });
        }
      });
      
      // Add gallery images
      const { data: galleryData, error } = await supabase
        .from('model_gallery')
        .select('*, models!inner(name)')
        .order('order_index');
        
      if (!error && galleryData) {
        galleryData.forEach(gallery => {
          images.push({
            id: `gallery-${gallery.id}`,
            image_url: gallery.image_url,
            model_id: gallery.model_id,
            model_name: gallery.models.name,
            source: 'gallery',
            caption: gallery.caption
          });
        });
      }
      
      setAvailableImages(images);
    } catch (error) {
      console.error('Error loading available images:', error);
    }
  };

  // Public gallery management functions
  const addToPublicGallery = async (imageData: {image_url: string, model_id: string, model_name: string, caption?: string}) => {
    try {
      const { data, error } = await supabase
        .from('public_gallery')
        .insert([{
          image_url: imageData.image_url,
          model_id: imageData.model_id,
          model_name: imageData.model_name,
          caption: imageData.caption || '',
          order_index: publicGallery.length
        }])
        .select()
        .single();

      if (error) throw error;

      setPublicGallery([...publicGallery, data]);
      toast({
        title: "Sucesso",
        description: "Imagem adicionada à galeria pública"
      });
    } catch (error) {
      console.error('Error adding to public gallery:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar imagem à galeria",
        variant: "destructive"
      });
    }
  };

  const removeFromPublicGallery = async (id: string) => {
    try {
      const { error } = await supabase
        .from('public_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPublicGallery(publicGallery.filter(item => item.id !== id));
      toast({
        title: "Sucesso",
        description: "Imagem removida da galeria pública"
      });
    } catch (error) {
      console.error('Error removing from public gallery:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem da galeria",
        variant: "destructive"
      });
    }
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
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-wide mb-2">
              Painel de <span className="luxury-text-gradient">Administração</span>
            </h1>
            <p className="text-muted-foreground">
              Gerencie modelos, usuários e conteúdo do site
            </p>
          </div>

          <Tabs defaultValue="models" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Modelos ({models.length})
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blog ({blogPosts.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Usuários ({profiles.length})
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Galeria
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
                      <DialogTitle>
                        {editingModel ? 'Editar Modelo' : 'Adicionar Novo Modelo'}
                      </DialogTitle>
                      <DialogDescription>
                        Preencha as informações do modelo abaixo.
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
                            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || null})}
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
                      <DialogTitle>
                        {editingBlogPost ? 'Editar Post' : 'Adicionar Novo Post'}
                      </DialogTitle>
                      <DialogDescription>
                        Preencha as informações do post do blog.
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
                          <Label htmlFor="blog-slug">Slug *</Label>
                          <Input
                            id="blog-slug"
                            value={blogFormData.slug || ''}
                            onChange={(e) => setBlogFormData({...blogFormData, slug: e.target.value})}
                            required
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

                        <div className="space-y-2">
                          <Label htmlFor="blog-read-time">Tempo de Leitura (min)</Label>
                          <Input
                            id="blog-read-time"
                            type="number"
                            value={blogFormData.read_time || ''}
                            onChange={(e) => setBlogFormData({...blogFormData, read_time: parseInt(e.target.value) || null})}
                          />
                        </div>

                        <div className="space-y-2 flex items-center gap-2">
                          <Switch
                            id="blog-published"
                            checked={blogFormData.is_published || false}
                            onCheckedChange={(checked) => setBlogFormData({...blogFormData, is_published: checked})}
                          />
                          <Label htmlFor="blog-published">Publicado</Label>
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
                        <Label htmlFor="blog-keywords">Palavras-chave SEO</Label>
                        <Input
                          id="blog-keywords"
                          value={blogFormData.seo_keywords || ''}
                          onChange={(e) => setBlogFormData({...blogFormData, seo_keywords: e.target.value})}
                          placeholder="palavra1, palavra2, palavra3"
                        />
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
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.category || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={post.is_published ? 'default' : 'secondary'}>
                              {post.is_published ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Publicado
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Rascunho
                                </>
                              )}
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

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Usuários Cadastrados</CardTitle>
                  <CardDescription>
                    Lista de todos os usuários do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Data de Criação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell>{profile.email}</TableCell>
                          <TableCell>
                            <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                              {profile.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date().toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available Images Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Imagens Disponíveis</CardTitle>
                      <CardDescription>
                        Fotos das modelos (perfil e galeria)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-y-auto">
                      {availableImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {availableImages.map((image) => {
                            const isInPublicGallery = publicGallery.some(pg => pg.image_url === image.image_url);
                            
                            return (
                              <div key={image.id} className="group relative">
                                <div className="aspect-square overflow-hidden rounded-lg border">
                                  <img
                                    src={image.image_url}
                                    alt={image.model_name}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                </div>
                                
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm font-medium truncate">{image.model_name}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {image.source === 'profile' ? 'Perfil' : 'Galeria'}
                                    </Badge>
                                    {image.caption && (
                                      <span className="text-xs text-muted-foreground truncate">
                                        {image.caption}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="mt-2">
                                  {!isInPublicGallery ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => addToPublicGallery({
                                        image_url: image.image_url,
                                        model_id: image.model_id,
                                        model_name: image.model_name,
                                        caption: image.caption
                                      })}
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Adicionar à Galeria
                                    </Button>
                                  ) : (
                                    <Button size="sm" variant="secondary" className="w-full" disabled>
                                      ✓ Na Galeria Pública
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Image className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            Nenhuma imagem disponível. Adicione modelos primeiro.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Public Gallery Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Galeria Pública</CardTitle>
                      <CardDescription>
                        Imagens que aparecem na galeria do site ({publicGallery.length} fotos)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-y-auto">
                      {publicGallery.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {publicGallery.map((item) => (
                            <div key={item.id} className="group relative">
                              <div className="aspect-square overflow-hidden rounded-lg border">
                                <img
                                  src={item.image_url}
                                  alt={item.model_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="mt-2 space-y-1">
                                <p className="text-sm font-medium truncate">{item.model_name}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="default" className="text-xs">
                                    Público
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeFromPublicGallery(item.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-black/50 text-white border-none hover:bg-black/70"
                                  onClick={() => {
                                    // Navigate to model profile
                                    window.open(`/models/${item.model_id}`, '_blank');
                                  }}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Image className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            Nenhuma imagem na galeria pública.
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Selecione imagens da seção "Imagens Disponíveis" para adicionar.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Instructions */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Como funciona a Galeria</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• <strong>Imagens Disponíveis:</strong> Todas as fotos das modelos (perfil + galeria individual)</li>
                          <li>• <strong>Galeria Pública:</strong> Fotos que aparecem na página de galeria do site</li>
                          <li>• <strong>Clique na imagem:</strong> Quando visitantes clicarem numa foto da galeria pública, serão redirecionados para o perfil da modelo</li>
                          <li>• <strong>Gestão:</strong> Adicione/remova fotos da galeria pública conforme necessário</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </>
  );
};