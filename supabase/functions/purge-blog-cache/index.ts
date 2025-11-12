import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

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
    const { fullRecache = false } = await req.json().catch(() => ({}));
    
    const CLOUDFLARE_ZONE_ID = Deno.env.get('CLOUDFLARE_ZONE_ID');
    const CLOUDFLARE_API_TOKEN = Deno.env.get('CLOUDFLARE_API_TOKEN');
    const PRERENDER_TOKEN = Deno.env.get('PRERENDER_TOKEN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const DOMAIN = 'https://fivelondon.com';

    console.log('Starting cache purge. Full recache:', fullRecache);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch all published blog post slugs from database
    const { data: posts, error: dbError } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('is_published', true);

    if (dbError) {
      console.error('Database error fetching posts:', dbError);
      throw new Error(`Failed to fetch posts: ${dbError.message}`);
    }

    // Build full URLs array
    const blogUrls = [
      `${DOMAIN}/blog`,
      ...posts.map(post => `${DOMAIN}/blog/${post.slug}`)
    ];

    console.log('Blog URLs to purge/recache:', blogUrls);

    const results = {
      cloudflare: { success: false, message: '' },
      prerender: { success: false, message: '' }
    };

    // 1. Purge Cloudflare Cache with full URLs
    if (CLOUDFLARE_ZONE_ID && CLOUDFLARE_API_TOKEN) {
      try {
        console.log('Purging Cloudflare URLs:', blogUrls);

        const cfResponse = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              files: blogUrls
            })
          }
        );

        const cfData = await cfResponse.json();
        
        if (cfResponse.ok && cfData.success) {
          results.cloudflare = { 
            success: true, 
            message: `Purged ${blogUrls.length} URLs from Cloudflare` 
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

    // 2. Recache with Prerender.io - individual URLs
    if (PRERENDER_TOKEN) {
      try {
        console.log('Recaching Prerender URLs individually:', blogUrls);

        let successCount = 0;
        for (const url of blogUrls) {
          try {
            const resp = await fetch(
              'https://api.prerender.io/recache',
              {
                method: 'POST',
                headers: {
                  'X-Prerender-Token': PRERENDER_TOKEN,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  prerenderToken: PRERENDER_TOKEN,
                  url
                })
              }
            );

            if (resp.ok) {
              successCount++;
              console.log('Prerender recache successful for', url);
            } else {
              const txt = await resp.text();
              console.error('Prerender recache failed for', url, txt);
            }
          } catch (e) {
            console.error('Prerender recache exception for', url, e);
          }
        }

        results.prerender = {
          success: successCount > 0,
          message: successCount > 0
            ? `Recached ${successCount}/${blogUrls.length} URLs in Prerender.io`
            : 'Prerender recache failed for all URLs'
        };
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
