-- Create Content Management System with versioning and image optimization (Fixed)
-- 1. Create storage buckets for optimized content
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES 
  ('cms-images', 'cms-images', true, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'], 20971520),
  ('cms-documents', 'cms-documents', false, ARRAY['application/pdf', 'text/plain', 'application/msword'], 52428800)
ON CONFLICT (id) DO NOTHING;

-- 2. Create content types table
CREATE TABLE IF NOT EXISTS public.content_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    schema JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create content items table
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type_id UUID REFERENCES content_types(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    content JSONB NOT NULL DEFAULT '{}',
    meta_data JSONB DEFAULT '{}',
    seo_data JSONB DEFAULT '{}',
    author_id UUID,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(content_type_id, slug)
);

-- 4. Create content versions table for rollback capability
CREATE TABLE IF NOT EXISTS public.content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    meta_data JSONB DEFAULT '{}',
    seo_data JSONB DEFAULT '{}',
    change_summary TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(content_item_id, version_number)
);

-- 5. Create image optimization tracking table
CREATE TABLE IF NOT EXISTS public.optimized_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename TEXT NOT NULL,
    original_size INTEGER NOT NULL,
    original_format TEXT NOT NULL,
    optimized_filename TEXT NOT NULL,
    optimized_size INTEGER NOT NULL,
    optimized_format TEXT NOT NULL DEFAULT 'webp',
    compression_ratio NUMERIC(5,2),
    bucket_path TEXT NOT NULL,
    alt_text TEXT,
    dimensions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index separately
CREATE INDEX IF NOT EXISTS idx_optimized_images_bucket_path ON public.optimized_images(bucket_path);

-- 6. Create content preview/staging table
CREATE TABLE IF NOT EXISTS public.content_preview (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    preview_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
    preview_data JSONB NOT NULL DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimized_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_preview ENABLE ROW LEVEL SECURITY;