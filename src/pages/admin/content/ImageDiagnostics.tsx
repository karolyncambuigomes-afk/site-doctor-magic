import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  CheckCircle, 
  Image as ImageIcon, 
  Download, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { purgeImageCache, refreshServiceWorker } from '@/utils/cacheManager';

// Types
interface ImageItem {
  id: string;
  source: string;
  category: string;
  url: string;
  alt?: string;
  status: 'local' | 'supabase' | 'assets' | 'unknown';
  tableName: string;
  fieldName: string;
}

interface ImageStats {
  total: number;
  local: number;
  supabase: number;
  assets: number;
  fixed?: number;
}

// Status determination function
const getImageStatus = (url: string): 'local' | 'supabase' | 'assets' | 'unknown' => {
  if (!url) return 'unknown';
  if (url.startsWith('/images') || url.startsWith('/public/images')) return 'local';
  if (url.includes('supabase.co')) return 'supabase';
  if (url.startsWith('/src/assets')) return 'assets';
  return 'unknown';
};

// Components
const ImageStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    local: { variant: 'default' as const, icon: CheckCircle, text: '🟢 Local', className: 'bg-green-100 text-green-800' },
    supabase: { variant: 'destructive' as const, icon: AlertTriangle, text: '🔴 Supabase', className: 'bg-red-100 text-red-800' },
    assets: { variant: 'secondary' as const, icon: AlertTriangle, text: '⚠️ Assets', className: 'bg-yellow-100 text-yellow-800' },
    unknown: { variant: 'outline' as const, icon: AlertTriangle, text: '❓ Unknown', className: 'bg-gray-100 text-gray-800' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unknown;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
};

const ImagePreview: React.FC<{ url: string; alt?: string; status: string }> = ({ url, alt, status }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
      {!imageError ? (
        <img
          src={url}
          alt={alt || 'Image preview'}
          className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <ImageIcon className="w-6 h-6 text-muted-foreground" />
      )}
      <div className="absolute top-1 right-1">
        <ImageStatusBadge status={status} />
      </div>
    </div>
  );
};

const ImageFixButton: React.FC<{ 
  item: ImageItem;
  onFixComplete: () => void;
}> = ({ item, onFixComplete }) => {
  const [isFixing, setIsFixing] = useState(false);

  const handleFix = async () => {
    setIsFixing(true);
    try {
      console.log(`🔧 Starting fix for ${item.source}`);
      
      // Get current session for auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      // Call the edge function to fix the image
      const response = await fetch('/functions/v1/fix-image-to-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          imageUrl: item.url,
          category: item.category,
          itemId: item.id,
          tableName: item.tableName,
          fieldName: item.fieldName,
          itemName: item.source.split(': ')[1] || item.source,
          altText: item.alt
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fix image');
      }

      console.log(`✅ Fixed ${item.source} → ${result.localUrl}`);
      
      // Purge cache and refresh service worker
      await purgeImageCache(['/images/*']);
      await refreshServiceWorker();
      
      toast.success(`✅ Fixed: ${item.source}`);
      onFixComplete();
      
    } catch (error) {
      console.error('Fix error:', error);
      toast.error(`❌ Failed to fix ${item.source}: ${error}`);
    } finally {
      setIsFixing(false);
    }
  };

  if (item.status === 'local') return null;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleFix}
      disabled={isFixing}
      className="text-xs"
    >
      {isFixing ? (
        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
      ) : (
        <Download className="w-3 h-3 mr-1" />
      )}
      {isFixing ? 'Fixing...' : 'Fix to Local'}
    </Button>
  );
};

const BulkFixButton: React.FC<{ 
  category: string;
  items: ImageItem[];
  onFixComplete: () => void;
}> = ({ category, items, onFixComplete }) => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixedCount, setFixedCount] = useState(0);
  const needsFix = items.filter(item => item.status !== 'local');

  const handleBulkFix = async () => {
    setIsFixing(true);
    setFixedCount(0);
    let successCount = 0;
    
    try {
      // Get current session for auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      toast.info(`🚀 Starting bulk fix for ${needsFix.length} ${category} images`);
      
      // Process each item sequentially to avoid overwhelming the system
      for (let i = 0; i < needsFix.length; i++) {
        const item = needsFix[i];
        
        try {
          console.log(`🔧 [${i+1}/${needsFix.length}] Fixing ${item.source}`);
          
          const response = await fetch('/functions/v1/fix-image-to-local', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              imageUrl: item.url,
              category: item.category,
              itemId: item.id,
              tableName: item.tableName,
              fieldName: item.fieldName,
              itemName: item.source.split(': ')[1] || item.source,
              altText: item.alt
            })
          });

          const result = await response.json();
          
          if (result.success) {
            successCount++;
            setFixedCount(successCount);
            console.log(`✅ [${i+1}/${needsFix.length}] Fixed ${item.source}`);
          } else {
            console.error(`❌ [${i+1}/${needsFix.length}] Failed to fix ${item.source}:`, result.error);
          }
          
          // Small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ [${i+1}/${needsFix.length}] Error fixing ${item.source}:`, error);
        }
      }
      
      // Purge cache and refresh service worker after bulk operations
      await purgeImageCache(['/images/*']);
      await refreshServiceWorker();
      
      toast.success(`✅ Bulk fix complete: ${successCount}/${needsFix.length} ${category} images fixed`);
      onFixComplete();
      
    } catch (error) {
      toast.error(`❌ Bulk fix failed: ${error}`);
    } finally {
      setIsFixing(false);
      setFixedCount(0);
    }
  };

  if (needsFix.length === 0) return null;

    return (
      <Button
        size="sm"
        variant="default"
        onClick={handleBulkFix}
        disabled={isFixing}
        className="ml-2"
      >
        {isFixing ? (
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
        ) : (
          <Download className="w-3 h-3 mr-1" />
        )}
        {isFixing 
          ? `Fixing... (${fixedCount}/${needsFix.length})` 
          : `Fix All (${needsFix.length})`
        }
      </Button>
    );
  };

// Main component
export const ImageDiagnostics: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ImageStats>({ total: 0, local: 0, supabase: 0, assets: 0, fixed: 0 });

  const fetchImages = async () => {
    setLoading(true);
    try {
      const allImages: ImageItem[] = [];

      // Fetch Hero Slides
      const { data: heroSlides } = await supabase
        .from('hero_slides')
        .select('id, title, image_url')
        .eq('active', true);

      heroSlides?.forEach(slide => {
        allImages.push({
          id: slide.id,
          source: `Hero: ${slide.title}`,
          category: 'Hero/Banners',
          url: slide.image_url,
          alt: slide.title,
          status: getImageStatus(slide.image_url),
          tableName: 'hero_slides',
          fieldName: 'image_url'
        });
      });

      // Fetch Homepage Carousel
      const { data: carouselItems } = await supabase
        .from('homepage_carousel')
        .select('id, model_name, image_url')
        .eq('is_active', true);

      carouselItems?.forEach(item => {
        allImages.push({
          id: item.id,
          source: `Carousel: ${item.model_name}`,
          category: 'Homepage Carousel',
          url: item.image_url,
          alt: `${item.model_name} carousel image`,
          status: getImageStatus(item.image_url),
          tableName: 'homepage_carousel',
          fieldName: 'image_url'
        });
      });

      // Fetch Models
      const { data: models } = await supabase
        .from('models')
        .select('id, name, image')
        .limit(10);

      models?.forEach(model => {
        if (model.image) {
          allImages.push({
            id: model.id,
            source: `Model: ${model.name}`,
            category: 'Models',
            url: model.image,
            alt: `${model.name} profile image`,
            status: getImageStatus(model.image),
            tableName: 'models',
            fieldName: 'image'
          });
        }
      });

      // Fetch Blog Posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, title, image')
        .eq('is_published', true)
        .limit(10);

      blogPosts?.forEach(post => {
        if (post.image) {
          allImages.push({
            id: post.id,
            source: `Blog: ${post.title}`,
            category: 'Blog Posts',
            url: post.image,
            alt: `${post.title} featured image`,
            status: getImageStatus(post.image),
            tableName: 'blog_posts',
            fieldName: 'image'
          });
        }
      });

      // Fetch Site Content
      const { data: siteContent } = await supabase
        .from('site_content')
        .select('id, section, image_url, image_url_local_desktop, image_url_local_mobile')
        .eq('is_active', true);

      siteContent?.forEach(content => {
        // Check desktop image
        if (content.image_url_local_desktop) {
          allImages.push({
            id: `${content.id}-desktop`,
            source: `Site: ${content.section} (Desktop)`,
            category: 'Site Content',
            url: content.image_url_local_desktop,
            alt: `${content.section} desktop image`,
            status: getImageStatus(content.image_url_local_desktop),
            tableName: 'site_content',
            fieldName: 'image_url_local_desktop'
          });
        }
        // Check mobile image
        if (content.image_url_local_mobile) {
          allImages.push({
            id: `${content.id}-mobile`,
            source: `Site: ${content.section} (Mobile)`,
            category: 'Site Content',
            url: content.image_url_local_mobile,
            alt: `${content.section} mobile image`,
            status: getImageStatus(content.image_url_local_mobile),
            tableName: 'site_content',
            fieldName: 'image_url_local_mobile'
          });
        }
      });

      setImages(allImages);

      // Calculate stats
      const newStats = allImages.reduce((acc, img) => {
        acc.total++;
        if (img.status === 'local') acc.local++;
        else if (img.status === 'supabase') acc.supabase++;
        else if (img.status === 'assets') acc.assets++;
        return acc;
      }, { total: 0, local: 0, supabase: 0, assets: 0, fixed: 0 });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const groupedImages = images.reduce((acc, img) => {
    if (!acc[img.category]) acc[img.category] = [];
    acc[img.category].push(img);
    return acc;
  }, {} as Record<string, ImageItem[]>);

  const categories = ['Hero/Banners', 'Homepage Carousel', 'Models', 'Blog Posts', 'Site Content'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Image Diagnostics</h1>
        <p className="text-muted-foreground">
          Review and fix images using external URLs or old asset paths
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Images</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.local}</div>
            <div className="text-sm text-muted-foreground">🟢 Local</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.supabase}</div>
            <div className="text-sm text-muted-foreground">🔴 Supabase</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.assets}</div>
            <div className="text-sm text-muted-foreground">⚠️ Assets</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      {categories.map(category => {
        const categoryImages = groupedImages[category] || [];
        const criticalCount = categoryImages.filter(img => img.status === 'supabase').length;
        const assetsCount = categoryImages.filter(img => img.status === 'assets').length;

        return (
          <Card key={category}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {category}
                    <Badge variant="outline">{categoryImages.length}</Badge>
                    {criticalCount > 0 && (
                      <Badge variant="destructive">{criticalCount} Critical</Badge>
                    )}
                    {assetsCount > 0 && (
                      <Badge variant="secondary">{assetsCount} Assets</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {criticalCount > 0 
                      ? `${criticalCount} images using external Supabase URLs need fixing`
                      : 'All images are properly configured'
                    }
                  </CardDescription>
                </div>
                <BulkFixButton 
                  category={category}
                  items={categoryImages}
                  onFixComplete={fetchImages}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Alt Text</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryImages.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <ImagePreview 
                          url={item.url} 
                          alt={item.alt} 
                          status={item.status}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.source}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded max-w-xs truncate">
                            {item.url}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(item.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {item.alt || 'No alt text'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ImageStatusBadge status={item.status} />
                      </TableCell>
                      <TableCell>
                        <ImageFixButton 
                          item={item}
                          onFixComplete={fetchImages}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};