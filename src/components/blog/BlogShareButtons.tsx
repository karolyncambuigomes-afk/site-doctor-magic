import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Linkedin, Link2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogShareButtonsProps {
  title: string;
  url: string;
  description: string;
}

export const BlogShareButtons: React.FC<BlogShareButtonsProps> = ({ title, url, description }) => {
  const { toast } = useToast();
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-50 hover:text-blue-800'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-50 hover:text-blue-700'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'hover:bg-gray-50 hover:text-gray-700'
    }
  ];

  return (
    <div className="flex items-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5 text-gray-600" />
        <span className="luxury-body-md font-medium text-gray-800">Share this article:</span>
      </div>
      
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="ghost"
            size="sm"
            onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
            className={`text-gray-600 transition-colors ${link.color}`}
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="w-4 h-4" />
          </Button>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          aria-label="Copy link"
        >
          <Link2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};