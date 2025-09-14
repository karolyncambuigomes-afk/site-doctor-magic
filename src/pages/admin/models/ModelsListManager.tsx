import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ModelsManagerContent } from './ModelsManager';

export const ModelsListManager: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Models Management</h1>
          <p className="text-muted-foreground">Manage model profiles, pricing, and availability</p>
        </div>
        <ModelsManagerContent />
      </div>
    </AdminLayout>
  );
};