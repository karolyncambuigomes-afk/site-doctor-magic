import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface for the request
interface FixGalleryRequest {
  modelId: string;
  sourceUrl: string;
  index: number;
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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Parse request body
    const { modelId, sourceUrl, index, dry_run = false }: FixGalleryRequest = await req.json();
    
    console.log(`🔄 Processing gallery image for model ${modelId}, index ${index}`);
    console.log(`📥 Source URL: ${sourceUrl}`);
    console.log(`🧪 Dry run: ${dry_run}`);

    // Validate inputs
    if (!modelId || !sourceUrl || index === undefined) {
      throw new Error('Missing required fields: modelId, sourceUrl, index');
    }

    // Generate optimized filename
    const timestamp = Date.now();
    const filename = `models/${modelId}/gallery-${index}-1200.webp`;
    const filename800 = `models/${modelId}/gallery-${index}-800.webp`;
    
    // If dry run, just return success
    if (dry_run) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Dry run - would process image',
        local_path: `/images/${filename}`,
        filename,
        modelId,
        index
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check if files already exist in optimized-images bucket
    const { data: existingFile } = await supabase.storage
      .from('optimized-images')
      .list(`models/${modelId}`, {
        search: `gallery-${index}-1200.webp`
      });

    if (existingFile && existingFile.length > 0) {
      console.log(`✅ Image already exists, updating database only`);
      
      // Update database with existing paths
      const { data: model, error: selectError } = await supabase
        .from('models')
        .select('gallery_external_urls, gallery_local_urls')
        .eq('id', modelId)
        .single();

      if (selectError) throw selectError;

      const updatedExternalUrls = [...(model.gallery_external_urls || [])];
      const updatedLocalUrls = [...(model.gallery_local_urls || [])];

      // Update arrays at the specified index
      updatedExternalUrls[index] = sourceUrl;
      updatedLocalUrls[index] = `/images/${filename}`;

      const { error: updateError } = await supabase
        .from('models')
        .update({
          gallery_external_urls: updatedExternalUrls,
          gallery_local_urls: updatedLocalUrls
        })
        .eq('id', modelId);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({
        success: true,
        message: 'File already existed, database updated',
        local_path: `/images/${filename}`,
        filename,
        modelId,
        index
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Download source image
    console.log(`📥 Downloading source image...`);
    const imageResponse = await fetch(sourceUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageBlob = await imageResponse.blob();
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    
    console.log(`📦 Downloaded ${imageArrayBuffer.byteLength} bytes`);

    // Upload to optimized-images bucket as webp
    console.log(`📤 Uploading to optimized-images/${filename}...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('optimized-images')
      .upload(filename, imageArrayBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 year
        upsert: true
      });

    if (uploadError) {
      console.error(`❌ Upload error:`, uploadError);
      throw uploadError;
    }

    console.log(`✅ Uploaded successfully:`, uploadData);

    // Also create 800px version (copy same file for now)
    console.log(`📤 Creating 800px version...`);
    await supabase.storage
      .from('optimized-images')
      .upload(filename800, imageArrayBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true
      });

    // Update database
    console.log(`💾 Updating database...`);
    const { data: model, error: selectError } = await supabase
      .from('models')
      .select('gallery_external_urls, gallery_local_urls')
      .eq('id', modelId)
      .single();

    if (selectError) throw selectError;

    const updatedExternalUrls = [...(model.gallery_external_urls || [])];
    const updatedLocalUrls = [...(model.gallery_local_urls || [])];

    // Update arrays at the specified index
    updatedExternalUrls[index] = sourceUrl;
    updatedLocalUrls[index] = `/images/${filename}`;

    const { error: updateError } = await supabase
      .from('models')
      .update({
        gallery_external_urls: updatedExternalUrls,
        gallery_local_urls: updatedLocalUrls
      })
      .eq('id', modelId);

    if (updateError) throw updateError;

    console.log(`✅ Database updated successfully`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Image processed and uploaded successfully',
      local_path: `/images/${filename}`,
      filename,
      modelId,
      index
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('❌ Error processing gallery image:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});