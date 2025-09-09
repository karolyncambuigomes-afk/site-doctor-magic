import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, Clock, DollarSign } from 'lucide-react';

interface BlogContentRendererProps {
  content: string;
  slug: string;
}

export const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ content, slug }) => {
  const images = [
    '/images/model1.jpg',
    '/images/model2.jpg', 
    '/images/model3.jpg',
    '/images/model4.jpg',
    '/images/kate1.jpg',
    '/images/luisa1.jpg'
  ];

  const parseContent = (htmlContent: string) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const sections = [];
    let currentSection = { title: '', content: '', type: 'text' };
    let imageIndex = 0;
    
    // Parse HTML elements
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
    
    return sections.map((section, index) => {
      // Add image every 2-3 sections
      const shouldAddImage = index > 0 && index % 2 === 0 && imageIndex < images.length;
      const imageToAdd = shouldAddImage ? images[imageIndex++] : null;
      
      return {
        ...section,
        image: imageToAdd,
        position: index % 2 === 0 ? 'left' : 'right'
      };
    });
  };

  const renderVenueTable = (content: string, title: string) => {
    const lines = content.split('<br>').filter(line => line.trim());
    const venueInfo: Record<string, string> = {};
    
    lines.forEach(line => {
      const strongMatch = line.match(/<strong>(.*?):<\/strong>\s*(.*)/);
      if (strongMatch) {
        venueInfo[strongMatch[1]] = strongMatch[2];
      }
    });

    return (
      <Card className="my-8 border border-gray-200 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="luxury-heading-md text-black flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="luxury-body-sm font-medium">Aspect</TableHead>
                <TableHead className="luxury-body-sm font-medium">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(venueInfo).map(([key, value]) => (
                <TableRow key={key} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-black flex items-center gap-2">
                    {key === 'Specialty' && <Star className="w-4 h-4 text-amber-500" />}
                    {key === 'Average price' && <DollarSign className="w-4 h-4 text-green-600" />}
                    {key === 'Atmosphere' && <Clock className="w-4 h-4 text-blue-500" />}
                    {key}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {key === 'Average price' ? (
                      <Badge variant="secondary" className="font-medium bg-gray-100 text-gray-800">
                        {value}
                      </Badge>
                    ) : (
                      value
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderImageSection = (imageSrc: string, position: 'left' | 'right', index: number) => (
    <div className="my-16 flex justify-center">
      <div className="relative group max-w-2xl w-full">
        <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-xl bg-gray-100">
          <img 
            src={imageSrc}
            alt={`Luxury experience ${index + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );

  const sections = parseContent(content);

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          {section.image && renderImageSection(section.image, section.position, index)}
          
          <div className="space-y-6">
            {section.title && (
              <h2 className="luxury-heading-lg text-black font-light border-b border-gray-200 pb-4 mb-8">
                {section.title}
              </h2>
            )}
            
            {section.type === 'venue' ? (
              renderVenueTable(section.content, section.title)
            ) : (
              <div 
                className="prose prose-lg max-w-none
                  [&>h3]:luxury-heading-md [&>h3]:text-black [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:font-light
                  [&>h4]:luxury-heading-sm [&>h4]:text-black [&>h4]:mt-6 [&>h4]:mb-3 [&>h4]:font-light
                  [&>p]:luxury-body-lg [&>p]:text-gray-800 [&>p]:leading-relaxed [&>p]:mb-6
                  [&>li]:text-gray-700 [&>li]:leading-relaxed [&>li]:mb-2
                  [&>strong]:text-black [&>strong]:font-semibold
                  [&>ul]:my-6 [&>ol]:my-6 [&>ul]:bg-gray-50 [&>ul]:p-6 [&>ul]:rounded-lg
                  [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-6
                  [&>blockquote]:italic [&>blockquote]:text-gray-700 [&>blockquote]:bg-gray-50 [&>blockquote]:py-4 [&>blockquote]:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
          </div>
          
          {index < sections.length - 1 && (
            <Separator className="my-16 bg-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};