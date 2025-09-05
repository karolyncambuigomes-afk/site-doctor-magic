import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, Users, FileText, Settings } from 'lucide-react';
import { SEO } from '@/components/SEO';
import BlogManager from '@/components/BlogManager';
import ContentManager from '@/components/ContentManager';
import { sanitizeText } from '@/utils/sanitizer';

interface Model {
  id: string;
  name: string;
  age: number;
  location: string;
  price: string;
  description: string;
  height: string;
  measurements: string;
  hair: string;
  eyes: string;
  nationality: string;
  image: string;
}

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    price: '',
    description: '',
    height: '',
    measurements: '',
    hair: '',
    eyes: '',
    nationality: '',
    image: ''
  });

  // Todos os hooks primeiro, antes de qualquer return
  useEffect(() => {
    if (isAdmin) {
      fetchModels();
    }
  }, [isAdmin]);

  // Redirect if not admin - DEPOIS dos hooks
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/auth" replace />;
  }

  const fetchModels = async () => {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar modelos');
    } else {
      setModels(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `models/${fileName}`;

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

    // Sanitize input data
    const modelData = {
      name: sanitizeText(formData.name),
      location: sanitizeText(formData.location),
      price: sanitizeText(formData.price),
      description: sanitizeText(formData.description),
      height: sanitizeText(formData.height),
      measurements: sanitizeText(formData.measurements),
      hair: sanitizeText(formData.hair),
      eyes: sanitizeText(formData.eyes),
      nationality: sanitizeText(formData.nationality),
      image: formData.image,
      age: parseInt(formData.age) || 0
    };

    if (editingModel) {
      const { error } = await supabase
        .from('models')
        .update(modelData)
        .eq('id', editingModel.id);

      if (error) {
        toast.error('Erro ao atualizar modelo');
      } else {
        toast.success('Modelo atualizado com sucesso!');
        setEditingModel(null);
        fetchModels();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('models')
        .insert([modelData]);

      if (error) {
        toast.error('Erro ao criar modelo');
      } else {
        toast.success('Modelo criado com sucesso!');
        setIsCreating(false);
        fetchModels();
        resetForm();
      }
    }
  };

  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      age: model.age.toString(),
      location: model.location,
      price: model.price,
      description: model.description,
      height: model.height,
      measurements: model.measurements,
      hair: model.hair,
      eyes: model.eyes,
      nationality: model.nationality,
      image: model.image
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta modelo?')) return;

    const { error } = await supabase
      .from('models')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir modelo');
    } else {
      toast.success('Modelo excluída com sucesso!');
      fetchModels();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      location: '',
      price: '',
      description: '',
      height: '',
      measurements: '',
      hair: '',
      eyes: '',
      nationality: '',
      image: ''
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <>
      <SEO 
        title="Painel Administrativo - Five London"
        description="Gerencie modelos e blog do Five London"
      />
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>

          <Tabs defaultValue="models" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Modelos
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Conteúdo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gerenciar Modelos</h2>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nova Modelo
                </Button>
              </div>

              {isCreating && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingModel ? 'Editar Modelo' : 'Nova Modelo'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Idade</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Localização</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Preço</Label>
                        <Input
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Altura</Label>
                        <Input
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="measurements">Medidas</Label>
                        <Input
                          id="measurements"
                          name="measurements"
                          value={formData.measurements}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hair">Cabelo</Label>
                        <Input
                          id="hair"
                          name="hair"
                          value={formData.hair}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eyes">Olhos</Label>
                        <Input
                          id="eyes"
                          name="eyes"
                          value={formData.eyes}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nacionalidade</Label>
                        <Input
                          id="nationality"
                          name="nationality"
                          value={formData.nationality}
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
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-4">
                        <Button type="submit">
                          {editingModel ? 'Atualizar' : 'Criar'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setIsCreating(false);
                            setEditingModel(null);
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
                {models.map((model) => (
                  <Card key={model.id}>
                    <CardContent className="p-4">
                      {model.image && (
                        <img 
                          src={model.image} 
                          alt={model.name}
                          className="w-full h-48 object-cover rounded mb-4"
                        />
                      )}
                      <h3 className="text-lg font-semibold mb-2">{model.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {model.age} anos • {model.location}
                      </p>
                      <p className="text-sm mb-4">{model.price}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(model)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(model.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="blog">
              <BlogManager />
            </TabsContent>

            <TabsContent value="content">
              <ContentManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}