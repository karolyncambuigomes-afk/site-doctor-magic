import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';



import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/components/AuthProvider';
import { useMobileGalleryOptimizer } from '@/hooks/useMobileGalleryOptimizer';
import { Trash2, Plus, Edit3, Globe, Crown, Lock, Info, AlertCircle } from 'lucide-react';

interface GalleryImage {
  id: string;
  model_id: string;
  image_url: string;
  caption?: string;
  order_index: number;
  visibility?: 'public' | 'members_only' | 'admin_only';
  created_at: string;
}

interface ModelForGallery {
  id?: string;
  name?: string;
  members_only?: boolean;
  all_photos_public?: boolean;
}

interface GalleryUploadProps {
  modelId: string;
  model?: ModelForGallery;
}

export const GalleryUpload: React.FC<GalleryUploadProps> = ({ modelId, model }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const auth = useAuth();
  const isAdmin = auth?.isAdmin || false;
  const { 
    optimizations, 
    metrics, 
    trackPerformance, 
    getOptimizedImageUrl, 
    getOptimizedClasses 
  } = useMobileGalleryOptimizer();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'members_only' | 'admin_only'>('public');
  const [activeTab, setActiveTab] = useState<'public' | 'members_only' | 'admin_only'>('public');


  useEffect(() => {
    loadGalleryImages();
  }, [modelId]);

  const loadGalleryImages = async () => {
    const startTime = performance.now();
    
    try {
      setLoading(true);
      setLoadingError(null);
      const { data, error } = await supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', modelId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Erro na query Supabase:', error);
        throw error;
      }

      const loadTime = performance.now() - startTime;
      
      // Track performance metrics
      trackPerformance(startTime, data?.length || 0);
      
      if (isMobile && loadTime > 3000) {
        console.warn(`Carregamento lento detectado (${loadTime.toFixed(2)}ms) - otimização necessária`);
      }

      setGalleryImages(data || []);
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
      setLoadingError(error instanceof Error ? error.message : 'Erro desconhecido');
      toast({
        title: "Erro",
        description: isMobile ? "Erro ao carregar galeria (mobile)" : "Erro ao carregar galeria",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addImage = async () => {
    const addStartTime = performance.now();
    
    if (!newImageUrl) {
      console.log('🎭 GALERIA: Erro - sem URL de imagem');
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem",
        variant: "destructive",
      });
      return;
    }

    if (!modelId) {
      console.log('🎭 GALERIA: Erro - sem modelId');
      toast({
        title: "Erro",
        description: "ID do modelo não encontrado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const nextOrderIndex = Math.max(...galleryImages.map(img => img.order_index), -1) + 1;
      console.log('🎭 GALERIA: nextOrderIndex =', nextOrderIndex);

      // Get the count of images with the selected visibility to set the order
      const imagesWithSameVisibility = galleryImages.filter(img => img.visibility === selectedVisibility);
      const nextOrderForVisibility = Math.max(...imagesWithSameVisibility.map(img => img.order_index), -1) + 1;
      
      // HOTFIX: Temporarily disable sync-to-local to fix broken photo URLs
      // Use direct Supabase URLs to ensure photos work correctly
      let finalImageUrl = newImageUrl;
      console.log('🎯 Using direct Supabase URL (sync-to-local disabled):', finalImageUrl);
      
      const insertData = {
        model_id: modelId,
        image_url: finalImageUrl,
        caption: newImageCaption || null,
        order_index: nextOrderForVisibility,
        visibility: selectedVisibility
      };
      console.log('🎭 GALERIA: Inserindo na tabela model_gallery:', insertData);

      const { error } = await supabase
        .from('model_gallery')
        .insert([insertData]);

      if (error) {
        console.error('🎭 GALERIA: Erro do Supabase:', error);
        throw error;
      }

      console.log('🎭 GALERIA: Sucesso! Imagem adicionada à model_gallery');
      toast({
        title: "Sucesso",
        description: finalImageUrl !== newImageUrl ? "Imagem adicionada e otimizada automaticamente" : "Imagem adicionada à galeria",
      });

      setNewImageUrl('');
      setNewImageCaption('');
      setIsAdding(false);
      loadGalleryImages();
      
      // Dispatch custom event to notify ModelGallery component
      console.log('🎭 GALERIA: Disparando evento galleryUpdated');
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar imagem",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (imageId: string) => {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) return;

    try {
      const { error } = await supabase
        .from('model_gallery')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Imagem removida da galeria",
      });

      loadGalleryImages();
      
      // Dispatch custom event to notify ModelGallery component
      console.log('🎭 GALERIA: Disparando evento galleryUpdated (remoção)');
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem",
        variant: "destructive",
      });
    }
  };

  const updateCaption = async (imageId: string, newCaption: string) => {
    try {
      const { error } = await supabase
        .from('model_gallery')
        .update({ caption: newCaption || null })
        .eq('id', imageId);

      if (error) throw error;

      setGalleryImages(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, caption: newCaption } : img
        )
      );

      toast({
        title: "Sucesso",
        description: "Legenda atualizada",
      });
    } catch (error) {
      console.error('Error updating caption:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar legenda",
        variant: "destructive",
      });
    }
  };

  const handleImageEdited = async (imageId: string, editedBlob: Blob) => {
    try {
      // Upload the edited image
      const fileExt = 'png';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('model-images')
        .upload(filePath, editedBlob);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('model-images')
        .getPublicUrl(filePath);

      // Update the gallery image URL
      const { error: updateError } = await supabase
        .from('model_gallery')
        .update({ image_url: data.publicUrl })
        .eq('id', imageId);

      if (updateError) throw updateError;

      await loadGalleryImages();
      setEditingImage(null);
      
      toast({
        title: "Sucesso",
        description: "Imagem ajustada com sucesso"
      });

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    } catch (error) {
      console.error('Error updating edited image:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar imagem editada",
        variant: "destructive"
      });
    }
  };

  const updateOrder = async (imageId: string, newOrder: number, visibility: string) => {
    try {
      const { error } = await supabase
        .from('model_gallery')
        .update({ order_index: newOrder })
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ordem atualizada",
      });

      loadGalleryImages();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ordem",
        variant: "destructive",
      });
    }
  };

  const updateVisibility = async (imageId: string, newVisibility: 'public' | 'members_only' | 'admin_only') => {
    try {
      const { error } = await supabase
        .from('model_gallery')
        .update({ visibility: newVisibility })
        .eq('id', imageId);

      if (error) throw error;

      const visibilityLabels = {
        'public': 'Pública',
        'members_only': 'Apenas Membros',
        'admin_only': 'Apenas Admin'
      };

      toast({
        title: "Sucesso",
        description: `Visibilidade alterada para: ${visibilityLabels[newVisibility]}`,
      });

      loadGalleryImages();
      
      // Notify other components about the change
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar visibilidade",
        variant: "destructive",
      });
    }
  };

  // Filter images by visibility
  const publicImages = galleryImages.filter(img => img.visibility === 'public');
  const membersImages = galleryImages.filter(img => img.visibility === 'members_only');
  const adminImages = galleryImages.filter(img => img.visibility === 'admin_only');

  // Determine if this is a mixed model (neither all public nor all members only)
  const isMixedModel = !model?.members_only && !model?.all_photos_public;
  
  // NEW: Check if there are actually multiple visibility types in the gallery
  const hasMultipleVisibilityTypes = useMemo(() => {
    const visibilityTypes = new Set(galleryImages.map(img => img.visibility));
    return visibilityTypes.size > 1;
  }, [galleryImages]);
  
  // NEW: More robust logic for showing tabs
  const shouldShowTabs = useMemo(() => {
    // Always show for admin users
    if (isAdmin) return true;
    
    // Show if model has mixed configuration OR if gallery actually has mixed photos
    return isMixedModel || hasMultipleVisibilityTypes;
  }, [isAdmin, isMixedModel, hasMultipleVisibilityTypes]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Galeria de Fotos ({galleryImages.length} fotos)</h3>
        <Button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Foto
        </Button>
      </div>

      <div className="bg-white border-2 border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
            <span className="text-foreground text-sm font-bold">!</span>
          </div>
          <h4 className="font-bold text-foreground">Sistema de Ordenação</h4>
        </div>
        <p className="text-sm text-foreground">
          • A primeira foto será exibida como destaque<br/>
          • Use os seletores de ordem para reorganizar as fotos<br/>
          • Adicione pelo menos 1 foto para que o modelo apareça no site
        </p>
      </div>

      {/* Seção de Configuração de Visibilidade - SEMPRE para modelos mistas e admin */}
      {(shouldShowTabs && isAdmin) && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
            <Info className="w-4 h-4" />
            Modelo Misto - Sistema de Abas Ativo
          </div>
          <p className="text-sm text-blue-600">
            Este modelo permite fotos com diferentes tipos de visibilidade. O seletor abaixo estará sempre disponível.
          </p>
        </div>
      )}

      {/* Seletor de Visibilidade - Sempre visível para modelos mistas */}
      {(isAdding || (shouldShowTabs && isAdmin)) && (
        <div className="bg-white p-4 rounded-lg border-2 border-border mb-4">
          <Label className="text-foreground font-bold text-lg flex items-center gap-2 mb-3">
            🎯 {isAdding ? 'Tipo de Foto' : 'Configuração de Visibilidade'}
          </Label>
          {!isAdding && (
            <p className="text-sm text-muted-foreground mb-3">
              Escolha o tipo de visibilidade que será aplicado ao próximo upload
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={selectedVisibility === 'public' ? 'default' : 'outline'}
              onClick={() => setSelectedVisibility('public')}
              className={`flex-1 ${
                selectedVisibility === 'public' 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'text-green-600 border-green-200 hover:bg-green-50'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Foto Pública
            </Button>
            <Button
              type="button"
              variant={selectedVisibility === 'members_only' ? 'default' : 'outline'}
              onClick={() => setSelectedVisibility('members_only')}
              className={`flex-1 ${
                selectedVisibility === 'members_only' 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'text-amber-600 border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Crown className="w-4 h-4 mr-2" />
              Foto Membros
            </Button>
            <Button
              type="button"
              variant={selectedVisibility === 'admin_only' ? 'default' : 'outline'}
              onClick={() => setSelectedVisibility('admin_only')}
              className={`flex-1 ${
                selectedVisibility === 'admin_only' 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'text-red-600 border-red-200 hover:bg-red-50'
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Foto Admin
            </Button>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="border-2 border-border rounded-lg p-6 space-y-4 bg-white">
          <div className="flex items-center justify-center gap-3 mb-4 bg-muted p-3 rounded-lg">
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-background" />
            </div>
            <h4 className="font-bold text-foreground text-lg">Adicionar Fotos</h4>
          </div>

          {/* Upload Mode Tabs */}
          <div className="w-full">
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-border">
                <Label className="text-foreground font-bold text-lg flex items-center gap-2 mb-3">
                  📸 Upload da Foto
                </Label>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded border border-border">
                    <ImageUpload
                      value={newImageUrl}
                      onChange={(url) => {
                        console.log('🎭 GALERIA: ImageUpload onChange chamado com URL:', url);
                        setNewImageUrl(url);
                      }}
                      label="Selecionar foto ou fazer upload"
                      placeholder="URL da imagem ou faça upload"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="caption">Legenda (opcional)</Label>
                <Input
                  id="caption"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  placeholder="Adicione uma legenda para esta imagem"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={addImage}
                  disabled={loading || !newImageUrl}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {loading ? 'Adicionando...' : `Adicionar à ${selectedVisibility === 'public' ? 'Públicas' : selectedVisibility === 'members_only' ? 'Membros' : 'Admin'}`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewImageUrl('');
                    setNewImageCaption('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


      {galleryImages.length > 0 ? (
        shouldShowTabs ? (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'public' | 'members_only' | 'admin_only')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="public" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Fotos Públicas
                <Badge variant="secondary" className="ml-1">
                  {publicImages.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="members_only" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Fotos Membros
                <Badge variant="secondary" className="ml-1">
                  {membersImages.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="admin_only" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Fotos Admin
                <Badge variant="secondary" className="ml-1">
                  {adminImages.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="public" className="space-y-4">
              {publicImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Globe className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Carrossel Público - {publicImages.length} fotos</span>
                  </div>
                   <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {publicImages.map((image, index) => (
                      <ImageCard 
                        key={image.id} 
                        image={image} 
                        index={index} 
                        images={publicImages}
                        onEdit={setEditingImage}
                        onUpdateOrder={updateOrder}
                        onUpdateCaption={updateCaption}
                        onUpdateVisibility={updateVisibility}
                        onRemove={removeImage}
                        showVisibilityControls={false}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-green-200 rounded-lg bg-green-50">
                  <Globe className="w-16 h-16 text-green-300 mx-auto mb-4" />
                  <p className="font-medium text-green-700">Nenhuma foto pública</p>
                  <p className="text-sm text-green-600">Estas fotos serão visíveis para todos os visitantes</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="members_only" className="space-y-4">
              {membersImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Crown className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-800">Carrossel Membros - {membersImages.length} fotos</span>
                  </div>
                   <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {membersImages.map((image, index) => (
                      <ImageCard 
                        key={image.id} 
                        image={image} 
                        index={index} 
                        images={membersImages}
                        onEdit={setEditingImage}
                        onUpdateOrder={updateOrder}
                        onUpdateCaption={updateCaption}
                        onUpdateVisibility={updateVisibility}
                        onRemove={removeImage}
                        showVisibilityControls={false}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-amber-200 rounded-lg bg-amber-50">
                  <Crown className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                  <p className="font-medium text-amber-700">Nenhuma foto para membros</p>
                  <p className="text-sm text-amber-600">Estas fotos serão visíveis apenas para membros autorizados</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="admin_only" className="space-y-4">
              {adminImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Lock className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Fotos Admin - {adminImages.length} fotos</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adminImages.map((image, index) => (
                      <ImageCard 
                        key={image.id} 
                        image={image} 
                        index={index} 
                        images={adminImages}
                        onEdit={setEditingImage}
                        onUpdateOrder={updateOrder}
                        onUpdateCaption={updateCaption}
                        onUpdateVisibility={updateVisibility}
                        onRemove={removeImage}
                        showVisibilityControls={false}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-red-200 rounded-lg bg-red-50">
                  <Lock className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <p className="font-medium text-red-700">Nenhuma foto admin</p>
                  <p className="text-sm text-red-600">Estas fotos são visíveis apenas para administradores</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {galleryImages.map((image, index) => (
                <ImageCard 
                  key={image.id} 
                  image={image} 
                  index={index} 
                  images={galleryImages}
                  onEdit={setEditingImage}
                  onUpdateOrder={updateOrder}
                  onUpdateCaption={updateCaption}
                  onUpdateVisibility={updateVisibility}
                  onRemove={removeImage}
                  showVisibilityControls={true}
                />
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-medium">Nenhuma foto adicionada</p>
          <p className="text-sm">Adicione pelo menos uma foto para que o modelo apareça no site</p>
        </div>
      )}

    </div>
  );
};

// Separate component for image cards to reduce complexity
interface ImageCardProps {
  image: GalleryImage;
  index: number;
  images: GalleryImage[];
  onEdit: (url: string) => void;
  onUpdateOrder: (id: string, order: number, visibility: string) => void;
  onUpdateCaption: (id: string, caption: string) => void;
  onUpdateVisibility: (id: string, visibility: 'public' | 'members_only' | 'admin_only') => void;
  onRemove: (id: string) => void;
  showVisibilityControls: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  images,
  onEdit,
  onUpdateOrder,
  onUpdateCaption,
  onUpdateVisibility,
  onRemove,
  showVisibilityControls
}) => {
  return (
    <div className="border-2 rounded-lg overflow-hidden border-border">
      <div 
        className="aspect-square cursor-pointer group relative"
        onClick={() => onEdit(image.image_url)}
        title="Clique para editar a imagem"
      >
        <img
          src={image.image_url}
          alt={image.caption || 'Gallery image'}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Edit3 className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {/* Order selector */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Posição:</Label>
          <select
            value={image.order_index}
            onChange={(e) => onUpdateOrder(image.id, parseInt(e.target.value), image.visibility || 'public')}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {Array.from({ length: Math.max(5, images.length + 1) }, (_, i) => (
              <option key={i} value={i}>{i + 1}</option>
            ))}
          </select>
          {index === 0 && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
              Destaque
            </span>
          )}
        </div>
        
        {/* Visibility controls for mixed access models */}
        {showVisibilityControls && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibilidade:</Label>
            <div className="flex gap-1">
              <Button
                type="button"
                variant={image.visibility === 'public' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdateVisibility(image.id, 'public')}
                className={`flex-1 text-xs ${
                  image.visibility === 'public' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'text-green-600 border-green-200 hover:bg-green-50'
                }`}
              >
                <Globe className="w-3 h-3 mr-1" />
                Pública
              </Button>
              <Button
                type="button"
                variant={image.visibility === 'members_only' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdateVisibility(image.id, 'members_only')}
                className={`flex-1 text-xs ${
                  image.visibility === 'members_only' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'text-amber-600 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <Crown className="w-3 h-3 mr-1" />
                Membros
              </Button>
              <Button
                type="button"
                variant={image.visibility === 'admin_only' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdateVisibility(image.id, 'admin_only')}
                className={`flex-1 text-xs ${
                  image.visibility === 'admin_only' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'text-red-600 border-red-200 hover:bg-red-50'
                }`}
              >
                <Lock className="w-3 h-3 mr-1" />
                Admin
              </Button>
            </div>
          </div>
        )}
        
        {/* Caption */}
        <Input
          value={image.caption || ''}
          onChange={(e) => onUpdateCaption(image.id, e.target.value)}
          placeholder="Adicionar legenda..."
          className="text-sm"
        />
        
        {/* Action buttons */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(image.id)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
};