-- Temporarily disable the trigger and update reviews with correct plan types
ALTER TABLE reviews DISABLE TRIGGER ALL;

-- Update existing reviews to show correct plan types for testing
UPDATE reviews 
SET plan_type = 'Silver'
WHERE plan_type = 'premium' OR plan_type IS NULL;

-- Update one review to Gold for variety
UPDATE reviews 
SET plan_type = 'Gold'
WHERE id = (SELECT id FROM reviews ORDER BY reviewed_at DESC LIMIT 1);

-- Re-enable triggers
ALTER TABLE reviews ENABLE TRIGGER ALL;