import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, Clock, List } from 'lucide-react';

interface IndexItem {
  id: string;
  title: string;
  level: number;
}

interface BlogContentIndexProps {
  content: string;
  slug: string;
}

export const BlogContentIndex: React.FC<BlogContentIndexProps> = ({ content }) => {
  const [indexItems, setIndexItems] = useState<IndexItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const headings = Array.from(tempDiv.querySelectorAll('h2, h3'));
    const items: IndexItem[] = headings.map((heading, index) => ({
      id: `section-${index}`,
      title: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }));
    
    setIndexItems(items);
  }, [content]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6, rootMargin: '-80px 0px -80px 0px' }
    );

    indexItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [indexItems]);

  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (indexItems.length === 0) return null;

  return (
    <Card className="p-6 border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg sticky top-24 z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <List className="w-5 h-5 text-gray-600" />
          <h3 className="luxury-heading-sm text-black">Content Index</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-black"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {indexItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-gray-100 text-black font-medium border-l-4 border-gray-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              } ${item.level === 3 ? 'ml-4 text-sm' : 'text-base'}`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 opacity-60" />
                <span className="luxury-body-md leading-snug">{item.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Estimated read: {Math.ceil(content.length / 1000)} min</span>
        </div>
      </div>
    </Card>
  );
};