-- Fix the Julia model with local image URLs
UPDATE public.models 
SET 
  image_url_local_main = '/images/models/0018eb02-4175-4eef-9f8f-fb7e7e68f55e/model-0018eb02-4175-4eef-9f8f-fb7e7e68f55e-main-1200.webp',
  image_local = '/images/models/0018eb02-4175-4eef-9f8f-fb7e7e68f55e/model-0018eb02-4175-4eef-9f8f-fb7e7e68f55e-main-1200.webp',
  updated_at = now()
WHERE id = '0018eb02-4175-4eef-9f8f-fb7e7e68f55e';