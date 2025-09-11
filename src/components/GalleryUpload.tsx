import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import { LazyImageEditor } from '@/components/LazyImageEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/components/AuthProvider';
import { useMobileGalleryOptimizer } from '@/hooks/useMobileGalleryOptimizer';
import { Trash2, Plus, Edit3, Globe, Crown, Lock, Info, AlertCircle, Download, Save } from 'lucide-react';

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

interface PendingImage {
  id: string;
  url: string;
  caption: string;
  status: 'pending' | 'processing' | 'ready' | 'saved' | 'error';
  error?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'members_only' | 'admin_only'>('public');
  const [activeTab, setActiveTab] = useState<'public' | 'members_only' | 'admin_only'>('public');
  const [loading, setLoading] = useState(false);
  
  // NEW: Batch upload states
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    loadGalleryImages();
  }, [modelId]);

  useEffect(() => {
    // Set default visibility based on model configuration
    if (model?.members_only) {
      setSelectedVisibility('members_only');
      setActiveTab('members_only');
    } else if (model?.all_photos_public) {
      setSelectedVisibility('public');
      setActiveTab('public');
    }
  }, [model]);

  const loadGalleryImages = async () => {
    if (!modelId) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', modelId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setGalleryImages(data || []);
      trackPerformance(Date.now(), data?.length || 0);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar galeria",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToPendingList = async () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Erro",
        description: "URL da imagem é obrigatória",
        variant: "destructive",
      });
      return;
    }

    // Add to pending list instead of directly saving
    const newPendingImage: PendingImage = {
      id: `pending-${Date.now()}`,
      url: newImageUrl.trim(),
      caption: newImageCaption.trim() || '',
      status: 'pending'
    };

    setPendingImages(prev => [...prev, newPendingImage]);
    setNewImageUrl('');
    setNewImageCaption('');
    
    toast({
      title: "Foto Adicionada",
      description: "Foto adicionada à lista. Use 'Processar Todas' para baixar e otimizar.",
    });
  };

  // NEW: Process all pending images
  const processAllImages = async () => {
    if (pendingImages.length === 0) return;

    setIsProcessingBatch(true);
    setProcessingProgress(0);

    try {
      const total = pendingImages.length;
      let processed = 0;

      for (const pendingImage of pendingImages) {
        // Update status to processing
        setPendingImages(prev => 
          prev.map(img => 
            img.id === pendingImage.id 
              ? { ...img, status: 'processing' } 
              : img
          )
        );

        try {
          // Determine visibility based on model configuration
          let visibility = selectedVisibility;
          if (model?.members_only) {
            visibility = 'members_only';
          } else if (model?.all_photos_public) {
            visibility = 'public';
          }

          // Call sync-image-to-local to process the image
          const { data: result, error: syncError } = await supabase.functions.invoke('sync-image-to-local', {
            body: {
              imageUrl: pendingImage.url,
              imageType: 'gallery',
              itemId: modelId,
              tableName: 'model_gallery',
              fieldName: 'image_url',
              itemName: `gallery-${modelId}-${Date.now()}`,
              altText: pendingImage.caption || 'Gallery image'
            }
          });

          if (syncError) throw syncError;

          // Add to gallery
          const { error: insertError } = await supabase
            .from('model_gallery')
            .insert({
              model_id: modelId,
              image_url: result?.localUrl || pendingImage.url,
              caption: pendingImage.caption || null,
              visibility: visibility,
              order_index: galleryImages.length + processed
            });

          if (insertError) throw insertError;

          // Update status to ready
          setPendingImages(prev => 
            prev.map(img => 
              img.id === pendingImage.id 
                ? { ...img, status: 'ready' } 
                : img
            )
          );

        } catch (error) {
          console.error('Error processing image:', error);
          setPendingImages(prev => 
            prev.map(img => 
              img.id === pendingImage.id 
                ? { ...img, status: 'error', error: error instanceof Error ? error.message : 'Erro desconhecido' } 
                : img
            )
          );
        }

        processed++;
        setProcessingProgress((processed / total) * 100);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      loadGalleryImages();
      window.dispatchEvent(new CustomEvent('galleryUpdated'));

      toast({
        title: "Processamento Concluído",
        description: `${processed} fotos processadas. Use 'Salvar Galeria' para finalizar.`,
      });

    } finally {
      setIsProcessingBatch(false);
    }
  };

  // NEW: Save all changes (clear pending list and refresh)
  const saveGallery = async () => {
    try {
      // Mark all ready images as saved
      setPendingImages(prev => 
        prev.map(img => 
          img.status === 'ready' 
            ? { ...img, status: 'saved' } 
            : img
        )
      );

      // Remove saved images after a short delay
      setTimeout(() => {
        setPendingImages(prev => prev.filter(img => img.status !== 'saved'));
      }, 1000);

      await loadGalleryImages();
      window.dispatchEvent(new CustomEvent('galleryUpdated'));

      toast({
        title: "Galeria Salva",
        description: "Todas as alterações foram salvas com sucesso.",
      });

    } catch (error) {
      console.error('Error saving gallery:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar galeria",
        variant: "destructive",
      });
    }
  };

  const removeImage = async (imageId: string) => {
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

      setGalleryImages(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, visibility: newVisibility } : img
        )
      );

      toast({
        title: "Sucesso",
        description: "Visibilidade atualizada",
      });

      // Dispatch event to notify gallery updates
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
    // Don't show tabs for exclusive models
    if (model?.members_only) return false;
    
    // Always show for admin users (non-exclusive models)
    if (isAdmin) return true;
    
    // Show if model has mixed configuration OR if gallery actually has mixed photos
    return isMixedModel || hasMultipleVisibilityTypes;
  }, [isAdmin, isMixedModel, hasMultipleVisibilityTypes, model?.members_only]);

  console.log(`🎯 GALLERY TABS DEBUG:`, {
    modelId: modelId,
    modelName: model?.name,
    isMixedModel,
    hasMultipleVisibilityTypes,
    shouldShowTabs,
    isAdmin,
    totalImages: galleryImages.length,
    publicCount: publicImages.length,
    membersCount: membersImages.length,
    adminCount: adminImages.length,
    modelConfig: {
      members_only: model?.members_only,
      all_photos_public: model?.all_photos_public
    }
  });

  const hasPendingToProcess = pendingImages.filter(img => img.status === 'pending').length > 0;
  const hasReadyToSave = pendingImages.filter(img => img.status === 'ready').length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Galeria de Fotos ({galleryImages.length} fotos)</h3>
        <Button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAdding ? 'Fechar' : 'Adicionar Fotos'}
        </Button>
      </div>

      {/* Banner para modelos exclusivos */}
      {model?.members_only && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground">Modelo Exclusiva</h4>
              <p className="text-sm text-muted-foreground">
                Todas as fotos são automaticamente para membros apenas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Banner informativo - Todas as fotos são públicas */}
      {!model?.members_only && !isMixedModel && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Fotos Públicas</h4>
              <p className="text-sm text-blue-700">
                Todas as fotos serão visíveis para todos (público e membros)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Seletor de Visibilidade - Apenas para modelos mistas */}
      {!model?.members_only && isMixedModel && (isAdding || (shouldShowTabs && isAdmin)) && (
        <div className="bg-background p-4 rounded-lg border border-border">
          <Label className="text-foreground font-bold text-lg flex items-center gap-2 mb-3">
            🎯 {isAdding ? 'Tipo de Foto' : 'Configuração de Visibilidade'}
          </Label>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={selectedVisibility === 'public' ? 'default' : 'outline'}
              onClick={() => setSelectedVisibility('public')}
              className={`flex-1 ${
                selectedVisibility === 'public' 
                  ? 'bg-foreground text-background hover:bg-foreground/90' 
                  : 'text-foreground border-border hover:bg-muted'
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
                  ? 'bg-foreground text-background hover:bg-foreground/90' 
                  : 'text-foreground border-border hover:bg-muted'
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
                  ? 'bg-foreground text-background hover:bg-foreground/90' 
                  : 'text-foreground border-border hover:bg-muted'
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Foto Admin
            </Button>
          </div>
        </div>
      )}

      {/* Batch Processing Section */}
      {(pendingImages.length > 0 || isAdding) && (
        <div className="border border-border rounded-lg p-6 space-y-4 bg-background">
          <div className="flex items-center justify-center gap-3 mb-4 bg-muted p-3 rounded-lg">
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-background" />
            </div>
            <h4 className="font-bold text-foreground">
              {isAdding ? 'Adicionar Novas Fotos' : 'Fotos Pendentes'}
            </h4>
          </div>

          {isAdding && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="imageUrl" className="text-foreground font-bold text-lg">URL da Imagem *</Label>
                <ImageUpload
                  value={newImageUrl}
                  onChange={(url) => setNewImageUrl(url)}
                  placeholder="Cole a URL da imagem aqui..."
                />
              </div>

              <div>
                <Label htmlFor="caption" className="text-foreground font-bold text-lg">Legenda (opcional)</Label>
                <Input
                  id="caption"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  placeholder="Descreva a imagem..."
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={addToPendingList} className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar à Lista
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                  Fechar
                </Button>
              </div>
            </div>
          )}

          {/* Pending Images List */}
          {pendingImages.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-medium text-foreground">Fotos na Lista ({pendingImages.length})</h5>
              
              {/* Processing Progress */}
              {isProcessingBatch && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Processando fotos...</span>
                    <span>{Math.round(processingProgress)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {pendingImages.map((pendingImage) => (
                <div key={pendingImage.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={pendingImage.url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {pendingImage.caption || 'Sem legenda'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={
                          pendingImage.status === 'ready' ? 'default' :
                          pendingImage.status === 'processing' ? 'secondary' :
                          pendingImage.status === 'error' ? 'destructive' :
                          'outline'
                        }
                        className="text-xs"
                      >
                        {pendingImage.status === 'pending' && 'Pendente'}
                        {pendingImage.status === 'processing' && 'Processando...'}
                        {pendingImage.status === 'ready' && 'Pronta'}
                        {pendingImage.status === 'saved' && 'Salva'}
                        {pendingImage.status === 'error' && 'Erro'}
                      </Badge>
                      {pendingImage.status === 'error' && pendingImage.error && (
                        <span className="text-xs text-destructive">{pendingImage.error}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPendingImages(prev => prev.filter(img => img.id !== pendingImage.id))}
                    disabled={pendingImage.status === 'processing'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Action Buttons - Always visible when there are pending images */}
      {pendingImages.length > 0 && (
        <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <Button
            onClick={processAllImages}
            disabled={isProcessingBatch || !hasPendingToProcess}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {isProcessingBatch ? (
              <>
                <LoadingSpinner className="w-4 h-4 mr-2" />
                Processando... ({Math.round(processingProgress)}%)
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Baixar e Processar Todas ({pendingImages.filter(img => img.status === 'pending').length})
              </>
            )}
          </Button>
          
          {hasReadyToSave && (
            <Button
              onClick={saveGallery}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Galeria ({pendingImages.filter(img => img.status === 'ready').length} prontas)
            </Button>
          )}
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
                <div className="grid gap-4">
                  {publicImages.map((image, index) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      index={index}
                      visibility="public"
                      onRemove={removeImage}
                      onUpdateCaption={updateCaption}
                      onUpdateOrder={updateOrder}
                      onUpdateVisibility={updateVisibility}
                      onEdit={setEditingImage}
                      isAdmin={isAdmin}
                      isMobile={isMobile}
                      getOptimizedImageUrl={getOptimizedImageUrl}
                      getOptimizedClasses={getOptimizedClasses}
                      isExclusiveModel={model?.members_only || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma foto pública adicionada ainda</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="members_only" className="space-y-4">
              {membersImages.length > 0 ? (
                <div className="grid gap-4">
                  {membersImages.map((image, index) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      index={index}
                      visibility="members_only"
                      onRemove={removeImage}
                      onUpdateCaption={updateCaption}
                      onUpdateOrder={updateOrder}
                      onUpdateVisibility={updateVisibility}
                      onEdit={setEditingImage}
                      isAdmin={isAdmin}
                      isMobile={isMobile}
                      getOptimizedImageUrl={getOptimizedImageUrl}
                      getOptimizedClasses={getOptimizedClasses}
                      isExclusiveModel={model?.members_only || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <Crown className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma foto para membros adicionada ainda</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="admin_only" className="space-y-4">
              {adminImages.length > 0 ? (
                <div className="grid gap-4">
                  {adminImages.map((image, index) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      index={index}
                      visibility="admin_only"
                      onRemove={removeImage}
                      onUpdateCaption={updateCaption}
                      onUpdateOrder={updateOrder}
                      onUpdateVisibility={updateVisibility}
                      onEdit={setEditingImage}
                      isAdmin={isAdmin}
                      isMobile={isMobile}
                      getOptimizedImageUrl={getOptimizedImageUrl}
                      getOptimizedClasses={getOptimizedClasses}
                      isExclusiveModel={model?.members_only || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma foto admin adicionada ainda</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // Single view for non-tabbed models
          <div className="space-y-4">
            {galleryImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                visibility={image.visibility || 'public'}
                onRemove={removeImage}
                onUpdateCaption={updateCaption}
                onUpdateOrder={updateOrder}
                onUpdateVisibility={updateVisibility}
                onEdit={setEditingImage}
                isAdmin={isAdmin}
                isMobile={isMobile}
                getOptimizedImageUrl={getOptimizedImageUrl}
                getOptimizedClasses={getOptimizedClasses}
                isExclusiveModel={model?.members_only || false}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center p-12 text-muted-foreground">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium mb-2">Nenhuma foto na galeria</h4>
          <p>Comece adicionando algumas fotos para criar a galeria do modelo</p>
        </div>
      )}

      {/* Image Editor Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Editar Imagem</h3>
            </div>
            <div className="p-4">
              <LazyImageEditor
                imageUrl={galleryImages.find(img => img.id === editingImage)?.image_url || ''}
                isOpen={true}
                onClose={() => setEditingImage(null)}
                onSave={(blob) => handleImageEdited(editingImage, blob)}
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={() => setEditingImage(null)} variant="outline">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

// ImageCard component remains the same...
interface ImageCardProps {
  image: GalleryImage;
  index: number;
  visibility: string;
  onRemove: (id: string) => void;
  onUpdateCaption: (id: string, caption: string) => void;
  onUpdateOrder: (id: string, newOrder: number, visibility: string) => void;
  onUpdateVisibility: (id: string, visibility: 'public' | 'members_only' | 'admin_only') => void;
  onEdit: (id: string) => void;
  isAdmin: boolean;
  isMobile: boolean;
  getOptimizedImageUrl: (url: string) => string;
  getOptimizedClasses: () => string;
  isExclusiveModel: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  visibility,
  onRemove,
  onUpdateCaption,
  onUpdateOrder,
  onUpdateVisibility,
  onEdit,
  isAdmin,
  isMobile,
  getOptimizedImageUrl,
  getOptimizedClasses,
  isExclusiveModel
}) => {
  const [caption, setCaption] = useState(image.caption || '');
  const [isUpdatingCaption, setIsUpdatingCaption] = useState(false);

  const handleCaptionUpdate = async () => {
    setIsUpdatingCaption(true);
    await onUpdateCaption(image.id, caption);
    setIsUpdatingCaption(false);
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-background space-y-4">
      <div className="flex gap-4">
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={getOptimizedImageUrl(image.image_url)}
            alt={image.caption || 'Gallery image'}
            className={`w-full h-full object-cover rounded-lg ${getOptimizedClasses()}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              #{index + 1}
            </Badge>
            {index === 0 && (
              <Badge variant="default" className="text-xs bg-primary">
                Destaque
              </Badge>
            )}
            {isExclusiveModel && (
              <Badge variant="secondary" className="text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Exclusiva
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Legenda</Label>
            <div className="flex gap-2">
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Adicione uma legenda..."
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleCaptionUpdate}
                disabled={isUpdatingCaption}
                variant="outline"
              >
                {isUpdatingCaption ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>

          {/* Order Controls */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Ordem:</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateOrder(image.id, Math.max(0, image.order_index - 1), visibility)}
              disabled={index === 0}
            >
              ↑
            </Button>
            <span className="text-sm px-2">{index + 1}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateOrder(image.id, image.order_index + 1, visibility)}
            >
              ↓
            </Button>
          </div>

          {/* Visibility Controls - Only for non-exclusive models and admins */}
          {!isExclusiveModel && isAdmin && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Visibilidade</Label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={image.visibility === 'public' ? 'default' : 'outline'}
                  onClick={() => onUpdateVisibility(image.id, 'public')}
                  className="text-xs"
                >
                  <Globe className="w-3 h-3 mr-1" />
                  Pública
                </Button>
                <Button
                  size="sm"
                  variant={image.visibility === 'members_only' ? 'default' : 'outline'}
                  onClick={() => onUpdateVisibility(image.id, 'members_only')}
                  className="text-xs"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Membros
                </Button>
                <Button
                  size="sm"
                  variant={image.visibility === 'admin_only' ? 'default' : 'outline'}
                  onClick={() => onUpdateVisibility(image.id, 'admin_only')}
                  className="text-xs"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Admin
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(image.id)}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemove(image.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remover
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
