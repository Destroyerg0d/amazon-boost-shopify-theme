import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, Phone, Mail, MessageSquare, Calendar, DollarSign, Edit, Eye, Search, Filter } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type: string | null;
  monthly_revenue: string | null;
  message: string | null;
  is_buyer: boolean;
  lead_source: string;
  status: string;
  created_at: string;
  updated_at: string;
  admin_notes: string | null;
  lifetime_spend?: number;
  user_id?: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSpendRange, setFilterSpendRange] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
    
    // Set up real-time subscriptions
    const customersChannel = supabase
      .channel('customers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, fetchCustomers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchCustomers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'review_plans' }, fetchCustomers)
      .subscribe();

    return () => {
      supabase.removeChannel(customersChannel);
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      // Get all profiles (registered users)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get existing customers from customers table
      const { data: existingCustomers, error: customersError } = await supabase
        .from('customers')
        .select('*');

      if (customersError) throw customersError;

      // Calculate lifetime spend for each user
      const customersWithSpend = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Check if user has review plans
          const { data: plans } = await supabase
            .from('review_plans')
            .select('*')
            .eq('user_id', profile.user_id);

          // Calculate total spend from plans
          const lifetimeSpend = (plans || []).reduce((total, plan) => {
            // Estimate plan cost based on plan type and reviews
            const planCost = getPlanCost(plan.plan_type, plan.total_reviews);
            return total + planCost;
          }, 0);

          // Check if this user exists in customers table
          const existingCustomer = existingCustomers?.find(c => c.email === profile.email);

          if (existingCustomer) {
            // Update existing customer with profile data
            return {
              ...existingCustomer,
              name: profile.full_name || existingCustomer.name,
              phone: profile.phone || existingCustomer.phone,
              lifetime_spend: lifetimeSpend,
              user_id: profile.user_id,
              is_buyer: lifetimeSpend > 0 || existingCustomer.is_buyer
            };
          } else {
            // Create new customer from profile
            return {
              id: profile.id,
              user_id: profile.user_id,
              name: profile.full_name || 'Unknown User',
              email: profile.email || '',
              phone: profile.phone || 'Not provided',
              business_type: null,
              monthly_revenue: null,
              message: null,
              is_buyer: lifetimeSpend > 0,
              lead_source: 'user_registration',
              status: lifetimeSpend > 0 ? 'converted' : 'new',
              created_at: profile.created_at,
              updated_at: profile.updated_at,
              admin_notes: null,
              lifetime_spend: lifetimeSpend
            } as Customer;
          }
        })
      );

      // Add customers who don't have profiles (leads from contact forms)
      const profileEmails = profiles?.map(p => p.email) || [];
      const customersWithoutProfiles = existingCustomers?.filter(c => !profileEmails.includes(c.email)) || [];
      
      const allCustomers = [
        ...customersWithSpend,
        ...customersWithoutProfiles.map(c => ({ ...c, lifetime_spend: 0 }))
      ];

      setCustomers(allCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanCost = (planType: string, totalReviews: number) => {
    // Use actual pricing based on plan names and review counts
    const planCosts: { [key: string]: number } = {
      'starter': 170,
      'bronze': 350, 
      'silver': 700,
      'gold': 1050
    };
    
    // Return the actual plan cost, not per-review calculation
    const normalizedType = planType.toLowerCase();
    return planCosts[normalizedType] || 0;
  };

  const updateCustomer = async (customer: Customer) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          status: customer.status,
          admin_notes: customer.admin_notes,
          is_buyer: customer.is_buyer
        })
        .eq('id', customer.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer updated successfully"
      });

      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'converted': return 'bg-purple-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const statusMatch = filterStatus === 'all' || customer.status === filterStatus;
    const typeMatch = filterType === 'all' || 
      (filterType === 'buyers' && customer.is_buyer) ||
      (filterType === 'leads' && !customer.is_buyer);
    
    const spendMatch = filterSpendRange === 'all' || 
      (filterSpendRange === 'none' && (customer.lifetime_spend || 0) === 0) ||
      (filterSpendRange === 'low' && (customer.lifetime_spend || 0) > 0 && (customer.lifetime_spend || 0) <= 500) ||
      (filterSpendRange === 'medium' && (customer.lifetime_spend || 0) > 500 && (customer.lifetime_spend || 0) <= 2000) ||
      (filterSpendRange === 'high' && (customer.lifetime_spend || 0) > 2000);

    const searchMatch = !searchTerm || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && typeMatch && spendMatch && searchMatch;
  });

  const totalCustomers = customers.length;
  const totalBuyers = customers.filter(c => c.is_buyer).length;
  const totalLeads = customers.filter(c => !c.is_buyer).length;
  const newLeads = customers.filter(c => c.status === 'new').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyers</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalBuyers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{newLeads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>Manage your customer database and track leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buyers">Buyers Only</SelectItem>
                <SelectItem value="leads">Leads Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSpendRange} onValueChange={setFilterSpendRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by spend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Spend Ranges</SelectItem>
                <SelectItem value="none">No Spend ($0)</SelectItem>
                <SelectItem value="low">Low Spend ($1-$500)</SelectItem>
                <SelectItem value="medium">Medium Spend ($501-$2000)</SelectItem>
                <SelectItem value="high">High Spend ($2000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Lifetime Spend</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{customer.business_type || 'N/A'}</div>
                        <div className="text-muted-foreground">{customer.monthly_revenue || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          ${(customer.lifetime_spend || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {customer.lifetime_spend === 0 ? 'No purchases' : 
                           customer.lifetime_spend! <= 500 ? 'Low spender' :
                           customer.lifetime_spend! <= 2000 ? 'Medium spender' : 'High spender'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(customer.status)} text-white`}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.is_buyer ? "default" : "secondary"}>
                        {customer.is_buyer ? 'Buyer' : 'Lead'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                              <DialogDescription>
                                Full customer information and communication history
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Name</Label>
                                    <p className="text-sm">{selectedCustomer.name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm">{selectedCustomer.email}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Phone</Label>
                                    <p className="text-sm">{selectedCustomer.phone}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Business Type</Label>
                                    <p className="text-sm">{selectedCustomer.business_type || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Monthly Revenue</Label>
                                    <p className="text-sm">{selectedCustomer.monthly_revenue || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Lead Source</Label>
                                    <p className="text-sm">{selectedCustomer.lead_source}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Message</Label>
                                  <p className="text-sm p-3 bg-muted rounded-md">
                                    {selectedCustomer.message || 'No message provided'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Admin Notes</Label>
                                  <p className="text-sm p-3 bg-muted rounded-md">
                                    {selectedCustomer.admin_notes || 'No notes added'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCustomer({ ...customer })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Customer</DialogTitle>
                              <DialogDescription>
                                Update customer status and add admin notes
                              </DialogDescription>
                            </DialogHeader>
                            {editingCustomer && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="status">Status</Label>
                                  <Select
                                    value={editingCustomer.status}
                                    onValueChange={(value) =>
                                      setEditingCustomer({ ...editingCustomer, status: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                      <SelectItem value="qualified">Qualified</SelectItem>
                                      <SelectItem value="converted">Converted</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="is_buyer"
                                    checked={editingCustomer.is_buyer}
                                    onChange={(e) =>
                                      setEditingCustomer({ ...editingCustomer, is_buyer: e.target.checked })
                                    }
                                  />
                                  <Label htmlFor="is_buyer">Mark as Buyer</Label>
                                </div>
                                <div>
                                  <Label htmlFor="admin_notes">Admin Notes</Label>
                                  <Textarea
                                    id="admin_notes"
                                    value={editingCustomer.admin_notes || ''}
                                    onChange={(e) =>
                                      setEditingCustomer({ ...editingCustomer, admin_notes: e.target.value })
                                    }
                                    placeholder="Add notes about this customer..."
                                    rows={4}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingCustomer(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={() => updateCustomer(editingCustomer)}>
                                    Save Changes
                                  </Button>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;