import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { BannerManager } from '@/components/BannerManager';

export const BannerManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Banner Management</h1>
          <p className="text-muted-foreground">Manage site banners following the optimized model gallery pattern</p>
        </div>
        <BannerManager />
      </div>
    </AdminLayout>
  );
};