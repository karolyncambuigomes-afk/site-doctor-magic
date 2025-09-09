-- Clean up existing fictional models from homepage carousel
DELETE FROM homepage_carousel;

-- Add Kate to homepage carousel (she has an image)
INSERT INTO homepage_carousel (model_id, model_name, image_url, order_index, is_active)
VALUES (
  '95437c3e-58d2-4be5-b208-ff582a43f036',
  'Kate',
  'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757257125604-b9fbajld87d.jpeg',
  1,
  true
);

-- Add Livia to homepage carousel (will use placeholder until image is uploaded)
INSERT INTO homepage_carousel (model_id, model_name, image_url, order_index, is_active)
VALUES (
  '7a60e995-0daa-423e-9864-050081d11c3f',
  'Livia',
  '/src/assets/model1.jpg',
  2,
  true
);