-- Create SEO settings table for global SEO management
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  category TEXT NOT NULL DEFAULT 'global',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page-level SEO table
CREATE TABLE public.page_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  structured_data JSONB,
  seo_score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SEO templates table
CREATE TABLE public.seo_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- 'page', 'blog', 'model', 'location'
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SEO audit log table
CREATE TABLE public.seo_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  page_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all SEO tables
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin users can manage SEO settings" 
ON public.seo_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admin users can manage page SEO" 
ON public.page_seo 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admin users can manage SEO templates" 
ON public.seo_templates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admin users can view SEO audit log" 
ON public.seo_audit_log 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create public read policies for SEO data
CREATE POLICY "Page SEO is viewable by everyone" 
ON public.page_seo 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "SEO settings are viewable by everyone" 
ON public.seo_settings 
FOR SELECT 
USING (true);

-- Create function to update SEO updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_seo_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_seo_updated_at_column();

CREATE TRIGGER update_page_seo_updated_at
BEFORE UPDATE ON public.page_seo
FOR EACH ROW
EXECUTE FUNCTION public.update_seo_updated_at_column();

CREATE TRIGGER update_seo_templates_updated_at
BEFORE UPDATE ON public.seo_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_seo_updated_at_column();

-- Insert default SEO settings
INSERT INTO public.seo_settings (setting_key, setting_value, category, description) VALUES
('global_meta_title', '{"value": "Five London - Luxury Companion Services in London"}', 'global', 'Default site title'),
('global_meta_description', '{"value": "Premium luxury companion services in London. Elegant, sophisticated and discreet escorts for discerning gentlemen."}', 'global', 'Default site description'),
('global_meta_keywords', '{"value": ["luxury escorts London", "premium companions", "elite escort services", "VIP escorts"]}', 'global', 'Default global keywords'),
('organization_schema', '{"name": "Five London", "url": "https://fivelondon.com", "type": "LocalBusiness", "address": {"streetAddress": "Mayfair", "addressLocality": "London", "addressRegion": "Greater London", "postalCode": "W1K", "addressCountry": "GB"}}', 'structured_data', 'Organization schema markup'),
('robots_txt', '{"content": "User-agent: *\\nDisallow: /admin\\nDisallow: /auth\\n\\nSitemap: https://fivelondon.com/sitemap.xml"}', 'technical', 'Robots.txt content');

-- Insert default SEO templates
INSERT INTO public.seo_templates (template_name, template_type, template_data, is_default) VALUES
('Default Blog Post', 'blog', '{"meta_title": "{title} - Five London Blog", "meta_description": "{excerpt}", "structured_data": {"@type": "Article", "@context": "https://schema.org"}}', true),
('Default Model Profile', 'model', '{"meta_title": "{name} - Luxury Companion in {location}", "meta_description": "Meet {name}, an elegant companion available in {location}. Professional escort services.", "structured_data": {"@type": "Person", "@context": "https://schema.org"}}', true),
('Default Location Page', 'location', '{"meta_title": "Luxury Escorts in {location} - Five London", "meta_description": "Premium companion services in {location}. Elite escorts for discerning gentlemen.", "structured_data": {"@type": "LocalBusiness", "@context": "https://schema.org"}}', true);