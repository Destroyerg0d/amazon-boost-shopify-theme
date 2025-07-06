import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Zap,
  Crown,
  Gem
} from 'lucide-react';

interface ReviewPlan {
  id: string;
  plan_type: string;
  plan_name: string;
  total_reviews: number;
  used_reviews: number;
  status: string;
  purchased_at: string;
  expires_at: string | null;
}

interface ReviewPlansProps {
  onBack: () => void;
}

const ReviewPlans = ({ onBack }: ReviewPlansProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<ReviewPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('review_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your review plans"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'expired':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'basic':
        return <Zap className="w-5 h-5" />;
      case 'silver':
        return <Star className="w-5 h-5" />;
      case 'gold':
        return <Crown className="w-5 h-5" />;
      case 'premium':
        return <Gem className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const availablePlans = [
    {
      name: 'Basic Review Package',
      type: 'basic',
      reviews: 5,
      price: 49,
      description: 'Perfect for new authors looking to get started',
      features: ['5 Professional Reviews', 'Basic Review Analysis', 'Email Support']
    },
    {
      name: 'Silver Review Package',
      type: 'silver',
      reviews: 10,
      price: 89,
      description: 'Great for authors building their reputation',
      features: ['10 Professional Reviews', 'Detailed Analysis', 'Priority Support', 'Amazon Optimization Tips']
    },
    {
      name: 'Gold Review Package',
      type: 'gold',
      reviews: 20,
      price: 159,
      description: 'Ultimate package for serious authors',
      features: ['20 Professional Reviews', 'Premium Analysis', '24/7 Support', 'Marketing Consultation', 'Verified Reviews']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reviews
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Review Plans</h2>
          <p className="text-muted-foreground">Manage your review packages and purchase new ones</p>
        </div>
      </div>

      {/* Current Plans */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {plans.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Active Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => {
                  const progressPercentage = (plan.used_reviews / plan.total_reviews) * 100;
                  const remainingReviews = plan.total_reviews - plan.used_reviews;
                  
                  return (
                    <Card key={plan.id} className="hover:shadow-medium transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getPlanIcon(plan.plan_type)}
                            <CardTitle className="text-lg">{plan.plan_name}</CardTitle>
                          </div>
                          <Badge className={getStatusColor(plan.status)}>
                            {getStatusIcon(plan.status)}
                            <span className="ml-1 capitalize">{plan.status}</span>
                          </Badge>
                        </div>
                        <CardDescription>
                          Purchased on {new Date(plan.purchased_at).toLocaleDateString()}
                          {plan.expires_at && (
                            <span className="block">
                              Expires: {new Date(plan.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Reviews Used</span>
                              <span>{plan.used_reviews} / {plan.total_reviews}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{remainingReviews}</p>
                            <p className="text-sm text-muted-foreground">Reviews Remaining</p>
                          </div>
                          {plan.status === 'active' && remainingReviews > 0 && (
                            <div className="text-center">
                              <Badge variant="outline" className="bg-success/10 text-success">
                                Ready to Use
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Plans */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Review Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <Card key={plan.type} className="hover:shadow-medium transition-all relative">
                  {plan.type === 'gold' && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {getPlanIcon(plan.type)}
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">${plan.price}</p>
                        <p className="text-sm text-muted-foreground">{plan.reviews} Professional Reviews</p>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Purchase Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {plans.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Review Plans Yet</p>
                <p className="text-muted-foreground mb-6">
                  Purchase your first review package to start getting professional reviews for your books
                </p>
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewPlans;