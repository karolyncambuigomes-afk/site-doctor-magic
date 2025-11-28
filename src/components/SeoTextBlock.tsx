import React from 'react';
import { useSeoText } from '@/hooks/useSeoText';

interface SeoTextBlockProps {
  sectionName: string;
}

export const SeoTextBlock: React.FC<SeoTextBlockProps> = ({ sectionName }) => {
  const { data, loading } = useSeoText(sectionName);

  // Don't render anything if no data or still loading
  if (loading || !data || !data.content) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="container-width px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {data.title && (
            <h2 className="luxury-heading-lg text-foreground mb-6 text-center">
              {data.title}
            </h2>
          )}
          <div 
            className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </div>
    </section>
  );
};
