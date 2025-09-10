import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { processAllPendingImages } from '@/utils/processAllPendingImages';
import { toast } from 'sonner';

export const ProcessPendingImagesButton: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleProcess = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      const result = await processAllPendingImages();
      setResult(result);

      if (result.success) {
        toast.success('✅ Processamento concluído com sucesso!');
      } else {
        toast.error('❌ Erro durante o processamento');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('❌ Erro durante o processamento');
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Processar Todas as Imagens Pendentes
        </CardTitle>
        <CardDescription>
          Processa todas as imagens externas que ainda não foram otimizadas para versões locais WebP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Processar Imagens Pendentes
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={result.success ? 'default' : 'destructive'}>
                {result.success ? 'Sucesso' : 'Erro'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {result.message}
              </span>
            </div>

            {result.success && result.summary && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-muted p-3 rounded">
                  <div className="font-medium">Modelos processados</div>
                  <div className="text-2xl font-bold">{result.summary.totalModels}</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="font-medium">Imagens processadas</div>
                  <div className="text-2xl font-bold text-green-600">{result.summary.totalProcessed}</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="font-medium">Já existentes</div>
                  <div className="text-2xl font-bold text-blue-600">{result.summary.totalSkipped}</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="font-medium">Erros</div>
                  <div className="text-2xl font-bold text-red-600">{result.summary.totalErrors}</div>
                </div>
              </div>
            )}

            {result.results && result.results.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="font-medium">Detalhes por modelo:</div>
                {result.results.map((modelResult: any) => (
                  <div key={modelResult.modelId} className="border rounded p-2 text-sm">
                    <div className="font-medium">{modelResult.modelName}</div>
                    <div className="text-muted-foreground">
                      {modelResult.totalExternal} externas → {modelResult.totalLocal} locais
                    </div>
                    {modelResult.galleryResults.filter((r: any) => !r.success).length > 0 && (
                      <div className="text-red-600 text-xs mt-1">
                        {modelResult.galleryResults.filter((r: any) => !r.success).length} erros
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result.error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                <div className="font-medium">Erro:</div>
                <div>{result.error}</div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Verifica todos os modelos com imagens externas</div>
          <div>• Processa imagens principais sem versão local</div>
          <div>• Otimiza imagens da galeria para WebP</div>
          <div>• Atualiza automaticamente os arrays de URLs locais</div>
          <div>• Não reprocessa imagens que já existem</div>
        </div>
      </CardContent>
    </Card>
  );
};