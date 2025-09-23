import { useState, useEffect } from 'react';
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

export const useRealTimeReviews = (locationPostcode?: string) => {
  const [data, setData] = useState<ReviewAggregateData>({
    averageRating: 4.9,
    totalReviews: 0,
    reviews: [],
    ratingBreakdown: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (locationPostcode) {
        query = query.eq('location_postcode', locationPostcode);
      }

      const { data: reviews, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (!reviews || reviews.length === 0) {
        setData({
          averageRating: 4.9,
          totalReviews: 0,
          reviews: [],
          ratingBreakdown: {}
        });
        return;
      }

      const totalReviews = reviews.length;
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      
      const ratingBreakdown = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      setData({
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        reviews,
        ratingBreakdown
      });
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    
    // Set up real-time subscription for reviews changes
    const channel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          console.log('Reviews database change detected:', payload);
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [locationPostcode]);

  return { data, loading, error, refetch: fetchReviews };
};

export const useRealTimeFeaturedReviews = (limit: number = 6) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) {
        throw fetchError;
      }

      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching featured reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedReviews();
    
    // Set up real-time subscription for featured reviews changes
    const channel = supabase
      .channel('featured-reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        (payload) => {
          console.log('Featured reviews database change detected:', payload);
          fetchFeaturedReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { reviews, loading, error, refetch: fetchFeaturedReviews };
};