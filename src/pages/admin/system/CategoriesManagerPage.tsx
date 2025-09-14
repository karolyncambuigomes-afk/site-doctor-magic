import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PreferenceCategoriesManager } from '@/components/PreferenceCategoriesManager';

export const CategoriesManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Categories Management</h1>
          <p className="text-muted-foreground">Manage preference categories and classifications</p>
        </div>
        <PreferenceCategoriesManager />
      </div>
    </AdminLayout>
  );
};