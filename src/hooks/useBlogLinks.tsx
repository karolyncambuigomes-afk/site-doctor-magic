import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BlogLink {
  slug: string;
  title: string;
  service_keywords: string[];
}

export const useBlogLinks = () => {
  const [blogLinks, setBlogLinks] = useState<BlogLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('slug, title, service_keywords')
          .eq('is_published', true)
          .not('service_keywords', 'is', null);

        if (error) {
          console.error('Error fetching blog links:', error);
          return;
        }

        setBlogLinks(data || []);
      } catch (error) {
        console.error('Error fetching blog links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogLinks();
  }, []);

  const getBlogLinkForKeyword = (keyword: string): string | null => {
    const blog = blogLinks.find(blog => 
      blog.service_keywords?.includes(keyword)
    );
    return blog ? `/blog/${blog.slug}` : null;
  };

  const getBlogTitleForKeyword = (keyword: string): string | null => {
    const blog = blogLinks.find(blog => 
      blog.service_keywords?.includes(keyword)
    );
    return blog?.title || null;
  };

  return {
    blogLinks,
    loading,
    getBlogLinkForKeyword,
    getBlogTitleForKeyword
  };
};