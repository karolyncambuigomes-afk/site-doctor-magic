import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, DollarSign } from 'lucide-react';

interface BlogVenueCardProps {
  title: string;
  content: string;
  imageSrc?: string;
}

export const BlogVenueCard: React.FC<BlogVenueCardProps> = ({ title, content, imageSrc }) => {
  const lines = content.split('<br>').filter(line => line.trim());
  const venueInfo: Record<string, string> = {};
  
  lines.forEach(line => {
    const strongMatch = line.match(/<strong>(.*?):<\/strong>\s*(.*)/);
    if (strongMatch) {
      venueInfo[strongMatch[1]] = strongMatch[2];
    }
  });

  return (
    <article className="my-20">
      <Card className="shadow-2xl overflow-hidden rounded-3xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
        {imageSrc && (
          <div className="aspect-[21/9] bg-muted relative overflow-hidden">
            <img 
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="luxury-heading-lg text-primary-foreground font-light drop-shadow-2xl mb-2">
                {title}
              </h3>
              <div className="w-16 h-1 bg-primary-foreground/80 rounded-full"></div>
            </div>
          </div>
        )}
        
        <CardHeader className={imageSrc ? 'pb-4' : 'pb-6'}>
          {!imageSrc && (
            <CardTitle className="luxury-heading-md flex items-center gap-3 justify-center">
              <MapPin className="w-6 h-6 text-primary" />
              {title}
            </CardTitle>
          )}
        </CardHeader>
        
        <CardContent className="px-10 pb-10">
          <div className="bg-muted rounded-2xl p-8 shadow-inner">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="luxury-body-md font-semibold border-r">
                    Aspect
                  </TableHead>
                  <TableHead className="luxury-body-md font-semibold">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(venueInfo).map(([key, value], index) => (
                  <TableRow 
                    key={key} 
                    className="hover:bg-card transition-colors"
                  >
                    <TableCell className="font-semibold flex items-center gap-3 border-r py-4">
                      {key === 'Specialty' && <Star className="w-5 h-5 text-amber-500" />}
                      {key === 'Average price' && <DollarSign className="w-5 h-5 text-green-600" />}
                      {key === 'Atmosphere' && <Clock className="w-5 h-5 text-blue-500" />}
                      <span className="luxury-body-md">{key}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {key === 'Average price' ? (
                        <Badge variant="secondary" className="font-semibold px-4 py-2">
                          {value}
                        </Badge>
                      ) : (
                        <span className="luxury-body-md leading-relaxed">{value}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};