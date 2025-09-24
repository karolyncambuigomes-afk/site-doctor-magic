// Helper utility to migrate existing images to local storage
import { supabase } from '@/integrations/supabase/client';

interface MigrationResult {
  success: boolean;
  migrated: number;
  failed: number;
  errors: string[];
}

/**
 * Migrate all model images to local storage
 */
export const migrateModelImages = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: false,
    migrated: 0,
    failed: 0,
    errors: []
  };

  try {
    console.log('🔄 Starting model images migration...');

    // Fetch all models
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('id, name, image');

    if (modelsError) {
      result.errors.push(`Failed to fetch models: ${modelsError.message}`);
      return result;
    }

    // Migrate main model images
    for (const model of models || []) {
      if (model.image && (model.image.includes('supabase') || model.image.includes('storage'))) {
        try {
          const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-image-to-local', {
            body: { 
              imageUrl: model.image,
              imageType: 'model-main',
              modelId: model.id
            }
          });

          if (syncError || !syncData?.success) {
            result.failed++;
            result.errors.push(`Failed to sync main image for model ${model.name}: ${syncError?.message || 'Unknown error'}`);
          } else {
            // Update model with local path
            const { error: updateError } = await supabase
              .from('models')
              .update({ image: syncData.localPath })
              .eq('id', model.id);

            if (updateError) {
              result.failed++;
              result.errors.push(`Failed to update model ${model.name}: ${updateError.message}`);
            } else {
              result.migrated++;
              console.log(`✅ Migrated main image for model ${model.name}`);
            }
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Error migrating model ${model.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Migrate gallery images
    const { data: galleryImages, error: galleryError } = await supabase
      .from('model_gallery')
      .select('id, model_id, image_url, order_index');

    if (galleryError) {
      result.errors.push(`Failed to fetch gallery images: ${galleryError.message}`);
    } else {
      for (const galleryImage of galleryImages || []) {
        if (galleryImage.image_url && (galleryImage.image_url.includes('supabase') || galleryImage.image_url.includes('storage'))) {
          try {
            const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-image-to-local', {
              body: { 
                imageUrl: galleryImage.image_url,
                imageType: 'model-gallery',
                modelId: galleryImage.model_id,
                index: galleryImage.order_index
              }
            });

            if (syncError || !syncData?.success) {
              result.failed++;
              result.errors.push(`Failed to sync gallery image ${galleryImage.id}: ${syncError?.message || 'Unknown error'}`);
            } else {
              // Update gallery image with local path
              const { error: updateError } = await supabase
                .from('model_gallery')
                .update({ image_url: syncData.localPath })
                .eq('id', galleryImage.id);

              if (updateError) {
                result.failed++;
                result.errors.push(`Failed to update gallery image ${galleryImage.id}: ${updateError.message}`);
              } else {
                result.migrated++;
                console.log(`✅ Migrated gallery image ${galleryImage.id}`);
              }
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`Error migrating gallery image ${galleryImage.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }
    }

    result.success = result.failed === 0;
    console.log(`🏁 Migration complete: ${result.migrated} migrated, ${result.failed} failed`);
    
    return result;
  } catch (error) {
    result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
};

/**
 * Migrate hero/banner images to local storage
 */
export const migrateHeroImages = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: false,
    migrated: 0,
    failed: 0,
    errors: []
  };

  try {
    console.log('🔄 Starting hero images migration...');

    // Fetch all hero slides
    const { data: heroSlides, error: heroError } = await supabase
      .from('hero_slides')
      .select('id, title, image_url');

    if (heroError) {
      result.errors.push(`Failed to fetch hero slides: ${heroError.message}`);
      return result;
    }

    for (const slide of heroSlides || []) {
      if (slide.image_url && (slide.image_url.includes('supabase') || slide.image_url.includes('storage'))) {
        try {
          const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-image-to-local', {
            body: { 
              imageUrl: slide.image_url,
              imageType: 'hero-banner'
            }
          });

          if (syncError || !syncData?.success) {
            result.failed++;
            result.errors.push(`Failed to sync hero slide ${slide.title}: ${syncError?.message || 'Unknown error'}`);
          } else {
            // Update hero slide with local path
            const { error: updateError } = await supabase
              .from('hero_slides')
              .update({ image_url: syncData.localPath })
              .eq('id', slide.id);

            if (updateError) {
              result.failed++;
              result.errors.push(`Failed to update hero slide ${slide.title}: ${updateError.message}`);
            } else {
              result.migrated++;
              console.log(`✅ Migrated hero slide ${slide.title}`);
            }
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Error migrating hero slide ${slide.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    result.success = result.failed === 0;
    console.log(`🏁 Hero migration complete: ${result.migrated} migrated, ${result.failed} failed`);
    
    return result;
  } catch (error) {
    result.errors.push(`Hero migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
};

/**
 * Update blog images data to use local paths
 */
export const updateBlogImagesData = (): string[] => {
  console.log('🔄 Updating blog images data to use local paths...');
  
  const imagesToMove = [
<<<<<<< HEAD
  '/src/assets/blog-entertainment-culture.webp',
  '/src/assets/blog-exclusive-experiences.webp', 
  '/src/assets/blog-restaurant-dining.webp',
  '/src/assets/blog-london-events.webp',
  '/src/assets/model1.webp',
  '/src/assets/model2.webp',
  '/src/assets/model3.webp',
  '/src/assets/model4.webp',
  '/src/assets/kate1.webp',
  '/src/assets/luisa1.webp',
  '/src/assets/about-luxury-1.webp',
  '/src/assets/about-luxury-2.webp',
  '/src/assets/about-luxury-3.webp'
=======
    '/src/assets/blog-entertainment-culture.jpg',
    '/src/assets/blog-exclusive-experiences.jpg', 
    '/src/assets/blog-restaurant-dining.jpg',
    '/src/assets/blog-london-events.jpg',
    '/src/assets/model1.jpg',
    '/src/assets/model2.jpg',
    '/src/assets/model3.jpg',
    '/src/assets/model4.jpg',
    '/src/assets/kate1.jpg',
    '/src/assets/luisa1.jpg',
    '/src/assets/about-luxury-1.jpg',
    '/src/assets/about-luxury-2.jpg',
    '/src/assets/about-luxury-3.jpg'
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)
  ];

  return imagesToMove;
};