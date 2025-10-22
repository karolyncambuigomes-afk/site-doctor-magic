-- Add expiration date to user_subscriptions
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Update existing active subscriptions with a default expiration (30 days from now)
UPDATE public.user_subscriptions 
SET expires_at = now() + interval '30 days'
WHERE active = true AND expires_at IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at 
ON public.user_subscriptions(user_id, active, expires_at);

-- Update RLS policy for models table to check expiration
DROP POLICY IF EXISTS "Premium users can view full model data" ON public.models;

CREATE POLICY "Premium users can view full model data" ON public.models
FOR SELECT
USING (
  -- Allow admins to see everything
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin')
  ))
  OR
  -- Allow premium users with VALID subscriptions to see all models
  (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM user_subscriptions 
      WHERE user_subscriptions.user_id = auth.uid() 
      AND user_subscriptions.active = true
      AND (user_subscriptions.expires_at IS NULL OR user_subscriptions.expires_at > now())
    )
  )
  OR
  -- Allow everyone to see public models (not members_only)
  (members_only = false OR members_only IS NULL)
);

-- Create a function to auto-expire subscriptions (run via cron or edge function)
CREATE OR REPLACE FUNCTION public.expire_old_subscriptions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  -- Only admins can run this function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can expire subscriptions';
  END IF;
  
  -- Deactivate expired subscriptions
  UPDATE user_subscriptions
  SET active = false
  WHERE active = true 
  AND expires_at IS NOT NULL 
  AND expires_at <= now();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Log the action
  PERFORM public.log_admin_action(
    'auto_expire_subscriptions',
    'user_subscriptions',
    NULL,
    NULL,
    jsonb_build_object('expired_count', expired_count, 'timestamp', now()),
    'low'
  );
  
  RETURN expired_count;
END;
$$;

COMMENT ON FUNCTION public.expire_old_subscriptions IS 'Automatically deactivates subscriptions past their expiration date. Should be called periodically by admin or scheduled job.';