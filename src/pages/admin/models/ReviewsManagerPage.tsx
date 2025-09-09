import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ReviewsManager } from './ReviewsManager';

export const ReviewsManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Model Reviews</h1>
          <p className="text-muted-foreground">Manage customer reviews and ratings</p>
        </div>
        <ReviewsManager />
      </div>
    </AdminLayout>
  );
};