-- Create the user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('manuscripts', 'manuscripts', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for manuscript uploads (private)
DO $$ BEGIN
    CREATE POLICY "Users can upload their own manuscripts" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view their own manuscripts" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own manuscripts" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete their own manuscripts" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create policies for cover uploads (public)
DO $$ BEGIN
    CREATE POLICY "Anyone can view cover images" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'covers');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can upload their own covers" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own covers" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete their own covers" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create policy to allow admins to view all manuscripts
DO $$ BEGIN
    CREATE POLICY "Admins can view all manuscripts" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'manuscripts' AND has_role(auth.uid(), 'admin'::user_role));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;