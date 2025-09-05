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
import { Plus, Edit, Trash2, Users, Image, Settings, FileText, Eye, EyeOff, ArrowUp, ArrowDown, Edit3, X, Check } from 'lucide-react';
import { characteristics } from '@/data/characteristics';
import { ImageUpload } from '@/components/ImageUpload';
import { GalleryManager } from '@/components/GalleryManager';
import { SiteContentManager } from '@/components/SiteContentManager';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  status: string;
  role: string;
  requested_at: string;
}

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

export const Admin: React.FC = () => {
  const { user, loading, hasAccess } = useAuth();
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (user && hasAccess) {
      loadData();
    }
  }, [user, hasAccess]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [modelsResponse, profilesResponse, postsResponse] = await Promise.all([
        supabase.from('models').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('requested_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
      ]);

      if (modelsResponse.error) throw modelsResponse.error;
      if (profilesResponse.error) throw profilesResponse.error;
      if (postsResponse.error) throw postsResponse.error;

      setModels(modelsResponse.data || []);
      setProfiles(profilesResponse.data || []);
      setBlogPosts(postsResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEO 
        title="Administração - Five London"
        description="Painel administrativo"
        keywords="admin, administração, painel"
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-white pt-20 pb-16">
        <div className="container-width">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">Gerencie modelos, blog posts e usuários</p>
          </div>

          <Tabs defaultValue="models" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-300">
              <TabsTrigger value="models" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black text-black">
                <Users className="w-4 h-4 mr-2" />
                Modelos
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black text-black">
                <FileText className="w-4 h-4 mr-2" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black text-black">
                <Users className="w-4 h-4 mr-2" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black text-black">
                <Image className="w-4 h-4 mr-2" />
                Galeria
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black text-black">
                <Settings className="w-4 h-4 mr-2" />
                Conteúdo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-6">
              <Card className="bg-white border-gray-200 border">
                <CardHeader>
                  <CardTitle className="text-black">Gerenciar Modelos</CardTitle>
                  <CardDescription className="text-gray-600">Visualize e gerencie todos os modelos cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center py-8 text-gray-600">Carregando modelos...</div>
                  ) : models.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Nenhum modelo encontrado</p>
                      <Button className="bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Primeiro Modelo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {models.map((model) => (
                        <div key={model.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center space-x-4">
                            {model.image && (
                              <img src={model.image} alt={model.name} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                              <h3 className="font-medium text-black">{model.name}</h3>
                              <p className="text-sm text-gray-600">{model.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <Card className="bg-white border-gray-200 border">
                <CardHeader>
                  <CardTitle className="text-black">Gerenciar Blog</CardTitle>
                  <CardDescription className="text-gray-600">Gerencie posts do blog e conteúdo editorial</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center py-8 text-gray-600">Carregando posts...</div>
                  ) : blogPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Nenhum post encontrado</p>
                      <Button className="bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Post
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blogPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-black">{post.title}</h3>
                              <Badge variant={post.is_published ? "default" : "secondary"} className={post.is_published ? "bg-gray-200 text-black" : "bg-gray-100 text-gray-800"}>
                                {post.is_published ? "Publicado" : "Rascunho"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{post.excerpt}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{post.category}</span>
                              <span>{post.read_time} min de leitura</span>
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="bg-white border-gray-200 border">
                <CardHeader>
                  <CardTitle className="text-black">Gerenciar Usuários</CardTitle>
                  <CardDescription className="text-gray-600">Gerencie registros e permissões de usuários</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center py-8 text-gray-600">Carregando usuários...</div>
                  ) : (
                    <div className="space-y-4">
                      {profiles.map((profile) => (
                        <div key={profile.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                          <div>
                            <h3 className="font-medium text-black">{profile.email}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={profile.status === 'approved' ? 'default' : profile.status === 'rejected' ? 'destructive' : 'secondary'} 
                                     className={profile.status === 'approved' ? 'bg-black text-white' : ''}>
                                {profile.status}
                              </Badge>
                              <Badge variant="outline" className="border-gray-300 text-gray-700">{profile.role}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800">Aprovar</Button>
                            <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800">Rejeitar</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <Card className="bg-white border-gray-200 border">
                <CardHeader>
                  <CardTitle className="text-black">Gerenciar Galeria</CardTitle>
                  <CardDescription className="text-gray-600">Gerencie imagens e carrosséis da galeria</CardDescription>
                </CardHeader>
                <CardContent className="text-black bg-white [&_*]:bg-white [&_*]:text-black">
                  <div className="bg-white [&_*]:bg-white [&_*]:text-black">
                    <GalleryManager />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card className="bg-white border-gray-200 border">
                <CardHeader>
                  <CardTitle className="text-black">Gerenciar Conteúdo</CardTitle>
                  <CardDescription className="text-gray-600">Gerencie conteúdo das páginas do site</CardDescription>
                </CardHeader>
                <CardContent className="text-black bg-white [&_*]:bg-white [&_*]:text-black [&_input]:bg-white [&_input]:text-black [&_textarea]:bg-white [&_textarea]:text-black">
                  <div className="bg-white [&_*]:bg-white [&_*]:text-black [&_input]:bg-white [&_input]:text-black [&_textarea]:bg-white [&_textarea]:text-black">
                    <SiteContentManager />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </>
  );
};