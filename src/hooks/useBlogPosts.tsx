import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  meta_description: string;
  seo_keywords: string;
  read_time: number;
  is_published: boolean;
  published_at: string;
  service_keywords: string[];
  created_at: string;
  updated_at: string;
}

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Helper: timeout wrapper to avoid hanging requests
      const withTimeout = <T,>(promise: PromiseLike<T>, ms = 4000): Promise<T> => {
        return new Promise((resolve, reject) => {
          const id = setTimeout(() => reject(new Error(`supabase_timeout_${ms}ms`)), ms);
          Promise.resolve(promise)
            .then((res) => {
              clearTimeout(id);
              resolve(res as T);
            })
            .catch((err) => {
              clearTimeout(id);
              reject(err);
            });
        });
      };

      console.log('[Blog] Fetching posts from Supabase...');

      // Try to fetch from database first (with timeout)
      const { data, error: fetchError } = await withTimeout(
        supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        4000
      );

      if (fetchError) {
        throw fetchError;
      }

      // If we have posts in database, use them
      if (data && (data as any[]).length > 0) {
        console.log('[Blog] Loaded posts from Supabase:', (data as any[]).length);
        // Normalize published_at to ensure cross-browser compatibility
        const normalizedPosts = (data as any[]).map(post => ({
          ...post,
          published_at: post.published_at ? post.published_at.replace(' ', 'T') : post.published_at
        }));
        setPosts(normalizedPosts);
      } else {
        console.warn('[Blog] No DB posts. Falling back to static articles.');
        // Import static articles as fallback
        const { blogArticles } = await import('@/data/blog-articles');
        const staticPosts = blogArticles.map(article => ({
          id: article.slug,
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
          published_at: article.publishedAt,
          service_keywords: article.serviceAreas || [],
          created_at: article.publishedAt,
          updated_at: new Date().toISOString()
        }));
        setPosts(staticPosts);
      }
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      // Try to load static articles as final fallback
      try {
        console.warn('[Blog] Attempting static fallback due to error...');
        const { blogArticles } = await import('@/data/blog-articles');
        const staticPosts = blogArticles.map(article => ({
          id: article.slug,
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
          published_at: article.publishedAt ? article.publishedAt.replace(' ', 'T') : article.publishedAt,
          service_keywords: article.serviceAreas || [],
          created_at: article.publishedAt ? article.publishedAt.replace(' ', 'T') : article.publishedAt,
          updated_at: new Date().toISOString()
        }));
        setPosts(staticPosts);
        setError(null); // Clear error since we have fallback data
      } catch (fallbackErr: any) {
        setError(err?.message || 'Failed to load blog posts');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // Set up real-time subscription for blog posts changes
    const channel = supabase
      .channel('blog-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        (payload) => {
          console.log('Blog posts database change detected:', payload);
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getPostBySlug = (slug: string): BlogPost | undefined => {
    return posts.find(post => post.slug === slug);
  };

  const getPostsByCategory = (category: string): BlogPost[] => {
    return posts.filter(post => post.category === category);
  };

  const getRelatedPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
    return posts
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
  };

  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    getPostBySlug,
    getPostsByCategory,
    getRelatedPosts,
    categories
  };
};