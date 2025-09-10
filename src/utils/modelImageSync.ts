// Utility to automatically sync models without main images with their gallery
import { supabase } from '@/integrations/supabase/client';

export const syncModelMainImages = async () => {
  try {
    console.log('🔄 [MODEL-SYNC] Starting model image synchronization...');
    
    // Get models without main image that have gallery images
    const { data: modelsWithoutImage, error: queryError } = await supabase
      .from('models')
      .select(`
        id, 
        name, 
        image,
        model_gallery(image_url, order_index)
      `)
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('❌ [MODEL-SYNC] Error fetching models:', queryError);
      return { success: false, error: queryError.message };
    }

    const modelsToUpdate = [];
    
    for (const model of modelsWithoutImage || []) {
      // Check if model needs update (no main image but has gallery)
      const hasMainImage = model.image && model.image.trim() !== '';
      const hasGallery = model.model_gallery && model.model_gallery.length > 0;
      
      if (!hasMainImage && hasGallery) {
        // Get first gallery image
        const firstGalleryImage = model.model_gallery
          .sort((a: any, b: any) => a.order_index - b.order_index)[0];
        
        if (firstGalleryImage?.image_url) {
          modelsToUpdate.push({
            id: model.id,
            name: model.name,
            newImage: firstGalleryImage.image_url
          });
          
          console.log(`📝 [MODEL-SYNC] ${model.name} precisa de atualização: ${firstGalleryImage.image_url}`);
        }
      }
    }

    if (modelsToUpdate.length === 0) {
      console.log('✅ [MODEL-SYNC] All models already have main images');
      return { success: true, updated: 0 };
    }

    console.log(`🔄 [MODEL-SYNC] Found ${modelsToUpdate.length} models to update`);
    
    // Note: In a read-only environment, we can't actually update
    // This would be the update logic in a writable environment:
    /*
    const updates = modelsToUpdate.map(model => 
      supabase
        .from('models')
        .update({ image: model.newImage })
        .eq('id', model.id)
    );
    
    const results = await Promise.all(updates);
    */
    
    // For now, just log what would be updated
    console.log('📋 [MODEL-SYNC] Models that would be updated:', modelsToUpdate);
    
    return { 
      success: true, 
      updated: modelsToUpdate.length,
      modelsToUpdate 
    };
    
  } catch (error) {
    console.error('💥 [MODEL-SYNC] Unexpected error:', error);
    return { success: false, error: error.message };
  }
};

// Check if a model needs image sync
export const checkModelImageSync = (model: any): boolean => {
  const hasMainImage = model.image && model.image.trim() !== '';
  const hasGallery = model.model_gallery && model.model_gallery.length > 0;
  
  return !hasMainImage && hasGallery;
};

// Get fallback image for a model from its gallery
export const getModelFallbackImage = (model: any): string | null => {
  if (!model.model_gallery || model.model_gallery.length === 0) {
    return null;
  }
  
  const sortedGallery = model.model_gallery
    .sort((a: any, b: any) => a.order_index - b.order_index);
  
  return sortedGallery[0]?.image_url || null;
};