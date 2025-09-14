import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ServicesManager } from '@/components/ServicesManager';

export const ServicesManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Services Management</h1>
          <p className="text-muted-foreground">Manage service offerings and descriptions</p>
        </div>
        <ServicesManager />
      </div>
    </AdminLayout>
  );
};