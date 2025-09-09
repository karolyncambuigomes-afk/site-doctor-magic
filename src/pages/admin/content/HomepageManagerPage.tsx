import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomepageManager } from '@/components/HomepageManager';

export const HomepageManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Homepage Management</h1>
          <p className="text-muted-foreground">Manage homepage content, carousels, and featured sections</p>
        </div>
        <HomepageManager />
      </div>
    </AdminLayout>
  );
};