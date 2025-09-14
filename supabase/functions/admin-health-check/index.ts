import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'healthy' | 'unhealthy';
    auth: 'healthy' | 'unhealthy';
    storage: 'healthy' | 'unhealthy';
    admin_functions: 'healthy' | 'unhealthy';
  };
  response_time_ms: number;
  version: string;
  environment: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ 
          error: 'Method not allowed',
          allowed_methods: ['GET'],
          status: 'unhealthy'
        }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test database connectivity
    let databaseHealth: 'healthy' | 'unhealthy' = 'unhealthy';
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      databaseHealth = error ? 'unhealthy' : 'healthy';
    } catch (error) {
      console.error('Database health check failed:', error);
      databaseHealth = 'unhealthy';
    }

    // Test auth service
    let authHealth: 'healthy' | 'unhealthy' = 'unhealthy';
    try {
      const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
      authHealth = error ? 'unhealthy' : 'healthy';
    } catch (error) {
      console.error('Auth health check failed:', error);
      authHealth = 'unhealthy';
    }

    // Test storage service
    let storageHealth: 'healthy' | 'unhealthy' = 'unhealthy';
    try {
      const { error } = await supabase.storage.listBuckets();
      storageHealth = error ? 'unhealthy' : 'healthy';
    } catch (error) {
      console.error('Storage health check failed:', error);
      storageHealth = 'unhealthy';
    }

    // Test admin functions (check if is_admin function exists)
    let adminFunctionsHealth: 'healthy' | 'unhealthy' = 'unhealthy';
    try {
      const { error } = await supabase.rpc('is_admin');
      // Function should return false for service role, but no error means it works
      adminFunctionsHealth = error && !error.message.includes('permission') ? 'unhealthy' : 'healthy';
    } catch (error) {
      console.error('Admin functions health check failed:', error);
      adminFunctionsHealth = 'unhealthy';
    }

    const responseTime = Date.now() - startTime;

    // Determine overall health status
    const services = {
      database: databaseHealth,
      auth: authHealth,
      storage: storageHealth,
      admin_functions: adminFunctionsHealth,
    };

    const unhealthyServices = Object.values(services).filter(status => status === 'unhealthy').length;
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';

    if (unhealthyServices === 0) {
      overallStatus = 'healthy';
    } else if (unhealthyServices <= 2) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'unhealthy';
    }

    const healthResponse: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
      response_time_ms: responseTime,
      version: '1.0.0',
      environment: Deno.env.get('ENVIRONMENT') || 'production',
    };

    // Return appropriate HTTP status based on health
    const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 206 : 503;

    return new Response(JSON.stringify(healthResponse, null, 2), {
      status: httpStatus,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unhealthy',
        auth: 'unhealthy',
        storage: 'unhealthy',
        admin_functions: 'unhealthy',
      },
      response_time_ms: Date.now() - startTime,
      version: '1.0.0',
      environment: Deno.env.get('ENVIRONMENT') || 'production',
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});