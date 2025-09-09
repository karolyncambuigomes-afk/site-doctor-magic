import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  location_postcode: string;
  area_name: string;
  rating: number;
  review_text: string;
  author_name: string;
  author_initial: string;
  created_at: string;
  is_featured: boolean;
  service_type: string;
}

export interface ReviewAggregateData {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  ratingBreakdown: { [key: number]: number };
}

export const useReviews = (locationPostcode?: string) => {
  return useQuery({
    queryKey: ['reviews', locationPostcode],
    queryFn: async (): Promise<ReviewAggregateData> => {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (locationPostcode) {
        query = query.eq('location_postcode', locationPostcode);
      }

      const { data: reviews, error } = await query;

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      if (!reviews || reviews.length === 0) {
        return {
          averageRating: 4.9,
          totalReviews: 0,
          reviews: [],
          ratingBreakdown: {}
        };
      }

      const totalReviews = reviews.length;
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      
      const ratingBreakdown = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        reviews,
        ratingBreakdown
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFeaturedReviews = (limit: number = 6) => {
  return useQuery({
    queryKey: ['featured-reviews', limit],
    queryFn: async (): Promise<Review[]> => {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured reviews:', error);
        throw error;
      }

      return reviews || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};