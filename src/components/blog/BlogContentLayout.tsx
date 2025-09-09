import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { BlogTextImageSection } from './BlogTextImageSection';
import { BlogVenueCard } from './BlogVenueCard';
import { BlogContentIndex } from './BlogContentIndex';
import { BlogProgressBar } from './BlogProgressBar';
import { BlogShareButtons } from './BlogShareButtons';
import { getImageForContent } from '@/data/blog-images';
import { processContentWithEntityLinks } from '@/utils/entityLinker';

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
  // Process content with entity links for SEO
  const processedContent = processContentWithEntityLinks(content);
  
  // Add section IDs to content for navigation
  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedContent;
    
    Array.from(tempDiv.querySelectorAll('h2, h3')).forEach((heading, index) => {
      heading.id = `section-${index}`;
    });
    
    // Update DOM with IDs
    setTimeout(() => {
      document.querySelectorAll('h2, h3').forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `section-${index}`;
        }
      });
    }, 100);
  }, [processedContent]);

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

  const sections = parseContent(processedContent);

  const currentUrl = `${window.location.origin}/blog/${slug}`;
  const firstSection = sections[0];

  return (
    <>
      <BlogProgressBar />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
        {/* Content Index - Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24">
            <BlogContentIndex content={processedContent} slug={slug} />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="space-y-12">
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
                    <Separator className="my-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px max-w-2xl mx-auto" />
                  )}
                </React.Fragment>
              );
            })}

            {/* Share Section */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <BlogShareButtons 
                title={firstSection?.title || 'Luxury London Experience'}
                url={currentUrl}
                description={firstSection?.content.substring(0, 150) || 'Discover luxury experiences in London'}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};