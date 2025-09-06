import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BookingContent {
  main: {
    title: string;
    subtitle: string;
  };
  steps: {
    title: string;
    content: string;
  }[];
  info: {
    title: string;
    content: string;
  }[];
}

export const useBookingContent = () => {
  const [content, setContent] = useState<BookingContent>({
    main: {
      title: 'How Booking Works',
      subtitle: 'A simple and discreet process to ensure your perfect experience'
    },
    steps: [
      {
        title: 'Initial Contact',
        content: 'Reach out to us by phone or contact form. Our team responds quickly and discreetly to understand your preferences.'
      },
      {
        title: 'Personalized Selection',
        content: 'Based on your preferences, we present the most suitable companions. You choose from detailed profiles and photos.'
      },
      {
        title: 'Secure Confirmation',
        content: 'We confirm all details - date, time, location and duration. Payment is processed securely and discreetly.'
      }
    ],
    info: [
      {
        title: '⏰ Schedule',
        content: 'Available 24/7. We recommend booking at least 2 hours in advance for better availability.'
      },
      {
        title: '🔒 Discretion',
        content: 'Complete confidentiality guaranteed. All data is protected and never shared.'
      },
      {
        title: '💳 Payment',
        content: 'We accept credit cards, bank transfers and cash. Payment is always discreet and secure.'
      },
      {
        title: '📍 Location',
        content: 'We serve all of London. Hotels, private residences or venues of your choice.'
      }
    ]
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookingContent();
  }, []);

  const loadBookingContent = async () => {
    try {
      const { data, error } = await supabase
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

      if (data && data.length > 0) {
        const newContent: BookingContent = {
          main: {
            title: 'How Booking Works',
            subtitle: 'A simple and discreet process to ensure your perfect experience'
          },
          steps: [],
          info: []
        };

        data.forEach(item => {
          if (item.section === 'how_booking_works') {
            newContent.main = {
              title: item.title || 'How Booking Works',
              subtitle: item.subtitle || 'A simple and discreet process to ensure your perfect experience'
            };
          } else if (item.section.startsWith('booking_step_')) {
            newContent.steps.push({
              title: item.title || '',
              content: item.content || ''
            });
          } else if (item.section.startsWith('booking_info_')) {
            newContent.info.push({
              title: item.title || '',
              content: item.content || ''
            });
          }
        });

        // Sort steps by order
        newContent.steps.sort((a, b) => {
          const orderA = data.find(d => d.title === a.title)?.section.split('_').pop();
          const orderB = data.find(d => d.title === b.title)?.section.split('_').pop();
          return (orderA || '').localeCompare(orderB || '');
        });

        setContent(newContent);
      }
    } catch (error) {
      console.error('Error loading booking content:', error);
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, refetch: loadBookingContent };
};