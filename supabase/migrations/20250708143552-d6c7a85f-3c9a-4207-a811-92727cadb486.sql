-- Update existing reviews to show correct plan types for testing
UPDATE reviews 
SET plan_type = 'Silver'
WHERE plan_type = 'premium';

-- Update some reviews to show different plan types for testing
UPDATE reviews 
SET plan_type = 'Gold'
WHERE id IN (
  SELECT id FROM reviews 
  WHERE plan_type IS NULL OR plan_type = 'premium'
  ORDER BY reviewed_at DESC 
  LIMIT 1
);

UPDATE reviews 
SET plan_type = 'Basic'
WHERE plan_type IS NULL;