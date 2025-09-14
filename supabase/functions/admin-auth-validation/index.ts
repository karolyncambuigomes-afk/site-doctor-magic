import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuthValidationResponse {
  valid: boolean;
  user_id?: string;
  role?: string;
  status?: string;
  error?: string;
  error_code?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      const response: AuthValidationResponse = {
        valid: false,
        error: 'Method not allowed',
        error_code: 'METHOD_NOT_ALLOWED'
      };
      
      return new Response(JSON.stringify(response), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: AuthValidationResponse = {
        valid: false,
        error: 'Missing or invalid authorization header',
        error_code: 'MISSING_AUTH_HEADER'
      };
      
      return new Response(JSON.stringify(response), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseKey) {
      const response: AuthValidationResponse = {
        valid: false,
        error: 'Server configuration error',
        error_code: 'SERVER_CONFIG_ERROR'
      };
      
      return new Response(JSON.stringify(response), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      const response: AuthValidationResponse = {
        valid: false,
        error: 'Invalid or expired token',
        error_code: 'INVALID_TOKEN'
      };
      
      return new Response(JSON.stringify(response), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user profile and role information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      const response: AuthValidationResponse = {
        valid: false,
        error: 'Unable to verify user profile',
        error_code: 'PROFILE_LOOKUP_ERROR'
      };
      
      return new Response(JSON.stringify(response), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    if (profile.role !== 'admin') {
      const response: AuthValidationResponse = {
        valid: false,
        user_id: user.id,
        role: profile.role,
        status: profile.status,
        error: 'Insufficient privileges - admin access required',
        error_code: 'INSUFFICIENT_PRIVILEGES'
      };
      
      return new Response(JSON.stringify(response), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user account is approved
    if (profile.status !== 'approved') {
      const response: AuthValidationResponse = {
        valid: false,
        user_id: user.id,
        role: profile.role,
        status: profile.status,
        error: 'Account not approved',
        error_code: 'ACCOUNT_NOT_APPROVED'
      };
      
      return new Response(JSON.stringify(response), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // All checks passed - user is valid admin
    const response: AuthValidationResponse = {
      valid: true,
      user_id: user.id,
      role: profile.role,
      status: profile.status
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Admin auth validation error:', error);
    
    const response: AuthValidationResponse = {
      valid: false,
      error: 'Internal server error',
      error_code: 'INTERNAL_ERROR'
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});