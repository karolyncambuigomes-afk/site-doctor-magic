import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SiteContentManager } from '@/components/SiteContentManager';

export const SiteContentManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Site Content</h1>
          <p className="text-muted-foreground">Manage general site content, descriptions, and text</p>
        </div>
        <SiteContentManager />
      </div>
    </AdminLayout>
  );
};