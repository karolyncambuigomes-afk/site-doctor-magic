import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useModels } from '@/hooks/useModels';

export const ModelsDebugPanel: React.FC = () => {
  const { models, loading, error, refetch } = useModels();
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="fixed bottom-16 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-background/90 backdrop-blur"
        >
          🔧 Models Debug
        </Button>
      </div>
    );
  }

  const validModels = models.filter(model => model && model.id && model.name);
  const invalidModels = models.filter(model => !model || !model.id || !model.name);

  return (
    <div className="fixed bottom-16 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            🔧 Models Debug Panel
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Models Status</span>
            <Button size="sm" variant="outline" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {loading && (
            <div className="text-xs text-blue-600">
              🔄 Loading models...
            </div>
          )}

          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              ❌ Error: {error}
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Total Models:</span>
              <Badge variant="default">{models.length}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Valid Models:</span>
              <Badge variant="default" className="bg-green-500">{validModels.length}</Badge>
            </div>
            
            {invalidModels.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Invalid Models:
                </span>
                <Badge variant="destructive">{invalidModels.length}</Badge>
              </div>
            )}
          </div>

          {invalidModels.length > 0 && (
            <div className="border-t pt-2">
              <div className="text-xs font-medium text-red-600 mb-1">Invalid Models:</div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {invalidModels.map((model, index) => (
                  <div key={index} className="text-xs text-red-500 bg-red-50 p-1 rounded">
                    Index {index}: {JSON.stringify(model)?.substring(0, 50)}...
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-2 space-y-1 text-xs">
            <div className="font-medium">Sample Valid Model:</div>
            {validModels[0] && (
              <div className="bg-green-50 p-2 rounded text-green-700">
                <div>ID: {validModels[0].id}</div>
                <div>Name: {validModels[0].name}</div>
                <div>Location: {validModels[0].location || 'N/A'}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};