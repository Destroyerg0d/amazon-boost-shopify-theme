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

-- Create policy to allow admins to view all manuscripts
CREATE POLICY "Admins can view all manuscripts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'manuscripts' AND has_role(auth.uid(), 'admin'::user_role));