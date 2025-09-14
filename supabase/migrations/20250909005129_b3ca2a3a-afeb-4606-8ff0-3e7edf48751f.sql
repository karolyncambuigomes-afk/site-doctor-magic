-- Clean up existing fictional models from homepage carousel
DELETE FROM homepage_carousel WHERE model_name IN ('Sofia', 'Isabella', 'Victoria', 'Anastasia');

-- Add Kate to homepage carousel (she has an image)
INSERT INTO homepage_carousel (model_id, model_name, image_url, order_index, is_active)
VALUES (
  '95437c3e-58d2-4be5-b208-ff582a43f036',
  'Kate',
  'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757257125604-b9fbajld87d.jpeg',
  1,
  true
)
ON CONFLICT (model_id) DO UPDATE SET
  model_name = EXCLUDED.model_name,
  image_url = EXCLUDED.image_url,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Add Livia to homepage carousel (will use placeholder until image is uploaded)
INSERT INTO homepage_carousel (model_id, model_name, image_url, order_index, is_active)
VALUES (
  '7a60e995-0daa-423e-9864-050081d11c3f',
  'Livia',
  '/src/assets/model1.jpg', -- Placeholder until real image is uploaded
  2,
  true
)
ON CONFLICT (model_id) DO UPDATE SET
  model_name = EXCLUDED.model_name,
  image_url = EXCLUDED.image_url,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active,
  updated_at = now();