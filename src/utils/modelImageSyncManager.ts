import { supabase } from '@/integrations/supabase/client';

/**
 * Automatically sync models that have empty main images with their first public gallery image
 */
export const syncModelMainImages = async () => {
  try {
    console.log('🔄 [ImageSync] Starting model main image synchronization...');
    
    // Find models with empty main images that have public gallery images
    const { data: modelsToSync, error: fetchError } = await supabase
      .from('models')
      .select(`
        id,
        name,
        image,
        model_gallery!inner(
          image_url,
          visibility,
          order_index
        )
      `)
      .or('image.is.null,image.eq.')
      .eq('model_gallery.visibility', 'public')
      .order('model_gallery.order_index', { ascending: true });

    if (fetchError) {
      console.error('❌ [ImageSync] Error fetching models:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!modelsToSync || modelsToSync.length === 0) {
      console.log('✅ [ImageSync] All models have main images or no gallery images available');
      return { success: true, synced: 0 };
    }

    console.log(`🔄 [ImageSync] Found ${modelsToSync.length} models to sync:`, 
      modelsToSync.map(m => m.name));

    // Update each model with their first gallery image
    const updates = modelsToSync.map(model => {
      const firstImage = model.model_gallery[0]?.image_url;
      
      if (!firstImage) {
        console.warn(`⚠️ [ImageSync] No valid image found for ${model.name}`);
        return null;
      }

      console.log(`✅ [ImageSync] Syncing ${model.name} with image: ${firstImage}`);
      
      return supabase
        .from('models')
        .update({ 
          image: firstImage,
          updated_at: new Date().toISOString()
        })
        .eq('id', model.id);
    }).filter(Boolean);

    // Execute all updates
    const results = await Promise.allSettled(updates);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    if (failed > 0) {
      console.warn(`⚠️ [ImageSync] ${failed} updates failed`);
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`❌ [ImageSync] Failed to update model:`, result.reason);
        }
      });
    }

    console.log(`✅ [ImageSync] Synchronization complete: ${successful} successful, ${failed} failed`);
    
    return {
      success: true,
      synced: successful,
      failed: failed,
      total: modelsToSync.length
    };

  } catch (error) {
    console.error('❌ [ImageSync] Unexpected error during sync:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Get fallback image for a model from their gallery
 */
export const getModelFallbackImage = (model: any): string | null => {
  if (!model.gallery || !Array.isArray(model.gallery)) {
    return null;
  }

  // Find first public image sorted by order_index
  const publicImages = model.gallery
    .filter((img: any) => img.visibility === 'public' || !img.visibility)
    .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

  return publicImages[0]?.image_url || null;
};

/**
 * Check if a model needs image synchronization
 */
export const checkModelImageSync = (model: any): boolean => {
  const hasEmptyMainImage = !model.image || model.image.trim() === '';
  const hasGalleryImages = model.gallery && Array.isArray(model.gallery) && model.gallery.length > 0;
  
  return hasEmptyMainImage && hasGalleryImages;
};