-- Security Fix for Model Applications Table - Part 1: Clean up with CASCADE
-- Drop the function with CASCADE to remove all dependent policies
DROP FUNCTION IF EXISTS public.log_admin_action(text, text, uuid, jsonb, jsonb, text) CASCADE;