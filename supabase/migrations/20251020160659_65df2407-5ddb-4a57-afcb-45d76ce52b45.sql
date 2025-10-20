-- Enable pgcrypto extension for encryption functions
-- This must run BEFORE any migrations that use encrypt()/decrypt()
-- Priority migration with early timestamp to ensure execution order

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verify extension is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto'
  ) THEN
    RAISE EXCEPTION 'pgcrypto extension failed to load';
  END IF;
END $$;