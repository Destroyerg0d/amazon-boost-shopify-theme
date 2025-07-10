-- Clear all data from database except admin user realdivyanshsingh@gmail.com

-- Delete all orders
DELETE FROM public.orders;

-- Delete all books
DELETE FROM public.books;

-- Delete all reviews
DELETE FROM public.reviews;

-- Delete all customers
DELETE FROM public.customers;

-- Delete all community readers
DELETE FROM public.community_readers;

-- Delete all payments
DELETE FROM public.payments;

-- Delete all review plans
DELETE FROM public.review_plans;

-- Delete all user roles except admin
DELETE FROM public.user_roles 
WHERE user_id NOT IN (
  SELECT user_id FROM public.profiles 
  WHERE email = 'realdivyanshsingh@gmail.com'
);

-- Delete all profiles except admin
DELETE FROM public.profiles 
WHERE email != 'realdivyanshsingh@gmail.com';

-- Ensure admin user has admin role
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::user_role
FROM public.profiles 
WHERE email = 'realdivyanshsingh@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Reset sequences if any exist
-- This ensures IDs start from 1 again for new entries