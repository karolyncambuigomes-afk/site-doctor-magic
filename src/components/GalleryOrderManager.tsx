import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Eye, EyeOff, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  model_id: string;
  image_url: string;
  caption?: string;
  order_index: number;
  visibility: 'public' | 'members_only';
  created_at: string;
}

interface GalleryOrderManagerProps {
  modelId: string;
  onUpdate?: () => void;
}

export const GalleryOrderManager: React.FC<GalleryOrderManagerProps> = ({
  modelId,
  onUpdate
}) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGalleryImages();
  }, [modelId]);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('model_gallery')
        .select('*')
        .eq('model_id', modelId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderIndexes = async (reorderedImages: GalleryImage[]) => {
    try {
      const updates = reorderedImages.map((img, index) => ({
        id: img.id,
        order_index: index
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('model_gallery')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) throw error;
      }

      // Update main image if first photo changed
      if (reorderedImages.length > 0) {
        await supabase
          .from('models')
          .update({ image: reorderedImages[0].image_url })
          .eq('id', modelId);
      }

      onUpdate?.();
      toast({
        title: "Success",
        description: "Gallery order updated successfully"
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update gallery order",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newImages = Array.from(images);
    const [reorderedItem] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedItem);

    setImages(newImages);
    updateOrderIndexes(newImages);
  };

  const toggleVisibility = async (imageId: string, currentVisibility: string) => {
    try {
      const newVisibility = currentVisibility === 'public' ? 'members_only' : 'public';
      
      const { error } = await supabase
        .from('model_gallery')
        .update({ visibility: newVisibility })
        .eq('id', imageId);

      if (error) throw error;

      setImages(images.map(img => 
        img.id === imageId 
          ? { ...img, visibility: newVisibility as 'public' | 'members_only' }
          : img
      ));

      toast({
        title: "Success",
        description: `Image visibility updated to ${newVisibility}`
      });
      
      onUpdate?.();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update image visibility",
        variant: "destructive"
      });
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    
    const newImages = Array.from(images);
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    
    setImages(newImages);
    updateOrderIndexes(newImages);
  };

  const moveDown = async (index: number) => {
    if (index === images.length - 1) return;
    
    const newImages = Array.from(images);
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    
    setImages(newImages);
    updateOrderIndexes(newImages);
  };

  if (loading) {
    return <div className="text-center py-8">Loading gallery...</div>;
  }

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No images in gallery. Upload some images first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gallery Order & Visibility</h3>
        <Badge variant="outline" className="text-xs">
          Drag to reorder • First image = Main photo
        </Badge>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-shadow ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      } ${index === 0 ? 'ring-2 ring-primary' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>

                          <img
                            src={image.image_url}
                            alt={image.caption || 'Gallery image'}
                            className="w-16 h-16 object-cover rounded"
                          />

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Photo {index + 1}</span>
                              {index === 0 && (
                                <Badge variant="default" className="text-xs flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  Main Photo
                                </Badge>
                              )}
                              <Badge 
                                variant={image.visibility === 'public' ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {image.visibility === 'public' ? 'Public' : 'Members Only'}
                              </Badge>
                            </div>
                            
                            {image.caption && (
                              <p className="text-sm text-muted-foreground">{image.caption}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`visibility-${image.id}`} className="text-xs">
                                {image.visibility === 'public' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Label>
                              <Switch
                                id={`visibility-${image.id}`}
                                checked={image.visibility === 'public'}
                                onCheckedChange={() => toggleVisibility(image.id, image.visibility)}
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveUp(index)}
                                disabled={index === 0}
                                className="h-8 w-8 p-0"
                              >
                                ↑
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveDown(index)}
                                disabled={index === images.length - 1}
                                className="h-8 w-8 p-0"
                              >
                                ↓
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};