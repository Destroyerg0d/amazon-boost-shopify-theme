import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, Target, ArrowRight, Handshake, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const AffiliateSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAffiliateClick = () => {
    if (user) {
      navigate('/affiliate');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Handshake className="w-4 h-4 mr-2" />
            Partnership Program
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our <span className="text-primary">Affiliate Program</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Earn 20% commission on every sale you refer. Perfect for book reviewers, authors, 
            literary bloggers, and anyone in the publishing industry.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Benefits Cards */}
          <div className="space-y-6">
            <Card className="bg-card border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">20% Commission Rate</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Earn substantial commissions on every successful referral. Our high-value services mean higher earnings for you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Real-Time Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Monitor your referrals, conversions, and earnings in real-time through our professional affiliate dashboard.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Monthly Payouts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Reliable monthly payments via PayPal. No minimum threshold, get paid for every successful referral.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Stats & CTA */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-card border rounded-2xl">
                <div className="text-3xl font-bold text-primary mb-2">20%</div>
                <div className="text-muted-foreground">Commission Rate</div>
              </div>
              <div className="text-center p-6 bg-card border rounded-2xl">
                <div className="text-3xl font-bold text-primary mb-2">$200+</div>
                <div className="text-muted-foreground">Avg. Commission</div>
              </div>
              <div className="text-center p-6 bg-card border rounded-2xl">
                <div className="text-3xl font-bold text-primary mb-2">30d</div>
                <div className="text-muted-foreground">Cookie Duration</div>
              </div>
              <div className="text-center p-6 bg-card border rounded-2xl">
                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                <div className="text-muted-foreground">Approval Time</div>
              </div>
            </div>

            {/* Perfect For Section */}
            <Card className="bg-card border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Perfect For
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm">Book Reviewers & Literary Bloggers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm">Authors & Publishing Professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm">Marketing Agencies & Consultants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm">Content Creators & Influencers</span>
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              onClick={handleAffiliateClick}
            >
              <Handshake className="w-5 h-5 mr-2" />
              {user ? 'Join Affiliate Program' : 'Start Earning Today'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {user ? 'Apply now and start earning commissions' : 'Sign up for free and start earning within 24 hours'}
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold">Sign Up</h4>
              <p className="text-muted-foreground text-sm">
                Apply for our affiliate program and get approved within 24 hours
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold">Share Your Link</h4>
              <p className="text-muted-foreground text-sm">
                Get your unique referral link and start promoting our services
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold">Earn Commissions</h4>
              <p className="text-muted-foreground text-sm">
                Receive 20% commission on every successful referral payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};