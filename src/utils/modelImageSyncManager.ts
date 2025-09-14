import { supabase } from '@/integrations/supabase/client';

/**
 * Automatically sync models that have empty main images with their gallery images
 * Prioritizes public images but falls back to members_only if needed
 */
export const syncModelMainImages = async () => {
  try {
    console.log('🔄 [ImageSync] Starting model main image synchronization...');
    
    // First, try to sync with public images
    const { data: publicModels, error: publicError } = await supabase
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

    // Then, get models that still need sync (no public images available)
    const { data: membersOnlyModels, error: membersError } = await supabase
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
      .eq('model_gallery.visibility', 'members_only')
      .order('model_gallery.order_index', { ascending: true });

    if (publicError && membersError) {
      console.error('❌ [ImageSync] Error fetching models:', publicError || membersError);
      return { success: false, error: (publicError || membersError).message };
    }

    // Combine and deduplicate models (prioritize public)
    const allModelsToSync = [...(publicModels || [])];
    const publicModelIds = new Set((publicModels || []).map(m => m.id));
    
    // Add members_only models that don't have public versions
    if (membersOnlyModels) {
      membersOnlyModels.forEach(model => {
        if (!publicModelIds.has(model.id)) {
          allModelsToSync.push(model);
        }
      });
    }


    if (!allModelsToSync || allModelsToSync.length === 0) {
      console.log('✅ [ImageSync] All models have main images or no gallery images available');
      return { success: true, synced: 0 };
    }

    console.log(`🔄 [ImageSync] Found ${allModelsToSync.length} models to sync:`, 
      allModelsToSync.map(m => `${m.name} (${m.model_gallery[0]?.visibility})`));

    // Update each model with their first gallery image
    const updates = allModelsToSync.map(model => {
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
      total: allModelsToSync.length
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
 * Prioritizes public images but falls back to members_only
 */
export const getModelFallbackImage = (model: any): string | null => {
  const gallery = model.gallery || model.model_gallery;
  if (!gallery || !Array.isArray(gallery)) {
    return null;
  }

  // Sort all images by order_index
  const sortedImages = gallery.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

  // First try to find a public image
  const publicImage = sortedImages.find((img: any) => img.visibility === 'public' || !img.visibility);
  if (publicImage) {
    return publicImage.image_url;
  }

  // Fallback to any available image (including members_only)
  return sortedImages[0]?.image_url || null;
};

/**
 * Check if a model needs image synchronization
 */
export const checkModelImageSync = (model: any): boolean => {
  const hasEmptyMainImage = !model.image || model.image.trim() === '';
  const gallery = model.gallery || model.model_gallery;
  const hasGalleryImages = gallery && Array.isArray(gallery) && gallery.length > 0;
  
  return hasEmptyMainImage && hasGalleryImages;
};

/**
 * Execute a complete sync for all models that need main images
 */
export const executeGlobalModelSync = async () => {
  console.log('🌍 [GlobalSync] Starting global model image synchronization...');
  
  try {
    const result = await syncModelMainImages();
    
    if (result.success) {
      console.log(`✅ [GlobalSync] Complete! Updated ${result.synced} models, ${result.failed} failed`);
    } else {
      console.error('❌ [GlobalSync] Failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('💥 [GlobalSync] Unexpected error:', error);
    return { success: false, error: error.message };
  }
};