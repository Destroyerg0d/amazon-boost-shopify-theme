import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CaptureOrderRequest {
  orderID: string;
  paymentId: string;
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

    const { orderID, paymentId }: CaptureOrderRequest = await req.json()

    // Get PayPal access token
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
    
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

    // Capture PayPal order
    const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      }
    })

    const captureData = await captureResponse.json()

    if (captureData.status === 'COMPLETED') {
      // Get payment details from database
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .eq('user_id', user.id)
        .single()

      if (paymentError || !payment) {
        throw new Error('Payment not found')
      }

      // Map plan names to review counts
      const reviewCounts: Record<string, number> = {
        'Starter Trial': 10,
        'Bronze Package': 25,
        'Silver Package': 50,
        'Gold Package': 100
      }

      const totalReviews = reviewCounts[payment.plan_name] || 10

      // Create review plan using the database function
      const { data: planResult, error: planError } = await supabase
        .rpc('handle_successful_payment', {
          p_payment_id: payment.id,
          p_user_id: user.id,
          p_plan_type: payment.plan_type,
          p_plan_name: payment.plan_name,
          p_amount: payment.amount,
          p_total_reviews: totalReviews
        })

      if (planError) {
        throw planError
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          planId: planResult,
          captureData
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      throw new Error('Payment capture failed')
    }

  } catch (error) {
    console.error('Error capturing PayPal order:', error)
    
    // Log detailed error information for debugging
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Payment processing failed',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 to avoid "non-2xx status code" error
      }
    )
  }
})