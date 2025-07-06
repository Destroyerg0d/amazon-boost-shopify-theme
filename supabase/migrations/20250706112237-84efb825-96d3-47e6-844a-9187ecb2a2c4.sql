-- Check if triggers exist and create them if they don't
DO $$ 
BEGIN
    -- Create trigger for handle_new_user if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
    
    -- Create trigger for setup_admin_user if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created_setup_roles'
    ) THEN
        CREATE TRIGGER on_auth_user_created_setup_roles
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.setup_admin_user();
    END IF;
END $$;