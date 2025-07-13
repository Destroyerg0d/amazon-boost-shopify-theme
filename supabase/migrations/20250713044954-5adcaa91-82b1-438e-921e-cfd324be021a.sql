-- Create affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code VARCHAR(20) NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 20.00, -- percentage
  total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_conversions INTEGER NOT NULL DEFAULT 0,
  payment_email TEXT,
  payment_method TEXT DEFAULT 'paypal',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);

-- Create referrals table to track clicks and conversions
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_at TIMESTAMP WITH TIME ZONE,
  conversion_value DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'clicked' CHECK (status IN ('clicked', 'converted', 'pending_payment', 'paid'))
);

-- Create affiliate commissions table
CREATE TABLE public.affiliate_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id),
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  sale_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create affiliate payouts table
CREATE TABLE public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_details JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for affiliates
CREATE POLICY "Users can view their own affiliate account" 
ON public.affiliates FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate account" 
ON public.affiliates FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate account" 
ON public.affiliates FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all affiliates" 
ON public.affiliates FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can update all affiliates" 
ON public.affiliates FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Create RLS policies for referrals
CREATE POLICY "Affiliates can view their own referrals" 
ON public.referrals FOR SELECT 
USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can create referrals" 
ON public.referrals FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all referrals" 
ON public.referrals FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Create RLS policies for commissions
CREATE POLICY "Affiliates can view their own commissions" 
ON public.affiliate_commissions FOR SELECT 
USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all commissions" 
ON public.affiliate_commissions FOR ALL 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Create RLS policies for payouts
CREATE POLICY "Affiliates can view their own payouts" 
ON public.affiliate_payouts FOR SELECT 
USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all payouts" 
ON public.affiliate_payouts FOR ALL 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Create triggers for updated_at
CREATE TRIGGER update_affiliates_updated_at
BEFORE UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique affiliate codes
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_code BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.affiliates WHERE affiliate_code = code) INTO exists_code;
    
    -- If code doesn't exist, return it
    IF NOT exists_code THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track referral conversion
CREATE OR REPLACE FUNCTION public.track_affiliate_conversion(
  p_payment_id UUID,
  p_referral_code TEXT,
  p_sale_amount DECIMAL
)
RETURNS VOID AS $$
DECLARE
  v_affiliate_id UUID;
  v_referral_id UUID;
  v_commission_rate DECIMAL;
  v_commission_amount DECIMAL;
BEGIN
  -- Find the affiliate and referral
  SELECT a.id, a.commission_rate, r.id
  INTO v_affiliate_id, v_commission_rate, v_referral_id
  FROM public.affiliates a
  JOIN public.referrals r ON r.affiliate_id = a.id
  WHERE r.referral_code = p_referral_code
  AND r.status = 'clicked'
  AND a.status = 'active'
  ORDER BY r.clicked_at DESC
  LIMIT 1;

  IF v_affiliate_id IS NOT NULL THEN
    -- Calculate commission
    v_commission_amount := p_sale_amount * (v_commission_rate / 100);
    
    -- Update referral as converted
    UPDATE public.referrals 
    SET 
      status = 'converted',
      converted_at = now(),
      conversion_value = p_sale_amount
    WHERE id = v_referral_id;
    
    -- Create commission record
    INSERT INTO public.affiliate_commissions (
      affiliate_id,
      referral_id,
      payment_id,
      commission_amount,
      commission_rate,
      sale_amount,
      status
    ) VALUES (
      v_affiliate_id,
      v_referral_id,
      p_payment_id,
      v_commission_amount,
      v_commission_rate,
      p_sale_amount,
      'approved'
    );
    
    -- Update affiliate stats
    UPDATE public.affiliates 
    SET 
      total_earnings = total_earnings + v_commission_amount,
      total_conversions = total_conversions + 1,
      updated_at = now()
    WHERE id = v_affiliate_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;