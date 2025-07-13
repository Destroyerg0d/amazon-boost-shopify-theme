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
            .maybeSingle();

          if (affiliate && !affiliateError) {
            // Check if this referral already exists to avoid duplicates
            const { data: existingReferral } = await supabase
              .from('referrals')
              .select('id')
              .eq('affiliate_id', affiliate.id)
              .eq('referral_code', referralCode)
              .gte('clicked_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Within 24 hours
              .maybeSingle();

            if (!existingReferral) {
              // Get IP address (don't await since it's optional)
              let ipAddress = null;
              try {
                ipAddress = await getClientIP();
              } catch (error) {
                console.log('Could not get IP address:', error);
              }

              // Track the referral click
              const { data: referralData, error: insertError } = await supabase
                .from('referrals')
                .insert({
                  affiliate_id: affiliate.id,
                  referral_code: referralCode,
                  ip_address: ipAddress,
                  user_agent: navigator.userAgent,
                  utm_source: urlParams.get('utm_source'),
                  utm_medium: urlParams.get('utm_medium'),
                  utm_campaign: urlParams.get('utm_campaign'),
                  status: 'clicked'
                })
                .select();

              if (insertError) {
                console.error('Error inserting referral:', insertError);
              } else {
                console.log('Referral tracked successfully:', referralData);
              }
            } else {
              console.log('Referral already exists within 24 hours');
            }
          } else if (affiliateError) {
            console.error('Error finding affiliate:', affiliateError);
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