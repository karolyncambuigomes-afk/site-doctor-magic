import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Play, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { executeMigration } from '@/utils/executeMigration';

export const MigrationExecutor: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const handleExecuteMigration = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    
    try {
      toast.info('🚀 Starting migration of 8 pending items...');
      
      const migrationResults = await executeMigration();
      
      setResults(migrationResults);
      setProgress(100);
      
      if (migrationResults.successCount === migrationResults.totalProcessed) {
        toast.success(`✅ Migration complete! All ${migrationResults.successCount} items migrated successfully`);
      } else {
        toast.warning(`⚠️ Migration complete with issues: ${migrationResults.successCount}/${migrationResults.totalProcessed} successful`);
      }

      // Refresh page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('Migration execution error:', error);
      toast.error(`❌ Migration failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Execute Migration - 8 Pending Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            This will migrate 8 pending items (5 Models + 2 Carousel + 1 Hero Slide) from Supabase Storage to local WebP format.
            The process includes HTTP 200 validation and cache purging.
          </AlertDescription>
        </Alert>

        {isRunning && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Processing migration...</span>
              <span>8 items total</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {results && (
          <div className="space-y-3">
            <div className="flex gap-4 text-sm">
              <Badge variant="secondary" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                {results.successCount} successful
              </Badge>
              {results.failedCount > 0 && (
                <Badge variant="destructive">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {results.failedCount} failed
                </Badge>
              )}
            </div>

            {results.results.length > 0 && (
              <div className="text-xs space-y-1">
                <p className="font-medium">Migration Results:</p>
                {results.results.map((result: any, index: number) => {
                  const name = result.item.name || result.item.model_name || result.item.title;
                  return (
                    <div key={index} className={`flex justify-between ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{result.item.category}: {name}</span>
                      <span>{result.success ? '✅' : '❌'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={handleExecuteMigration}
          disabled={isRunning}
          size="lg"
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Migrating Images...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Execute Migration Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};