import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationStats {
  totalModels: number;
  processedModels: number;
  mainImagesFixed: number;
  galleryImagesFixed: number;
  errors: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('🚀 Starting global model image migration...');

    // Get all models that need migration
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('id, name, image, image_url_local_main, gallery_external_urls, gallery_local_urls');

    if (modelsError) {
      throw new Error(`Failed to fetch models: ${modelsError.message}`);
    }

    const stats: MigrationStats = {
      totalModels: models?.length || 0,
      processedModels: 0,
      mainImagesFixed: 0,
      galleryImagesFixed: 0,
      errors: []
    };

    console.log(`📊 Found ${stats.totalModels} models to process`);

    if (!models || models.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        stats,
        message: 'No models found to migrate' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Process each model
    for (const model of models) {
      try {
        console.log(`\n🔄 Processing model: ${model.name} (${model.id})`);
        
        let needsMainImageFix = false;
        let needsGalleryFix = false;

        // Check if main image needs fixing
        if (model.image && !model.image_url_local_main) {
          // Check if image is external URL
          if (model.image.startsWith('http')) {
            console.log(`📸 Main image needs conversion: ${model.image}`);
            needsMainImageFix = true;
          }
        }

        // Check if gallery needs fixing
        if (model.gallery_external_urls && model.gallery_external_urls.length > 0) {
          const localUrls = model.gallery_local_urls || [];
          if (localUrls.length < model.gallery_external_urls.length) {
            console.log(`🖼️ Gallery needs conversion: ${model.gallery_external_urls.length} external, ${localUrls.length} local`);
            needsGalleryFix = true;
          }
        }

        // Fix main image if needed
        if (needsMainImageFix) {
          try {
            console.log(`🔧 Fixing main image for ${model.name}...`);
            const { data: mainResult, error: mainError } = await supabase.functions.invoke('fix-image-to-local', {
              body: {
                imageUrl: model.image,
                category: 'models',
                itemId: model.id,
                tableName: 'models',
                fieldName: 'image_url_local_main',
                itemName: model.name
              }
            });

            if (mainError) {
              console.error(`❌ Main image error for ${model.name}:`, mainError);
              stats.errors.push(`Main image error for ${model.name}: ${mainError.message}`);
            } else {
              console.log(`✅ Main image fixed for ${model.name}`);
              stats.mainImagesFixed++;
            }
          } catch (error) {
            console.error(`❌ Main image exception for ${model.name}:`, error);
            stats.errors.push(`Main image exception for ${model.name}: ${error.message}`);
          }
        }

        // Fix gallery images if needed
        if (needsGalleryFix) {
          const externalUrls = model.gallery_external_urls || [];
          const localUrls = model.gallery_local_urls || [];
          
          for (let i = localUrls.length; i < externalUrls.length; i++) {
            const sourceUrl = externalUrls[i];
            if (!sourceUrl || !sourceUrl.startsWith('http')) continue;

            try {
              console.log(`🔧 Fixing gallery image ${i + 1}/${externalUrls.length} for ${model.name}...`);
              const { data: galleryResult, error: galleryError } = await supabase.functions.invoke('admin-fix-one-gallery', {
                body: {
                  modelId: model.id,
                  sourceUrl: sourceUrl,
                  index: i
                }
              });

              if (galleryError) {
                console.error(`❌ Gallery image ${i} error for ${model.name}:`, galleryError);
                stats.errors.push(`Gallery image ${i} error for ${model.name}: ${galleryError.message}`);
              } else {
                console.log(`✅ Gallery image ${i} fixed for ${model.name}`);
                stats.galleryImagesFixed++;
              }
            } catch (error) {
              console.error(`❌ Gallery image ${i} exception for ${model.name}:`, error);
              stats.errors.push(`Gallery image ${i} exception for ${model.name}: ${error.message}`);
            }

            // Small delay to avoid overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        // Set main image from gallery if none exists
        if (!model.image_url_local_main && !needsMainImageFix) {
          const localUrls = model.gallery_local_urls || [];
          if (localUrls.length > 0) {
            console.log(`📷 Setting main image from gallery for ${model.name}...`);
            const { error: updateError } = await supabase
              .from('models')
              .update({ 
                image_url_local_main: localUrls[0],
                updated_at: new Date().toISOString()
              })
              .eq('id', model.id);

            if (updateError) {
              console.error(`❌ Failed to set main image for ${model.name}:`, updateError);
              stats.errors.push(`Failed to set main image for ${model.name}: ${updateError.message}`);
            } else {
              console.log(`✅ Main image set from gallery for ${model.name}`);
              stats.mainImagesFixed++;
            }
          }
        }

        stats.processedModels++;
        console.log(`✅ Completed processing ${model.name} (${stats.processedModels}/${stats.totalModels})`);

      } catch (error) {
        console.error(`💥 Failed to process model ${model.name}:`, error);
        stats.errors.push(`Failed to process model ${model.name}: ${error.message}`);
        stats.processedModels++;
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`📊 Stats: ${stats.processedModels}/${stats.totalModels} models processed`);
    console.log(`📸 Main images fixed: ${stats.mainImagesFixed}`);
    console.log(`🖼️ Gallery images fixed: ${stats.galleryImagesFixed}`);
    console.log(`❌ Errors: ${stats.errors.length}`);

    const success = stats.errors.length === 0;
    
    return new Response(JSON.stringify({
      success,
      stats,
      message: success 
        ? `Migration completed successfully! Processed ${stats.processedModels} models, fixed ${stats.mainImagesFixed} main images and ${stats.galleryImagesFixed} gallery images.`
        : `Migration completed with ${stats.errors.length} errors. Check logs for details.`
    }), {
      status: success ? 200 : 207, // 207 = Multi-Status (partial success)
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Migration failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Migration failed with unexpected error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});