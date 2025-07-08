-- Simple update of plan types in reviews
UPDATE reviews SET plan_type = 'Silver' WHERE plan_type = 'premium';
UPDATE reviews SET plan_type = 'Basic' WHERE plan_type IS NULL;