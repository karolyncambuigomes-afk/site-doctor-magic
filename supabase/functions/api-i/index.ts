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
    
    // Handle status endpoint
    if (imagePath === '_status') {
      return new Response(JSON.stringify({ 
        ok: true, 
        status: "healthy",
        timestamp: new Date().toISOString()
      }), { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
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

    // Function to generate alias paths for legacy flat naming
    const generateAliases = (originalPath: string): string[] => {
      const aliases: string[] = [];
      
      // carousel- prefix → carousel/ folder
      if (originalPath.startsWith('carousel-')) {
        const slug = originalPath.replace('carousel-', '');
        aliases.push(`carousel/${slug}`);
      }
      
      // model-<id>-main-<size>.webp → models/<id>/model-<id>-main-<size>.webp
      const modelMainMatch = originalPath.match(/^model-([^-]+)-main-(.+)$/);
      if (modelMainMatch) {
        const [, id, rest] = modelMainMatch;
        aliases.push(`models/${id}/model-${id}-main-${rest}`);
      }
      
      // model-<id>-gallery-<idx>-<size>.webp → models/<id>/gallery-<idx>-<size>.webp  
      const modelGalleryMatch = originalPath.match(/^model-([^-]+)-gallery-(.+)$/);
      if (modelGalleryMatch) {
        const [, id, rest] = modelGalleryMatch;
        aliases.push(`models/${id}/gallery-${rest}`);
      }
      
      // hero-banner-* → hero/hero-banner-*
      if (originalPath.startsWith('hero-banner-') && !originalPath.includes('/')) {
        aliases.push(`hero/${originalPath}`);
      }
      
      return aliases;
    };

    // Try to get the image from storage - first try original path
    let { data, error } = await supabase.storage
      .from('model-images')
      .download(imagePath);

    // If original path fails, try aliases
    if (error || !data) {
      console.log(`Original path failed: ${imagePath}, trying aliases...`);
      
      const aliases = generateAliases(imagePath);
      for (const aliasPath of aliases) {
        console.log(`Trying alias: ${aliasPath}`);
        const aliasResult = await supabase.storage
          .from('model-images')
          .download(aliasPath);
          
        if (!aliasResult.error && aliasResult.data) {
          console.log(`Found image at alias: ${aliasPath}`);
          data = aliasResult.data;
          error = null;
          break;
        }
      }
    }

    if (error || !data) {
      console.log(`Image not found in storage (tried original + aliases): ${imagePath}`, error);
      return new Response(JSON.stringify({ 
        error: 'Image not found',
        originalPath: imagePath,
        triedAliases: generateAliases(imagePath)
      }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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