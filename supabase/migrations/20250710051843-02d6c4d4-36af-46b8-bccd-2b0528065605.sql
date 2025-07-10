-- Add RLS policy for admins to view all books
CREATE POLICY "Admins can view all books" 
ON public.books 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Add RLS policy for admins to update all books
CREATE POLICY "Admins can update all books" 
ON public.books 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::user_role));