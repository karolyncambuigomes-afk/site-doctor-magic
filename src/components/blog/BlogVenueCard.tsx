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
      <Card className="border border-gray-200 bg-white shadow-2xl overflow-hidden rounded-3xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
        {imageSrc && (
          <div className="aspect-[21/9] bg-gray-100 relative overflow-hidden">
            <img 
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="luxury-heading-lg text-white font-light drop-shadow-2xl mb-2">
                {title}
              </h3>
              <div className="w-16 h-1 bg-white/80 rounded-full"></div>
            </div>
          </div>
        )}
        
        <CardHeader className={imageSrc ? 'pb-4' : 'pb-6'}>
          {!imageSrc && (
            <CardTitle className="luxury-heading-md text-black flex items-center gap-3 justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
              {title}
            </CardTitle>
          )}
        </CardHeader>
        
        <CardContent className="px-10 pb-10">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-8 shadow-inner">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="luxury-body-md font-semibold text-black border-r border-gray-200">
                    Aspect
                  </TableHead>
                  <TableHead className="luxury-body-md font-semibold text-black">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(venueInfo).map(([key, value], index) => (
                  <TableRow 
                    key={key} 
                    className={`hover:bg-white transition-colors border-gray-200 ${index % 2 === 0 ? 'bg-white/50' : ''}`}
                  >
                    <TableCell className="font-semibold text-black flex items-center gap-3 border-r border-gray-200 py-4">
                      {key === 'Specialty' && <Star className="w-5 h-5 text-amber-500" />}
                      {key === 'Average price' && <DollarSign className="w-5 h-5 text-green-600" />}
                      {key === 'Atmosphere' && <Clock className="w-5 h-5 text-blue-500" />}
                      <span className="luxury-body-md">{key}</span>
                    </TableCell>
                    <TableCell className="text-black py-4">
                      {key === 'Average price' ? (
                        <Badge variant="secondary" className="font-semibold bg-green-100 text-green-800 px-4 py-2">
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