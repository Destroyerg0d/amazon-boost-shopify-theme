import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Edit, DollarSign, Users, TrendingUp, Eye } from 'lucide-react';

interface Affiliate {
  id: string;
  user_id: string;
  affiliate_code: string;
  status: string;
  commission_rate: number;
  total_earnings: number;
  total_referrals: number;
  total_conversions: number;
  payment_email: string;
  payment_method: string;
  notes: string;
  created_at: string;
  approved_at: string | null;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

interface Commission {
  id: string;
  affiliate_id: string;
  commission_amount: number;
  sale_amount: number;
  commission_rate: number;
  status: string;
  created_at: string;
  affiliates?: {
    affiliate_code: string;
    profiles?: {
      full_name: string;
    } | null;
  } | null;
}

interface Payout {
  id: string;
  affiliate_id: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  affiliates?: {
    affiliate_code: string;
    payment_email: string;
    profiles?: {
      full_name: string;
    } | null;
  } | null;
}

const AdminAffiliates = () => {
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch affiliates with profile data
      const { data: affiliatesData, error: affiliatesError } = await supabase
        .from('affiliates')
        .select(`
          *,
          profiles!affiliates_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (affiliatesError) throw affiliatesError;

      // Fetch commissions
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('affiliate_commissions')
        .select(`
          *,
          affiliates(
            affiliate_code,
            profiles!affiliates_user_id_fkey(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (commissionsError) throw commissionsError;

      // Fetch payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('affiliate_payouts')
        .select(`
          *,
          affiliates(
            affiliate_code,
            payment_email,
            profiles!affiliates_user_id_fkey(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (payoutsError) throw payoutsError;

      setAffiliates((affiliatesData as unknown as Affiliate[]) || []);
      setCommissions((commissionsData as unknown as Commission[]) || []);
      setPayouts((payoutsData as unknown as Payout[]) || []);
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

  const updateAffiliateStatus = async (affiliateId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'active') {
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('affiliates')
        .update(updateData)
        .eq('id', affiliateId);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: `Affiliate ${status === 'active' ? 'approved' : status}`,
      });
    } catch (error) {
      console.error('Error updating affiliate status:', error);
      toast({
        title: "Error",
        description: "Failed to update affiliate status",
        variant: "destructive"
      });
    }
  };

  const updateAffiliate = async (updates: Partial<Affiliate>) => {
    if (!selectedAffiliate) return;

    try {
      const { error } = await supabase
        .from('affiliates')
        .update(updates)
        .eq('id', selectedAffiliate.id);

      if (error) throw error;

      await fetchData();
      setEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Affiliate updated successfully",
      });
    } catch (error) {
      console.error('Error updating affiliate:', error);
      toast({
        title: "Error",
        description: "Failed to update affiliate",
        variant: "destructive"
      });
    }
  };

  const createPayout = async (affiliateId: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('affiliate_payouts')
        .insert({
          affiliate_id: affiliateId,
          amount,
          payment_method: 'paypal',
          status: 'pending'
        });

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: "Payout created successfully",
      });
    } catch (error) {
      console.error('Error creating payout:', error);
      toast({
        title: "Error",
        description: "Failed to create payout",
        variant: "destructive"
      });
    }
  };

  const updatePayoutStatus = async (payoutId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.processed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('affiliate_payouts')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: `Payout marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating payout status:', error);
      toast({
        title: "Error",
        description: "Failed to update payout status",
        variant: "destructive"
      });
    }
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

  const stats = {
    totalAffiliates: affiliates.length,
    activeAffiliates: affiliates.filter(a => a.status === 'active').length,
    pendingAffiliates: affiliates.filter(a => a.status === 'pending').length,
    totalEarnings: affiliates.reduce((sum, a) => sum + a.total_earnings, 0),
    totalCommissions: commissions.reduce((sum, c) => sum + c.commission_amount, 0),
    pendingPayouts: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Affiliates</p>
                <p className="text-lg font-bold">{stats.totalAffiliates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-lg font-bold">{stats.activeAffiliates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-bold">{stats.pendingAffiliates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
                <p className="text-lg font-bold">${stats.totalEarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Commissions</p>
                <p className="text-lg font-bold">${stats.totalCommissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-muted-foreground">Pending Payouts</p>
                <p className="text-lg font-bold">${stats.pendingPayouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="affiliates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="affiliates">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Management</CardTitle>
              <CardDescription>Manage affiliate applications and accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>{affiliate.profiles?.full_name || 'N/A'}</TableCell>
                      <TableCell>{affiliate.profiles?.email}</TableCell>
                      <TableCell className="font-mono">{affiliate.affiliate_code}</TableCell>
                      <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                      <TableCell>{affiliate.commission_rate}%</TableCell>
                      <TableCell>${affiliate.total_earnings}</TableCell>
                      <TableCell>{affiliate.total_conversions}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {affiliate.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateAffiliateStatus(affiliate.id, 'active')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateAffiliateStatus(affiliate.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedAffiliate(affiliate)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Affiliate</DialogTitle>
                                <DialogDescription>
                                  Update affiliate settings and information
                                </DialogDescription>
                              </DialogHeader>
                              {selectedAffiliate && (
                                <div className="space-y-4">
                                  <div>
                                    <Label>Status</Label>
                                    <Select
                                      value={selectedAffiliate.status}
                                      onValueChange={(value) => 
                                        setSelectedAffiliate({...selectedAffiliate, status: value})
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Commission Rate (%)</Label>
                                    <Input
                                      type="number"
                                      value={selectedAffiliate.commission_rate}
                                      onChange={(e) => 
                                        setSelectedAffiliate({
                                          ...selectedAffiliate, 
                                          commission_rate: parseFloat(e.target.value)
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Notes</Label>
                                    <Textarea
                                      value={selectedAffiliate.notes || ''}
                                      onChange={(e) => 
                                        setSelectedAffiliate({...selectedAffiliate, notes: e.target.value})
                                      }
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={() => updateAffiliate(selectedAffiliate)}>
                                      Save Changes
                                    </Button>
                                    {selectedAffiliate.total_earnings > 0 && (
                                      <Button
                                        variant="outline"
                                        onClick={() => createPayout(selectedAffiliate.id, selectedAffiliate.total_earnings)}
                                      >
                                        Create Payout
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
              <CardDescription>Track all affiliate commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Sale Amount</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        {commission.affiliates?.profiles?.full_name || commission.affiliates?.affiliate_code}
                      </TableCell>
                      <TableCell>${commission.commission_amount}</TableCell>
                      <TableCell>${commission.sale_amount}</TableCell>
                      <TableCell>{commission.commission_rate}%</TableCell>
                      <TableCell>
                        <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                          {commission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(commission.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout Management</CardTitle>
              <CardDescription>Manage affiliate payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Email</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        {payout.affiliates?.profiles?.full_name || payout.affiliates?.affiliate_code}
                      </TableCell>
                      <TableCell>${payout.amount}</TableCell>
                      <TableCell>{payout.affiliates?.payment_email}</TableCell>
                      <TableCell className="capitalize">{payout.payment_method}</TableCell>
                      <TableCell>
                        <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(payout.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {payout.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updatePayoutStatus(payout.id, 'completed')}
                            >
                              Mark Paid
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updatePayoutStatus(payout.id, 'failed')}
                            >
                              Mark Failed
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAffiliates;