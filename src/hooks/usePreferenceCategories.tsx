import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PreferenceCategory {
  id: string;
  name: string;
  path: string;
  image_url: string;
  image_alt?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePreferenceCategories = () => {
  const [categories, setCategories] = useState<PreferenceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('preference_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching preference categories:', error);
        toast.error('Failed to load categories');
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching preference categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, updates: Partial<PreferenceCategory>) => {
    try {
      const { error } = await supabase
        .from('preference_categories')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
        return false;
      }

      toast.success('Category updated successfully');
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      return false;
    }
  };

  const createCategory = async (category: Omit<PreferenceCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('preference_categories')
        .insert(category);

      if (error) {
        console.error('Error creating category:', error);
        toast.error('Failed to create category');
        return false;
      }

      toast.success('Category created successfully');
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('preference_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
        return false;
      }

      toast.success('Category deleted successfully');
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();

    // Enhanced mobile refresh events with ultra-aggressive sync
    const handleMobileRefresh = () => {
      console.log('[usePreferenceCategories] Mobile refresh triggered');
      fetchCategories();
    };

    const handleMobileSync = () => {
      console.log('[usePreferenceCategories] Mobile sync triggered');
      fetchCategories();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Force immediate refresh when returning to app
        setTimeout(fetchCategories, 50);
      }
    };

    const handleNetworkChange = () => {
      if (navigator.onLine) {
        setTimeout(fetchCategories, 100);
      }
    };

    const handleFocus = () => {
      // Refresh on focus
      setTimeout(fetchCategories, 25);
    };

    // Listen to all possible refresh events
    window.addEventListener('mobile-force-refresh', handleMobileRefresh);
    window.addEventListener('mobile-force-sync', handleMobileSync);
    window.addEventListener('mobile-status-change', handleMobileRefresh);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleNetworkChange);

    return () => {
      window.removeEventListener('mobile-force-refresh', handleMobileRefresh);
      window.removeEventListener('mobile-force-sync', handleMobileSync);
      window.removeEventListener('mobile-status-change', handleMobileRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleNetworkChange);
    };
  }, []);

  return {
    categories,
    loading,
    fetchCategories,
    updateCategory,
    createCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};