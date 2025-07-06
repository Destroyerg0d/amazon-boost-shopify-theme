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
import { Users, Phone, Mail, MessageSquare, Calendar, DollarSign, Edit, Eye } from 'lucide-react';

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
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
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
    return statusMatch && typeMatch;
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
          <div className="flex gap-4 mb-6">
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
          </div>

          {/* Customer Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Business</TableHead>
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