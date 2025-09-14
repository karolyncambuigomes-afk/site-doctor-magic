-- Update Luisa model with detailed pricing
UPDATE models 
SET pricing = '{
  "oneHour": "£650",
  "twoHours": "£1200",
  "threeHours": "£1650",
  "additionalHour": "£550"
}'::jsonb
WHERE id = 'bfe08bba-5dd8-41c0-ae2a-61e2565bd7b6';