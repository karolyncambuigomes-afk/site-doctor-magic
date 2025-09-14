import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BookingContent {
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
}

interface BookingData {
  main: BookingContent | null;
  steps: BookingContent[];
  info: BookingContent[];
  loading: boolean;
  error: string | null;
}

export const useBookingContent = (): BookingData => {
  const [data, setData] = useState<BookingData>({
    main: null,
    steps: [],
    info: [],
    loading: true,
    error: null
  });

  const fetchBookingContent = async () => {
    try {
      const { data: content, error } = await supabase
        .from('site_content')
        .select('section, title, subtitle, content')
        .in('section', [
          'how_booking_works',
          'booking_step_1',
          'booking_step_2', 
          'booking_step_3',
          'booking_info_schedule',
          'booking_info_discretion',
          'booking_info_payment',
          'booking_info_location'
        ])
        .eq('is_active', true);

      if (error) throw error;

      const main = content?.find(item => item.section === 'how_booking_works') || null;
      const steps = content?.filter(item => item.section.startsWith('booking_step_')) || [];
      const info = content?.filter(item => item.section.startsWith('booking_info_')) || [];

      // Sort steps by section name to ensure correct order
      steps.sort((a, b) => a.section.localeCompare(b.section));

      setData({
        main,
        steps,
        info,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching booking content:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load booking content'
      }));
    }
  };

  useEffect(() => {
    fetchBookingContent();
  }, []);

  return data;
};