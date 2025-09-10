import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const anastasiaId = 'd851677c-b1cc-43ac-bb9a-a65f83bf9e5b';
    
    console.log(`🔄 Processing Anastasia's photos...`);

    // Get Anastasia's current data
    const { data: anastasia, error: selectError } = await supabase
      .from('models')
      .select('image, image_url_local_main, gallery_external_urls, gallery_local_urls')
      .eq('id', anastasiaId)
      .single();

    if (selectError) throw selectError;

    console.log(`📊 Current data:`, anastasia);

    const results = [];

    // 1. Fix main image if needed
    if (anastasia.image && !anastasia.image_url_local_main) {
      console.log(`🖼️ Processing main image...`);
      
      const { data: mainResult, error: mainError } = await supabase.functions.invoke('admin-fix-one-image', {
        body: {
          entity: 'model',
          id: anastasiaId,
          dry_run: false
        }
      });

      if (mainError) {
        console.error(`❌ Main image error:`, mainError);
        results.push({ type: 'main', success: false, error: mainError.message });
      } else {
        console.log(`✅ Main image processed:`, mainResult);
        results.push({ type: 'main', success: true, result: mainResult });
      }
    }

    // 2. Process gallery images
    if (anastasia.gallery_external_urls && anastasia.gallery_external_urls.length > 0) {
      console.log(`🖼️ Processing ${anastasia.gallery_external_urls.length} gallery images...`);

      for (let i = 0; i < anastasia.gallery_external_urls.length; i++) {
        const sourceUrl = anastasia.gallery_external_urls[i];
        
        console.log(`📷 Processing gallery image ${i}: ${sourceUrl}`);
        
        const { data: galleryResult, error: galleryError } = await supabase.functions.invoke('admin-fix-one-gallery', {
          body: {
            modelId: anastasiaId,
            sourceUrl: sourceUrl,
            index: i,
            dry_run: false
          }
        });

        if (galleryError) {
          console.error(`❌ Gallery image ${i} error:`, galleryError);
          results.push({ type: 'gallery', index: i, success: false, error: galleryError.message });
        } else {
          console.log(`✅ Gallery image ${i} processed:`, galleryResult);
          results.push({ type: 'gallery', index: i, success: true, result: galleryResult });
        }
      }
    }

    // 3. Get final state
    const { data: finalState } = await supabase
      .from('models')
      .select('image, image_url_local_main, gallery_external_urls, gallery_local_urls')
      .eq('id', anastasiaId)
      .single();

    console.log(`🏁 Final state:`, finalState);

    return new Response(JSON.stringify({
      success: true,
      message: 'Anastasia photos processing completed',
      results,
      initialState: anastasia,
      finalState
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('❌ Error processing Anastasia photos:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});