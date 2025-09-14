-- Step 1: Remove the overly permissive service role policy
DROP POLICY IF EXISTS "Service role can only insert subscriptions" ON public.user_subscriptions;

-- Step 2: Create a more restrictive service role policy for legitimate payment processing
CREATE POLICY "Service role can insert valid subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (
  -- Ensure required fields are present and valid
  user_id IS NOT NULL 
  AND stripe_customer_id IS NOT NULL 
  AND plan_type IS NOT NULL
  AND plan_type IN ('basic', 'premium', 'enterprise')
  AND active IS NOT NULL
  -- Ensure user_id references an actual user in auth.users
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id
  )
);