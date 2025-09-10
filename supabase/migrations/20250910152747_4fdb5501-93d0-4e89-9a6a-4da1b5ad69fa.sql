-- Remove the problematic test model with empty data
DELETE FROM models WHERE name = 'Teste' AND (image IS NULL OR image = '') AND (location IS NULL OR location = '');