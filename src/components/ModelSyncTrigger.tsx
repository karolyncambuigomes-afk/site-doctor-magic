import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { executeGlobalModelSync } from '@/utils/modelImageSyncManager';
import { Loader2, RefreshCw } from 'lucide-react';

export const ModelSyncTrigger: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      const result = await executeGlobalModelSync();
      
      if (result.success) {
        const syncedCount = 'synced' in result ? result.synced : 0;
        toast({
          title: "Sincronização Completa",
          description: `${syncedCount} modelos atualizados com sucesso`,
        });
      } else {
        toast({
          title: "Erro na Sincronização",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Sincronização",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={isSyncing}
      variant="outline"
      size="sm"
    >
      {isSyncing ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <RefreshCw className="h-4 w-4 mr-2" />
      )}
      {isSyncing ? 'Sincronizando...' : 'Sincronizar Imagens'}
    </Button>
  );
};