-- Create a service for Silver Package 
INSERT INTO public.services (name, description, price, category, features, delivery_time_days, is_active)
VALUES (
  'Silver Package',
  'Premium review service with comprehensive features',
  199.00,
  'review',
  ARRAY['Enhanced review acquisition', 'Quality assurance', 'Detailed reporting'],
  10,
  true
);

-- Create an order for the existing review plan
INSERT INTO public.orders (
  user_id,
  service_id,
  status,
  payment_status,
  total_amount,
  created_at,
  updated_at
)
SELECT 
  rp.user_id,
  s.id,
  'completed',
  'paid',
  199.00,
  rp.purchased_at,
  rp.updated_at
FROM review_plans rp
JOIN profiles p ON rp.user_id = p.user_id
CROSS JOIN services s
WHERE p.email = 'realdivyanshsingh@gmail.com' 
  AND rp.plan_name = 'Silver Package'
  AND s.name = 'Silver Package';