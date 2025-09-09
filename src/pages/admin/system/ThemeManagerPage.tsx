import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ThemeManager } from '@/components/ThemeManager';

export const ThemeManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Theme Settings</h1>
          <p className="text-muted-foreground">Customize visual appearance and brand settings</p>
        </div>
        <ThemeManager />
      </div>
    </AdminLayout>
  );
};