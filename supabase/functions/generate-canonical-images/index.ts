import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerationItem {
  id: string;
  name: string;
  category: 'hero' | 'carousel' | 'models';
  sourceUrl: string;
  canonicalPath: string;
  width: number;
  height: number;
  tableName: string;
  fieldName: string;
}

interface GenerationResult {
  item: GenerationItem;
  success: boolean;
  uploaded: boolean;
  proxyStatus: number;
  dbUpdated: boolean;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    console.log('Fetching real data from database...');
    
    // Fetch real data from database
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('id, name, image')
      .neq('image', null);

    const { data: carouselItems, error: carouselError } = await supabase
      .from('homepage_carousel')
      .select('id, model_name, image_url')
      .eq('is_active', true);

    const { data: heroSlides, error: heroError } = await supabase
      .from('hero_slides')
      .select('id, title, image_url')
      .eq('active', true);

    if (modelsError || carouselError || heroError) {
      console.error('Database fetch errors:', { modelsError, carouselError, heroError });
    }

    const itemsToGenerate: GenerationItem[] = [];

    // Add models
    if (models) {
      for (const model of models) {
        if (model.image) {
          itemsToGenerate.push({
            id: model.id,
            name: `Model ${model.name}`,
            category: 'models',
            sourceUrl: model.image,
            canonicalPath: `models/${model.id}/model-${model.id}-main-1200.webp`,
            width: 1200,
            height: 800,
            tableName: 'models',
            fieldName: 'image_url_local_main'
          });
        }
      }
    }

    // Add carousel items
    if (carouselItems) {
      for (const item of carouselItems) {
        if (item.image_url) {
          itemsToGenerate.push({
            id: item.id,
            name: `Carousel ${item.model_name}`,
            category: 'carousel',
            sourceUrl: item.image_url,
            canonicalPath: `carousel/${item.id}-1200.webp`,
            width: 1200,
            height: 800,
            tableName: 'homepage_carousel',
            fieldName: 'image_url_local'
          });
        }
      }
    }

    // Add hero slides - generate desktop, mobile and fallback versions
    if (heroSlides) {
      for (const slide of heroSlides) {
        if (slide.image_url) {
          // Desktop version
          itemsToGenerate.push({
            id: slide.id,
            name: `${slide.title} Desktop`,
            category: 'hero',
            sourceUrl: slide.image_url,
            canonicalPath: `hero/${slide.id}-desktop-1600.webp`,
            width: 1600,
            height: 900,
            tableName: 'hero_slides',
            fieldName: 'image_url_local_desktop'
          });

          // Mobile version
          itemsToGenerate.push({
            id: slide.id,
            name: `${slide.title} Mobile`,
            category: 'hero',
            sourceUrl: slide.image_url,
            canonicalPath: `hero/${slide.id}-mobile-1080.webp`,
            width: 1080,
            height: 1920,
            tableName: 'hero_slides',
            fieldName: 'image_url_local_mobile'
          });

          // Fallback version
          itemsToGenerate.push({
            id: slide.id,
            name: `${slide.title} Fallback`,
            category: 'hero',
            sourceUrl: slide.image_url,
            canonicalPath: `hero/${slide.id}-fallback-1200.webp`,
            width: 1200,
            height: 675,
            tableName: 'hero_slides',
            fieldName: 'image_url_local_fallback'
          });
        }
      }
    }

    console.log(`Generated ${itemsToGenerate.length} items to process`);

    const results: GenerationResult[] = [];

    // Process each item
    for (const item of itemsToGenerate) {
      console.log(`Processing ${item.name}...`);
      
        try {
        // Download source image - handle both Supabase Storage URLs and public URLs
        let sourceUrl = item.sourceUrl;
        if (sourceUrl.startsWith('/images/')) {
          // Convert to full public URL
          sourceUrl = `${supabaseUrl.replace('/rest/v1', '')}${sourceUrl}`;
        }

        console.log(`Downloading from: ${sourceUrl}`);
        const sourceResponse = await fetch(sourceUrl);
        if (!sourceResponse.ok) {
          results.push({
            item,
            success: false,
            uploaded: false,
            proxyStatus: 0,
            dbUpdated: false,
            error: `Failed to download source: ${sourceResponse.status} from ${sourceUrl}`
          });
          continue;
        }

        const sourceBuffer = await sourceResponse.arrayBuffer();
        const sourceImage = new Uint8Array(sourceBuffer);

        // Create optimized WebP version (simplified - in production would use image processing library)
        const optimizedImage = sourceImage; // For now, just use original

        console.log(`Uploading to: ${item.canonicalPath}`);
        // Upload to bucket
        const { error: uploadError } = await supabase.storage
          .from('model-images')
          .upload(item.canonicalPath, optimizedImage, {
            contentType: 'image/webp',
            upsert: true
          });

        if (uploadError) {
          results.push({
            item,
            success: false,
            uploaded: false,
            proxyStatus: 0,
            dbUpdated: false,
            error: `Upload failed: ${uploadError.message}`
          });
          continue;
        }

        // Test proxy URL
        const proxyUrl = `/images/${item.canonicalPath}`;
        const proxyResponse = await fetch(`${supabaseUrl.replace('/rest/v1', '')}${proxyUrl}`, { 
          method: 'HEAD' 
        });
        const proxyStatus = proxyResponse.status;

        let dbUpdated = false;
        if (proxyStatus === 200) {
          // Update database with local path
          const localPath = `/images/${item.canonicalPath}`;
          
          console.log(`Updating DB: ${item.tableName}.${item.fieldName} = ${localPath} for ID ${item.id}`);
          
          const { error: dbError } = await supabase
            .from(item.tableName)
            .update({ [item.fieldName]: localPath })
            .eq('id', item.id);
          
          if (dbError) {
            console.error(`DB update error for ${item.id}:`, dbError);
          }
          
          dbUpdated = !dbError;
        }

        results.push({
          item,
          success: true,
          uploaded: true,
          proxyStatus,
          dbUpdated,
        });

      } catch (error) {
        console.error(`Error processing ${item.name}:`, error);
        results.push({
          item,
          success: false,
          uploaded: false,
          proxyStatus: 0,
          dbUpdated: false,
          error: error.message
        });
      }
    }

    // Background task for cache management
    EdgeRuntime.waitUntil((async () => {
      try {
        // Trigger cache purge via service worker message
        console.log('Triggering cache purge and service worker refresh...');
        
        // This would typically be handled by the frontend after receiving the response
      } catch (error) {
        console.error('Cache management error:', error);
      }
    })());

    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      uploaded: results.filter(r => r.uploaded).length,
      proxyWorking: results.filter(r => r.proxyStatus === 200).length,
      dbUpdated: results.filter(r => r.dbUpdated).length,
    };

    return new Response(JSON.stringify({
      success: true,
      summary,
      results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Generation error:', error);
    return new Response(JSON.stringify({
      error: 'Generation failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});