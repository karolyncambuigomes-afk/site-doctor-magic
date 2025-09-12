import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback,
  showFallback = true
}) => {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showFallback) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">Access Denied</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You don't have permission to access this feature.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};