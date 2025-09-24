import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Plus, Edit, Trash2, Eye, EyeOff, ThumbsUp, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  model_id: string;
  model_name: string;
  reviewer_name: string;
  rating: number;
  title: string;
  content: string;
  is_verified: boolean;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const ReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'pending' | 'featured'>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    model_id: '',
    reviewer_name: '',
    rating: 5,
    title: '',
    content: '',
    is_verified: false,
    is_published: true,
    is_featured: false
  });

  useEffect(() => {
    loadReviews();
    loadModels();
  }, []);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('model_reviews')
        .select(`
          *,
          models!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const reviewsWithModelNames = data?.map(review => ({
        ...review,
        model_name: review.models?.name || 'Modelo não encontrado'
      })) || [];
      
      setReviews(reviewsWithModelNames);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      let query = supabase.from('model_reviews');
      
      if (selectedReview) {
        const { error } = await query
          .update(dataToSave)
          .eq('id', selectedReview.id);
        if (error) throw error;
      } else {
        const { error } = await query.insert([dataToSave]);
        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: `Review ${selectedReview ? 'atualizada' : 'criada'} com sucesso!`
      });

      setIsDialogOpen(false);
      setSelectedReview(null);
      resetForm();
      loadReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar review",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('model_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Review removida com sucesso!"
      });

      loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover review",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('model_reviews')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Review ${!currentStatus ? 'publicada' : 'despublicada'} com sucesso!`
      });

      loadReviews();
    } catch (error) {
      console.error('Error toggling review status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da review",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('model_reviews')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Review ${!currentStatus ? 'destacada' : 'não destacada'} com sucesso!`
      });

      loadReviews();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status de destaque",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      model_id: '',
      reviewer_name: '',
      rating: 5,
      title: '',
      content: '',
      is_verified: false,
      is_published: true,
      is_featured: false
    });
  };

  const openDialog = (review?: Review) => {
    if (review) {
      setSelectedReview(review);
      setFormData({
        model_id: review.model_id,
        reviewer_name: review.reviewer_name,
        rating: review.rating,
        title: review.title,
        content: review.content,
        is_verified: review.is_verified,
        is_published: review.is_published,
        is_featured: review.is_featured
      });
    } else {
      setSelectedReview(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'published') return review.is_published;
    if (filterStatus === 'pending') return !review.is_published;
    if (filterStatus === 'featured') return review.is_featured;
    return true;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO 
        title="Gerenciar Reviews - Five London Admin"
        description="Gerencie reviews e avaliações dos serviços"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Reviews</h1>
            <p className="text-muted-foreground">
              Gerencie avaliações e depoimentos dos clientes
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Review
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedReview ? 'Editar' : 'Criar'} Review
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="model_id">Modelo</Label>
                  <select
                    id="model_id"
                    value={formData.model_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, model_id: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Selecione um modelo</option>
                    {models.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="reviewer_name">Nome do Reviewer</Label>
                  <Input
                    id="reviewer_name"
                    value={formData.reviewer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviewer_name: e.target.value }))}
                    placeholder="Nome do cliente ou iniciais"
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Avaliação</Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value={5}>5 estrelas</option>
                    <option value={4}>4 estrelas</option>
                    <option value={3}>3 estrelas</option>
                    <option value={2}>2 estrelas</option>
                    <option value={1}>1 estrela</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="title">Título da Review</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título ou resumo da experiência"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Conteúdo da Review</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Depoimento detalhado do cliente..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_verified"
                      checked={formData.is_verified}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_verified: checked }))}
                    />
                    <Label htmlFor="is_verified">Verificado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                    />
                    <Label htmlFor="is_published">Publicado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="is_featured">Destacado</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            Todas ({reviews.length})
          </Button>
          <Button
            variant={filterStatus === 'published' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('published')}
          >
            Publicadas ({reviews.filter(r => r.is_published).length})
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Pendentes ({reviews.filter(r => !r.is_published).length})
          </Button>
          <Button
            variant={filterStatus === 'featured' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('featured')}
          >
            Destacadas ({reviews.filter(r => r.is_featured).length})
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>
              Lista de todas as avaliações e depoimentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <Badge variant="outline">{review.model_name}</Badge>
                      {review.is_verified && (
                        <Badge variant="default">Verificado</Badge>
                      )}
                      {review.is_featured && (
                        <Badge variant="secondary">Destacado</Badge>
                      )}
                      {!review.is_published && (
                        <Badge variant="destructive">Pendente</Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold mb-1">{review.title}</h3>
<<<<<<< HEAD
                    <p className="text-sm text-muted-foreground mb-2">
                      By {review.reviewer_name}
                    </p>
                    <p className="text-sm mb-2 line-clamp-2">{review.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('en-GB')}
                    </p>
=======
                    <p className="text-sm text-muted-foreground mb-2">
                      Por {review.reviewer_name}
                    </p>
                    <p className="text-sm mb-2 line-clamp-2">{review.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </p>
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(review.id, review.is_published)}
                    >
                      {review.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeatured(review.id, review.is_featured)}
                    >
                      <ThumbsUp className={`h-4 w-4 ${review.is_featured ? 'text-blue-500' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog(review)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja remover esta review?')) {
                          handleDelete(review.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma review encontrada.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};