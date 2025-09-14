-- Update models with detailed pricing
UPDATE models 
SET pricing = '{
  "oneHour": "£500",
  "twoHours": "£900", 
  "threeHours": "£1300",
  "additionalHour": "£400"
}'::jsonb
WHERE name = 'Sofia';

UPDATE models 
SET pricing = '{
  "oneHour": "£600",
  "twoHours": "£1100",
  "threeHours": "£1550", 
  "additionalHour": "£500"
}'::jsonb
WHERE name = 'Isabella';

UPDATE models 
SET pricing = '{
  "oneHour": "£550",
  "twoHours": "£1000",
  "threeHours": "£1400",
  "additionalHour": "£450"
}'::jsonb
WHERE name = 'Victoria';

UPDATE models 
SET pricing = '{
  "oneHour": "£700",
  "twoHours": "£1300",
  "threeHours": "£1850",
  "additionalHour": "£600"
}'::jsonb
WHERE name = 'Anastasia';