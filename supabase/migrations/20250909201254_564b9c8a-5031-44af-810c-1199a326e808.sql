-- Add visibility field to model_gallery table
ALTER TABLE public.model_gallery 
ADD COLUMN visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'members_only', 'admin_only'));

-- Create index for better performance on visibility queries
CREATE INDEX idx_model_gallery_visibility ON public.model_gallery(visibility);

-- Create index for combined model_id and visibility queries
CREATE INDEX idx_model_gallery_model_visibility ON public.model_gallery(model_id, visibility);