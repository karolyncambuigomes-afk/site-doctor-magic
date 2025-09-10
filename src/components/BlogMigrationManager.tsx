import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { migrateBlogDataToDatabase, checkMigrationStatus } from '@/utils/migrateBlogData';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  FileText,
  Globe,
  Info
} from 'lucide-react';

interface MigrationStatus {
  staticArticles: number;
  databasePosts: number;
  needsMigration: boolean;
  missingPosts: number;
  error?: string;
}

export const BlogMigrationManager: React.FC = () => {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const { toast } = useToast();

  const checkStatus = async () => {
    setLoading(true);
    const migrationStatus = await checkMigrationStatus();
    setStatus(migrationStatus);
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleMigration = async () => {
    setMigrating(true);
    
    try {
      const result = await migrateBlogDataToDatabase();
      
      if (result.success) {
        toast({
          title: "Migração Concluída",
          description: result.message,
        });
        
        // Refresh status after migration
        await checkStatus();
      } else {
        toast({
          title: "Erro na Migração",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Migração",
        description: "Erro inesperado durante a migração.",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  if (!status && loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Blog Migration Manager
          </CardTitle>
          <CardDescription>
            Verificando status da migração...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Erro ao Verificar Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={checkStatus} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = status.staticArticles > 0 
    ? Math.round((status.databasePosts / status.staticArticles) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Blog Migration Manager
          </CardTitle>
          <CardDescription>
            Gerencie a migração dos artigos estáticos para a base de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Artigos Estáticos</p>
                <p className="text-2xl font-bold">{status.staticArticles}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Globe className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Na Base de Dados</p>
                <p className="text-2xl font-bold">{status.databasePosts}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Upload className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Faltam Migrar</p>
                <p className="text-2xl font-bold">{status.missingPosts}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da Migração</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Status Alerts */}
          {status.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro: {status.error}
              </AlertDescription>
            </Alert>
          )}

          {!status.needsMigration && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Todos os artigos foram migrados com sucesso! O blog público agora usa a base de dados.
              </AlertDescription>
            </Alert>
          )}

          {status.needsMigration && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Existem {status.missingPosts} artigos que precisam ser migrados para a base de dados.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleMigration}
              disabled={migrating || !status.needsMigration}
              className="flex-1"
            >
              {migrating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Migrando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Iniciar Migração
                </>
              )}
            </Button>
            
            <Button 
              onClick={checkStatus}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Status
            </Button>
          </div>

          {/* Information */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>O que esta migração faz:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Migra todos os artigos de <code>src/data/blog-articles.ts</code> para a tabela <code>blog_posts</code></li>
              <li>A página pública do blog passa a usar dados da base de dados</li>
              <li>Todos os posts ficam visíveis e editáveis na área admin</li>
              <li>Não duplica artigos já existentes na base de dados</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};