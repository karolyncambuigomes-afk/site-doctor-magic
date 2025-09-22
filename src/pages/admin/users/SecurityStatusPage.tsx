import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { SecurityStatusManager } from '@/components/admin/SecurityStatusManager';

export const SecurityStatusPage: React.FC = () => {
  return (
    <AdminLayout>
      <SEO 
        title="Security Status - Admin Panel"
        description="Monitor and manage security status and compliance"
      />
      <SecurityStatusManager />
    </AdminLayout>
  );
};