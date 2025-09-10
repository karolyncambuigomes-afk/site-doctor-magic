import { supabase } from '@/integrations/supabase/client';

interface MigrationItem {
  id: string;
  name?: string;
  title?: string;
  model_name?: string;
  imageUrl: string;
  category: string;
  tableName: string;
  fieldName: string;
}

interface MigrationResult {
  success: boolean;
  localUrl?: string;
  error?: string;
  item: MigrationItem;
}

export const executeMigration = async (): Promise<{
  totalProcessed: number;
  successCount: number;
  failedCount: number;
  results: MigrationResult[];
}> => {
  console.log('🚀 Starting migration of 8 pending items...');
  
  // Define all 8 items to migrate
  const itemsToMigrate: MigrationItem[] = [
    // Models (5)
    {
      id: '95437c3e-58d2-4be5-b208-ff582a43f036',
      name: 'Kate',
      imageUrl: 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757257125604-b9fbajld87d.jpeg',
      category: 'models',
      tableName: 'models',
      fieldName: 'image'
    },
    {
      id: '7a60e995-0daa-423e-9864-050081d11c3f',
      name: 'Livia',
      imageUrl: 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757374964208-wfvq5ryuyv.jpeg',
      category: 'models',
      tableName: 'models',
      fieldName: 'image'
    },
    {
      id: '307b4245-13d4-4346-94c5-2dd9ed1e5517',
      name: 'Ana',
      imageUrl: 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757446204072-obm2dpbzsyj.jpeg',
      category: 'models',
      tableName: 'models',
      fieldName: 'image'
    },
    {
      id: '02268d9b-8fcd-4a9d-ae20-c857997c186a',
      name: 'Carolina',
      imageUrl: 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757442283812-73eihmr4sup.jpeg',
      category: 'models',
      tableName: 'models',
      fieldName: 'image'
    },
    {
      id: '95a0e395-aa8d-41b1-af08-783d6c1df6da',
      name: 'Vic',
      imageUrl: 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757514053331-oci3cuzmnrn.jpeg',
      category: 'models',
      tableName: 'models',
      fieldName: 'image'
    },
    // Homepage Carousel (2)
    {
      id: '9529a9cc-b277-48cd-a8ce-4ef2bdac3b1f',
      model_name: 'Kate',
      imageUrl: 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757257125604-b9fbajld87d.jpeg',
      category: 'homepage_carousel',
      tableName: 'homepage_carousel',
      fieldName: 'image_url'
    },
    {
      id: '4518300f-a152-4a43-ad67-a796f8267cd0',
      model_name: 'Livia',
      imageUrl: 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757374964208-wfvq5ryuyv.jpeg',
      category: 'homepage_carousel',
      tableName: 'homepage_carousel',
      fieldName: 'image_url'
    },
    // Hero Slide (1)
    {
      id: '575d935e-2302-4865-95d1-c46b4ec244cb',
      title: 'Novo Slide',
      imageUrl: 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757269373610-hi0hjfmoe1s.jpeg',
      category: 'hero_slides',
      tableName: 'hero_slides',
      fieldName: 'image_url'
    }
  ];

  const results: MigrationResult[] = [];
  let successCount = 0;
  let failedCount = 0;

  console.log(`📋 Processing ${itemsToMigrate.length} items...`);

  // Process each item
  for (const item of itemsToMigrate) {
    try {
      const itemName = item.name || item.model_name || item.title || `item-${item.id}`;
      console.log(`🔄 Processing: ${item.category} - ${itemName}`);

      const { data: result, error } = await supabase.functions.invoke('fix-image-to-local', {
        body: {
          imageUrl: item.imageUrl,
          category: item.category,
          itemId: item.id,
          tableName: item.tableName,
          fieldName: item.fieldName,
          itemName: itemName.toLowerCase().replace(/\s+/g, '-'),
          altText: item.category === 'models' 
            ? `${itemName} — elite companion in London`
            : 'Exclusive Five London — luxury companions'
        }
      });

      if (error) {
        console.error(`❌ Error processing ${itemName}:`, error);
        results.push({ success: false, error: error.message, item });
        failedCount++;
        continue;
      }

      if (result?.success) {
        console.log(`✅ Successfully migrated ${itemName} to ${result.localUrl}`);
        results.push({ success: true, localUrl: result.localUrl, item });
        successCount++;
      } else {
        console.error(`❌ Failed to migrate ${itemName}:`, result?.error);
        results.push({ success: false, error: result?.error || 'Unknown error', item });
        failedCount++;
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`❌ Exception processing item ${item.id}:`, error);
      results.push({ success: false, error: String(error), item });
      failedCount++;
    }
  }

  // Purge cache and refresh service worker
  console.log('🔄 Purging cache and refreshing service worker...');
  try {
    // Clear service worker cache
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      navigator.serviceWorker.controller.postMessage({ type: 'CLIENTS_CLAIM' });
    }

    // Force reload stylesheets and images
    const images = document.querySelectorAll('img[src*="/images/"]');
    images.forEach(img => {
      const imgElement = img as HTMLImageElement;
      const src = imgElement.getAttribute('src');
      if (src) {
        imgElement.src = src + '?t=' + Date.now();
      }
    });

    console.log('✅ Cache purged and service worker refreshed');
  } catch (error) {
    console.error('⚠️ Error purging cache:', error);
  }

  // Final report
  console.log(`\n📊 MIGRATION COMPLETE`);
  console.log(`Total items: ${itemsToMigrate.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failedCount}`);
  
  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    console.log('\n✅ Successfully migrated:');
    successful.forEach(r => {
      const name = r.item.name || r.item.model_name || r.item.title;
      console.log(`  - ${r.item.category}: ${name} → ${r.localUrl}`);
    });
  }

  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed migrations (keeping external):');
    failed.forEach(r => {
      const name = r.item.name || r.item.model_name || r.item.title;
      console.log(`  - ${r.item.category}: ${name} → ${r.error}`);
    });
  }

  return {
    totalProcessed: itemsToMigrate.length,
    successCount,
    failedCount,
    results
  };
};