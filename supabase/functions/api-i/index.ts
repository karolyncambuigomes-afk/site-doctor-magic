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
    const url = new URL(req.url);
    const imagePath = url.pathname.replace('/api/i/', '');
    
    if (!imagePath) {
      return new Response('Image path required', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the image from storage
    const { data, error } = await supabase.storage
      .from('model-images')
      .download(imagePath);

    if (error || !data) {
      console.log(`Image not found in storage: ${imagePath}`, error);
      return new Response('Image not found', { 
        status: 404,
        headers: corsHeaders 
      });
    }

    // Determine content type based on file extension
    const extension = imagePath.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg'; // default
    
    switch (extension) {
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'avif':
        contentType = 'image/avif';
        break;
    }

    // Cache headers for optimal performance
    const cacheHeaders = {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': contentType,
      'ETag': `"${imagePath}-${Date.now()}"`,
      ...corsHeaders
    };

    return new Response(data, {
      status: 200,
      headers: cacheHeaders
    });

  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});