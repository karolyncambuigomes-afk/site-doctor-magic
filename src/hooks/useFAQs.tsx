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

  useEffect(() => {
    fetchFAQs();
  }, []);

  return {
    faqs,
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