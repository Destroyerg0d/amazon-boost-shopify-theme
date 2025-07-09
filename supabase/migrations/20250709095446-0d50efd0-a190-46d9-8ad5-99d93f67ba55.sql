-- Create payments table to track all transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL, -- 'verified' or 'unverified'
  plan_name TEXT NOT NULL, -- 'Starter Trial', 'Bronze Package', etc.
  amount DECIMAL(10,2) NOT NULL,
  book_price DECIMAL(10,2) DEFAULT 0, -- Only for verified plans
  paypal_payment_id TEXT,
  paypal_payer_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  payment_data JSONB, -- Store full PayPal response
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" 
ON public.payments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Add trigger for payments updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update review_plans table to link with payments
ALTER TABLE public.review_plans 
ADD COLUMN payment_id UUID REFERENCES public.payments(id),
ADD COLUMN amount_paid DECIMAL(10,2);

-- Create function to handle successful payment and create review plan
CREATE OR REPLACE FUNCTION public.handle_successful_payment(
  p_payment_id UUID,
  p_user_id UUID,
  p_plan_type TEXT,
  p_plan_name TEXT,
  p_amount DECIMAL,
  p_total_reviews INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  plan_id UUID;
BEGIN
  -- Update payment status
  UPDATE public.payments 
  SET status = 'completed', updated_at = now()
  WHERE id = p_payment_id AND user_id = p_user_id;
  
  -- Create review plan
  INSERT INTO public.review_plans (
    user_id, 
    plan_type, 
    plan_name, 
    total_reviews, 
    payment_id,
    amount_paid,
    status
  ) VALUES (
    p_user_id,
    p_plan_type,
    p_plan_name,
    p_total_reviews,
    p_payment_id,
    p_amount,
    'active'
  ) RETURNING id INTO plan_id;
  
  RETURN plan_id;
END;
$$;