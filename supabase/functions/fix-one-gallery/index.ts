import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FixGalleryRequest {
  modelId: string;
  sourceUrl: string;
  index: number;
  dry_run?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const { modelId, sourceUrl, index, dry_run = false }: FixGalleryRequest = await req.json();

    console.log('🖼️ GALLERY FIX: Processing', { modelId, sourceUrl, index, dry_run });

    // Validate inputs
    if (!modelId || !sourceUrl || index < 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid modelId, sourceUrl, or index' }), 
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate optimized filenames
    const baseFilename = `models/${modelId}/gallery-${index}`;
    const filename800 = `${baseFilename}-800.webp`;
    const filename1200 = `${baseFilename}-1200.webp`;
    const localUrl = `/images/${filename1200}`;

    // Check if local image already exists
    const { data: existingFile } = await supabase.storage
      .from('model-images')
      .download(filename1200);

    if (existingFile) {
      console.log('✅ GALLERY FIX: File already exists, updating DB only');
      
      // Update database to ensure URLs are tracked
      const { data: model } = await supabase
        .from('models')
        .select('gallery_external_urls, gallery_local_urls')
        .eq('id', modelId)
        .single();

      if (model) {
        const externalUrls = model.gallery_external_urls || [];
        const localUrls = model.gallery_local_urls || [];
        
        const updatedExternalUrls = externalUrls.includes(sourceUrl) 
          ? externalUrls 
          : [...externalUrls, sourceUrl];
        
        const updatedLocalUrls = localUrls.includes(localUrl)
          ? localUrls
          : [...localUrls, localUrl];

        await supabase
          .from('models')
          .update({
            gallery_external_urls: updatedExternalUrls,
            gallery_local_urls: updatedLocalUrls
          })
          .eq('id', modelId);
      }

      return new Response(
        JSON.stringify({ 
          ok: true, 
          status: 200, 
          local: localUrl,
          message: 'File already exists, DB updated'
        }),
        { headers: corsHeaders }
      );
    }

    if (dry_run) {
      return new Response(
        JSON.stringify({ 
          ok: true, 
          status: 'dry_run', 
          local: localUrl,
          message: 'Dry run - would process this image'
        }),
        { headers: corsHeaders }
      );
    }

    // Download source image
    console.log('📥 GALLERY FIX: Downloading source image');
    const imageResponse = await fetch(sourceUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageData = new Uint8Array(imageBuffer);

    // Upload both sizes (for now, we'll upload the same image - optimization can be added later)
    console.log('📤 GALLERY FIX: Uploading optimized images');
    
    const { error: uploadError800 } = await supabase.storage
      .from('model-images')
      .upload(filename800, imageData, {
        contentType: 'image/webp',
        upsert: true
      });

    const { error: uploadError1200 } = await supabase.storage
      .from('model-images')
      .upload(filename1200, imageData, {
        contentType: 'image/webp',
        upsert: true
      });

    if (uploadError800 || uploadError1200) {
      throw new Error(`Upload failed: ${uploadError800?.message || uploadError1200?.message}`);
    }

    // Update database
    console.log('💾 GALLERY FIX: Updating database');
    const { data: model } = await supabase
      .from('models')
      .select('gallery_external_urls, gallery_local_urls')
      .eq('id', modelId)
      .single();

    if (model) {
      const externalUrls = model.gallery_external_urls || [];
      const localUrls = model.gallery_local_urls || [];
      
      const updatedExternalUrls = externalUrls.includes(sourceUrl) 
        ? externalUrls 
        : [...externalUrls, sourceUrl];
      
      const updatedLocalUrls = localUrls.includes(localUrl)
        ? localUrls
        : [...localUrls, localUrl];

      const { error: updateError } = await supabase
        .from('models')
        .update({
          gallery_external_urls: updatedExternalUrls,
          gallery_local_urls: updatedLocalUrls
        })
        .eq('id', modelId);

      if (updateError) {
        console.error('❌ GALLERY FIX: Database update error:', updateError);
      }
    }

    console.log('✅ GALLERY FIX: Complete');
    
    return new Response(
      JSON.stringify({ 
        ok: true, 
        status: 200, 
        local: localUrl,
        message: 'Gallery image processed successfully'
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ GALLERY FIX: Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        ok: false 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});