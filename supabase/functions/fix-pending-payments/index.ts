import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get all pending payments for this user  
    const { data: pendingPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError)
      throw paymentsError
    }

    console.log(`Found ${pendingPayments.length} pending payments for user ${user.id}`)

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

    const processedPayments = []

    for (const payment of pendingPayments) {
      try {
        console.log(`Processing payment ${payment.id} with PayPal ID ${payment.paypal_payment_id}`)
        
        // Check PayPal order status
        const orderResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${payment.paypal_payment_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          }
        })

        const orderData = await orderResponse.json()
        console.log(`PayPal order ${payment.paypal_payment_id} status: ${orderData.status}`)

        if (orderData.status === 'COMPLETED') {
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
            console.error(`Error creating plan for payment ${payment.id}:`, planError)
            processedPayments.push({
              paymentId: payment.id,
              status: 'error',
              error: planError.message
            })
          } else {
            console.log(`Successfully created plan ${planResult} for payment ${payment.id}`)
            processedPayments.push({
              paymentId: payment.id,
              status: 'completed',
              planId: planResult
            })
          }
        } else if (orderData.status === 'APPROVED') {
          // Try to capture the payment
          const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${payment.paypal_payment_id}/capture`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            }
          })

          const captureData = await captureResponse.json()
          
          if (captureData.status === 'COMPLETED') {
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
              console.error(`Error creating plan for payment ${payment.id}:`, planError)
              processedPayments.push({
                paymentId: payment.id,
                status: 'error',
                error: planError.message
              })
            } else {
              console.log(`Successfully captured and created plan ${planResult} for payment ${payment.id}`)
              processedPayments.push({
                paymentId: payment.id,
                status: 'captured_and_completed',
                planId: planResult
              })
            }
          } else {
            processedPayments.push({
              paymentId: payment.id,
              status: 'capture_failed',
              error: 'Failed to capture PayPal payment'
            })
          }
        } else {
          processedPayments.push({
            paymentId: payment.id,
            status: 'not_completed',
            paypalStatus: orderData.status
          })
        }
      } catch (error) {
        console.error(`Error processing payment ${payment.id}:`, error)
        processedPayments.push({
          paymentId: payment.id,
          status: 'error',
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processedPayments,
        totalProcessed: processedPayments.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error fixing pending payments:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})