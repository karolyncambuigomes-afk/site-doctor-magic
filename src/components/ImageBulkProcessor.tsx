import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

interface ProcessingStats {
  total: number;
  processed: number;
  success: number;
  failed: number;
}

export const ImageBulkProcessor: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ProcessingStats>({ total: 0, processed: 0, success: 0, failed: 0 });
  const [currentItem, setCurrentItem] = useState<string>('');

  const processAllImages = async () => {
    setIsProcessing(true);
    setStats({ total: 0, processed: 0, success: 0, failed: 0 });
    
    try {
      toast.info('🚀 Starting complete image migration...');
      
      // Get all images that need processing
      const categories = [
        {
          name: 'Models',
          query: `SELECT id, name, image FROM models WHERE image LIKE '%supabase%' OR image LIKE '%https%'`,
          tableName: 'models',
          fieldName: 'image'
        },
        {
          name: 'Homepage Carousel', 
          query: `SELECT id, model_name, image_url FROM homepage_carousel WHERE image_url LIKE '%supabase%' OR image_url LIKE '%https%'`,
          tableName: 'homepage_carousel',
          fieldName: 'image_url'
        },
        {
          name: 'Hero Slides',
          query: `SELECT id, title, image_url FROM hero_slides WHERE image_url LIKE '%supabase%' OR image_url LIKE '%https%'`,
          tableName: 'hero_slides', 
          fieldName: 'image_url'
        },
        {
          name: 'Site Content',
          query: `SELECT id, section, image_url FROM site_content WHERE image_url LIKE '%supabase%' OR image_url LIKE '%https%'`,
          tableName: 'site_content',
          fieldName: 'image_url'
        }
      ];

      let totalImages = 0;
      const allItems: any[] = [];

      // Collect all items
      for (const category of categories) {
        const { data: items, error } = await supabase.rpc('fetch_migration_items', {
          query_text: category.query
        });
        
        if (error) throw error;
        
        if (items && items.length > 0) {
          items.forEach((item: any) => {
            allItems.push({ ...item, category: category.name, tableName: category.tableName, fieldName: category.fieldName });
          });
          totalImages += items.length;
        }
      }

      setStats(prev => ({ ...prev, total: totalImages }));

      if (totalImages === 0) {
        toast.success('✅ All images are already optimized!');
        return;
      }

      // Process each image
      for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        setCurrentItem(`${item.category}: ${item.name || item.model_name || item.title || item.section}`);
        
        try {
          const imageUrl = item.image_url || item.image;
          const itemName = `${item.category.toLowerCase().replace(' ', '-')}-${item.id}`;
          
          const { data: result, error: fixError } = await supabase.functions.invoke('sync-image-to-local', {
            body: {
              imageUrl,
              imageType: item.category.toLowerCase().replace(' ', '_'),
              itemId: item.id,
              tableName: item.tableName,
              fieldName: item.fieldName,
              itemName,
              altText: `Optimized ${item.category} image`
            }
          });

          if (fixError) throw fixError;

          if (result?.success) {
            setStats(prev => ({ ...prev, success: prev.success + 1 }));
            console.log(`✅ [${i+1}/${totalImages}] Fixed: ${itemName}`);
          } else {
            setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
            console.error(`❌ [${i+1}/${totalImages}] Failed: ${result?.error}`);
          }

        } catch (error) {
          setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
          console.error(`❌ [${i+1}/${totalImages}] Error:`, error);
        }

        setStats(prev => ({ ...prev, processed: prev.processed + 1 }));
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Clear service worker cache
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        navigator.serviceWorker.controller.postMessage({ type: 'CLIENTS_CLAIM' });
      }

      toast.success(`✅ Migration complete! ${stats.success}/${totalImages} images processed successfully`);

      // Refresh page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Bulk processing error:', error);
      toast.error(`❌ Migration failed: ${error}`);
    } finally {
      setIsProcessing(false);
      setCurrentItem('');
    }
  };

  const progress = stats.total > 0 ? (stats.processed / stats.total) * 100 : 0;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Complete Image Migration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            This will convert all external images (Supabase Storage, assets) to optimized local WebP versions.
            The page will reload automatically when complete.
          </AlertDescription>
        </Alert>

        {isProcessing && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{stats.processed}/{stats.total}</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {currentItem && (
              <p className="text-xs text-muted-foreground truncate">
                Current: {currentItem}
              </p>
            )}

            <div className="flex gap-4 text-sm">
              <Badge variant="secondary" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                {stats.success} success
              </Badge>
              {stats.failed > 0 && (
                <Badge variant="destructive">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {stats.failed} failed
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button 
          onClick={processAllImages}
          disabled={isProcessing}
          size="lg"
          className="w-full"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Processing Images... ({stats.processed}/{stats.total})
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Start Complete Migration
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};