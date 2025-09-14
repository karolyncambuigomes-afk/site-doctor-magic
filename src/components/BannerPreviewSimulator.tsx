import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, RotateCcw } from 'lucide-react';

interface BannerPreviewSimulatorProps {
  desktopImage?: string;
  mobileImage?: string;
  fallbackImage?: string;
  title?: string;
  subtitle?: string;
}

export const BannerPreviewSimulator: React.FC<BannerPreviewSimulatorProps> = ({
  desktopImage,
  mobileImage,
  fallbackImage,
  title = "Premium London Escort Agency",
  subtitle = "Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea"
}) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const getImageForPreview = () => {
    if (previewMode === 'mobile') {
      return mobileImage || fallbackImage || '/lovable-uploads/4b8ba540-676f-4e57-9771-9e3a6638f837.png';
    } else {
      return desktopImage || fallbackImage || '/lovable-uploads/4b8ba540-676f-4e57-9771-9e3a6638f837.png';
    }
  };

  const getImageSource = () => {
    if (previewMode === 'mobile') {
      return mobileImage ? 'Mobile específica' : 
             fallbackImage ? 'Fallback' : 'Padrão';
    } else {
      return desktopImage ? 'Desktop específica' : 
             fallbackImage ? 'Fallback' : 'Padrão';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Simulador de Visualização
        </CardTitle>
        <CardDescription>
          Veja como os banners aparecerão em diferentes dispositivos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </Button>
        </div>

        {/* Preview Container */}
        <div className={`relative rounded-lg overflow-hidden border-2 ${
          previewMode === 'mobile' ? 'border-green-300 max-w-sm mx-auto' : 'border-blue-300'
        }`}>
          {/* Device Label */}
          <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-semibold ${
            previewMode === 'mobile' 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            {previewMode === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'}
          </div>

          {/* Image Source Label */}
          <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs bg-black/50 text-white">
            {getImageSource()}
          </div>

          {/* Preview Image */}
          <div className={`relative ${
            previewMode === 'mobile' ? 'aspect-[9/16] max-h-80' : 'aspect-[16/9] max-h-40'
          }`}>
            <img 
              src={getImageForPreview()}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Erro ao carregar preview:', getImageForPreview());
                e.currentTarget.src = '/lovable-uploads/4b8ba540-676f-4e57-9771-9e3a6638f837.png';
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-end justify-center p-4">
              <div className="text-center text-white">
                <h3 className={`font-light mb-2 ${
                  previewMode === 'mobile' ? 'text-lg' : 'text-2xl'
                }`}>
                  {title}
                </h3>
                <p className={`text-white/90 ${
                  previewMode === 'mobile' ? 'text-sm' : 'text-base'
                }`}>
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="text-xs space-y-1 p-3 bg-gray-50 rounded border">
          <div className="font-semibold mb-2">Informações do Preview:</div>
          <div><strong>Modo:</strong> {previewMode === 'mobile' ? 'Mobile 📱' : 'Desktop 🖥️'}</div>
          <div><strong>Imagem usada:</strong> {getImageForPreview()}</div>
          <div><strong>Origem:</strong> {getImageSource()}</div>
          <div className="mt-2 pt-2 border-t">
            <div className="text-gray-600">
              {previewMode === 'mobile' 
                ? 'Este é como o banner aparecerá em dispositivos móveis (max-width: 767px)'
                : 'Este é como o banner aparecerá em desktops (min-width: 1024px)'
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};