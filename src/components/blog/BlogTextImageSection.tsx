import React from 'react';

interface BlogTextImageSectionProps {
  title: string;
  content: string;
  imageSrc?: string;
  imagePosition?: 'left' | 'right';
  index: number;
}

export const BlogTextImageSection: React.FC<BlogTextImageSectionProps> = ({
  title,
  content,
  imageSrc,
  imagePosition = 'right',
  index
}) => {
  return (
    <div className="my-16">
      {title && (
        <h2 className="luxury-heading-lg text-black font-light border-b border-gray-200 pb-4 mb-12 text-center">
          {title}
        </h2>
      )}
      
      {imageSrc ? (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${imagePosition === 'left' ? 'lg:grid-flow-col-dense' : ''}`}>
          <div className={`space-y-6 ${imagePosition === 'left' ? 'lg:col-start-2' : ''}`}>
            <div 
              className="prose prose-lg max-w-none
                [&>h3]:luxury-heading-md [&>h3]:text-black [&>h3]:mt-8 [&>h3]:mb-6 [&>h3]:font-light
                [&>h4]:luxury-heading-sm [&>h4]:text-black [&>h4]:mt-6 [&>h4]:mb-4 [&>h4]:font-light
                [&>p]:luxury-body-lg [&>p]:text-gray-800 [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-justify
                [&>li]:text-gray-700 [&>li]:leading-relaxed [&>li]:mb-3
                [&>strong]:text-black [&>strong]:font-semibold
                [&>ul]:my-8 [&>ol]:my-8 [&>ul]:bg-gray-50 [&>ul]:p-8 [&>ul]:rounded-lg [&>ul]:border-l-4 [&>ul]:border-blue-500
                [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-8
                [&>blockquote]:italic [&>blockquote]:text-gray-700 [&>blockquote]:bg-gray-50 [&>blockquote]:py-6 [&>blockquote]:rounded-r-lg [&>blockquote]:my-8"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          
          <div className={`${imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            <div className="relative group sticky top-8">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <img 
                  src={imageSrc}
                  alt={`${title || 'Content'} - Luxury experience ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg max-w-none
              [&>h3]:luxury-heading-md [&>h3]:text-black [&>h3]:mt-8 [&>h3]:mb-6 [&>h3]:font-light [&>h3]:text-center
              [&>h4]:luxury-heading-sm [&>h4]:text-black [&>h4]:mt-6 [&>h4]:mb-4 [&>h4]:font-light
              [&>p]:luxury-body-lg [&>p]:text-gray-800 [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-justify
              [&>li]:text-gray-700 [&>li]:leading-relaxed [&>li]:mb-3
              [&>strong]:text-black [&>strong]:font-semibold
              [&>ul]:my-8 [&>ol]:my-8 [&>ul]:bg-gray-50 [&>ul]:p-8 [&>ul]:rounded-lg [&>ul]:border-l-4 [&>ul]:border-blue-500
              [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-8
              [&>blockquote]:italic [&>blockquote]:text-gray-700 [&>blockquote]:bg-gray-50 [&>blockquote]:py-6 [&>blockquote]:rounded-r-lg [&>blockquote]:my-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
};