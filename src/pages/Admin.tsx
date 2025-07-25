import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminBooks from '@/components/admin/AdminBooks';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminReviews from '@/components/admin/AdminReviews';
import AdminCustomers from '@/components/admin/AdminCustomers';
import { AdminReaders } from '@/components/admin/AdminReaders';
import { AdminSurveys } from '@/components/admin/AdminSurveys';
import AdminAffiliates from '@/components/admin/AdminAffiliates';
import AdminContent from '@/components/admin/AdminContent';
import {
  LayoutDashboard,
  ShoppingCart,
  BookOpen,
  Users,
  Settings,
  LogOut,
  UserCheck,
  UsersRound,
  ClipboardList,
  CreditCard,
  TrendingUp,
  FileText
} from 'lucide-react';

const Admin = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your platform, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="grid gap-4">
            {/* Core Operations */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Core Operations</h3>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="dashboard" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="payments" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="books" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Books
                </TabsTrigger>
              </TabsList>
            </div>

            {/* User Management */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">User Management</h3>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="customers" className="gap-2">
                  <UserCheck className="h-4 w-4" />
                  Customers
                </TabsTrigger>
                <TabsTrigger value="readers" className="gap-2">
                  <UsersRound className="h-4 w-4" />
                  Readers
                </TabsTrigger>
                <TabsTrigger value="affiliates" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Affiliates
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content & Services */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Content & Services</h3>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                <TabsTrigger value="content" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="surveys" className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Surveys
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <AdminPayments />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <AdminOrders />
          </TabsContent>

          <TabsContent value="books" className="space-y-6">
            <AdminBooks />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <AdminCustomers />
          </TabsContent>

          <TabsContent value="readers" className="space-y-6">
            <AdminReaders />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <AdminReviews />
          </TabsContent>

          <TabsContent value="surveys" className="space-y-6">
            <AdminSurveys />
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-6">
            <AdminAffiliates />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <AdminContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;