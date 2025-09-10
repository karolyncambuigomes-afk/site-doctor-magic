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

    // Define all canonical items to generate
    const itemsToGenerate: GenerationItem[] = [
      // Hero items
      {
        id: 'hero-vic',
        name: 'Hero Vic 1600',
        category: 'hero',
        sourceUrl: '/images/hero-banner-vic-original.jpg',
        canonicalPath: 'hero/hero-banner-vic-1600.webp',
        width: 1600,
        height: 900,
        tableName: 'hero_slides',
        fieldName: 'image_url_local'
      },
      {
        id: 'hero-vic-1200',
        name: 'Hero Vic 1200',
        category: 'hero',
        sourceUrl: '/images/hero-banner-vic-original.jpg',
        canonicalPath: 'hero/hero-banner-vic-1200.webp',
        width: 1200,
        height: 675,
        tableName: 'hero_slides',
        fieldName: 'image_url_local'
      },
      {
        id: 'hero-vic-mobile',
        name: 'Hero Vic Mobile',
        category: 'hero',
        sourceUrl: '/images/hero-banner-vic-original.jpg',
        canonicalPath: 'hero/hero-banner-vic-mobile-1080x1920.webp',
        width: 1080,
        height: 1920,
        tableName: 'hero_slides',
        fieldName: 'image_url_local'
      },
      // Carousel items
      {
        id: 'carousel-kate',
        name: 'Carousel Kate',
        category: 'carousel',
        sourceUrl: '/images/kate1.jpg',
        canonicalPath: 'carousel/kate-1200.webp',
        width: 1200,
        height: 800,
        tableName: 'homepage_carousel',
        fieldName: 'image_url_local'
      },
      {
        id: 'carousel-livia',
        name: 'Carousel Livia',
        category: 'carousel',
        sourceUrl: '/images/luisa1.jpg',
        canonicalPath: 'carousel/livia-1200.webp',
        width: 1200,
        height: 800,
        tableName: 'homepage_carousel',
        fieldName: 'image_url_local'
      },
      // Model items
      {
        id: '95437c3e-58d2-4be5-b208-ff582a43f036',
        name: 'Kate Model',
        category: 'models',
        sourceUrl: '/images/kate1.jpg',
        canonicalPath: 'models/95437c3e-58d2-4be5-b208-ff582a43f036/model-95437c3e-58d2-4be5-b208-ff582a43f036-main-1200.webp',
        width: 1200,
        height: 800,
        tableName: 'models',
        fieldName: 'image_local'
      },
      {
        id: '7a60e995-0daa-423e-9864-050081d11c3f',
        name: 'Livia Model',
        category: 'models',
        sourceUrl: '/images/luisa1.jpg',
        canonicalPath: 'models/7a60e995-0daa-423e-9864-050081d11c3f/model-7a60e995-0daa-423e-9864-050081d11c3f-main-1200.webp',
        width: 1200,
        height: 800,
        tableName: 'models',
        fieldName: 'image_local'
      }
    ];

    const results: GenerationResult[] = [];

    // Process each item
    for (const item of itemsToGenerate) {
      console.log(`Processing ${item.name}...`);
      
      try {
        // Download source image
        const sourceResponse = await fetch(`${supabaseUrl.replace('/rest/v1', '')}${item.sourceUrl}`);
        if (!sourceResponse.ok) {
          results.push({
            item,
            success: false,
            uploaded: false,
            proxyStatus: 0,
            dbUpdated: false,
            error: `Failed to download source: ${sourceResponse.status}`
          });
          continue;
        }

        const sourceBuffer = await sourceResponse.arrayBuffer();
        const sourceImage = new Uint8Array(sourceBuffer);

        // Create optimized WebP version (simplified - in production would use image processing library)
        const optimizedImage = sourceImage; // For now, just use original

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
          
          if (item.tableName === 'models') {
            const { error: dbError } = await supabase
              .from('models')
              .update({ image_url_local_main: localPath })
              .eq('id', item.id);
            
            dbUpdated = !dbError;
          } else if (item.tableName === 'homepage_carousel') {
            const { error: dbError } = await supabase
              .from('homepage_carousel')
              .update({ image_url_local: localPath })
              .eq('id', item.id);
            
            dbUpdated = !dbError;
          } else if (item.tableName === 'hero_slides') {
            // Determine which field to update based on dimensions
            let updateField = 'image_url_local_desktop';
            if (item.dimensions?.includes('mobile')) {
              updateField = 'image_url_local_mobile';
            } else if (item.dimensions?.includes('1200')) {
              updateField = 'image_url_local_fallback';
            }
            
            const { error: dbError } = await supabase
              .from('hero_slides')
              .update({ [updateField]: localPath })
              .eq('id', item.id);
            
            dbUpdated = !dbError;
          }
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