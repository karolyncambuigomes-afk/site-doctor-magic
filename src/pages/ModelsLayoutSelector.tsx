import React, { useState } from 'react';
import { ModelsGallery } from '@/components/ModelsGalleryLayouts';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type LayoutStyle = 'minimal' | 'elegant' | 'modern';

export const ModelsLayoutSelector: React.FC = () => {
  const [selectedLayout, setSelectedLayout] = useState<LayoutStyle>('minimal');
  const [showPreview, setShowPreview] = useState(false);

  const layouts = [
    {
      id: 'minimal' as LayoutStyle,
      name: 'Galeria Minimalista',
      description: 'Inspirado na estética Five London - fundo preto, tipografia elegante, hover effects suaves',
      features: ['Fundo preto elegante', 'Tipografia clean', 'Hover effects suaves', 'Foco nas imagens'],
      preview: 'Estilo sofisticado e minimalista'
    },
    {
      id: 'elegant' as LayoutStyle,
      name: 'Cards Elegantes',
      description: 'Cards com gradientes sutis, informações overlay, badges de status',
      features: ['Gradientes sutis', 'Info overlay', 'Badges de status', 'Ratings visíveis'],
      preview: 'Estilo elegante com mais informações'
    },
    {
      id: 'modern' as LayoutStyle,
      name: 'Grid Moderno',
      description: 'Layout moderno com cards flutuantes, bordas arredondadas, micro-interações',
      features: ['Cards flutuantes', 'Bordas arredondadas', 'Micro-interações', 'Design contemporâneo'],
      preview: 'Estilo moderno e interativo'
    }
  ];

  if (showPreview) {
    return (
      <>
        <SEO 
          title="Luxury Escort Models in London - Five London"
          description="Browse our exclusive collection of sophisticated escort models in London."
          keywords="luxury escorts London, elite companions, sophisticated models"
        />
        
        {/* Layout Switcher */}
        <div className="fixed top-20 right-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
          <div className="space-y-2">
            <p className="text-sm font-medium">Layout Style:</p>
            <div className="flex flex-col gap-1">
              {layouts.map((layout) => (
                <Button
                  key={layout.id}
                  variant={selectedLayout === layout.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedLayout(layout.id)}
                  className="justify-start text-xs"
                >
                  {layout.name}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPreview(false)}
              className="w-full mt-2"
            >
              Voltar às Opções
            </Button>
          </div>
        </div>
        
        <ModelsGallery layoutStyle={selectedLayout} />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Choose Layout Style - Models Gallery"
        description="Select your preferred layout style for the models gallery"
        keywords="layout options, gallery styles"
      />
      
      <div className="min-h-screen bg-background">
        <div className="section-padding pt-32">
          <div className="container-width">
            <div className="text-center mb-12">
              <h1 className="heading-xl mb-4">
                Escolha o Estilo da Galeria
              </h1>
              <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
                Selecione qual estética você prefere para a página de modelos. 
                Cada opção mantém toda a funcionalidade, apenas muda o visual.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {layouts.map((layout) => (
                <Card 
                  key={layout.id} 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedLayout === layout.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedLayout(layout.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="heading-md">{layout.name}</CardTitle>
                      {selectedLayout === layout.id && (
                        <Badge variant="default">Selecionado</Badge>
                      )}
                    </div>
                    <CardDescription className="body-sm">
                      {layout.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Características:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {layout.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground italic">
                          {layout.preview}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => setShowPreview(true)}
                className="minimal-button"
              >
                Ver Preview do Layout Selecionado
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Você poderá alternar entre os estilos no preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};