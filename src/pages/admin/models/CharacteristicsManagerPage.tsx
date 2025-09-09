import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { CharacteristicsManager } from '@/components/CharacteristicsManager';

export const CharacteristicsManagerPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-luxury-heading">Model Characteristics</h1>
          <p className="text-muted-foreground">Manage model characteristics and preference categories</p>
        </div>
        <CharacteristicsManager />
      </div>
    </AdminLayout>
  );
};