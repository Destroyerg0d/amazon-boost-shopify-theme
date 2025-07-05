import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  delivery_time_days: number;
  category: string;
  is_active: boolean;
}

export const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load services"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderService = async (service: Service) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          service_id: service.id,
          total_amount: service.price,
          status: 'pending',
          payment_status: 'pending',
          expected_delivery_date: new Date(Date.now() + service.delivery_time_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Order Created!",
        description: "Your order has been created. Check your dashboard."
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create order. Please try again."
      });
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'review': return <Star className="h-6 w-6" />;
      case 'optimization': return <Zap className="h-6 w-6" />;
      case 'advertising': return <Crown className="h-6 w-6" />;
      default: return <Check className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-background via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Choose Your Success Package
            </h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Choose Your Success Package
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional Amazon services to boost your sales and reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card key={service.id} className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-strong">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 w-fit">
                  {getServiceIcon(service.category)}
                </div>
                <CardTitle className="text-2xl font-bold mb-2">{service.name}</CardTitle>
                <CardDescription className="text-base mb-4">{service.description}</CardDescription>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    ₹{service.price}
                  </span>
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground">one-time</div>
                    <div className="text-xs text-muted-foreground">{service.delivery_time_days} days</div>
                  </div>
                </div>
                <Badge variant="secondary" className="mb-4 capitalize">{service.category} Package</Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {service.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={index === 1 ? 'hero' : 'default'}
                  size="lg" 
                  className="w-full text-lg py-6"
                  onClick={() => handleOrderService(service)}
                >
                  {user ? 'Order Now' : 'Sign Up & Order'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};