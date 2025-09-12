import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { UserManagement } from '@/components/UserManagement';

export const PermissionsManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">User & Role Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, assign roles, and monitor administrative actions
          </p>
        </div>
        
        <UserManagement />
      </div>
    </AdminLayout>
  );
};