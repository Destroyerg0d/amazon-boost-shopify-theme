-- Create an order for the existing Silver Package review plan purchase
-- First, let's create a service for Silver Package if it doesn't exist
INSERT INTO public.services (id, name, description, price, category, features, delivery_time_days, is_active)
VALUES (
  gen_random_uuid(),
  'Silver Package',
  'Premium review service with comprehensive features',
  199.00,
  'review',
  ARRAY['Enhanced review acquisition', 'Quality assurance', 'Detailed reporting'],
  10,
  true
)
ON CONFLICT (name) DO NOTHING;

-- Create an order for the existing review plan
INSERT INTO public.orders (
  id,
  user_id,
  service_id,
  status,
  payment_status,
  total_amount,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  rp.user_id,
  s.id,
  'completed',
  'paid',
  199.00,
  rp.purchased_at,
  rp.updated_at
FROM review_plans rp
JOIN profiles p ON rp.user_id = p.user_id
JOIN services s ON s.name = rp.plan_name
WHERE p.email = 'realdivyanshsingh@gmail.com' 
  AND rp.plan_name = 'Silver Package'
  AND NOT EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = rp.user_id 
    AND o.service_id = s.id
  );