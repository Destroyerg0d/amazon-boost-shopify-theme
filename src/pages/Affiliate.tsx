import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, DollarSign, Users, TrendingUp, Eye } from 'lucide-react';

interface AffiliateData {
  id: string;
  affiliate_code: string;
  status: string;
  commission_rate: number;
  total_earnings: number;
  total_referrals: number;
  total_conversions: number;
  payment_email: string;
  payment_method: string;
}

interface Commission {
  id: string;
  commission_amount: number;
  sale_amount: number;
  commission_rate: number;
  status: string;
  created_at: string;
}

interface Referral {
  id: string;
  referral_code: string;
  clicked_at: string;
  converted_at: string | null;
  conversion_value: number | null;
  status: string;
}

const Affiliate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [paymentEmail, setPaymentEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    try {
      // Check if user is already an affiliate
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (affiliateError && affiliateError.code !== 'PGRST116') {
        throw affiliateError;
      }

      if (affiliateData) {
        setAffiliate(affiliateData);
        setPaymentEmail(affiliateData.payment_email || '');

        // Fetch commissions
        const { data: commissionsData, error: commissionsError } = await supabase
          .from('affiliate_commissions')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('created_at', { ascending: false });

        if (commissionsError) throw commissionsError;
        setCommissions(commissionsData || []);

        // Fetch referrals
        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('clicked_at', { ascending: false })
          .limit(50);

        if (referralsError) throw referralsError;
        setReferrals(referralsData || []);
      }
    } catch (error) {
      console.error('Error fetching affiliate data:', error);
      toast({
        title: "Error",
        description: "Failed to load affiliate data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyForAffiliate = async () => {
    if (!paymentEmail) {
      toast({
        title: "Error",
        description: "Please enter your payment email",
        variant: "destructive"
      });
      return;
    }

    setApplying(true);
    try {
      // Generate affiliate code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_affiliate_code');

      if (codeError) throw codeError;

      // Create affiliate account
      const { data, error } = await supabase
        .from('affiliates')
        .insert({
          user_id: user?.id,
          affiliate_code: codeData,
          payment_email: paymentEmail,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setAffiliate(data);
      toast({
        title: "Application Submitted",
        description: "Your affiliate application has been submitted for review. You'll be notified once approved.",
      });
    } catch (error) {
      console.error('Error applying for affiliate:', error);
      toast({
        title: "Error",
        description: "Failed to submit affiliate application",
        variant: "destructive"
      });
    } finally {
      setApplying(false);
    }
  };

  const updatePaymentInfo = async () => {
    if (!affiliate) return;

    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ payment_email: paymentEmail })
        .eq('id', affiliate.id);

      if (error) throw error;

      setAffiliate({ ...affiliate, payment_email: paymentEmail });
      toast({
        title: "Success",
        description: "Payment information updated successfully",
      });
    } catch (error) {
      console.error('Error updating payment info:', error);
      toast({
        title: "Error",
        description: "Failed to update payment information",
        variant: "destructive"
      });
    }
  };

  const copyReferralLink = (code: string) => {
    const link = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      active: { variant: 'default' as const, label: 'Active' },
      suspended: { variant: 'destructive' as const, label: 'Suspended' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Join Our Affiliate Program</CardTitle>
              <CardDescription className="text-lg">
                Earn 20% commission on every sale you refer to ReviewProMax
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <DollarSign className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">20% Commission</h3>
                  <p className="text-sm text-muted-foreground">Earn on every successful referral</p>
                </div>
                <div className="space-y-2">
                  <Users className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Real-time Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor your referrals and earnings</p>
                </div>
                <div className="space-y-2">
                  <TrendingUp className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Monthly Payouts</h3>
                  <p className="text-sm text-muted-foreground">Get paid via PayPal monthly</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-email">Payment Email (PayPal)</Label>
                  <Input
                    id="payment-email"
                    type="email"
                    placeholder="your-paypal@email.com"
                    value={paymentEmail}
                    onChange={(e) => setPaymentEmail(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={applyForAffiliate} 
                  disabled={applying}
                  className="w-full"
                >
                  {applying ? "Submitting..." : "Apply for Affiliate Program"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Affiliate Dashboard</h1>
          <div className="flex items-center justify-center gap-2">
            <span>Status:</span>
            {getStatusBadge(affiliate.status)}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${affiliate.total_earnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold">{affiliate.total_referrals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-2xl font-bold">{affiliate.total_conversions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {affiliate.total_referrals > 0 
                      ? ((affiliate.total_conversions / affiliate.total_referrals) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="links">Referral Links</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Links</CardTitle>
                <CardDescription>
                  Share these links to earn {affiliate.commission_rate}% commission on sales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Main Referral Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}/?ref=${affiliate.affiliate_code}`}
                      readOnly
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyReferralLink(affiliate.affiliate_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pricing Page Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}/pricing?ref=${affiliate.affiliate_code}`}
                      readOnly
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyReferralLink(affiliate.affiliate_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">How it works:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Share your referral links with potential customers</li>
                    <li>• When someone clicks your link, we track the referral</li>
                    <li>• If they purchase within 30 days, you earn {affiliate.commission_rate}% commission</li>
                    <li>• Commissions are paid monthly via PayPal</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions">
            <Card>
              <CardHeader>
                <CardTitle>Commission History</CardTitle>
                <CardDescription>Track your earnings and commission status</CardDescription>
              </CardHeader>
              <CardContent>
                {commissions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No commissions yet. Start sharing your referral links!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {commissions.map((commission) => (
                      <div key={commission.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">${commission.commission_amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {commission.commission_rate}% of ${commission.sale_amount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(commission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                          {commission.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Referral Activity</CardTitle>
                <CardDescription>See who clicked your links and converted</CardDescription>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No referral activity yet. Start sharing your links!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {referrals.map((referral) => (
                      <div key={referral.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">
                            {referral.status === 'converted' ? 'Conversion' : 'Click'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Clicked: {new Date(referral.clicked_at).toLocaleDateString()}
                          </p>
                          {referral.converted_at && (
                            <p className="text-sm text-muted-foreground">
                              Converted: {new Date(referral.converted_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={referral.status === 'converted' ? 'default' : 'secondary'}>
                            {referral.status}
                          </Badge>
                          {referral.conversion_value && (
                            <p className="text-sm text-muted-foreground mt-1">
                              ${referral.conversion_value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Update your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="payment-email-update">PayPal Email</Label>
                  <Input
                    id="payment-email-update"
                    type="email"
                    value={paymentEmail}
                    onChange={(e) => setPaymentEmail(e.target.value)}
                  />
                </div>
                <Button onClick={updatePaymentInfo}>Update Payment Info</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Affiliate;