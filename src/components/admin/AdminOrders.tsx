import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Calendar,
  DollarSign,
  User,
  Package
} from 'lucide-react';

interface Order {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  manuscript_url: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  expected_delivery_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  services?: {
    name: string;
    category: string;
  } | null;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription
    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          services (name, category)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as any) || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, adminNotes?: string, expectedDeliveryDate?: string) => {
    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (adminNotes) updateData.admin_notes = adminNotes;
      if (expectedDeliveryDate) updateData.expected_delivery_date = expectedDeliveryDate;
      if (newStatus === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });

      fetchOrders();
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      in_progress: { variant: 'default' as const, label: 'In Progress' },
      completed: { variant: 'success' as const, label: 'Completed' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      paid: { variant: 'success' as const, label: 'Paid' },
      failed: { variant: 'destructive' as const, label: 'Failed' },
      refunded: { variant: 'outline' as const, label: 'Refunded' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.services?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

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
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <p className="text-muted-foreground">Manage customer orders and delivery status</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
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
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">Customer</div>
                        <div className="text-sm text-muted-foreground font-mono">{order.user_id.slice(0, 8)}...</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.services?.name}</div>
                        <div className="text-sm text-muted-foreground">{order.services?.category}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${Number(order.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.payment_status || 'pending')}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                              <DialogDescription>
                                Order #{order.id.slice(0, 8)}...
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Customer ID</Label>
                                <p className="text-sm font-mono">{order.user_id}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Service</Label>
                                <p className="text-sm">{order.services?.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Amount</Label>
                                <p className="text-sm">${Number(order.total_amount).toFixed(2)}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <div className="mt-1">{getStatusBadge(order.status)}</div>
                              </div>
                              {order.customer_notes && (
                                <div className="md:col-span-2">
                                  <Label className="text-sm font-medium">Customer Notes</Label>
                                  <p className="text-sm mt-1">{order.customer_notes}</p>
                                </div>
                              )}
                              {order.admin_notes && (
                                <div className="md:col-span-2">
                                  <Label className="text-sm font-medium">Admin Notes</Label>
                                  <p className="text-sm mt-1">{order.admin_notes}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {order.manuscript_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={order.manuscript_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Order Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order</DialogTitle>
            <DialogDescription>
              Update order status and add admin notes
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <OrderEditForm
              order={selectedOrder}
              onUpdate={updateOrderStatus}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedOrder(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface OrderEditFormProps {
  order: Order;
  onUpdate: (orderId: string, status: string, adminNotes?: string, expectedDeliveryDate?: string) => void;
  onCancel: () => void;
}

const OrderEditForm = ({ order, onUpdate, onCancel }: OrderEditFormProps) => {
  const [status, setStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    order.expected_delivery_date ? new Date(order.expected_delivery_date).toISOString().split('T')[0] : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(order.id, status, adminNotes, expectedDeliveryDate);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="status">Order Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
        <Input
          type="date"
          value={expectedDeliveryDate}
          onChange={(e) => setExpectedDeliveryDate(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="adminNotes">Admin Notes</Label>
        <Textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Add notes about this order..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Order</Button>
      </div>
    </form>
  );
};

export default AdminOrders;