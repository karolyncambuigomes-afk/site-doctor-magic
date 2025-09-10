import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { modelId, sourceUrl, index, dry_run = false }: FixGalleryRequest = await req.json();

    console.log('🖼️ ADMIN FIX GALLERY: Processing', { modelId, sourceUrl, index, dry_run });

    // Validate model exists
    const { data: model } = await supabase
      .from('models')
      .select('name')
      .eq('id', modelId)
      .single();

    if (!model) {
      return new Response(JSON.stringify({ error: 'Model not found' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    if (dry_run) {
      return new Response(JSON.stringify({ 
        ok: true, 
        status: 'dry_run', 
        modelId,
        modelName: model.name,
        sourceUrl,
        index,
        local: `/images/models/${modelId}/gallery-${index}-1200.webp`,
        message: 'Dry run - would process this gallery image'
      }), {
        headers: corsHeaders
      });
    }

    // Call the fix-one-gallery function
    const { data: fixResult, error: fixError } = await supabase.functions.invoke('fix-one-gallery', {
      body: {
        modelId,
        sourceUrl,
        index,
        dry_run: false
      }
    });

    if (fixError) {
      throw new Error(`Fix gallery function failed: ${fixError.message}`);
    }

    console.log('✅ ADMIN FIX GALLERY: Complete', fixResult);
    
    return new Response(JSON.stringify({ 
      ok: true, 
      status: 200, 
      local: fixResult.local,
      modelId,
      modelName: model.name,
      sourceUrl,
      index
    }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('❌ ADMIN FIX GALLERY: Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      ok: false 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});