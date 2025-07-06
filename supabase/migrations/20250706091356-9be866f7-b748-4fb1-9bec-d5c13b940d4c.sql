-- Create customers table for lead management
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT,
  monthly_revenue TEXT,
  message TEXT,
  is_buyer BOOLEAN NOT NULL DEFAULT false,
  lead_source TEXT NOT NULL DEFAULT 'website_contact',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Admins can manage all customers" 
ON public.customers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Anyone can create customer leads" 
ON public.customers 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for customers updated_at
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_status ON public.customers(status);
CREATE INDEX idx_customers_is_buyer ON public.customers(is_buyer);