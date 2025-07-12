import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PayPalButtonProps {
  planType: 'verified' | 'unverified';
  planName: string;
  amount: number;
  bookPrice?: number;
  disabled?: boolean;
}

export const PayPalButton = ({ planType, planName, amount, bookPrice = 0, disabled }: PayPalButtonProps) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center p-4 border border-dashed rounded-lg">
        <p className="text-muted-foreground">Please sign in to purchase a plan</p>
      </div>
    );
  }

  const createOrder = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          planType,
          planName,
          amount,
          bookPrice,
          totalReviews: getReviewCount(planName)
        },
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to create order');
      }

      // Store paymentId for later use in onApprove
      (window as any).currentPaymentId = data.paymentId;
      return data.orderID;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message
      });
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const paymentId = (window as any).currentPaymentId;
      
      if (!paymentId) {
        throw new Error('Payment ID not found');
      }

      const { data: result, error } = await supabase.functions.invoke('capture-paypal-order', {
        body: {
          orderID: data.orderID,
          paymentId: paymentId
        },
      });

      if (error) {
        throw new Error(error.message || 'Payment capture failed');
      }

      toast({
        title: "Payment Successful!",
        description: `Your ${planName} plan has been activated successfully.`
      });

      // Redirect to thank you page
      navigate('/thank-you');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Processing Error",
        description: error.message
      });
    }
  };

  const onError = (error: any) => {
    console.error('PayPal error:', error);
    toast({
      variant: "destructive",
      title: "Payment Error",
      description: "An error occurred during payment processing. Please try again."
    });
  };

  const getReviewCount = (planName: string): number => {
    const counts: Record<string, number> = {
      'Starter Trial': 10,
      'Bronze Package': 25,
      'Silver Package': 50,
      'Gold Package': 100
    };
    return counts[planName] || 10;
  };

  if (isPending) {
    return (
      <div className="w-full h-12 bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PayPalButtons
        style={{ 
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay"
        }}
        disabled={disabled}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </div>
  );
};