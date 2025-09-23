-- Enable real-time for all major content tables
ALTER TABLE public.models REPLICA IDENTITY FULL;
ALTER TABLE public.blog_posts REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.homepage_carousel REPLICA IDENTITY FULL;
ALTER TABLE public.hero_slides REPLICA IDENTITY FULL;
ALTER TABLE public.model_gallery REPLICA IDENTITY FULL;
ALTER TABLE public.preference_categories REPLICA IDENTITY FULL;
ALTER TABLE public.page_seo REPLICA IDENTITY FULL;
ALTER TABLE public.hero_settings REPLICA IDENTITY FULL;

-- Add all tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.models;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_carousel;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_slides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.model_gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE public.preference_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_seo;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_settings;