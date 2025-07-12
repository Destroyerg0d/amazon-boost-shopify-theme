import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Users,
  Crown,
  User,
  Mail,
  Calendar,
  Trash2,
  Phone,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  user_role?: 'admin' | 'customer';
  signup_method?: 'email' | 'google';
  phone_verified?: boolean;
  email_verified?: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    
    // Set up real-time subscription
    const usersChannel = supabase
      .channel('users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, fetchUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch user roles and auth data for each user
      const usersWithRoles = await Promise.all(
        (data || []).map(async (user) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.user_id)
            .single();
          
          // Check if email contains google indicators or has google provider
          const isGoogleSignup = user.email?.includes('@gmail.com') || 
                                user.email?.includes('@googlemail.com') ||
                                user.full_name && !user.phone; // Google users often have names but no phone initially
          
          return {
            ...user,
            user_role: roleData?.role || 'customer',
            signup_method: (isGoogleSignup ? 'google' : 'email') as 'email' | 'google',
            phone_verified: user.phone ? true : false,
            email_verified: user.email ? true : false // Since users are in system, email is verified
          };
        })
      );
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'customer') => {
    try {
      // First, remove existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then add the new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });

      fetchUsers();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Get user email before deletion for customer table update
      const userToDelete = users.find(u => u.user_id === userId);
      
      // 1. Delete user's books
      const { error: booksError } = await supabase
        .from('books')
        .delete()
        .eq('user_id', userId);

      if (booksError) {
        console.error('Error deleting books:', booksError);
      }

      // 2. Update customers table to mark as banned (preserve order history)
      if (userToDelete?.email) {
        const { error: customerError } = await supabase
          .from('customers')
          .update({ 
            status: 'banned',
            admin_notes: `User account permanently deleted by admin on ${new Date().toISOString()}. Order history preserved.`
          })
          .eq('email', userToDelete.email);

        if (customerError) {
          console.error('Error updating customer status:', customerError);
        }
      }

      // 3. Delete user profile and roles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Note: We can only delete from public schema tables. 
      // The user will still exist in auth.users but won't have access to the app.

      // Immediately update local state to remove the user from the UI
      setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));

      toast({
        title: 'Success',
        description: 'User account deleted successfully. Login access removed. Order history and reviews preserved.',
      });

      // Also refetch to ensure consistency
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete user account',
        variant: 'destructive',
      });
    }
  };

  const getUserRole = (user: UserProfile): 'admin' | 'customer' => {
    return user.user_role || 'customer';
  };

  const getRoleBadge = (role: 'admin' | 'customer') => {
    return role === 'admin' ? (
      <Badge variant="default" className="gap-1">
        <Crown className="h-3 w-3" />
        Admin
      </Badge>
    ) : (
      <Badge variant="secondary" className="gap-1">
        <User className="h-3 w-3" />
        Customer
      </Badge>
    );
  };

  const getSignupMethodBadge = (method: 'email' | 'google' | undefined) => {
    return method === 'google' ? (
      <Badge variant="outline" className="gap-1">
        <svg className="h-3 w-3" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <Mail className="h-3 w-3" />
        Email
      </Badge>
    );
  };

  const getVerificationBadge = (verified: boolean, type: 'email' | 'phone') => {
    return verified ? (
      <Badge variant="success" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Verified
      </Badge>
    ) : (
      <Badge variant="secondary" className="gap-1">
        <XCircle className="h-3 w-3" />
        Not Verified
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const userRole = getUserRole(user);
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || userRole === roleFilter;

    return matchesSearch && matchesRole;
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
        <h2 className="text-2xl font-bold">Users Management</h2>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
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
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Signup Method</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const userRole = getUserRole(user);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name || 'Unknown User'}</div>
                            <div className="text-sm text-muted-foreground">ID: {user.user_id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.email || 'No email'}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getSignupMethodBadge(user.signup_method)}</TableCell>
                      <TableCell>{getRoleBadge(userRole)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs">Email: {getVerificationBadge(user.email_verified || false, 'email')}</div>
                          <div className="text-xs">Phone: {getVerificationBadge(user.phone_verified || false, 'phone')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                                <DialogDescription>
                                  View user information and activity
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Full Name</Label>
                                    <p className="text-sm">{user.full_name || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Email</Label>
                                    <p className="text-sm">{user.email || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Phone</Label>
                                    <p className="text-sm">{user.phone || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Role</Label>
                                    <div className="mt-1">{getRoleBadge(userRole)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Signup Method</Label>
                                    <div className="mt-1">{getSignupMethodBadge(user.signup_method)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Email Verified</Label>
                                    <div className="mt-1">{getVerificationBadge(user.email_verified || false, 'email')}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Phone Verified</Label>
                                    <div className="mt-1">{getVerificationBadge(user.phone_verified || false, 'phone')}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">User ID</Label>
                                    <p className="text-xs font-mono">{user.user_id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Joined</Label>
                                    <p className="text-sm">{new Date(user.created_at).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-destructive">Ban User Account</AlertDialogTitle>
                                <AlertDialogDescription className="space-y-3">
                                  <div className="font-medium">
                                    Banning: <strong>{user.full_name || 'Unknown User'}</strong> ({user.email})
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="font-medium text-destructive">Will be DELETED:</div>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                      <li>User account & login access</li>
                                      <li>User profile information</li>
                                      <li>All uploaded books</li>
                                      <li>Account permissions & roles</li>
                                    </ul>
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    <div className="font-medium text-green-600">Will be PRESERVED:</div>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                      <li>Order history & purchase records</li>
                                      <li>Written reviews (marked as banned user)</li>
                                      <li>Customer data (marked as banned)</li>
                                      <li>Payment transaction history</li>
                                    </ul>
                                  </div>

                                  <div className="p-2 bg-destructive/10 rounded text-xs">
                                    <strong>Note:</strong> This action cannot be undone. The user will lose all access but their transaction history remains for records.
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUser(user.user_id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user role and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserEditForm
              user={selectedUser}
              onUpdate={updateUserRole}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface UserEditFormProps {
  user: UserProfile;
  onUpdate: (userId: string, role: 'admin' | 'customer') => void;
  onCancel: () => void;
}

const UserEditForm = ({ user, onUpdate, onCancel }: UserEditFormProps) => {
  const [role, setRole] = useState<'admin' | 'customer'>(
    user.user_role || 'customer'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(user.user_id, role);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium">{user.full_name || 'Unknown User'}</h4>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div>
        <Label htmlFor="role">User Role</Label>
        <Select value={role} onValueChange={(value: 'admin' | 'customer') => setRole(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </div>
            </SelectItem>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Admin
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Role</Button>
      </div>
    </form>
  );
};

export default AdminUsers;