-- Update one review to Gold for testing variety
UPDATE reviews 
SET plan_type = 'Gold'
WHERE id = (
  SELECT id FROM reviews 
  WHERE plan_type = 'Silver' 
  LIMIT 1
);