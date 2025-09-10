import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, imageType = 'hero-banner' } = await req.json();
    
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    console.log('🔄 Starting image sync process for:', imageUrl);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Download image from URL (either Supabase Storage or external)
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBlob = await imageResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Generate optimized filename
    const timestamp = Date.now();
    const fileExtension = imageUrl.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${imageType}-${timestamp}.${fileExtension}`;
    const localPath = `/images/${fileName}`;

    console.log('📁 Generated local path:', localPath);

    // Save to local public/images directory
    // Note: In Edge Functions, we can't write directly to the project's public folder
    // Instead, we'll upload to a special local storage bucket and serve from there
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('model-images')
      .upload(`local-cache/${fileName}`, uint8Array, {
        contentType: imageBlob.type,
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Failed to upload to cache: ${uploadError.message}`);
    }

    // Get the public URL for the cached image
    const { data: publicUrlData } = supabase.storage
      .from('model-images')
      .getPublicUrl(`local-cache/${fileName}`);

    console.log('✅ Image successfully cached and available at:', publicUrlData.publicUrl);

    // For the response, we'll return the local path that the frontend can use
    // The frontend will handle copying to actual public/images if needed
    return new Response(JSON.stringify({
      success: true,
      localPath: localPath,
      cachedUrl: publicUrlData.publicUrl,
      originalUrl: imageUrl,
      fileName: fileName
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in sync-image-to-local function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});