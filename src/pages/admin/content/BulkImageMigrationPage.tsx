import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { BulkImageMigration } from './BulkImageMigration';
import { ImageBulkProcessor } from '@/components/ImageBulkProcessor';
<<<<<<< HEAD

=======
import { MigrationExecutor } from '@/components/MigrationExecutor';
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)

export const BulkImageMigrationPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Bulk Image Migration</h1>
          <p className="text-muted-foreground">Convert all external images to optimized local WebP versions</p>
        </div>
<<<<<<< HEAD
        
=======
        <MigrationExecutor />
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)
        <ImageBulkProcessor />
        <BulkImageMigration />
      </div>
    </AdminLayout>
  );
};