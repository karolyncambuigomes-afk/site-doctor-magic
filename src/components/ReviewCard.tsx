import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewCardProps {
  rating: number;
  reviewText: string;
  authorInitial: string;
  createdAt: string;
}

export const ReviewCard = ({ rating, reviewText, authorInitial, createdAt }: ReviewCardProps) => {
  // Format date to "Month Year" only
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Card className="h-full flex flex-col bg-white">
      <CardContent className="p-8 flex flex-col h-full">
        {/* Star Rating */}
        <div className="flex items-center gap-0.5 mb-4" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          ))}
        </div>

        {/* Review Text */}
        <p className="luxury-body-md text-gray-800 italic mb-6 flex-grow">
          "{reviewText}"
        </p>

        {/* Author Info (Initials + Date) */}
        <div className="flex items-center gap-2 text-gray-600 mt-auto">
          <span className="luxury-heading-xs text-black">{authorInitial}</span>
          <span className="text-gray-400">•</span>
          <span className="luxury-body-sm">{formatDate(createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
