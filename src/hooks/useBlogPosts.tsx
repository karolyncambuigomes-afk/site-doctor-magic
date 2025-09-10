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

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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

  const categories = [...new Set(posts.map(post => post.category))];

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