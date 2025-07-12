import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Eye,
  DollarSign,
  User,
  Calendar,
  CreditCard
} from 'lucide-react';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  plan_name: string;
  plan_type: string;
  status: string;
  paypal_payment_id: string | null;
  paypal_payer_id: string | null;
  book_price: number;
  created_at: string;
  updated_at: string;
  payment_data: any;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
    
    // Set up real-time subscription
    const paymentsChannel = supabase
      .channel('payments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, fetchPayments)
      .subscribe();

    return () => {
      supabase.removeChannel(paymentsChannel);
    };
  }, []);

  const fetchPayments = async () => {
    try {
      // First get all payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Then get profiles for each payment
      const paymentsWithProfiles = await Promise.all(
        (paymentsData || []).map(async (payment) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', payment.user_id)
            .single();

          return {
            ...payment,
            profiles: profileData
          };
        })
      );

      setPayments(paymentsWithProfiles);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      completed: { variant: 'success' as const, label: 'Completed' },
      failed: { variant: 'destructive' as const, label: 'Failed' },
      cancelled: { variant: 'outline' as const, label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlanTypeBadge = (planType: string) => {
    const typeConfig = {
      verified: { variant: 'default' as const, label: 'Verified', color: 'text-blue-600' },
      unverified: { variant: 'secondary' as const, label: 'Unverified', color: 'text-gray-600' },
    };

    const config = typeConfig[planType as keyof typeof typeConfig] || typeConfig.unverified;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paypal_payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted-foreground/20 rounded w-1/4 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted-foreground/20 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payments Management</h2>
        <p className="text-muted-foreground">View customer payments and transaction history</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>Customer payment transactions and review plan purchases</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {payment.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.profiles?.full_name || 'Unknown User'}</div>
                        <div className="text-sm text-muted-foreground">{payment.profiles?.email || 'No email'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.plan_name}</div>
                        <div className="text-sm text-muted-foreground">${payment.book_price}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${Number(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{getPlanTypeBadge(payment.plan_type)}</TableCell>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Details</DialogTitle>
                            <DialogDescription>
                              Payment #{payment.id.slice(0, 8)}...
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Customer</label>
                              <p className="text-sm">{payment.profiles?.full_name || 'Unknown'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <p className="text-sm">{payment.profiles?.email || 'No email'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Plan Name</label>
                              <p className="text-sm">{payment.plan_name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Plan Type</label>
                              <div className="mt-1">{getPlanTypeBadge(payment.plan_type)}</div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Amount Paid</label>
                              <p className="text-sm font-medium">${Number(payment.amount).toFixed(2)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Status</label>
                              <div className="mt-1">{getStatusBadge(payment.status)}</div>
                            </div>
                            {payment.paypal_payment_id && (
                              <div>
                                <label className="text-sm font-medium">PayPal Payment ID</label>
                                <p className="text-xs font-mono">{payment.paypal_payment_id}</p>
                              </div>
                            )}
                            {payment.paypal_payer_id && (
                              <div>
                                <label className="text-sm font-medium">PayPal Payer ID</label>
                                <p className="text-xs font-mono">{payment.paypal_payer_id}</p>
                              </div>
                            )}
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium">Created</label>
                              <p className="text-sm">{new Date(payment.created_at).toLocaleString()}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium">Last Updated</label>
                              <p className="text-sm">{new Date(payment.updated_at).toLocaleString()}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;