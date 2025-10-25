import { supabase } from '@/integrations/supabase/client';
import { blogArticles } from '@/data/blog-articles';
import { toast } from 'sonner';

export const migrateBlogDataToDatabase = async () => {
  try {
    console.log('Iniciando migração dos artigos do blog...');
    
    // Transform blog articles to match database structure
    const blogPostsData = blogArticles.map(article => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      author: article.author,
      category: article.category,
      meta_description: article.metaDescription,
      seo_keywords: article.seoKeywords,
      read_time: article.readTime,
      is_published: true,
      published_at: new Date(article.publishedAt).toISOString(),
      service_keywords: article.serviceAreas || [],
      created_at: new Date(article.publishedAt).toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Check which articles already exist
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('slug')
      .in('slug', blogPostsData.map(post => post.slug));

    const existingSlugs = new Set(existingPosts?.map(post => post.slug) || []);
    
    // Filter out articles that already exist
    const newPosts = blogPostsData.filter(post => !existingSlugs.has(post.slug));
    
    if (newPosts.length === 0) {
      console.log('Todos os artigos já existem na base de dados');
      return { success: true, message: 'Todos os artigos já existem na base de dados' };
    }

    // Insert new posts in batches to avoid hitting limits
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < newPosts.length; i += batchSize) {
      const batch = newPosts.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('blog_posts')
        .insert(batch);

      if (error) {
        console.error('Erro ao inserir batch:', error);
        throw error;
      }
      
      successCount += batch.length;
      console.log(`Migrados ${successCount}/${newPosts.length} artigos...`);
    }

    console.log(`Migração concluída! ${successCount} artigos migrados com sucesso.`);
    return { 
      success: true, 
      message: `${successCount} artigos migrados com sucesso!`,
      migratedCount: successCount 
    };
    
  } catch (error) {
    console.error('Erro durante a migração:', error);
    return { 
      success: false, 
      message: `Erro durante a migração: ${error.message}`,
      error 
    };
  }
};

// Function to check migration status
export const checkMigrationStatus = async () => {
  try {
    const { data: dbPosts, error: dbError } = await supabase
      .from('blog_posts')
      .select('slug, title')
      .eq('is_published', true);

    if (dbError) throw dbError;

    const staticCount = blogArticles.length;
    const dbCount = dbPosts?.length || 0;
    
    return {
      staticArticles: staticCount,
      databasePosts: dbCount,
      needsMigration: dbCount < staticCount,
      missingPosts: staticCount - dbCount
    };
  } catch (error) {
    console.error('Erro ao verificar status da migração:', error);
    return {
      staticArticles: blogArticles.length,
      databasePosts: 0,
      needsMigration: true,
      missingPosts: blogArticles.length,
      error: error.message
    };
  }
};