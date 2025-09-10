import { supabase } from '@/integrations/supabase/client';

export interface MigrationStats {
  totalModels: number;
  processedModels: number;
  mainImagesFixed: number;
  galleryImagesFixed: number;
  errors: string[];
}

export interface MigrationResult {
  success: boolean;
  stats: MigrationStats;
  message: string;
  error?: string;
}

/**
 * Execute global migration for all model images
 */
export const executeGlobalMigration = async (): Promise<MigrationResult> => {
  try {
    console.log('🚀 Starting global model migration...');
    
    const { data, error } = await supabase.functions.invoke('migrate-all-model-images', {
      body: {}
    });

    if (error) {
      console.error('❌ Migration function error:', error);
      throw error;
    }

    console.log('✅ Migration completed:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error executing global migration:', error);
    throw error;
  }
};

/**
 * Check migration status for all models
 */
export const checkMigrationStatus = async () => {
  try {
    const { data: models, error } = await supabase
      .from('models')
      .select(`
        id,
        name,
        image,
        image_url_local_main,
        gallery_external_urls,
        gallery_local_urls
      `);

    if (error) {
      throw error;
    }

    const stats = {
      totalModels: models?.length || 0,
      modelsWithLocalMain: 0,
      modelsWithExternalMain: 0,
      modelsWithExternalGallery: 0,
      modelsNeedingMigration: 0
    };

    models?.forEach(model => {
      // Check main image status
      if (model.image_url_local_main) {
        stats.modelsWithLocalMain++;
      } else if (model.image && model.image.startsWith('http')) {
        stats.modelsWithExternalMain++;
      }

      // Check gallery status
      const externalCount = model.gallery_external_urls?.length || 0;
      const localCount = model.gallery_local_urls?.length || 0;
      
      if (externalCount > localCount) {
        stats.modelsWithExternalGallery++;
      }

      // Model needs migration if has external main or incomplete gallery
      const needsMainMigration = model.image && model.image.startsWith('http') && !model.image_url_local_main;
      const needsGalleryMigration = externalCount > localCount;
      
      if (needsMainMigration || needsGalleryMigration) {
        stats.modelsNeedingMigration++;
      }
    });

    return {
      success: true,
      stats,
      models
    };

  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get detailed migration report
 */
export const getMigrationReport = async () => {
  try {
    const { data: models, error } = await supabase
      .from('models')
      .select(`
        id,
        name,
        image,
        image_url_local_main,
        gallery_external_urls,
        gallery_local_urls,
        updated_at
      `)
      .order('name');

    if (error) {
      throw error;
    }

    const report = models?.map(model => {
      const externalCount = model.gallery_external_urls?.length || 0;
      const localCount = model.gallery_local_urls?.length || 0;
      
      return {
        id: model.id,
        name: model.name,
        hasLocalMain: !!model.image_url_local_main,
        hasExternalMain: !!(model.image && model.image.startsWith('http')),
        externalGalleryCount: externalCount,
        localGalleryCount: localCount,
        needsMigration: (
          (model.image && model.image.startsWith('http') && !model.image_url_local_main) ||
          (externalCount > localCount)
        ),
        lastUpdated: model.updated_at
      };
    }) || [];

    return {
      success: true,
      report,
      summary: {
        total: report.length,
        fullyMigrated: report.filter(r => r.hasLocalMain && r.externalGalleryCount === r.localGalleryCount).length,
        needsMigration: report.filter(r => r.needsMigration).length,
        noImages: report.filter(r => !r.hasLocalMain && !r.hasExternalMain).length
      }
    };

  } catch (error) {
    console.error('❌ Error generating migration report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};