import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ModelApplicationManager } from '@/components/ModelApplicationManager';

export const ApplicationsManager: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Model Applications</h1>
          <p className="text-muted-foreground">Review and manage model applications</p>
        </div>
        <ModelApplicationManager />
      </div>
    </AdminLayout>
  );
};