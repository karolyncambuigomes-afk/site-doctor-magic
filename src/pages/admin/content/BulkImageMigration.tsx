import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { performCompleteImageRefresh } from '@/utils/cacheManager';

interface MigrationCategory {
  name: string;
  description: string;
  query: string;
  tableName: string;
  fieldName: string;
  count: number;
  pattern: string;
}

export const BulkImageMigration: React.FC = () => {
  const [migrationStats, setMigrationStats] = useState<Record<string, { total: number; processed: number; success: number; failed: number }>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('');

  const categories: MigrationCategory[] = [
    {
      name: 'Hero Banner',
      description: 'Convert banner to optimized WebP versions',
      query: `SELECT id, image_url FROM site_content WHERE section = 'homepage_hero_main' AND (image_url_local_desktop IS NULL OR image_url_local_mobile IS NULL)`,
      tableName: 'site_content',
      fieldName: 'image_url',
      count: 0,
      pattern: 'hero-banner-*'
    },
    {
      name: 'Models',
      description: 'Convert all model images to local WebP',
      query: `SELECT id, name, image FROM models WHERE image LIKE '%supabase%'`,
      tableName: 'models', 
      fieldName: 'image',
      count: 0,
      pattern: 'model-*'
    },
    {
      name: 'Homepage Carousel',
      description: 'Convert carousel images to local WebP',
      query: `SELECT id, model_name, image_url FROM homepage_carousel WHERE image_url LIKE '%supabase%'`,
      tableName: 'homepage_carousel',
      fieldName: 'image_url', 
      count: 0,
      pattern: 'carousel-*'
    },
    {
      name: 'Blog Posts',
      description: 'Convert blog images from /src/assets/ to local WebP',
      query: `SELECT id, title, slug, image, category FROM blog_posts WHERE image LIKE '%/src/assets/%'`,
      tableName: 'blog_posts',
      fieldName: 'image',
      count: 0,
      pattern: 'blog-*'
    }
  ];

  const runBulkMigration = async (category: MigrationCategory) => {
    setIsProcessing(true);
    setCurrentCategory(category.name);
    
    try {
      // Get images that need migration
      const { data: items, error } = await supabase.rpc('fetch_migration_items', {
        query_text: category.query
      });
      
      if (error) throw error;
      
      if (!items || items.length === 0) {
        toast.success(`✅ ${category.name}: No images need migration`);
        return;
      }

      // Initialize stats
      const stats = { total: items.length, processed: 0, success: 0, failed: 0 };
      setMigrationStats(prev => ({ ...prev, [category.name]: stats }));

      toast.info(`🚀 Starting ${category.name} migration: ${items.length} images`);

      // Process each image
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        try {
          // Generate proper itemName based on category
          let itemName = '';
          if (category.name === 'Hero Banner') {
            itemName = 'hero-banner-vic';
          } else if (category.name === 'Models') {
            itemName = `model-${item.id}-main`;
          } else if (category.name === 'Homepage Carousel') {
            itemName = `carousel-${item.model_name?.toLowerCase() || 'unnamed'}`;
          } else if (category.name === 'Blog Posts') {
            itemName = `blog-${item.category?.toLowerCase() || 'post'}-${item.slug || 'untitled'}`;
          }

          // Call fix-image-to-local Edge Function
          const { data: result, error: fixError } = await supabase.functions.invoke('fix-image-to-local', {
            body: {
              imageUrl: item.image_url || item.image,
              category: category.name.toLowerCase(),
              itemId: item.id,
              tableName: category.tableName,
              fieldName: category.fieldName,
              itemName: itemName,
              altText: item.name || item.model_name || item.title || 'Optimized image'
            }
          });

          if (fixError) throw fixError;

          if (result?.success) {
            stats.success++;
            console.log(`✅ [${i+1}/${items.length}] Fixed ${category.name}: ${itemName}`);
          } else {
            stats.failed++;
            console.error(`❌ [${i+1}/${items.length}] Failed ${category.name}: ${result?.error}`);
          }

        } catch (error) {
          stats.failed++;
          console.error(`❌ [${i+1}/${items.length}] Error processing ${category.name}:`, error);
        }

        stats.processed++;
        setMigrationStats(prev => ({ ...prev, [category.name]: { ...stats } }));

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Cache refresh after category completion
      await performCompleteImageRefresh({ 
        patterns: [category.pattern, '/images/*'], 
        force: true 
      });

      toast.success(`✅ ${category.name} migration complete: ${stats.success}/${stats.total} successful`);

    } catch (error) {
      console.error(`Migration error for ${category.name}:`, error);
      toast.error(`❌ ${category.name} migration failed: ${error}`);
    } finally {
      setIsProcessing(false);
      setCurrentCategory('');
    }
  };

  const runCompleteHouseKeeping = async () => {
    setIsProcessing(true);
    
    try {
      toast.info('🧹 Starting complete WebP housekeeping...');
      
      // Run all categories sequentially
      for (const category of categories) {
        await runBulkMigration(category);
        // Short break between categories
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Final comprehensive cache clear and refresh
      await performCompleteImageRefresh({ 
        patterns: ['hero-banner-*', 'model-*', 'carousel-*', 'blog-*', '/images/*'], 
        force: true 
      });

      // Force page reload to show all new images
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      toast.success('✅ Complete WebP migration finished! Page will reload shortly.');
      
    } catch (error) {
      console.error('Complete migration error:', error);
      toast.error(`❌ Complete migration failed: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk WebP Migration</h2>
        <p className="text-muted-foreground">
          Convert all external and asset images to optimized local WebP versions
        </p>
      </div>

      {/* Complete Migration Button */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Complete WebP Housekeeping
          </CardTitle>
          <CardDescription>
            Run all migrations sequentially to convert the entire site to local WebP images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runCompleteHouseKeeping}
            disabled={isProcessing}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running Complete Migration...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Start Complete WebP Migration
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Individual Categories */}
      <div className="grid gap-4">
        {categories.map((category) => {
          const stats = migrationStats[category.name];
          const progress = stats ? (stats.processed / stats.total) * 100 : 0;
          const isActiveCategory = currentCategory === category.name;
          
          return (
            <Card key={category.name} className={isActiveCategory ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {category.name}
                      {stats && (
                        <Badge variant={stats.success === stats.total ? 'default' : 'secondary'}>
                          {stats.success}/{stats.total}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Button 
                    onClick={() => runBulkMigration(category)}
                    disabled={isProcessing}
                    variant={isActiveCategory ? 'default' : 'outline'}
                  >
                    {isActiveCategory ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Migrate {category.name}
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              {stats && (
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{stats.processed}/{stats.total}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    {stats.processed > 0 && (
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          {stats.success} success
                        </span>
                        {stats.failed > 0 && (
                          <span className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-3 h-3" />
                            {stats.failed} failed
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};