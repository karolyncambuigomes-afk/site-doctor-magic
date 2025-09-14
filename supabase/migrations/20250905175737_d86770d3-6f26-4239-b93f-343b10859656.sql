-- Create FAQs table for managing frequently asked questions
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for FAQs
CREATE POLICY "FAQs are viewable by everyone" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin users can manage FAQs" 
ON public.faqs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default FAQ data
INSERT INTO public.faqs (question, answer, order_index) VALUES
('How do I book a companion with Five London?', 'Booking is simple and discreet. You can call us directly at +44 7436 190679 (available 24/7), send a WhatsApp message, or contact us through our secure online form. We recommend booking at least 24-48 hours in advance to ensure availability of your preferred companion. Our experienced concierge team will guide you through the process and help match you with the perfect companion for your needs.', 1),
('Is complete discretion guaranteed?', 'Absolutely. Discretion and confidentiality are the absolute foundation of our service. All client information is strictly confidential and never shared with third parties. Our companions are professionally trained in maintaining the highest levels of discretion. We have established comprehensive protocols to ensure your privacy is protected at all times, from initial contact to the completion of your booking.', 2),
('What areas of London do you serve?', 'We primarily serve Central London and the greater London area, including premium locations such as Mayfair, Knightsbridge, Chelsea, Kensington, Belgravia, Canary Wharf, and the City of London. We can also arrange companionship for travel within the UK and internationally. Extended travel arrangements require advance notice and may incur additional travel expenses.', 3),
('What are your rates and pricing structure?', 'Our rates vary depending on the companion, duration, and type of engagement, typically ranging from £500-£1000+ per hour. We offer transparent pricing with no hidden fees. All rates include the companion''s time, companionship, and professional service. Longer bookings and overnight arrangements may have preferred rates. Please contact us directly for specific pricing information as we tailor our services to meet individual requirements.', 4),
('How far in advance should I make a booking?', 'We recommend booking at least 24-48 hours in advance to ensure the availability of your preferred companion and to allow proper preparation for your engagement. However, we understand that plans can change, and we do our best to accommodate same-day bookings when possible. For special events, travel arrangements, or popular times (weekends, holidays), earlier booking is strongly advisable.', 5);