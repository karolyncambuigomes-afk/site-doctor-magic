import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateTestAccountRequest {
  email: string;
  password: string;
  role: 'admin' | 'team' | 'member';
  status?: 'approved' | 'pending';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // SECURITY: Verify user is authenticated and is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin using secure function
    const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin_secure');

    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ 
        error: 'Forbidden: Admin privileges required to create test accounts' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, password, role, status = 'approved' }: CreateTestAccountRequest = await req.json();

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: email, password, role' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!['admin', 'team', 'member'].includes(role)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid role. Must be admin, team, or member' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create user account using already initialized supabase client
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation for test accounts
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return new Response(JSON.stringify({ 
        error: 'Failed to create user account',
        details: authError.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!authData.user) {
      return new Response(JSON.stringify({ 
        error: 'User creation failed - no user data returned' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create profile with specified role and status
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        role: role,
        status: status,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
        requested_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      
      // Cleanup: delete the auth user if profile creation failed
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return new Response(JSON.stringify({ 
        error: 'Failed to create user profile',
        details: profileError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the account creation for audit purposes
    await supabase
      .from('user_management_audit')
      .insert({
        admin_user_id: null, // System-created account
        target_user_id: authData.user.id,
        action: 'test_account_created',
        new_values: {
          email: email,
          role: role,
          status: status,
          created_via: 'test_account_function'
        }
      });

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: authData.user.id,
        email: email,
        role: role,
        status: status,
      },
      message: `Test account created successfully with role: ${role}`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});