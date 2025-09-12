import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface Permission {
  permission_name: string;
  description: string;
  category: string;
}

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_user_permissions', { user_id: user.id });

        if (error) throw error;
        setPermissions(data || []);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasPermission = (permissionName: string): boolean => {
    return permissions.some(p => p.permission_name === permissionName);
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(name => hasPermission(name));
  };

  const getPermissionsByCategory = (category: string): Permission[] => {
    return permissions.filter(p => p.category === category);
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    getPermissionsByCategory,
  };
};

// Higher-order component for permission-based rendering
export const withPermission = (
  Component: React.ComponentType<any>,
  requiredPermission: string,
  fallback?: React.ComponentType<any>
) => {
  return (props: any) => {
    const { hasPermission } = usePermissions();
    
    if (hasPermission(requiredPermission)) {
      return <Component {...props} />;
    }
    
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent {...props} />;
    }
    
    return null;
  };
};