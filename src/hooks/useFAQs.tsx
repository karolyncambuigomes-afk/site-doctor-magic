import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (fetchError) {
        console.error('Error fetching FAQs:', fetchError);
        setError('Failed to load FAQs');
        return;
      }

      setFaqs(data || []);
    } catch (err) {
      console.error('Unexpected error fetching FAQs:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFAQs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index');

      if (fetchError) {
        console.error('Error fetching all FAQs:', fetchError);
        setError('Failed to load FAQs');
        return;
      }

      setFaqs(data || []);
    } catch (err) {
      console.error('Unexpected error fetching all FAQs:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faq])
        .select()
        .single();

      if (error) {
        console.error('Error creating FAQ:', error);
        toast({
          title: "Error",
          description: "Failed to create FAQ",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "FAQ created successfully",
      });

      // Refresh the FAQs list
      fetchAllFAQs();
      return data;
    } catch (err) {
      console.error('Unexpected error creating FAQ:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateFAQ = async (id: string, updates: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating FAQ:', error);
        toast({
          title: "Error",
          description: "Failed to update FAQ",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });

      // Refresh the FAQs list
      fetchAllFAQs();
      return data;
    } catch (err) {
      console.error('Unexpected error updating FAQ:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting FAQ:', error);
        toast({
          title: "Error",
          description: "Failed to delete FAQ",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });

      // Refresh the FAQs list
      fetchAllFAQs();
      return true;
    } catch (err) {
      console.error('Unexpected error deleting FAQ:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Add GEO-specific FAQs for enhanced local SEO
  const geoFAQs = [
    {
      id: 'geo-1',
      question: 'Do you provide companion services in Mayfair and Westminster areas?',
      answer: 'Yes, we provide premium companion services throughout Central London including Mayfair (W1), Westminster (SW1), and all prime areas. Our companions are available for both incall and outcall services in these prestigious locations.',
      order_index: 100,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'geo-2',
      question: 'What areas of London do you cover for outcall services?',
      answer: 'We cover all Central London areas including Kensington (SW7), Chelsea (SW3), Canary Wharf (E14), Covent Garden (WC2), Camden (NW1), and surrounding premium districts. Travel arrangements can be made for locations outside Central London.',
      order_index: 101,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'geo-3',
      question: 'Do you serve business clients in the City of London financial district?',
      answer: 'Absolutely. We understand the unique requirements of business professionals in the City of London and Canary Wharf. Our companions are experienced in corporate environments and can provide discreet, professional companionship for business events, dinners, and social occasions.',
      order_index: 102,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'geo-4',
      question: 'Are your services available in luxury hotels across London?',
      answer: 'Yes, our companions are welcome at all major luxury hotels in London including The Ritz, Claridge\'s, The Savoy, and other prestigious establishments in Mayfair, Covent Garden, and Central London. We maintain excellent relationships with premium hotel concierge services.',
      order_index: 103,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'geo-5',
      question: 'Can you arrange services for events in South Kensington and Knightsbridge?',
      answer: 'Certainly. South Kensington and Knightsbridge are among our core service areas. Whether for gallery openings, museum events, shopping excursions on Sloane Street, or dining at prestigious venues, our companions are perfectly suited for these sophisticated locations.',
      order_index: 104,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchAllFAQs(); // Admin needs to see all FAQs, not just active ones
  }, []);

  return {
    faqs: [...faqs, ...geoFAQs],
    loading,
    error,
    fetchFAQs,
    fetchAllFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    refetch: fetchFAQs
  };
};