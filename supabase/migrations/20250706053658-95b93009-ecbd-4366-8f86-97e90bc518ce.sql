-- Add admin role for realdivyanshsingh@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT auth.users.id, 'admin'::user_role
FROM auth.users 
WHERE auth.users.email = 'realdivyanshsingh@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;