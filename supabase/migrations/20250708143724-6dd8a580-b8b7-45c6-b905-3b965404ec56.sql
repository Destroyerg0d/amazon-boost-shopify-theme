-- Drop the problematic trigger on reviews table since it doesn't have updated_at column
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;

-- Now update the plan types
UPDATE reviews SET plan_type = 'Silver' WHERE plan_type = 'premium';
UPDATE reviews SET plan_type = 'Basic' WHERE plan_type IS NULL;