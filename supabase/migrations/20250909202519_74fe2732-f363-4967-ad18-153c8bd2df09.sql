-- Update Kate's location to fix missing location data
UPDATE models SET location = 'Mayfair' WHERE name = 'Kate' AND location IS NULL OR location = '';