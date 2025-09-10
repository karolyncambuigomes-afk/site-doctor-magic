import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle, Play } from 'lucide-react';

export const AdminGalleryTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [modelId, setModelId] = useState('d851677c-b1cc-43ac-bb9a-a65f83bf9e5b'); // Anastasia's ID
  const [sourceUrl, setSourceUrl] = useState('');
  const [index, setIndex] = useState(0);
  const { toast } = useToast();

  const runStatusTest = async () => {
    const result = { step: 'API Status Check', status: 'running', details: '', timestamp: new Date() };
    setResults(prev => [...prev, result]);

    try {
      const response = await fetch('/api/i/_status');
      const data = await response.json();
      
      if (response.ok && data.status === 'ok') {
        result.status = 'success';
        result.details = `✅ API Status: OK (${data.healthy ? 'healthy' : 'unhealthy'})`;
      } else {
        result.status = 'error';
        result.details = `❌ API Status failed: ${response.status}`;
      }
    } catch (error) {
      result.status = 'error';
      result.details = `❌ API Error: ${error.message}`;
    }

    setResults(prev => prev.map(r => r.timestamp === result.timestamp ? result : r));
  };

  const runOptimizationTest = async () => {
    if (!sourceUrl) {
      toast({
        title: "Missing URL",
        description: "Please provide a source URL to test",
        variant: "destructive"
      });
      return;
    }

    const result = { step: 'Gallery Optimization Test', status: 'running', details: '', timestamp: new Date() };
    setResults(prev => [...prev, result]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authentication session');
      }

      console.log('🧪 Testing gallery optimization with:', { modelId, sourceUrl, index });

      const { data, error } = await supabase.functions.invoke('admin-fix-one-gallery', {
        body: {
          modelId,
          sourceUrl,
          index,
          dry_run: false
        },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        result.status = 'error';
        result.details = `❌ Optimization failed: ${error.message}`;
      } else if (data.success) {
        result.status = 'success';
        result.details = `✅ Optimization successful: ${data.local_path}`;
        
        // Test if the optimized image is accessible
        setTimeout(async () => {
          const testResult = { step: 'Image Access Test', status: 'running', details: '', timestamp: new Date() };
          setResults(prev => [...prev, testResult]);
          
          try {
            const imageResponse = await fetch(data.local_path);
            if (imageResponse.ok) {
              testResult.status = 'success';
              testResult.details = `✅ Image accessible: ${data.local_path} (${imageResponse.status})`;
            } else {
              testResult.status = 'error';
              testResult.details = `❌ Image not accessible: ${imageResponse.status}`;
            }
          } catch (imageError) {
            testResult.status = 'error';
            testResult.details = `❌ Image access error: ${imageError.message}`;
          }
          
          setResults(prev => prev.map(r => r.timestamp === testResult.timestamp ? testResult : r));
        }, 2000);
      } else {
        result.status = 'error';
        result.details = `❌ Optimization returned: ${JSON.stringify(data)}`;
      }
    } catch (error) {
      result.status = 'error';
      result.details = `❌ Test error: ${error.message}`;
    }

    setResults(prev => prev.map(r => r.timestamp === result.timestamp ? result : r));
  };

  const runFullTest = async () => {
    setTesting(true);
    setResults([]);

    try {
      await runStatusTest();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await runOptimizationTest();
    } finally {
      setTesting(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gallery System Test</h1>
        <Badge variant="outline">Admin Test Panel</Badge>
      </div>

      <Tabs defaultValue="test" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="test">Run Tests</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Optimization Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Model ID</label>
                  <Input
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    placeholder="Model ID (UUID)"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Source Image URL</label>
                  <Input
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Gallery Index</label>
                  <Input
                    type="number"
                    value={index}
                    onChange={(e) => setIndex(parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={runFullTest} 
                  disabled={testing}
                  className="flex-1"
                >
                  {testing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Full Test
                    </>
                  )}
                </Button>
                
                <Button onClick={clearResults} variant="outline">
                  Clear Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p className="text-muted-foreground">No test results yet. Run tests to see results.</p>
              ) : (
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="mt-1">
                        {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {result.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                        {result.status === 'running' && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{result.step}</span>
                          <Badge variant={
                            result.status === 'success' ? 'default' : 
                            result.status === 'error' ? 'destructive' : 
                            'secondary'
                          }>
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.details}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};