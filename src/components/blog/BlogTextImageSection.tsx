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
  const aspectVariations = ['aspect-[4/3]', 'aspect-[3/2]', 'aspect-video', 'aspect-[5/4]'];
  const currentAspect = aspectVariations[index % aspectVariations.length];
  
  return (
    <article className="my-20" id={`section-${index}`}>
      {title && (
        <header className="mb-16">
          <h2 className="luxury-heading-lg text-black font-light text-center mb-4">
            {title}
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
        </header>
      )}
      
      {imageSrc ? (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start ${imagePosition === 'left' ? 'lg:grid-flow-col-dense' : ''}`}>
          <div className={`space-y-8 ${imagePosition === 'left' ? 'lg:col-start-2' : ''}`}>
            <div 
              className="prose prose-lg max-w-none
                [&>h3]:luxury-heading-md [&>h3]:text-black [&>h3]:mt-10 [&>h3]:mb-8 [&>h3]:font-medium [&>h3]:leading-tight
                [&>h4]:luxury-heading-sm [&>h4]:text-black [&>h4]:mt-8 [&>h4]:mb-6 [&>h4]:font-medium
                [&>p]:luxury-body-lg [&>p]:text-black [&>p]:leading-relaxed [&>p]:mb-8 [&>p]:text-justify
                [&>li]:text-black [&>li]:leading-relaxed [&>li]:mb-4 [&>li]:pl-2
                [&>strong]:text-black [&>strong]:font-semibold
                [&>ul]:my-10 [&>ol]:my-10 [&>ul]:bg-gradient-to-r [&>ul]:from-gray-50 [&>ul]:to-gray-100/50 [&>ul]:p-8 [&>ul]:rounded-2xl [&>ul]:border-l-4 [&>ul]:border-gray-600 [&>ul]:shadow-sm
                [&>blockquote]:border-l-4 [&>blockquote]:border-gray-600 [&>blockquote]:pl-8 [&>blockquote]:pr-6
                [&>blockquote]:italic [&>blockquote]:text-black [&>blockquote]:bg-gradient-to-r [&>blockquote]:from-gray-50 [&>blockquote]:to-gray-100/30 [&>blockquote]:py-8 [&>blockquote]:rounded-r-2xl [&>blockquote]:my-10 [&>blockquote]:shadow-sm
                [&>em]:text-black [&>em]:font-medium"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          
          <div className={`${imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            <div className="relative group sticky top-8">
              <div className={`${currentAspect} rounded-3xl overflow-hidden shadow-2xl bg-gray-100 transform hover:scale-105 transition-all duration-500`}>
                <img 
                  src={imageSrc}
                  alt={`${title || 'Content'} - Luxury experience ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div 
            className="prose prose-xl max-w-none
              [&>h3]:luxury-heading-md [&>h3]:text-black [&>h3]:mt-12 [&>h3]:mb-8 [&>h3]:font-medium [&>h3]:text-center [&>h3]:leading-tight
              [&>h4]:luxury-heading-sm [&>h4]:text-black [&>h4]:mt-10 [&>h4]:mb-6 [&>h4]:font-medium
              [&>p]:luxury-body-lg [&>p]:text-black [&>p]:leading-relaxed [&>p]:mb-8 [&>p]:text-justify [&>p]:first-letter:text-4xl [&>p]:first-letter:font-light [&>p]:first-letter:text-black [&>p]:first-letter:mr-2 [&>p]:first-letter:float-left [&>p]:first-letter:leading-none
              [&>li]:text-black [&>li]:leading-relaxed [&>li]:mb-4 [&>li]:pl-2
              [&>strong]:text-black [&>strong]:font-semibold
              [&>ul]:my-10 [&>ol]:my-10 [&>ul]:bg-gradient-to-br [&>ul]:from-gray-50 [&>ul]:to-gray-100/50 [&>ul]:p-10 [&>ul]:rounded-2xl [&>ul]:border-l-4 [&>ul]:border-gray-600 [&>ul]:shadow-lg
              [&>blockquote]:border-l-4 [&>blockquote]:border-gray-600 [&>blockquote]:pl-10 [&>blockquote]:pr-8
              [&>blockquote]:italic [&>blockquote]:text-black [&>blockquote]:bg-gradient-to-r [&>blockquote]:from-gray-50 [&>blockquote]:to-gray-100/30 [&>blockquote]:py-10 [&>blockquote]:rounded-r-2xl [&>blockquote]:my-12 [&>blockquote]:shadow-lg [&>blockquote]:text-xl
              [&>em]:text-black [&>em]:font-medium"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </article>
  );
};