import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    // Initialize Supabase client with service role for admin operations
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'ID do usuário é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Deleting user:', { userId });

    // First, get user details for logging
    const { data: userProfile } = await supabaseServiceRole
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    // Delete user subscription(s) first
    const { error: subscriptionError } = await supabaseServiceRole
      .from('user_subscriptions')
      .delete()
      .eq('user_id', userId);

    if (subscriptionError) {
      console.error('Error deleting user subscriptions:', subscriptionError);
      // Continue anyway, as user might not have subscriptions
    }

    // Delete user profile
    const { error: profileError } = await supabaseServiceRole
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting user profile:', profileError);
      return new Response(
        JSON.stringify({ error: `Erro ao deletar perfil: ${profileError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Finally, delete the auth user
    const { error: authError } = await supabaseServiceRole.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      return new Response(
        JSON.stringify({ error: `Erro ao deletar usuário: ${authError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User deleted successfully:', { userId, email: userProfile?.email });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuário deletado com sucesso'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in delete-user function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});