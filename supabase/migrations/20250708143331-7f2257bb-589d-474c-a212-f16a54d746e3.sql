-- Update existing reviews to show correct plan types for testing
UPDATE reviews 
SET plan_type = CASE 
  WHEN id IN (
    SELECT id FROM reviews 
    ORDER BY reviewed_at DESC 
    LIMIT 1
  ) THEN 'Silver'
  WHEN id IN (
    SELECT id FROM reviews 
    ORDER BY reviewed_at DESC 
    OFFSET 1 LIMIT 1
  ) THEN 'Gold'
  ELSE 'Basic'
END
WHERE plan_type = 'premium' OR plan_type IS NULL;

-- Also update any review plans that might have incorrect plan types
UPDATE review_plans 
SET plan_type = 'Silver'
WHERE plan_type = 'premium';