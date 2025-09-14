import React from 'react';
import { BlogContentLayout } from './blog/BlogContentLayout';

interface BlogContentRendererProps {
  content: string;
  slug: string;
}

export const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ content, slug }) => {
  return <BlogContentLayout content={content} slug={slug} />;
};