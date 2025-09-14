import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ModelForm } from '@/components/ModelForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Model {
  id?: string;
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
  members_only: boolean | null;
  face_visible: boolean | null;
}

export const ModelFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      loadModel(id);
    }
  }, [id]);

  const loadModel = async (modelId: string) => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('id', modelId)
        .single();

      if (error) throw error;
      setModel(data);
    } catch (error) {
      console.error('Error loading model:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar modelo",
        variant: "destructive"
      });
      navigate('/admin/models/list');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: id ? "Modelo atualizado com sucesso" : "Modelo criado com sucesso"
    });
    navigate('/admin/models/list');
  };

  const handleCancel = () => {
    navigate('/admin/models/list');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/models/list')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-luxury-heading">
              {id ? 'Editar Modelo' : 'Novo Modelo'}
            </h1>
            <p className="text-muted-foreground">
              {id ? 'Atualize as informações do modelo' : 'Crie um novo perfil de modelo'}
            </p>
          </div>
        </div>

        <ModelForm 
          model={model} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    </AdminLayout>
  );
};