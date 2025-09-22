-- Enable leaked password protection and improve auth security
-- This addresses the security linter warnings

-- Enable leaked password protection (this is an auth setting, not SQL)
-- Note: This needs to be enabled in Supabase Dashboard -> Authentication -> Settings -> Password Protection

-- Create function to get auth security status
CREATE OR REPLACE FUNCTION get_auth_security_status()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only admins can check auth security status
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can check auth security status';
  END IF;
  
  RETURN jsonb_build_object(
    'security_check', 'Enable leaked password protection in Supabase Dashboard',
    'postgres_upgrade', 'Upgrade Postgres version for security patches',
    'recommendation', 'Visit Authentication -> Settings in Supabase Dashboard',
    'last_check', now()
  );
END;
$function$;

-- Create function to validate profile relationships and prevent orphaned data
CREATE OR REPLACE FUNCTION validate_profile_relationships()
RETURNS TABLE(table_name text, issue_count bigint, description text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only admins can run validation
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can run profile validation';
  END IF;
  
  -- Check for orphaned model applications (should link to profiles, not auth.users directly)
  RETURN QUERY
  SELECT 
    'model_applications'::text,
    COUNT(*)::bigint,
    'Applications with missing profile references'::text
  FROM model_applications ma
  LEFT JOIN profiles p ON p.id::text = ma.reviewed_by::text
  WHERE ma.reviewed_by IS NOT NULL AND p.id IS NULL;
  
  -- Check for orphaned admin sessions
  RETURN QUERY
  SELECT 
    'admin_sessions'::text,
    COUNT(*)::bigint,
    'Sessions with missing profile references'::text
  FROM admin_sessions ase
  LEFT JOIN profiles p ON p.id = ase.user_id
  WHERE p.id IS NULL;
  
  -- Check for orphaned 2FA records
  RETURN QUERY
  SELECT 
    'admin_two_factor'::text,
    COUNT(*)::bigint,
    'Two-factor records with missing profile references'::text
  FROM admin_two_factor atf
  LEFT JOIN profiles p ON p.id = atf.user_id
  WHERE p.id IS NULL;
END;
$function$;

-- Create function to clean up orphaned records
CREATE OR REPLACE FUNCTION cleanup_orphaned_records()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  cleanup_count integer := 0;
  total_cleaned integer := 0;
BEGIN
  -- Only admins can run cleanup
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can run cleanup';
  END IF;
  
  -- Clean up orphaned admin sessions
  DELETE FROM admin_sessions
  WHERE user_id NOT IN (SELECT id FROM profiles);
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  total_cleaned := total_cleaned + cleanup_count;
  
  -- Clean up orphaned 2FA records
  DELETE FROM admin_two_factor
  WHERE user_id NOT IN (SELECT id FROM profiles);
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  total_cleaned := total_cleaned + cleanup_count;
  
  -- Clean up orphaned audit logs
  DELETE FROM admin_audit_log
  WHERE admin_user_id NOT IN (SELECT id FROM profiles) AND admin_user_id IS NOT NULL;
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  total_cleaned := total_cleaned + cleanup_count;
  
  -- Log the cleanup operation
  PERFORM log_admin_action(
    'cleanup_orphaned_records',
    'system',
    NULL,
    NULL,
    jsonb_build_object('total_cleaned', total_cleaned, 'timestamp', now()),
    'medium'
  );
  
  RETURN format('Successfully cleaned up %s orphaned records', total_cleaned);
END;
$function$;