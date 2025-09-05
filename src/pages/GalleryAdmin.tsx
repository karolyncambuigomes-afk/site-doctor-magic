import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { GalleryManager } from '@/components/GalleryManager';

export const GalleryAdmin: React.FC = () => {
  return (
    <>
      <SEO 
        title="Administração de Galeria - Five London"
        description="Painel de administração da galeria de imagens"
        keywords="admin, galeria, administração, imagens"
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container-width">
          <GalleryManager />
        </div>
      </div>
      
      <Footer />
    </>
  );
};