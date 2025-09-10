import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RestoreResult {
  phase: string;
  success: boolean;
  details: string;
  count?: number;
}

export const ImageRestoreManager = () => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<RestoreResult[]>([]);

  const executeCompleteRestore = async () => {
    setIsRestoring(true);
    setProgress(0);
    setResults([]);

    const phaseResults: RestoreResult[] = [];

    try {
      // Phase 1: Generate missing local images
      setProgress(10);
      toast.info('🔄 Fase 1: Gerando imagens locais...');
      
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          throw new Error('Not authenticated');
        }

        const response = await supabase.functions.invoke('generate-canonical-images', {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        const result = response.data;
        phaseResults.push({
          phase: 'Geração de Imagens',
          success: true,
          details: `${result.summary.successful}/${result.summary.total} imagens geradas`,
          count: result.summary.successful
        });

        toast.success(`✅ Geradas ${result.summary.successful} imagens`);
      } catch (error) {
        phaseResults.push({
          phase: 'Geração de Imagens',
          success: false,
          details: `Erro: ${error.message}`
        });
        toast.error(`❌ Falha na geração: ${error.message}`);
      }

      // Phase 2: Create placeholder images if needed
      setProgress(30);
      toast.info('🖼️ Fase 2: Criando placeholders...');
      
      try {
        // Create a simple placeholder image using canvas
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, 400, 600);
          gradient.addColorStop(0, '#f3f4f6');
          gradient.addColorStop(1, '#e5e7eb');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 400, 600);
          
          // Add text
          ctx.fillStyle = '#6b7280';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Imagem não disponível', 200, 280);
          ctx.font = '16px sans-serif';
          ctx.fillText('Placeholder', 200, 320);
          
          // Convert to blob and upload as placeholder
          canvas.toBlob(async (blob) => {
            if (blob) {
              const { error } = await supabase.storage
                .from('model-images')
                .upload('placeholders/model.jpg', blob, {
                  contentType: 'image/jpeg',
                  upsert: true
                });
              
              if (!error) {
                toast.success('✅ Placeholder criado');
              }
            }
          }, 'image/jpeg', 0.8);
        }

        phaseResults.push({
          phase: 'Criação de Placeholders',
          success: true,
          details: 'Placeholder padrão criado'
        });
      } catch (error) {
        phaseResults.push({
          phase: 'Criação de Placeholders',
          success: false,
          details: `Erro: ${error.message}`
        });
      }

      // Phase 3: Fix database inconsistencies
      setProgress(50);
      toast.info('📊 Fase 3: Corrigindo banco de dados...');
      
      try {
        // Update models with missing local URLs
        const { data: models, error: modelsError } = await supabase
          .from('models')
          .select('id, name, image')
          .is('image_url_local_main', null)
          .not('image', 'is', null);

        if (!modelsError && models) {
          for (const model of models) {
            const localUrl = `/images/models/${model.id}/model-${model.id}-main-1200.webp`;
            await supabase
              .from('models')
              .update({ image_url_local_main: localUrl })
              .eq('id', model.id);
          }
          
          phaseResults.push({
            phase: 'Correção do Banco',
            success: true,
            details: `${models.length} modelos atualizados`,
            count: models.length
          });
        }
      } catch (error) {
        phaseResults.push({
          phase: 'Correção do Banco',
          success: false,
          details: `Erro: ${error.message}`
        });
      }

      // Phase 4: Activate local preference
      setProgress(70);
      toast.info('⚙️ Fase 4: Ativando preferência local...');
      
      try {
        const flags = { preferLocalImages: true };
        localStorage.setItem('featureFlags', JSON.stringify(flags));
        localStorage.setItem('imagePreferences', JSON.stringify({ preferLocal: true }));
        
        // Dispatch event to notify components
        window.dispatchEvent(new CustomEvent('imagePreferenceChanged', { 
          detail: { preferLocalImages: true } 
        }));

        phaseResults.push({
          phase: 'Ativação de Preferência',
          success: true,
          details: 'Preferência local ativada'
        });

        toast.success('✅ Preferência local ativada');
      } catch (error) {
        phaseResults.push({
          phase: 'Ativação de Preferência',
          success: false,
          details: `Erro: ${error.message}`
        });
      }

      // Phase 5: Clear caches and force reload
      setProgress(90);
      toast.info('🗑️ Fase 5: Limpando cache...');
      
      try {
        // Clear service worker cache
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        }

        // Clear image-related localStorage
        localStorage.removeItem('cachedImages');
        localStorage.removeItem('imageCache');

        // Force reload all images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          const src = img.src;
          img.src = '';
          setTimeout(() => {
            img.src = src + (src.includes('?') ? '&' : '?') + 'restore=' + Date.now();
          }, 100);
        });

        phaseResults.push({
          phase: 'Limpeza de Cache',
          success: true,
          details: `${images.length} imagens recarregadas`
        });

        toast.success('✅ Cache limpo e imagens recarregadas');
      } catch (error) {
        phaseResults.push({
          phase: 'Limpeza de Cache',
          success: false,
          details: `Erro: ${error.message}`
        });
      }

      setProgress(100);
      setResults(phaseResults);
      
      const successfulPhases = phaseResults.filter(r => r.success).length;
      toast.success(`🎉 Restauração completa! ${successfulPhases}/${phaseResults.length} fases concluídas`);

    } catch (error) {
      console.error('Restore failed:', error);
      toast.error(`❌ Falha na restauração: ${error.message}`);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Restauração Completa de Imagens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Este processo irá:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Gerar todas as imagens locais em falta</li>
            <li>Criar placeholders para fallback</li>
            <li>Corrigir inconsistências no banco de dados</li>
            <li>Ativar preferência local</li>
            <li>Limpar cache e forçar reload</li>
          </ul>
        </div>

        {isRestoring && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progresso da restauração</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Resultados por Fase:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-medium">{result.phase}</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.count && (
                    <Badge variant="outline">{result.count}</Badge>
                  )}
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'Sucesso' : 'Falha'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button 
          onClick={executeCompleteRestore}
          disabled={isRestoring}
          className="w-full"
          size="lg"
        >
          {isRestoring ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Executando Restauração...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Executar Restauração Completa
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};