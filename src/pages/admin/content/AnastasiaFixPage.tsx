import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AnastasiaFixManager } from '@/components/admin/AnastasiaFixManager';

export const AnastasiaFixPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Corrigir Fotos da Anastasia</h1>
          <p className="text-muted-foreground">
            Ferramentas para corrigir as fotos principais e de galeria da Anastasia
          </p>
        </div>
        
        <AnastasiaFixManager />
      </div>
    </AdminLayout>
  );
};