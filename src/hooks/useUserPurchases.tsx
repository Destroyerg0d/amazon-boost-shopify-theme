import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useUserPurchases = () => {
  const { user } = useAuth();
  const [hasPurchases, setHasPurchases] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserPurchases = async () => {
      if (!user) {
        setHasPurchases(false);
        setLoading(false);
        return;
      }

      try {
        // Check for completed payments
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .limit(1);

        if (paymentsError) throw paymentsError;

        // Check for active review plans
        const { data: reviewPlans, error: reviewPlansError } = await supabase
          .from('review_plans')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);

        if (reviewPlansError) throw reviewPlansError;

        // User has purchases if they have either completed payments or active review plans
        const hasAnyPurchases = (payments && payments.length > 0) || (reviewPlans && reviewPlans.length > 0);
        setHasPurchases(hasAnyPurchases);
      } catch (error) {
        console.error('Error checking user purchases:', error);
        setHasPurchases(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserPurchases();
  }, [user]);

  return { hasPurchases, loading };
};