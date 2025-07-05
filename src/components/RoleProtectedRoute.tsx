import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'customer';
}

export const RoleProtectedRoute = ({ children, requiredRole }: RoleProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hasRole, setHasRole] = useState<boolean>(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
      return;
    }

    if (user) {
      checkUserRole();
    }
  }, [user, loading, navigate]);

  const checkUserRole = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: requiredRole
      });

      if (error) {
        console.error('Error checking user role:', error);
        navigate('/', { replace: true });
        return;
      }

      setHasRole(data || false);
      
      if (!data) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/', { replace: true });
    } finally {
      setRoleLoading(false);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !hasRole) {
    return null;
  }

  return <>{children}</>;
};