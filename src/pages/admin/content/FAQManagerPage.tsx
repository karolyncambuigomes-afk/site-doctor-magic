import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { FAQManager } from '@/components/FAQManager';

export const FAQManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">FAQ Management</h1>
          <p className="text-muted-foreground">Manage frequently asked questions and answers</p>
        </div>
        <FAQManager />
      </div>
    </AdminLayout>
  );
};