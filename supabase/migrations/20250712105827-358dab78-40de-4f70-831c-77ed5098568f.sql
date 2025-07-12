-- Add RLS policy to allow admins to view all user surveys  
CREATE POLICY "Admins can view all user surveys" 
ON public.user_surveys 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));