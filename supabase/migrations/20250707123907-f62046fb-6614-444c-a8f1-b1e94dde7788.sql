-- Update the Silver Package service to reflect correct pricing and description
UPDATE public.services 
SET 
  price = 450.00,
  description = 'Silver Plan for unverified reviews - Premium review acquisition service',
  features = ARRAY['50 unverified reviews', 'Natural review velocity', 'Quality assurance', 'Basic keyword optimization', 'Review monitoring']
WHERE name = 'Silver Package';

-- Update the existing order to reflect correct amount
UPDATE public.orders 
SET 
  total_amount = 450.00,
  customer_notes = 'Silver Plan purchase for unverified reviews'
WHERE user_id = (
  SELECT user_id FROM profiles WHERE email = 'realdivyanshsingh@gmail.com'
) AND service_id = (
  SELECT id FROM services WHERE name = 'Silver Package'
);

-- Update the review plan to ensure consistency
UPDATE public.review_plans 
SET 
  plan_name = 'Silver Plan',
  plan_type = 'silver',
  total_reviews = 50,
  status = 'active'
WHERE user_id = (
  SELECT user_id FROM profiles WHERE email = 'realdivyanshsingh@gmail.com'
) AND plan_name = 'Silver Package';