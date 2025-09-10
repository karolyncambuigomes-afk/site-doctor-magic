import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AnastasiaFixManager } from '@/components/admin/AnastasiaFixManager';
import { AnastasiaFixButton } from '@/components/admin/AnastasiaFixButton';
import { ProcessPendingImagesButton } from '@/components/admin/ProcessPendingImagesButton';

export const AnastasiaFixPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Correção de Imagens</h1>
          <p className="text-muted-foreground">
            Ferramentas para processar e corrigir imagens de modelos
          </p>
        </div>
        
        <ProcessPendingImagesButton />
        <AnastasiaFixButton />
        <AnastasiaFixManager />
      </div>
    </AdminLayout>
  );
};