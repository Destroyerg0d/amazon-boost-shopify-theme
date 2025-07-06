-- Add new columns to books table
ALTER TABLE public.books 
ADD COLUMN author_note TEXT,
ADD COLUMN asin TEXT,
ADD COLUMN approval_status TEXT DEFAULT 'under_review',
ADD COLUMN admin_feedback TEXT,
DROP COLUMN amazon_url;

-- Update description to be required in application logic
-- Add minimum length constraint will be handled in frontend

-- Create review_plans table for tracking user's review plans
CREATE TABLE public.review_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL, -- 'basic', 'silver', 'gold', etc.
  plan_name TEXT NOT NULL,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  used_reviews INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'expired'
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on review_plans
ALTER TABLE public.review_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for review_plans
CREATE POLICY "Users can view their own review plans" 
ON public.review_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own review plans" 
ON public.review_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review plans" 
ON public.review_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for review_plans updated_at
CREATE TRIGGER update_review_plans_updated_at
BEFORE UPDATE ON public.review_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update reviews table to include more details
ALTER TABLE public.reviews 
ADD COLUMN amazon_visible BOOLEAN DEFAULT false,
ADD COLUMN review_type TEXT DEFAULT 'unverified', -- 'verified', 'unverified'
ADD COLUMN plan_type TEXT,
ADD COLUMN review_plan_id UUID,
ADD COLUMN masked_reviewer_name TEXT;