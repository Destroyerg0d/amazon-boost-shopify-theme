-- Create function to update affiliate referral count
CREATE OR REPLACE FUNCTION public.update_affiliate_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the affiliate's total referrals count
  UPDATE public.affiliates 
  SET total_referrals = total_referrals + 1,
      updated_at = now()
  WHERE id = NEW.affiliate_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update referral count
DROP TRIGGER IF EXISTS trigger_update_affiliate_referral_count ON public.referrals;
CREATE TRIGGER trigger_update_affiliate_referral_count
  AFTER INSERT ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_affiliate_referral_count();