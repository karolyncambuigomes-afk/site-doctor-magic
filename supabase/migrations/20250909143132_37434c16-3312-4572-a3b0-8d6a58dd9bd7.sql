-- Create reviews table for local SEO
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_postcode TEXT NOT NULL,
  area_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 4 AND rating <= 5) NOT NULL,
  review_text TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_initial TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false,
  service_type TEXT DEFAULT 'companion'
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Admin users can manage reviews" 
ON public.reviews 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Add indexes for performance
CREATE INDEX idx_reviews_location ON public.reviews(location_postcode);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_featured ON public.reviews(is_featured);

-- Seed realistic reviews data for London areas
INSERT INTO public.reviews (location_postcode, area_name, rating, review_text, author_name, author_initial, service_type, is_featured) VALUES
-- Mayfair W1 Reviews
('W1', 'Mayfair', 5, 'Exceptional service in the heart of Mayfair. Professional, discreet, and truly sophisticated companions for high-end events.', 'James Wellington', 'J.W.', 'companion', true),
('W1', 'Mayfair', 5, 'Outstanding experience at a gala event near Bond Street. Impeccable presentation and engaging conversation throughout the evening.', 'Victoria Sterling', 'V.S.', 'companion', true),
('W1', 'Mayfair', 5, 'Perfect companion for business dinners in Mayfair. Knowledgeable about art and culture, making every conversation meaningful.', 'Alexander Hayes', 'A.H.', 'companion', false),
('W1', 'Mayfair', 4, 'Highly professional service for events around Oxford Street area. Elegant and well-educated companions.', 'Margaret Thompson', 'M.T.', 'companion', false),
('W1', 'Mayfair', 5, 'Excellent experience at Royal Opera House events. The companion was charming and well-versed in classical arts.', 'Robert Ashworth', 'R.A.', 'companion', false),

-- Knightsbridge SW1 Reviews  
('SW1', 'Knightsbridge', 5, 'Remarkable companion for shopping experiences at Harrods and Harvey Nichols. Excellent taste and sophisticated presence.', 'Catherine Pemberton', 'C.P.', 'companion', true),
('SW1', 'Knightsbridge', 5, 'Wonderful evening at the exclusive restaurants near Hyde Park Corner. The companion was engaging and culturally aware.', 'Edward Morrison', 'E.M.', 'companion', true),
('SW1', 'Knightsbridge', 4, 'Professional service for business events in the Knightsbridge area. Discreet and well-presented throughout.', 'Diana Sinclair', 'D.S.', 'companion', false),
('SW1', 'Knightsbridge', 5, 'Exceptional companion for gallery openings around Sloane Street. Knowledgeable about contemporary art.', 'Geoffrey Parker', 'G.P.', 'companion', false),
('SW1', 'Knightsbridge', 5, 'Outstanding service for luxury hotel events. The companion was charming and well-educated.', 'Helena Whitmore', 'H.W.', 'companion', false),

-- Chelsea SW3 Reviews
('SW3', 'Chelsea', 5, 'Fantastic companion for events in Chelsea. Sophisticated, well-educated, and perfect for high-society gatherings.', 'Sebastian Clarke', 'S.C.', 'companion', true),
('SW3', 'Chelsea', 5, 'Excellent experience at exclusive venues on Kings Road. The companion was elegant and engaging throughout.', 'Penelope Fitzgerald', 'P.F.', 'companion', true),
('SW3', 'Chelsea', 4, 'Professional service for private events in Chelsea. Discreet and charming companion with excellent social skills.', 'Marcus Bentley', 'M.B.', 'companion', false),
('SW3', 'Chelsea', 5, 'Wonderful companion for cultural events around Chelsea. Knowledgeable about fashion and contemporary culture.', 'Isabella Hartwell', 'I.H.', 'companion', false),
('SW3', 'Chelsea', 5, 'Outstanding service for luxury dining experiences. The companion was sophisticated and well-versed in fine dining.', 'Theodore Blackwood', 'T.B.', 'companion', false),

-- Belgravia SW1X Reviews
('SW1X', 'Belgravia', 5, 'Impeccable service in the prestigious Belgravia area. Truly elite companions for the most exclusive events.', 'Arabella Kensington', 'A.K.', 'companion', true),
('SW1X', 'Belgravia', 5, 'Exceptional companion for embassy events and diplomatic functions. Professional and culturally sophisticated.', 'Lord Pembroke', 'L.P.', 'companion', true),
('SW1X', 'Belgravia', 4, 'Excellent service for luxury hotel experiences around Belgrave Square. Elegant and well-presented.', 'Vivienne Carlisle', 'V.C.', 'companion', false),
('SW1X', 'Belgravia', 5, 'Outstanding companion for high-end social events. Charming conversation and impeccable presentation.', 'Charles Montague', 'C.M.', 'companion', false),

-- Kensington SW7 Reviews
('SW7', 'Kensington', 5, 'Remarkable service for events near the Royal Albert Hall. Cultured and sophisticated companions.', 'Felicity Worthington', 'F.W.', 'companion', true),
('SW7', 'Kensington', 4, 'Professional companion for museum events and cultural gatherings. Well-educated and engaging.', 'Oliver Pemberton', 'O.P.', 'companion', false),
('SW7', 'Kensington', 5, 'Excellent experience at exclusive venues in South Kensington. Elegant and well-versed in arts.', 'Cordelia Ashford', 'C.A.', 'companion', false),

-- Westminster SW1A Reviews
('SW1A', 'Westminster', 5, 'Outstanding service for political and business events near Westminster. Professional and discreet.', 'Winston Harrington', 'W.H.', 'companion', true),
('SW1A', 'Westminster', 4, 'Excellent companion for government and diplomatic functions. Well-informed and sophisticated.', 'Beatrice Thornbury', 'B.T.', 'companion', false),

-- Marylebone W1U Reviews
('W1U', 'Marylebone', 5, 'Wonderful companion for events around Regent''s Park. Charming and well-educated with excellent social grace.', 'Jasper Whitfield', 'J.W.', 'companion', true),
('W1U', 'Marylebone', 4, 'Professional service for business events in Marylebone. Sophisticated and engaging companion.', 'Rosalind Fairfax', 'R.F.', 'companion', false),

-- Fitzrovia W1T Reviews
('W1T', 'Fitzrovia', 5, 'Exceptional companion for media and creative industry events. Well-versed in arts and contemporary culture.', 'Rupert Blackstone', 'R.B.', 'companion', true),
('W1T', 'Fitzrovia', 4, 'Excellent service for gallery openings and cultural events. Knowledgeable and engaging companion.', 'Imogen Salisbury', 'I.S.', 'companion', false);