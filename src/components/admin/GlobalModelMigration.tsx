import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Database, Image, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MigrationStats {
  totalModels: number;
  processedModels: number;
  mainImagesFixed: number;
  galleryImagesFixed: number;
  errors: string[];
}

interface MigrationResult {
  success: boolean;
  stats: MigrationStats;
  message: string;
  error?: string;
}

export const GlobalModelMigration: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const { toast } = useToast();

  const runMigration = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      toast({
        title: "Iniciando Migração",
        description: "Processando todas as modelos para converter imagens para local...",
      });

      const { data, error } = await supabase.functions.invoke('migrate-all-model-images', {
        body: {}
      });

      if (error) {
        throw error;
      }

      setResult(data);

      if (data.success) {
        toast({
          title: "Migração Completa",
          description: data.message,
        });
      } else {
        toast({
          title: "Migração com Erros",
          description: data.message,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Migration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setResult({
        success: false,
        stats: { totalModels: 0, processedModels: 0, mainImagesFixed: 0, galleryImagesFixed: 0, errors: [errorMessage] },
        message: 'Falha na migração',
        error: errorMessage
      });

      toast({
        title: "Erro na Migração",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getProgressPercentage = () => {
    if (!result?.stats) return 0;
    const { totalModels, processedModels } = result.stats;
    return totalModels > 0 ? Math.round((processedModels / totalModels) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Migração Global de Imagens
        </CardTitle>
        <CardDescription>
          Converte todas as imagens das modelos para versões locais otimizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            onClick={runMigration} 
            disabled={isRunning}
            size="lg"
            className="min-w-48"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Iniciar Migração Global
              </>
            )}
          </Button>
        </div>

        {/* Progress and Stats */}
        {result && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Migração</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {result.stats.totalModels}
                </div>
                <div className="text-sm text-muted-foreground">Total Modelos</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {result.stats.processedModels}
                </div>
                <div className="text-sm text-muted-foreground">Processadas</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {result.stats.mainImagesFixed}
                </div>
                <div className="text-sm text-muted-foreground">Imagens Principais</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.stats.galleryImagesFixed}
                </div>
                <div className="text-sm text-muted-foreground">Imagens Galeria</div>
              </div>
            </div>

            {/* Success/Error Status */}
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted">
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">Migração Concluída</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="text-destructive font-medium">
                    Migração com {result.stats.errors.length} Erro(s)
                  </span>
                </>
              )}
              <Badge variant={result.success ? "default" : "destructive"} className="ml-auto">
                {result.success ? "Sucesso" : "Parcial"}
              </Badge>
            </div>

            {/* Message */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{result.message}</p>
            </div>

            {/* Error Details */}
            {result.stats.errors.length > 0 && (
              <details className="p-4 bg-destructive/10 rounded-lg">
                <summary className="cursor-pointer text-destructive font-medium mb-2">
                  Ver Detalhes dos Erros ({result.stats.errors.length})
                </summary>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {result.stats.errors.map((error, index) => (
                    <div key={index} className="text-sm text-muted-foreground bg-background p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Image className="h-4 w-4" />
            Como Funciona
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Converte imagens principais para formato WebP otimizado</li>
            <li>• Processa todas as imagens da galeria externa</li>
            <li>• Define imagem principal automaticamente se ausente</li>
            <li>• Mantém URLs originais como backup</li>
            <li>• Gera relatório detalhado do processo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};