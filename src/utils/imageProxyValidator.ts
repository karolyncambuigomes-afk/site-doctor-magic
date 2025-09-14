import { toast } from 'sonner';

interface ValidationResult {
  isAvailable: boolean;
  responseTime?: number;
  error?: string;
}

export async function validateImageProxy(): Promise<ValidationResult> {
  try {
    const start = Date.now();
    
    // Test the image proxy endpoint
    const response = await fetch('/images/health.png', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    
    const responseTime = Date.now() - start;
    
    if (response.ok) {
      return {
        isAvailable: true,
        responseTime
      };
    } else {
      return {
        isAvailable: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      isAvailable: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testImageUrl(url: string): Promise<{
  status: number;
  isLocal: boolean;
  responseTime: number;
}> {
  const start = Date.now();
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const responseTime = Date.now() - start;
    
    return {
      status: response.status,
      isLocal: url.includes('/images/'),
      responseTime
    };
  } catch (error) {
    return {
      status: 500,
      isLocal: url.includes('/images/'),
      responseTime: Date.now() - start
    };
  }
}

export async function batchTestImages(urls: string[]): Promise<Map<string, {
  status: number;
  isLocal: boolean;
  responseTime: number;
}>> {
  const results = new Map();
  
  // Test in batches of 5 to avoid overwhelming the server
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchPromises = batch.map(url => testImageUrl(url));
    const batchResults = await Promise.all(batchPromises);
    
    batch.forEach((url, index) => {
      results.set(url, batchResults[index]);
    });
    
    // Small delay between batches
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

export function getImageUrlsFromDOM(): {
  banners: string[];
  models: string[];
  carousel: string[];
  blog: string[];
} {
  const banners: string[] = [];
  const models: string[] = [];
  const carousel: string[] = [];
  const blog: string[] = [];
  
  // Banner images
  document.querySelectorAll('[data-hero-image]').forEach(img => {
    const src = (img as HTMLImageElement).src;
    if (src) banners.push(src);
  });
  
  // Model images
  document.querySelectorAll('[data-model-image]').forEach(img => {
    const src = (img as HTMLImageElement).src;
    if (src) models.push(src);
  });
  
  // Carousel images
  document.querySelectorAll('[data-carousel-image]').forEach(img => {
    const src = (img as HTMLImageElement).src;
    if (src) carousel.push(src);
  });
  
  // Blog images
  document.querySelectorAll('[data-blog-image]').forEach(img => {
    const src = (img as HTMLImageElement).src;
    if (src) blog.push(src);
  });
  
  return { banners, models, carousel, blog };
}

export async function autoFixBrokenImage(
  imageUrl: string,
  category: string,
  itemId?: string,
  tableName?: string,
  fieldName?: string
): Promise<boolean> {
  try {
    const response = await fetch(`https://jiegopvbwpyfohhfvmwo.supabase.co/functions/v1/sync-image-to-local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl,
        category,
        itemId,
        tableName,
        fieldName
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      toast.success(`Fixed image: ${result.filename}`);
      return true;
    } else {
      const error = await response.text();
      toast.error(`Failed to fix image: ${error}`);
      return false;
    }
  } catch (error) {
    console.error('Auto-fix error:', error);
    toast.error('Failed to auto-fix image');
    return false;
  }
}