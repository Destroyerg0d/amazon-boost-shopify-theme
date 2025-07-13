import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useReferralTracking = () => {
  useEffect(() => {
    // Track referral when user lands on the page
    const trackReferral = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');
        
        if (referralCode) {
          // Store referral code in localStorage for session persistence
          localStorage.setItem('referralCode', referralCode);
          
          // Find the affiliate by code
          const { data: affiliate, error: affiliateError } = await supabase
            .from('affiliates')
            .select('id')
            .eq('affiliate_code', referralCode)
            .eq('status', 'active')
            .single();

          if (affiliate && !affiliateError) {
            // Track the referral click
            await supabase
              .from('referrals')
              .insert({
                affiliate_id: affiliate.id,
                referral_code: referralCode,
                ip_address: await getClientIP(),
                user_agent: navigator.userAgent,
                utm_source: urlParams.get('utm_source'),
                utm_medium: urlParams.get('utm_medium'),
                utm_campaign: urlParams.get('utm_campaign'),
                status: 'clicked'
              });

            // Update affiliate referral count will be handled by database triggers
          }

          // Clean up URL parameters
          const url = new URL(window.location.href);
          url.searchParams.delete('ref');
          url.searchParams.delete('utm_source');
          url.searchParams.delete('utm_medium');
          url.searchParams.delete('utm_campaign');
          window.history.replaceState({}, document.title, url.toString());
        }
      } catch (error) {
        console.error('Error tracking referral:', error);
      }
    };

    trackReferral();
  }, []);

  const trackConversion = async (paymentId: string, amount: number) => {
    try {
      const referralCode = localStorage.getItem('referralCode');
      if (referralCode) {
        await supabase.rpc('track_affiliate_conversion', {
          p_payment_id: paymentId,
          p_referral_code: referralCode,
          p_sale_amount: amount
        });
        
        // Clear referral code after conversion
        localStorage.removeItem('referralCode');
      }
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  };

  return { trackConversion };
};

// Helper function to get client IP (fallback method)
const getClientIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return null;
  }
};