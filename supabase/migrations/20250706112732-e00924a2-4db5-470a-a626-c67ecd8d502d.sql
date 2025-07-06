-- Drop the duplicate trigger that might be causing conflicts
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;

-- Also drop any old functions that are no longer needed
DROP FUNCTION IF EXISTS public.setup_admin_user();
DROP FUNCTION IF EXISTS public.handle_new_user();