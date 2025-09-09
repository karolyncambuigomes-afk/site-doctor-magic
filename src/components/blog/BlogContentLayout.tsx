import React from 'react';
import { Separator } from '@/components/ui/separator';
import { BlogTextImageSection } from './BlogTextImageSection';
import { BlogVenueCard } from './BlogVenueCard';
import { getImageForContent } from '@/data/blog-images';

interface BlogSection {
  title: string;
  content: string;
  type: 'text' | 'venue';
}

interface BlogContentLayoutProps {
  content: string;
  slug: string;
}

export const BlogContentLayout: React.FC<BlogContentLayoutProps> = ({ content, slug }) => {
  const parseContent = (htmlContent: string): BlogSection[] => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const sections: BlogSection[] = [];
    let currentSection: BlogSection = { title: '', content: '', type: 'text' };
    
    Array.from(tempDiv.children).forEach((element, index) => {
      if (element.tagName === 'H2') {
        if (currentSection.content) {
          sections.push(currentSection);
        }
        currentSection = { title: element.textContent || '', content: '', type: 'text' };
      } else if (element.tagName === 'H3') {
        if (currentSection.content) {
          sections.push(currentSection);
        }
        
        // Check if this might be restaurant/venue info that should be in a table
        const nextElements = Array.from(tempDiv.children).slice(index + 1, index + 4);
        const hasStructuredInfo = nextElements.some(el => 
          el.textContent?.includes('Specialty:') || 
          el.textContent?.includes('Atmosphere:') || 
          el.textContent?.includes('Average price:') ||
          el.textContent?.includes('Location:') ||
          el.textContent?.includes('Date:')
        );
        
        currentSection = { 
          title: element.textContent || '', 
          content: '', 
          type: hasStructuredInfo ? 'venue' : 'text' 
        };
      } else {
        currentSection.content += element.outerHTML;
      }
    });
    
    if (currentSection.content) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const sections = parseContent(content);

  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        const imageSrc = getImageForContent(slug, section.title, index);
        const imagePosition = index % 2 === 0 ? 'right' : 'left';
        
        return (
          <React.Fragment key={index}>
            {section.type === 'venue' ? (
              <BlogVenueCard 
                title={section.title}
                content={section.content}
                imageSrc={imageSrc || undefined}
              />
            ) : (
              <BlogTextImageSection
                title={section.title}
                content={section.content}
                imageSrc={imageSrc || undefined}
                imagePosition={imagePosition}
                index={index}
              />
            )}
            
            {index < sections.length - 1 && (
              <Separator className="my-20 bg-gray-300 h-px max-w-2xl mx-auto" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};