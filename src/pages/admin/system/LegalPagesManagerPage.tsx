import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LegalPagesManager } from '@/components/LegalPagesManager';

export const LegalPagesManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Legal Pages</h1>
          <p className="text-muted-foreground">Manage terms, privacy policy, and legal content</p>
        </div>
        <LegalPagesManager />
      </div>
    </AdminLayout>
  );
};