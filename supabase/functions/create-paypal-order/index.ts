import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateOrderRequest {
  planType: 'verified' | 'unverified';
  planName: string;
  amount: number;
  bookPrice?: number;
  totalReviews: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { planType, planName, amount, bookPrice = 0, totalReviews }: CreateOrderRequest = await req.json()

    // Get PayPal access token
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured')
    }

    const auth = btoa(`${clientId}:${clientSecret}`)
    
    const tokenResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    })

    const { access_token } = await tokenResponse.json()

    // Create PayPal order
    const orderResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2)
          },
          description: `ReviewProMax ${planName} - ${planType === 'verified' ? 'Verified' : 'Unverified'} Reviews`
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/dashboard`,
          cancel_url: `${req.headers.get('origin')}/pricing`
        }
      })
    })

    const order = await orderResponse.json()

    // Store payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        plan_type: planType,
        plan_name: planName,
        amount: amount,
        book_price: bookPrice,
        paypal_payment_id: order.id,
        status: 'pending'
      })
      .select()
      .single()

    if (paymentError) {
      throw paymentError
    }

    return new Response(
      JSON.stringify({ 
        orderID: order.id,
        paymentId: payment.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error creating PayPal order:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})