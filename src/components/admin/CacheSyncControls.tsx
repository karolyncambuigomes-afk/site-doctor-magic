import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCacheSyncContext } from '@/components/CacheSyncProvider';
import { Loader2, RefreshCw, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner';

export const CacheSyncControls: React.FC = () => {
  const { manualSync, triggerCacheClear } = useCacheSyncContext();
  const [loading, setLoading] = useState<string | null>(null);

  const handleClearSpecific = async (table: string) => {
    setLoading(table);
    try {
      await triggerCacheClear(table);
      toast.success(`${table} cache cleared`, {
        description: 'All clients will refresh this content automatically.',
      });
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setLoading(null);
    }
  };

  const handleClearAll = async () => {
    setLoading('all');
    try {
      await triggerCacheClear();
      toast.success('All cache cleared', {
        description: 'All clients will refresh content automatically.',
      });
    } catch (error) {
      toast.error('Failed to clear all cache');
    } finally {
      setLoading(null);
    }
  };

  const handleManualSync = async (table?: string) => {
    setLoading(table || 'manual-all');
    try {
      await manualSync(table);
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(null);
    }
  };

  const cacheTargets = [
    { key: 'models', label: 'Models' },
    { key: 'blog_posts', label: 'Blog Posts' },
    { key: 'hero_slides', label: 'Hero Banners' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'faqs', label: 'FAQs' },
    { key: 'characteristics', label: 'Characteristics' },
    { key: 'locations', label: 'Locations' },
    { key: 'homepage_carousel', label: 'Homepage Carousel' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Cache Synchronization
        </CardTitle>
        <CardDescription>
          Force cache refresh across all website visitors when content is updated.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleClearAll()}
            disabled={loading !== null}
            variant="destructive"
            size="sm"
          >
            {loading === 'all' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Clear All Cache
          </Button>
          
          <Button
            onClick={() => handleManualSync()}
            disabled={loading !== null}
            variant="outline"
            size="sm"
          >
            {loading === 'manual-all' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync All
          </Button>
        </div>

        {/* Specific Cache Targets */}
        <div>
          <h4 className="font-medium mb-2">Clear Specific Content</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {cacheTargets.map(({ key, label }) => (
              <Button
                key={key}
                onClick={() => handleClearSpecific(key)}
                disabled={loading !== null}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                {loading === key ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Badge variant="secondary" className="text-xs">
            Real-time Sync Active
          </Badge>
          <span className="text-xs text-muted-foreground">
            Changes automatically sync to all visitors
          </span>
        </div>
      </CardContent>
    </Card>
  );
};