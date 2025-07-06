-- Add new columns to books table for comprehensive book information
ALTER TABLE public.books 
ADD COLUMN author TEXT,
ADD COLUMN manuscript_url TEXT,
ADD COLUMN front_cover_url TEXT,
ADD COLUMN amazon_url TEXT,
ADD COLUMN language TEXT DEFAULT 'English',
ADD COLUMN explicit_content BOOLEAN DEFAULT FALSE,
ADD COLUMN upload_status TEXT DEFAULT 'draft';

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('manuscripts', 'manuscripts', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);

-- Create policies for manuscript uploads (private)
CREATE POLICY "Users can upload their own manuscripts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own manuscripts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own manuscripts" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own manuscripts" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'manuscripts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for cover uploads (public)
CREATE POLICY "Anyone can view cover images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'covers');

CREATE POLICY "Users can upload their own covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own covers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own covers" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);