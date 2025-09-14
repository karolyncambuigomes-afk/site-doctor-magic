-- Configure Auth Hook to call send-confirmation-email function
-- This will trigger the function when a user signs up and needs email confirmation

-- Add webhook configuration for auth events
INSERT INTO auth.hooks (id, hook_name, hook_url, events, created_at)
VALUES (
  gen_random_uuid(),
  'send-confirmation-email',
  'https://jiegopvbwpyfohhfvmwo.supabase.co/functions/v1/send-confirmation-email',
  ARRAY['user.created'],
  NOW()
) ON CONFLICT (hook_name) DO UPDATE SET
  hook_url = EXCLUDED.hook_url,
  events = EXCLUDED.events;