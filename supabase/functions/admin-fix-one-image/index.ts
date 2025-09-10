import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FixImageRequest {
  entity: 'model' | 'carousel' | 'hero_slide';
  id: string;
  dry_run?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check authentication
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: corsHeaders
      });
    }

    // Parse request
    const { entity, id, dry_run = false }: FixImageRequest = await req.json();

    console.log('🔧 ADMIN FIX IMAGE: Processing', { entity, id, dry_run });

    // Get entity data and determine source URL
    let sourceUrl = '';
    let itemName = '';
    let category = '';
    let tableName = '';
    let fieldName = '';

    switch (entity) {
      case 'model': {
        const { data: model } = await supabase
          .from('models')
          .select('name, image')
          .eq('id', id)
          .single();
        
        if (!model) {
          return new Response(JSON.stringify({ error: 'Model not found' }), {
            status: 404,
            headers: corsHeaders
          });
        }

        sourceUrl = model.image;
        itemName = model.name;
        category = 'models';
        tableName = 'models';
        fieldName = 'image_url_local_main';
        break;
      }

      case 'carousel': {
        const { data: item } = await supabase
          .from('homepage_carousel')
          .select('model_name, image_url')
          .eq('id', id)
          .single();
        
        if (!item) {
          return new Response(JSON.stringify({ error: 'Carousel item not found' }), {
            status: 404,
            headers: corsHeaders
          });
        }

        sourceUrl = item.image_url;
        itemName = item.model_name;
        category = 'homepage carousel';
        tableName = 'homepage_carousel';
        fieldName = 'image_url_local';
        break;
      }

      case 'hero_slide': {
        const { data: slide } = await supabase
          .from('hero_slides')
          .select('title, image_url')
          .eq('id', id)
          .single();
        
        if (!slide) {
          return new Response(JSON.stringify({ error: 'Hero slide not found' }), {
            status: 404,
            headers: corsHeaders
          });
        }

        sourceUrl = slide.image_url;
        itemName = slide.title;
        category = 'hero/banners';
        tableName = 'hero_slides';
        fieldName = 'image_url_local_desktop';
        break;
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid entity type' }), {
          status: 400,
          headers: corsHeaders
        });
    }

    if (!sourceUrl) {
      return new Response(JSON.stringify({ error: 'No source image URL found' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (dry_run) {
      return new Response(JSON.stringify({ 
        ok: true, 
        status: 'dry_run', 
        entity,
        itemName,
        sourceUrl,
        message: 'Dry run - would process this image'
      }), {
        headers: corsHeaders
      });
    }

    // Call the fix-image-to-local function
    const { data: fixResult, error: fixError } = await supabase.functions.invoke('fix-image-to-local', {
      body: {
        imageUrl: sourceUrl,
        category,
        itemId: id,
        tableName,
        fieldName,
        itemName,
        altText: itemName
      }
    });

    if (fixError) {
      throw new Error(`Fix function failed: ${fixError.message}`);
    }

    console.log('✅ ADMIN FIX IMAGE: Complete', fixResult);
    
    return new Response(JSON.stringify({ 
      ok: true, 
      status: 200, 
      local: fixResult.localUrl,
      entity,
      itemName,
      originalUrl: sourceUrl
    }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('❌ ADMIN FIX IMAGE: Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      ok: false 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});