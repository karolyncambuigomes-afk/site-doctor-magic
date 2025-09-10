import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { fixAnastasiaImages } from '@/utils/fixAnastasiaImages';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const AnastasiaFixButton: React.FC = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFix = async () => {
    setIsFixing(true);
    setResult(null);

    try {
      const fixResult = await fixAnastasiaImages();
      setResult(fixResult);

      if (fixResult.success) {
        toast({
          title: "✅ Correção Concluída",
          description: "Imagens da Anastasia foram corrigidas com sucesso!",
        });
      } else {
        toast({
          title: "❌ Erro na Correção",
          description: fixResult.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro na correção:', error);
      toast({
        title: "❌ Erro",
        description: "Erro inesperado durante a correção",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Correção de Imagens - Anastasia
        </CardTitle>
        <CardDescription>
          Executa o plano de correção para sincronizar todos os sistemas de imagem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleFix} 
          disabled={isFixing}
          className="w-full"
        >
          {isFixing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executando Correção...
            </>
          ) : (
            '🚀 Executar Plano de Correção'
          )}
        </Button>

        {result && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-semibold">
                {result.success ? 'Sucesso' : 'Erro'}
              </span>
            </div>
            
            <div className="text-sm space-y-2">
              <p><strong>Mensagem:</strong> {result.message}</p>
              
              {result.success && result.finalState && (
                <div>
                  <strong>Estado Final:</strong>
                  <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-auto">
                    {JSON.stringify(result.finalState, null, 2)}
                  </pre>
                </div>
              )}

              {result.galleryResults && (
                <div>
                  <strong>Resultados da Galeria:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {result.galleryResults.map((item: any, idx: number) => (
                      <li key={idx} className={item.success ? 'text-green-600' : 'text-red-600'}>
                        Índice {item.index}: {item.success ? '✅ OK' : `❌ ${item.error}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!result.success && result.error && (
                <p className="text-red-600"><strong>Erro:</strong> {result.error}</p>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Este processo irá:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Sincronizar image_url_local_main usando admin-fix-one-image</li>
            <li>Converter gallery_external_urls para gallery_local_urls</li>
            <li>Alinhar visibilidade entre model_gallery e arrays</li>
            <li>Validar URLs locais (/images/models/...)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};