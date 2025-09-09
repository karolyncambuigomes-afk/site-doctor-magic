import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ZoomIn, ZoomOut, RotateCw, Move, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageEditorProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImageBlob: Blob) => void;
  aspectRatio?: number; // width/height ratio, default 1 for square
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  isOpen,
  onClose,
  onSave,
  aspectRatio = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState([1]);
  const [rotation, setRotation] = useState([0]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const CANVAS_SIZE = 400;
  const canvasWidth = CANVAS_SIZE;
  const canvasHeight = CANVAS_SIZE / aspectRatio;

  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#f8f9fa',
    });

    // Load the image
    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      // Calculate initial scale to fit the image in canvas
      const imgAspectRatio = img.width! / img.height!;
      const canvasAspectRatio = canvasWidth / canvasHeight;
      
      let scale;
      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider, fit by height
        scale = canvasHeight / img.height!;
      } else {
        // Image is taller, fit by width
        scale = canvasWidth / img.width!;
      }

      img.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    }).catch((error) => {
      console.error('Error loading image:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a imagem",
        variant: "destructive"
      });
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [imageUrl, isOpen, canvasWidth, canvasHeight]);

  const handleZoomChange = (value: number[]) => {
    setZoom(value);
    if (fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        const scale = value[0];
        activeObject.set({
          scaleX: scale,
          scaleY: scale
        });
        fabricCanvas.renderAll();
      }
    }
  };

  const handleRotationChange = (value: number[]) => {
    setRotation(value);
    if (fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        activeObject.set({ angle: value[0] });
        fabricCanvas.renderAll();
      }
    }
  };

  const handleSave = async () => {
    if (!fabricCanvas) return;
    
    setIsLoading(true);
    try {
      // Export canvas as blob
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.9,
        multiplier: 2 // Higher resolution
      });
      
      // Convert dataURL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();
      
      onSave(blob);
      toast({
        title: "Sucesso",
        description: "Imagem ajustada com sucesso"
      });
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a imagem",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetTransform = () => {
    if (fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        activeObject.set({
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          scaleX: 1,
          scaleY: 1,
          angle: 0
        });
        fabricCanvas.renderAll();
        setZoom([1]);
        setRotation([0]);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Move className="w-5 h-5" />
            Ajustar Imagem
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <canvas 
                    ref={canvasRef}
                    className="border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Zoom */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ZoomOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Zoom</span>
                    <ZoomIn className="w-4 h-4" />
                  </div>
                  <Slider
                    value={zoom}
                    onValueChange={handleZoomChange}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {Math.round(zoom[0] * 100)}%
                  </div>
                </div>

                {/* Rotation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RotateCw className="w-4 h-4" />
                    <span className="text-sm font-medium">Rotação</span>
                  </div>
                  <Slider
                    value={rotation}
                    onValueChange={handleRotationChange}
                    min={-180}
                    max={180}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {rotation[0]}°
                  </div>
                </div>

                {/* Reset */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetTransform}
                  className="w-full"
                >
                  Resetar
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>💡 <strong>Dicas:</strong></p>
                  <p>• Arraste para mover a imagem</p>
                  <p>• Use os controles para zoom e rotação</p>
                  <p>• A área visível será salva</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Ajustes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};