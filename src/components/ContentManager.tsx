import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Edit, Upload, Save, Eye, EyeOff } from 'lucide-react';

interface SiteContent {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  image_alt: string;
  button_text: string;
  button_url: string;
  is_active: boolean;
}

const sectionLabels = {
  hero: 'Seção Principal (Hero)',
  about_intro: 'About Us - Introdução',
  about_mission: 'About Us - Nossa Missão',
  about_values: 'About Us - Nossos Valores'
};

export default function ContentManager() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    image_alt: '',
    button_text: '',
    button_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section');

    if (error) {
      toast.error('Erro ao carregar conteúdo');
    } else {
      setContents(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `site-content/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('model-images')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Erro ao fazer upload da imagem');
    } else {
      const { data } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      toast.success('Imagem carregada com sucesso!');
    }
  };

  const handleEdit = (content: SiteContent) => {
    setEditingContent(content);
    setFormData({
      title: content.title || '',
      subtitle: content.subtitle || '',
      content: content.content || '',
      image_url: content.image_url || '',
      image_alt: content.image_alt || '',
      button_text: content.button_text || '',
      button_url: content.button_url || '',
      is_active: content.is_active
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingContent) return;

    const { error } = await supabase
      .from('site_content')
      .update(formData)
      .eq('id', editingContent.id);

    if (error) {
      toast.error('Erro ao atualizar conteúdo');
    } else {
      toast.success('Conteúdo atualizado com sucesso!');
      setEditingContent(null);
      fetchContents();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      image_url: '',
      image_alt: '',
      button_text: '',
      button_url: '',
      is_active: true
    });
  };

  const toggleActive = async (content: SiteContent) => {
    const { error } = await supabase
      .from('site_content')
      .update({ is_active: !content.is_active })
      .eq('id', content.id);

    if (error) {
      toast.error('Erro ao alterar status');
    } else {
      toast.success(`Seção ${content.is_active ? 'desativada' : 'ativada'} com sucesso!`);
      fetchContents();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Conteúdo do Site</h2>
      </div>

      {editingContent && (
        <Card>
          <CardHeader>
            <CardTitle>
              Editando: {sectionLabels[editingContent.section as keyof typeof sectionLabels] || editingContent.section}
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
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="button_text">Texto do Botão</Label>
                  <Input
                    id="button_text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="button_url">URL do Botão</Label>
                  <Input
                    id="button_url"
                    name="button_url"
                    value={formData.button_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="image_alt">Texto Alternativo da Imagem</Label>
                  <Input
                    id="image_alt"
                    name="image_alt"
                    value={formData.image_alt}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Upload de Nova Imagem</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  {formData.image_url && (
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="mt-2 h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_active">Seção ativa</Label>
              </div>
              
              <div className="flex gap-4">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setEditingContent(null);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contents.map((content) => (
          <Card key={content.id}>
            <CardContent className="p-4">
              {content.image_url && (
                <img 
                  src={content.image_url} 
                  alt={content.image_alt || content.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold flex-1">
                  {sectionLabels[content.section as keyof typeof sectionLabels] || content.section}
                </h3>
                {content.is_active ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm font-medium mb-1">{content.title}</p>
              <p className="text-xs text-muted-foreground mb-2">{content.subtitle}</p>
              <p className="text-sm mb-4 line-clamp-3">{content.content}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(content)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant={content.is_active ? "destructive" : "default"}
                  onClick={() => toggleActive(content)}
                >
                  {content.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}