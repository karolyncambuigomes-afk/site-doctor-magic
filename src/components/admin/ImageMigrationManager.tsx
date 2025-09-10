import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { migrateModelImages, migrateHeroImages, updateBlogImagesData } from '@/utils/imageMigrationHelper';
import { Download, CheckCircle, AlertCircle, Loader2, HardDrive } from 'lucide-react';

export const ImageMigrationManager: React.FC = () => {
  const { toast } = useToast();
  const [migrationStatus, setMigrationStatus] = useState({
    models: { running: false, completed: false, progress: 0 },
    hero: { running: false, completed: false, progress: 0 },
    blog: { running: false, completed: false, progress: 0 }
  });
  const [results, setResults] = useState<{
    models?: any;
    hero?: any;
    blog?: any;
  }>({});

  const runModelsMigration = async () => {
    setMigrationStatus(prev => ({ 
      ...prev, 
      models: { running: true, completed: false, progress: 10 } 
    }));

    try {
      const result = await migrateModelImages();
      
      setMigrationStatus(prev => ({ 
        ...prev, 
        models: { running: false, completed: true, progress: 100 } 
      }));
      
      setResults(prev => ({ ...prev, models: result }));

      if (result.success) {
        toast({
          title: "Migração de Models Concluída",
          description: `${result.migrated} imagens migradas com sucesso`,
        });
      } else {
        toast({
          title: "Migração Parcial",
          description: `${result.migrated} migradas, ${result.failed} falharam`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setMigrationStatus(prev => ({ 
        ...prev, 
        models: { running: false, completed: false, progress: 0 } 
      }));
      
      toast({
        title: "Erro na Migração",
        description: "Falha ao migrar imagens dos models",
        variant: "destructive",
      });
    }
  };

  const runHeroMigration = async () => {
    setMigrationStatus(prev => ({ 
      ...prev, 
      hero: { running: true, completed: false, progress: 10 } 
    }));

    try {
      const result = await migrateHeroImages();
      
      setMigrationStatus(prev => ({ 
        ...prev, 
        hero: { running: false, completed: true, progress: 100 } 
      }));
      
      setResults(prev => ({ ...prev, hero: result }));

      if (result.success) {
        toast({
          title: "Migração de Hero/Banner Concluída",
          description: `${result.migrated} imagens migradas com sucesso`,
        });
      } else {
        toast({
          title: "Migração Parcial",
          description: `${result.migrated} migradas, ${result.failed} falharam`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setMigrationStatus(prev => ({ 
        ...prev, 
        hero: { running: false, completed: false, progress: 0 } 
      }));
      
      toast({
        title: "Erro na Migração",
        description: "Falha ao migrar imagens hero/banner",
        variant: "destructive",
      });
    }
  };

  const updateBlogImages = async () => {
    setMigrationStatus(prev => ({ 
      ...prev, 
      blog: { running: true, completed: false, progress: 50 } 
    }));

    try {
      const imagesToMove = updateBlogImagesData();
      
      setMigrationStatus(prev => ({ 
        ...prev, 
        blog: { running: false, completed: true, progress: 100 } 
      }));
      
      setResults(prev => ({ 
        ...prev, 
        blog: { 
          success: true, 
          migrated: imagesToMove.length, 
          failed: 0, 
          errors: [] 
        } 
      }));

      toast({
        title: "Atualização de Blog Concluída",
        description: `${imagesToMove.length} referências de imagens atualizadas`,
      });
    } catch (error) {
      setMigrationStatus(prev => ({ 
        ...prev, 
        blog: { running: false, completed: false, progress: 0 } 
      }));
      
      toast({
        title: "Erro na Atualização",
        description: "Falha ao atualizar referências do blog",
        variant: "destructive",
      });
    }
  };

  const runAllMigrations = async () => {
    await runModelsMigration();
    await runHeroMigration();
    await updateBlogImages();
    
    toast({
      title: "Migração Completa",
      description: "Todas as migrações foram executadas",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Migração de Imagens para Local
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Esta ferramenta migra todas as imagens do Supabase Storage para o diretório local <code>/public/images/</code> 
              para melhor performance e confiabilidade.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Models Migration */}
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold">Models</div>
                  <div className="text-sm text-muted-foreground">
                    Imagens principais e galerias
                  </div>
                  
                  {migrationStatus.models.running && (
                    <Progress value={migrationStatus.models.progress} className="w-full" />
                  )}
                  
                  <Button
                    onClick={runModelsMigration}
                    disabled={migrationStatus.models.running}
                    className="w-full"
                    variant={migrationStatus.models.completed ? "secondary" : "default"}
                  >
                    {migrationStatus.models.running ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : migrationStatus.models.completed ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {migrationStatus.models.running ? 'Migrando...' : 
                     migrationStatus.models.completed ? 'Concluído' : 'Migrar Models'}
                  </Button>
                  
                  {results.models && (
                    <div className="space-y-1">
                      <Badge variant={results.models.success ? "secondary" : "destructive"}>
                        {results.models.migrated} migradas
                      </Badge>
                      {results.models.failed > 0 && (
                        <Badge variant="destructive">
                          {results.models.failed} falharam
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hero Migration */}
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold">Hero/Banner</div>
                  <div className="text-sm text-muted-foreground">
                    Imagens do carousel principal
                  </div>
                  
                  {migrationStatus.hero.running && (
                    <Progress value={migrationStatus.hero.progress} className="w-full" />
                  )}
                  
                  <Button
                    onClick={runHeroMigration}
                    disabled={migrationStatus.hero.running}
                    className="w-full"
                    variant={migrationStatus.hero.completed ? "secondary" : "default"}
                  >
                    {migrationStatus.hero.running ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : migrationStatus.hero.completed ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {migrationStatus.hero.running ? 'Migrando...' : 
                     migrationStatus.hero.completed ? 'Concluído' : 'Migrar Hero'}
                  </Button>
                  
                  {results.hero && (
                    <div className="space-y-1">
                      <Badge variant={results.hero.success ? "secondary" : "destructive"}>
                        {results.hero.migrated} migradas
                      </Badge>
                      {results.hero.failed > 0 && (
                        <Badge variant="destructive">
                          {results.hero.failed} falharam
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Blog Images */}
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold">Blog</div>
                  <div className="text-sm text-muted-foreground">
                    Referências de imagens do blog
                  </div>
                  
                  {migrationStatus.blog.running && (
                    <Progress value={migrationStatus.blog.progress} className="w-full" />
                  )}
                  
                  <Button
                    onClick={updateBlogImages}
                    disabled={migrationStatus.blog.running}
                    className="w-full"
                    variant={migrationStatus.blog.completed ? "secondary" : "default"}
                  >
                    {migrationStatus.blog.running ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : migrationStatus.blog.completed ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {migrationStatus.blog.running ? 'Atualizando...' : 
                     migrationStatus.blog.completed ? 'Concluído' : 'Atualizar Blog'}
                  </Button>
                  
                  {results.blog && (
                    <Badge variant={results.blog.success ? "secondary" : "destructive"}>
                      {results.blog.migrated} atualizadas
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Run All */}
            <Card className="border-2 border-primary">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold text-primary">Executar Tudo</div>
                  <div className="text-sm text-muted-foreground">
                    Migração completa automática
                  </div>
                  
                  <Button
                    onClick={runAllMigrations}
                    disabled={Object.values(migrationStatus).some(status => status.running)}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Migrar Tudo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {Object.values(results).some(result => result?.errors?.length > 0) && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">Erros encontrados:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {Object.values(results).map((result, index) => 
                      result?.errors?.map((error: string, errorIndex: number) => (
                        <li key={`${index}-${errorIndex}`}>{error}</li>
                      ))
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};