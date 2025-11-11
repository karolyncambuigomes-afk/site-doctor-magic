import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { urls = ['/blog', '/blog/*'] } = await req.json().catch(() => ({}));
    
    const CLOUDFLARE_ZONE_ID = Deno.env.get('CLOUDFLARE_ZONE_ID');
    const CLOUDFLARE_API_TOKEN = Deno.env.get('CLOUDFLARE_API_TOKEN');
    const PRERENDER_TOKEN = Deno.env.get('PRERENDER_TOKEN');
    const DOMAIN = 'https://fivelondon.com';

    console.log('Starting cache purge for URLs:', urls);

    const results = {
      cloudflare: { success: false, message: '' },
      prerender: { success: false, message: '' }
    };

    // 1. Purge Cloudflare Cache
    if (CLOUDFLARE_ZONE_ID && CLOUDFLARE_API_TOKEN) {
      try {
        const fullUrls = urls.map((url: string) => {
          // Handle wildcards - Cloudflare doesn't support wildcards in purge
          if (url.endsWith('/*')) {
            return url.replace('/*', ''); // Just purge the base path
          }
          return `${DOMAIN}${url}`;
        });

        console.log('Purging Cloudflare URLs:', fullUrls);

        const cfResponse = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              files: fullUrls
            })
          }
        );

        const cfData = await cfResponse.json();
        
        if (cfResponse.ok && cfData.success) {
          results.cloudflare = { 
            success: true, 
            message: `Purged ${fullUrls.length} URLs from Cloudflare` 
          };
          console.log('Cloudflare purge successful:', cfData);
        } else {
          results.cloudflare = { 
            success: false, 
            message: `Cloudflare error: ${cfData.errors?.[0]?.message || 'Unknown error'}` 
          };
          console.error('Cloudflare purge failed:', cfData);
        }
      } catch (error) {
        results.cloudflare = { 
          success: false, 
          message: `Cloudflare exception: ${error.message}` 
        };
        console.error('Cloudflare purge exception:', error);
      }
    } else {
      results.cloudflare = { 
        success: false, 
        message: 'Cloudflare credentials not configured' 
      };
    }

    // 2. Recache with Prerender.io
    if (PRERENDER_TOKEN) {
      try {
        const fullUrls = urls.map((url: string) => {
          if (url.endsWith('/*')) {
            return `${DOMAIN}${url.replace('/*', '')}`;
          }
          return `${DOMAIN}${url}`;
        });

        console.log('Recaching Prerender URLs:', fullUrls);

        const prerenderResponse = await fetch(
          'https://api.prerender.io/recache',
          {
            method: 'POST',
            headers: {
              'X-Prerender-Token': PRERENDER_TOKEN,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prerenderToken: PRERENDER_TOKEN,
              url: fullUrls
            })
          }
        );

        if (prerenderResponse.ok) {
          results.prerender = { 
            success: true, 
            message: `Recached ${fullUrls.length} URLs in Prerender.io` 
          };
          console.log('Prerender recache successful');
        } else {
          const prerenderData = await prerenderResponse.text();
          results.prerender = { 
            success: false, 
            message: `Prerender error: ${prerenderData}` 
          };
          console.error('Prerender recache failed:', prerenderData);
        }
      } catch (error) {
        results.prerender = { 
          success: false, 
          message: `Prerender exception: ${error.message}` 
        };
        console.error('Prerender recache exception:', error);
      }
    } else {
      results.prerender = { 
        success: false, 
        message: 'Prerender token not configured' 
      };
    }

    console.log('Cache purge completed:', results);

    return new Response(
      JSON.stringify({
        success: results.cloudflare.success || results.prerender.success,
        results,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Cache purge error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
