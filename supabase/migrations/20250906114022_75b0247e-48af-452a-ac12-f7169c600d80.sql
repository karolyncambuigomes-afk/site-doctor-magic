-- Insert default hero settings if not exists
INSERT INTO hero_settings (auto_play, slide_duration, show_dots, show_scroll_indicator, overlay_opacity)
SELECT true, 5000, true, true, 30
WHERE NOT EXISTS (SELECT 1 FROM hero_settings);

-- Insert default hero slides if not exists
INSERT INTO hero_slides (title, subtitle, image_url, button_text, button_link, order_index, active)
SELECT * FROM (VALUES
  ('Five London', 'Premier luxury companion services', '/images/model1.jpg', 'View Our Models', '/models', 0, true),
  ('Sophisticated Elegance', 'Exclusive experiences in London', '/images/model2.jpg', 'View Our Models', '/models', 1, true),
  ('Discretion & Quality', 'Unparalleled companion services', '/images/model3.jpg', 'View Our Models', '/models', 2, true),
  ('Exceptional Standards', 'Where luxury meets sophistication', '/images/model4.jpg', 'View Our Models', '/models', 3, true)
) AS v(title, subtitle, image_url, button_text, button_link, order_index, active)
WHERE NOT EXISTS (SELECT 1 FROM hero_slides);