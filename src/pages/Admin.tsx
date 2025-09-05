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
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, Image, Settings } from 'lucide-react';
import { characteristics } from '@/data/characteristics';

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

export const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }

        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;

      try {
        const [modelsResponse, profilesResponse] = await Promise.all([
          supabase.from('models').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').order('created_at', { ascending: false })
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

        setModels([data, ...models]);

        toast({
          title: "Sucesso",
          description: "Modelo criado com sucesso"
        });
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

  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setFormData(model);
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

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Modelos ({models.length})
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

                      <div className="space-y-2">
                        <Label htmlFor="image">URL da Imagem</Label>
                        <Input
                          id="image"
                          value={formData.image || ''}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                        />
                      </div>

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
              <Card>
                <CardHeader>
                  <CardTitle>Galeria de Imagens</CardTitle>
                  <CardDescription>
                    Gerencie as imagens dos modelos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Funcionalidade de galeria em desenvolvimento...
                  </p>
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