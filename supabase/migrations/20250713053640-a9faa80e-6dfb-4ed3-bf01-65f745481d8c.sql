-- Add missing foreign key constraints for affiliate system

-- Add foreign key constraint to affiliates table
ALTER TABLE public.affiliates 
ADD CONSTRAINT affiliates_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraints to affiliate_commissions table
ALTER TABLE public.affiliate_commissions 
ADD CONSTRAINT affiliate_commissions_affiliate_id_fkey 
FOREIGN KEY (affiliate_id) REFERENCES public.affiliates(id) ON DELETE CASCADE;

ALTER TABLE public.affiliate_commissions 
ADD CONSTRAINT affiliate_commissions_referral_id_fkey 
FOREIGN KEY (referral_id) REFERENCES public.referrals(id) ON DELETE CASCADE;

ALTER TABLE public.affiliate_commissions 
ADD CONSTRAINT affiliate_commissions_payment_id_fkey 
FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE SET NULL;

-- Add foreign key constraint to affiliate_payouts table
ALTER TABLE public.affiliate_payouts 
ADD CONSTRAINT affiliate_payouts_affiliate_id_fkey 
FOREIGN KEY (affiliate_id) REFERENCES public.affiliates(id) ON DELETE CASCADE;

-- Add foreign key constraint to referrals table
ALTER TABLE public.referrals 
ADD CONSTRAINT referrals_affiliate_id_fkey 
FOREIGN KEY (affiliate_id) REFERENCES public.affiliates(id) ON DELETE CASCADE;

-- Add foreign key constraint to user_surveys table
ALTER TABLE public.user_surveys 
ADD CONSTRAINT user_surveys_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;