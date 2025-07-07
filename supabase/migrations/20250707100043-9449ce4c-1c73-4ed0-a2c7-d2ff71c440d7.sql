-- Add a silver plan purchase for user realdivyanshsingh@gmail.com
INSERT INTO review_plans (
  user_id, 
  plan_type, 
  plan_name, 
  total_reviews, 
  used_reviews, 
  status, 
  purchased_at
) 
SELECT 
  (SELECT user_id FROM profiles WHERE email = 'realdivyanshsingh@gmail.com' LIMIT 1),
  'silver',
  'Silver Package',
  50,
  0,
  'active',
  now()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'realdivyanshsingh@gmail.com');