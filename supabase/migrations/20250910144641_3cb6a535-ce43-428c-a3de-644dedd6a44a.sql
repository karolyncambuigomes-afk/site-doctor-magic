-- Update Carolina's main image to use her first public gallery image
UPDATE models 
SET image = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757442283812-73eihmr4sup.jpeg',
    updated_at = now()
WHERE name = 'Carolina' AND (image IS NULL OR image = '');

-- Update any other models that have empty or null main images to use their first public gallery image
UPDATE models 
SET image = (
    SELECT mg.image_url 
    FROM model_gallery mg 
    WHERE mg.model_id = models.id 
    AND mg.visibility = 'public'
    ORDER BY mg.order_index ASC, mg.created_at ASC 
    LIMIT 1
),
updated_at = now()
WHERE (image IS NULL OR image = '') 
AND EXISTS (
    SELECT 1 FROM model_gallery mg 
    WHERE mg.model_id = models.id 
    AND mg.visibility = 'public'
);