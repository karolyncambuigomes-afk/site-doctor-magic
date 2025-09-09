import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { GalleryManager } from '@/components/GalleryManager';

export const GalleryManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Gallery Management</h1>
          <p className="text-muted-foreground">Manage image galleries and carousel content</p>
        </div>
        <GalleryManager />
      </div>
    </AdminLayout>
  );
};