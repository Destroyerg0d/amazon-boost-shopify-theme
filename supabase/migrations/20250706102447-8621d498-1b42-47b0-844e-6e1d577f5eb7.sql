-- Create policy to allow admins to view all manuscripts
CREATE POLICY "Admins can view all manuscripts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'manuscripts' AND has_role(auth.uid(), 'admin'::user_role));