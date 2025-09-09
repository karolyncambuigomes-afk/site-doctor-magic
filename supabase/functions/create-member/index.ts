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

    const { clientName, password, expiresAt } = await req.json();

    if (!clientName || !password) {
      return new Response(
        JSON.stringify({ error: 'Nome do cliente e senha são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean client name for email (remove spaces, special chars, convert to lowercase)
    const cleanName = clientName.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20); // Limit length

    const email = `${cleanName}@fivelondon.com`;

    console.log('Creating exclusive member:', { email, clientName });

    // Create user with email confirmation bypassed
    const { data: authData, error: authError } = await supabaseServiceRole.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Bypass email confirmation
      user_metadata: {
        client_name: clientName,
        member_type: 'exclusive',
        created_by_admin: true
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return new Response(
        JSON.stringify({ error: `Erro ao criar usuário: ${authError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Erro: ID do usuário não encontrado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabaseServiceRole
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      console.log('Profile already exists, updating instead of creating');
      // Update existing profile to approved status
      const { error: updateError } = await supabaseServiceRole
        .from('profiles')
        .update({
          email: email,
          role: 'user',
          status: 'approved',
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        await supabaseServiceRole.auth.admin.deleteUser(userId);
        return new Response(
          JSON.stringify({ error: `Erro ao atualizar perfil: ${updateError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Create new approved profile
      const { error: profileError } = await supabaseServiceRole
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: 'user',
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: null // Set to null for exclusive members created by admin
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Clean up auth user if profile creation fails
        await supabaseServiceRole.auth.admin.deleteUser(userId);
        return new Response(
          JSON.stringify({ error: `Erro ao criar perfil: ${profileError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create premium subscription
    const subscriptionData = {
      user_id: userId,
      plan_type: 'premium',
      active: true,
      stripe_customer_id: `exclusive_${cleanName}_${Date.now()}`, // Unique identifier for exclusive members
      expires_at: expiresAt || null,
      amount: 0, // Exclusive members don't pay
      currency: 'gbp'
    };

    const { error: subscriptionError } = await supabaseServiceRole
      .from('user_subscriptions')
      .insert(subscriptionData);

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      // Clean up auth user and profile if subscription creation fails
      await supabaseServiceRole.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: `Erro ao criar assinatura: ${subscriptionError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Exclusive member created successfully:', { userId, email, clientName });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userId,
          email,
          clientName,
          status: 'approved',
          memberType: 'exclusive'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in create-member function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});