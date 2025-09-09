import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Twitter, Facebook, Search } from 'lucide-react';

interface SEOPreviewCardProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'google' | 'twitter' | 'facebook';
}

export const SEOPreviewCard: React.FC<SEOPreviewCardProps> = ({
  title,
  description,
  url = 'https://fivelondon.com',
  image,
  type = 'google'
}) => {
  const truncateTitle = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const truncateDescription = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (type === 'google') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Search className="h-4 w-4" />
            Google Search Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              {url}
            </div>
            <div className="text-blue-600 hover:underline cursor-pointer text-lg">
              {truncateTitle(title, 60)}
            </div>
            <div className="text-sm text-muted-foreground">
              {truncateDescription(description, 160)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'twitter') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Twitter className="h-4 w-4" />
            Twitter Card Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {image && (
              <div className="h-32 bg-muted flex items-center justify-center">
                <img src={image} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-3 space-y-1">
              <div className="text-xs text-muted-foreground uppercase">
                {new URL(url).hostname}
              </div>
              <div className="font-medium text-sm">
                {truncateTitle(title, 70)}
              </div>
              <div className="text-xs text-muted-foreground">
                {truncateDescription(description, 125)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'facebook') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Facebook className="h-4 w-4" />
            Facebook Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {image && (
              <div className="h-40 bg-muted flex items-center justify-center">
                <img src={image} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-3 space-y-2">
              <div className="text-xs text-muted-foreground uppercase">
                {new URL(url).hostname}
              </div>
              <div className="font-medium">
                {truncateTitle(title, 95)}
              </div>
              <div className="text-sm text-muted-foreground">
                {truncateDescription(description, 300)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};