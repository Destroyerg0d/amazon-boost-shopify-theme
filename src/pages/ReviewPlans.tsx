import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [bookPrice, setBookPrice] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<'verified' | 'unverified'>('verified');

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

  const availablePlans = {
    verified: [
      {
        name: "Starter Trial",
        type: "starter",
        reviews: "10 reviews",
        originalPrice: 230,
        discountedPrice: 170,
        discount: "26% OFF",
        features: [
          "Written reviews only",
          "Verified purchase reviews",
          "Genre-matched readers",
          "Quality guarantee"
        ]
      },
      {
        name: "Bronze Package",
        type: "bronze",
        reviews: "20–25 reviews",
        originalPrice: 450,
        discountedPrice: 350,
        discount: "22% OFF",
        features: [
          "Written reviews only",
          "Verified purchase reviews",
          "Genre-matched readers",
          "Quality guarantee",
          "Review analytics"
        ]
      },
      {
        name: "Silver Package",
        type: "silver",
        reviews: "45–50 reviews",
        originalPrice: 870,
        discountedPrice: 700,
        discount: "20% OFF",
        features: [
          "Written reviews only",
          "Verified purchase reviews",
          "Genre-matched readers",
          "Quality guarantee",
          "Review analytics",
          "Priority support"
        ],
        popular: true
      },
      {
        name: "Gold Package",
        type: "gold",
        reviews: "95–100 reviews",
        originalPrice: 1290,
        discountedPrice: 1050,
        discount: "19% OFF",
        features: [
          "Written reviews only",
          "Verified purchase reviews",
          "Genre-matched readers",
          "Quality guarantee",
          "Review analytics",
          "Priority support",
          "Dedicated account manager"
        ]
      }
    ],
    unverified: [
      {
        name: "Starter Trial",
        type: "starter",
        reviews: "10 reviews",
        originalPrice: 170,
        discountedPrice: 130,
        discount: "24% OFF",
        features: [
          "Text reviews only",
          "Fast delivery",
          "Genre-matched readers",
          "Quality guarantee"
        ]
      },
      {
        name: "Bronze Package",
        type: "bronze",
        reviews: "20–25 reviews",
        originalPrice: 280,
        discountedPrice: 230,
        discount: "18% OFF",
        features: [
          "Text reviews only",
          "Fast delivery",
          "Genre-matched readers",
          "Quality guarantee",
          "Review analytics"
        ]
      },
      {
        name: "Silver Package",
        type: "silver",
        reviews: "45–50 reviews",
        originalPrice: 560,
        discountedPrice: 450,
        discount: "20% OFF",
        features: [
          "Text reviews only",
          "Fast delivery",
          "Genre-matched readers",
          "Quality guarantee",
          "Review analytics",
          "Priority support"
        ],
        popular: true
      },
      {
        name: "Gold Package",
        type: "gold",
        reviews: "95–100 reviews",
        originalPrice: 980,
        discountedPrice: 790,
        discount: "19% OFF",
        features: [
          "Text reviews only",
          "Fast delivery",
          "Genre-matched readers",
          "Quality guarantee",
          "Review analytics",
          "Priority support",
          "Dedicated account manager"
        ]
      }
    ]
  };

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

          {/* Review Type Selection with Book Price Calculator */}
          <div className="mb-8">
            {/* Book Price Input for Verified Reviews */}
            {selectedType === 'verified' && (
              <Card className="max-w-md mx-auto mb-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Book Price Calculator</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter your book price on Amazon to calculate total cost (Plan Cost + Book Purchase Cost)
                      </p>
                      <Label htmlFor="bookPrice">Book Price on Amazon ($)</Label>
                      <Input
                        id="bookPrice"
                        type="number"
                        step="0.01"
                        value={bookPrice}
                        onChange={(e) => setBookPrice(parseFloat(e.target.value) || 0)}
                        placeholder="Enter your book price"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              {/* Verified Reviews Card */}
              <Card 
                className={`cursor-pointer transition-all hover:shadow-medium ${
                  selectedType === 'verified' ? 'border-success shadow-soft bg-success/5' : ''
                }`}
                onClick={() => setSelectedType('verified')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">✅ Verified Reviews</h3>
                      <p className="text-sm text-muted-foreground">Amazon verified purchase</p>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Higher credibility & trust</li>
                    <li>• Amazon algorithm boost</li>
                    <li>• Verified purchase badge</li>
                    <li>• Premium pricing</li>
                  </ul>
                  {selectedType === 'verified' && (
                    <div className="mt-4 text-center">
                      <Badge className="bg-success text-success-foreground">Selected</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Unverified Reviews Card */}
              <Card 
                className={`cursor-pointer transition-all hover:shadow-medium ${
                  selectedType === 'unverified' ? 'border-primary shadow-soft bg-primary/5' : ''
                }`}
                onClick={() => setSelectedType('unverified')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">🔓 Unverified Reviews</h3>
                      <p className="text-sm text-muted-foreground">Fast & affordable</p>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Faster delivery</li>
                    <li>• Budget-friendly pricing</li>
                    <li>• Great for pre-launch</li>
                    <li>• Build initial momentum</li>
                  </ul>
                  {selectedType === 'unverified' && (
                    <div className="mt-4 text-center">
                      <Badge className="bg-primary text-primary-foreground">Selected</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Available Plans */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {selectedType === 'verified' ? 'Verified' : 'Unverified'} Review Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availablePlans[selectedType].map((plan, index) => (
                <Card key={plan.type} className={`hover:shadow-medium transition-all relative ${plan.popular ? 'border-accent shadow-medium' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {getPlanIcon(plan.type)}
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
            <div className="text-center">
              <p className="font-semibold text-lg">{plan.reviews}</p>
            </div>
            <div className="space-y-4">
              {selectedType === 'verified' ? (
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    Plan: ${plan.discountedPrice}
                    <div className="text-xs text-muted-foreground line-through">
                      Was ${plan.originalPrice}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-success">
                    + Book Cost: ${(bookPrice * parseInt(plan.reviews.split(' ')[0])).toFixed(2)}
                  </div>
                  <div className="text-2xl font-bold text-foreground border-t pt-2">
                    Total: ${(plan.discountedPrice + (bookPrice * parseInt(plan.reviews.split(' ')[0]))).toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    ${plan.discountedPrice}
                  </div>
                  <div className="text-sm text-muted-foreground line-through">
                    ${plan.originalPrice}
                  </div>
                </div>
              )}
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 mx-auto block w-fit">
                {plan.discount}
              </Badge>
            </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        size="lg"
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => {
                          const totalCost = selectedType === 'verified' 
                            ? plan.discountedPrice + (bookPrice * parseInt(plan.reviews.split(' ')[0]))
                            : plan.discountedPrice;
                          console.log('Purchase plan:', plan.name, 'Total:', totalCost);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Purchase Plan - ${selectedType === 'verified' 
                          ? (plan.discountedPrice + (bookPrice * parseInt(plan.reviews.split(' ')[0]))).toFixed(2)
                          : plan.discountedPrice}
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