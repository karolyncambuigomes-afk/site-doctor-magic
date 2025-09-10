import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  url?: string;
}

export const SystemTestPage: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'API Status Endpoint', status: 'pending' },
    { name: 'Image Proxy Health', status: 'pending' },
    { name: 'Fix One Image Endpoint', status: 'pending' },
    { name: 'Fix Gallery Endpoint', status: 'pending' },
    { name: 'Anastasia Photos Display', status: 'pending' }
  ]);

  const updateTest = (index: number, status: TestResult['status'], message?: string, url?: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, url } : test
    ));
  };

  const runTests = async () => {
    // Reset tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' })));

    // Test 1: API Status
    try {
      const statusResponse = await fetch('/api/i/_status');
      const statusData = await statusResponse.json();
      if (statusResponse.ok && statusData.ok) {
        updateTest(0, 'success', 'Status endpoint working');
      } else {
        updateTest(0, 'error', 'Status endpoint failed');
      }
    } catch (error) {
      updateTest(0, 'error', `Status endpoint error: ${error.message}`);
    }

    // Test 2: Image Proxy Health
    try {
      const healthResponse = await fetch('/images/health.png');
      if (healthResponse.ok) {
        updateTest(1, 'success', 'Image proxy working');
      } else {
        updateTest(1, 'error', `Image proxy failed: ${healthResponse.status}`);
      }
    } catch (error) {
      updateTest(1, 'error', `Image proxy error: ${error.message}`);
    }

    // Test 3: Check if admin endpoints exist (will fail with auth error but that's expected)
    try {
      const fixResponse = await fetch('/api/admin/fix-one-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'model', id: 'test', dry_run: true })
      });
      if (fixResponse.status === 401) {
        updateTest(2, 'success', 'Fix endpoint exists (auth required)');
      } else {
        updateTest(2, 'error', `Unexpected response: ${fixResponse.status}`);
      }
    } catch (error) {
      updateTest(2, 'error', `Fix endpoint error: ${error.message}`);
    }

    // Test 4: Fix Gallery endpoint
    try {
      const galleryResponse = await fetch('/api/admin/fix-one-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: 'test', sourceUrl: 'test', index: 0, dry_run: true })
      });
      if (galleryResponse.status === 401) {
        updateTest(3, 'success', 'Gallery endpoint exists (auth required)');
      } else {
        updateTest(3, 'error', `Unexpected response: ${galleryResponse.status}`);
      }
    } catch (error) {
      updateTest(3, 'error', `Gallery endpoint error: ${error.message}`);
    }

    // Test 5: Check Anastasia photos
    updateTest(4, 'pending');
    
    // Wait a bit for images to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const anastasiaPhotos = document.querySelectorAll('img[alt*="Anastasia"]');
    const galleryImages = document.querySelectorAll('[class*="gallery"] img, [class*="Gallery"] img');
    
    console.log('🔍 DOM DEBUG: Found images:', {
      anastasiaSpecific: anastasiaPhotos.length,
      galleryImages: galleryImages.length,
      allImages: document.querySelectorAll('img').length
    });
    
    if (anastasiaPhotos.length > 0) {
      updateTest(4, 'success', `Found ${anastasiaPhotos.length} Anastasia photos`);
    } else {
      updateTest(4, 'error', `Anastasia photos not found. Gallery images: ${galleryImages.length}`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sistema de Imagens - Teste Completo</h1>
          <p className="text-muted-foreground mt-2">
            Validação dos endpoints e funcionalidades implementadas
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Testes Automatizados</CardTitle>
            <CardDescription>
              Clique no botão abaixo para executar todos os testes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runTests} className="mb-4">
              Executar Todos os Testes
            </Button>

            <div className="space-y-3">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      {test.message && (
                        <div className="text-sm text-muted-foreground">{test.message}</div>
                      )}
                      {test.url && (
                        <div className="text-xs text-blue-600">{test.url}</div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testes Manuais</CardTitle>
            <CardDescription>
              Verifique estes itens manualmente após os testes automatizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <strong>1. Verificar fotos da Anastasia:</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Navegue para /models e verifique se as fotos da Anastasia estão sendo exibidas corretamente.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>2. Testar galeria:</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique na Anastasia e verifique se a galeria abre e todas as fotos aparecem.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>3. Performance:</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Verifique no DevTools (Network) se as imagens estão carregando rapidamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};