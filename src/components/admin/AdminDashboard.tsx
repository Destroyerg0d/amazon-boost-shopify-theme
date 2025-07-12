import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  BookOpen,
  ShoppingCart,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  totalOrders: number;
  totalReviews: number;
  pendingOrders: number;
  completedOrders: number;
  pendingBooks: number;
  approvedBooks: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    totalReviews: 0,
    pendingOrders: 0,
    completedOrders: 0,
    pendingBooks: 0,
    approvedBooks: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all stats in parallel - using payments table for better data accuracy
      const [
        usersCount,
        booksCount,
        paymentsCount,
        reviewsCount,
        pendingPaymentsCount,
        completedPaymentsCount,
        pendingBooksCount,
        approvedBooksCount,
        revenueData,
        monthlyRevenueData,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('books').select('*', { count: 'exact', head: true }).eq('approval_status', 'under_review'),
        supabase.from('books').select('*', { count: 'exact', head: true }).eq('approval_status', 'approved'),
        supabase.from('payments').select('amount').eq('status', 'completed'),
        supabase.from('payments').select('amount').eq('status', 'completed').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ]);

      const totalRevenue = revenueData.data?.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;
      const monthlyRevenue = monthlyRevenueData.data?.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0) || 0;

      setStats({
        totalUsers: usersCount.count || 0,
        totalBooks: booksCount.count || 0,
        totalOrders: paymentsCount.count || 0,
        totalReviews: reviewsCount.count || 0,
        pendingOrders: pendingPaymentsCount.count || 0,
        completedOrders: completedPaymentsCount.count || 0,
        pendingBooks: pendingBooksCount.count || 0,
        approvedBooks: approvedBooksCount.count || 0,
        totalRevenue,
        monthlyRevenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered authors',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      description: `${stats.pendingBooks} pending approval`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Payments',
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: `${stats.pendingOrders} pending`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: Star,
      description: 'Reviews delivered',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: 'This month',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      description: 'All time',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                <div className="h-8 bg-muted-foreground/20 rounded w-1/3"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground">Platform statistics and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Payment Status Overview
            </CardTitle>
            <CardDescription>Current payment distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending Payments</span>
                <Badge variant="secondary">{stats.pendingOrders}</Badge>
              </div>
              <Progress value={stats.totalOrders > 0 ? (stats.pendingOrders / stats.totalOrders) * 100 : 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed Payments</span>
                <Badge variant="default">{stats.completedOrders}</Badge>
              </div>
              <Progress value={stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Book Approval Status
            </CardTitle>
            <CardDescription>Book review status distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending Approval</span>
                <Badge variant="warning">{stats.pendingBooks}</Badge>
              </div>
              <Progress value={(stats.pendingBooks / stats.totalBooks) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Approved Books</span>
                <Badge variant="success">{stats.approvedBooks}</Badge>
              </div>
              <Progress value={(stats.approvedBooks / stats.totalBooks) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;