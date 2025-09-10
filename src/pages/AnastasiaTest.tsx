import React from 'react';
import { useParams } from 'react-router-dom';
import { ModelProfile } from '@/pages/ModelProfile';

export const AnastasiaTestPage: React.FC = () => {
  // Hardcode Anastasia's ID for direct testing
  const anastasiaId = 'd851677c-b1cc-43ac-bb9a-a65f83bf9e5b';
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Teste Direto - Perfil da Anastasia
          </h1>
          <p className="text-muted-foreground">
            ID: {anastasiaId}
          </p>
        </div>
        
        <ModelProfile />
      </div>
    </div>
  );
};