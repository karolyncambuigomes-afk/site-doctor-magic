import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface for the request
interface FixBannerRequest {
  sectionId: string;
  sourceUrl: string;
  imageType: 'desktop' | 'mobile' | 'fallback';
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
    const { sectionId, sourceUrl, imageType, dry_run = false }: FixBannerRequest = await req.json();
    
    console.log(`🔄 [BANNER] Processing banner image for section ${sectionId}, type ${imageType}`);
    console.log(`📥 [BANNER] Source URL: ${sourceUrl}`);
    console.log(`🧪 [BANNER] Dry run: ${dry_run}`);

    // Validate inputs
    if (!sectionId || !sourceUrl || !imageType) {
      throw new Error('Missing required fields: sectionId, sourceUrl, imageType');
    }

    // Generate optimized filename
    const timestamp = Date.now();
    const filename = `banners/${sectionId}-${imageType}-1200.webp`;
    const filename800 = `banners/${sectionId}-${imageType}-800.webp`;
    
    // If dry run, just return success
    if (dry_run) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Dry run - would process banner image',
        local_path: `/images/${filename}`,
        filename,
        sectionId,
        imageType
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check if files already exist in optimized-images bucket
    const { data: existingFile } = await supabase.storage
      .from('optimized-images')
      .list(`banners`, {
        search: `${sectionId}-${imageType}-1200.webp`
      });

    if (existingFile && existingFile.length > 0) {
      console.log(`✅ [BANNER] Image already exists, updating database only`);
      
      // Update database with existing paths
      const columnName = `image_url_local_${imageType}`;
      const { error: updateError } = await supabase
        .from('site_content')
        .update({
          [columnName]: `/images/${filename}`
        })
        .eq('section', sectionId);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({
        success: true,
        message: 'Banner file already existed, database updated',
        local_path: `/images/${filename}`,
        filename,
        sectionId,
        imageType
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Download source image
    console.log(`📥 [BANNER] Downloading source image...`);
    const imageResponse = await fetch(sourceUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageBlob = await imageResponse.blob();
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    
    console.log(`📦 [BANNER] Downloaded ${imageArrayBuffer.byteLength} bytes`);

    // Upload to optimized-images bucket as webp
    console.log(`📤 [BANNER] Uploading to optimized-images/${filename}...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('optimized-images')
      .upload(filename, imageArrayBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 year
        upsert: true
      });

    if (uploadError) {
      console.error(`❌ [BANNER] Upload error:`, uploadError);
      throw uploadError;
    }

    console.log(`✅ [BANNER] Uploaded successfully:`, uploadData);

    // Also create 800px version (copy same file for now)
    console.log(`📤 [BANNER] Creating 800px version...`);
    await supabase.storage
      .from('optimized-images')
      .upload(filename800, imageArrayBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true
      });

    // Update database
    console.log(`💾 [BANNER] Updating database...`);
    const columnName = `image_url_local_${imageType}`;
    const { error: updateError } = await supabase
      .from('site_content')
      .update({
        [columnName]: `/images/${filename}`
      })
      .eq('section', sectionId);

    if (updateError) throw updateError;

    console.log(`✅ [BANNER] Database updated successfully`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Banner image processed and uploaded successfully',
      local_path: `/images/${filename}`,
      filename,
      sectionId,
      imageType
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('❌ [BANNER] Error processing banner image:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});