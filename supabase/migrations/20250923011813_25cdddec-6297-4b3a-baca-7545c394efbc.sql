-- Enable real-time for FAQs table
ALTER TABLE public.faqs REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.faqs;