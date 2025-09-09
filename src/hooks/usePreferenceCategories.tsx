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

    const handleRefreshEvent = (event: any) => {
      console.log('[usePreferenceCategories] Refresh event detected:', event.type, event.detail);
      
      // Debounced refresh to avoid excessive calls
      setTimeout(() => {
        console.log('[usePreferenceCategories] Refreshing categories...');
        fetchCategories();
      }, 100);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[usePreferenceCategories] App visible, refreshing');
        setTimeout(fetchCategories, 200);
      }
    };

    const handleFocus = () => {
      console.log('[usePreferenceCategories] App focused, refreshing');
      setTimeout(fetchCategories, 100);
    };

    const handleOnline = () => {
      console.log('[usePreferenceCategories] Network restored, refreshing');
      setTimeout(fetchCategories, 300);
    };

    // Listen for relevant refresh events
    const events = [
      'mobile-force-sync',
      'preference-categories-refresh',
      'mobile-data-changed',
      'data-changed'
    ];

    events.forEach(eventType => {
      window.addEventListener(eventType, handleRefreshEvent);
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    return () => {
      events.forEach(eventType => {
        window.removeEventListener(eventType, handleRefreshEvent);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchCategories]);

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