import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Eye, EyeOff, ArrowUpDown, GripVertical } from 'lucide-react';

export const GallerySystemInfo: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Star className="h-5 w-5" />
          Sistema Avançado de Galeria - Restaurado!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-blue-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Ordenação de Fotos
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Drag & drop para reordenar</li>
              <li>• Botões ↑↓ para ajustes</li>
              <li>• Primeira foto = Foto principal</li>
              <li>• Ordem automática mantida</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Controle de Visibilidade
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Toggle por foto individual</li>
              <li>• <Badge variant="secondary" className="text-xs">Public</Badge> = Todos veem</li>
              <li>• <Badge variant="destructive" className="text-xs">Members Only</Badge> = Só membros</li>
              <li>• Sync automático com sistema</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white/50 rounded-lg p-3 text-sm">
          <strong>✅ Sistema Migrado:</strong> Todas as fotos existentes foram migradas automaticamente 
          para o novo sistema estruturado com ordem e visibilidade configuráveis.
        </div>
      </CardContent>
    </Card>
  );
};