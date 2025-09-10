import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { BulkImageMigration } from './BulkImageMigration';
import { ImageBulkProcessor } from '@/components/ImageBulkProcessor';

export const BulkImageMigrationPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Bulk Image Migration</h1>
          <p className="text-muted-foreground">Convert all external images to optimized local WebP versions</p>
        </div>
        <ImageBulkProcessor />
        <BulkImageMigration />
      </div>
    </AdminLayout>
  );
};