-- Add book_id to review_plans table to link plans to specific books
ALTER TABLE public.review_plans 
ADD COLUMN book_id uuid REFERENCES public.books(id) ON DELETE SET NULL;

-- Add unique constraint to prevent multiple plans per book
ALTER TABLE public.review_plans 
ADD CONSTRAINT unique_book_plan UNIQUE (book_id);

-- Update RLS policies for review_plans to allow admins to view all plans
CREATE POLICY "Admins can view all review plans" 
ON public.review_plans 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Update existing policy to allow both user and admin access
DROP POLICY IF EXISTS "Users can view their own review plans" ON public.review_plans;
CREATE POLICY "Users can view their own review plans" 
ON public.review_plans 
FOR SELECT 
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::user_role));