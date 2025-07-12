-- Add RLS policy to allow admins to view all reviews
CREATE POLICY "Admins can view all reviews" 
ON public.reviews 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Add RLS policy to allow admins to manage all reviews
CREATE POLICY "Admins can update all reviews" 
ON public.reviews 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can delete all reviews" 
ON public.reviews 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::user_role));