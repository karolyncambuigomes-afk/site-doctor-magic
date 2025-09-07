-- Add foreign key constraint to model_gallery table
-- This ensures that model_id references an existing model

-- First check if the constraint already exists, if not add it
DO $$
BEGIN
    -- Check if foreign key constraint exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'model_gallery_model_id_fkey' 
        AND table_name = 'model_gallery'
    ) THEN
        -- Add foreign key constraint
        ALTER TABLE public.model_gallery 
        ADD CONSTRAINT model_gallery_model_id_fkey 
        FOREIGN KEY (model_id) REFERENCES public.models(id) ON DELETE CASCADE;
    END IF;
END $$;