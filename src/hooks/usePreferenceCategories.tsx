import { useState, useEffect, useCallback, useRef } from 'react';
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

// Global cache to prevent duplicate requests across component instances
let globalCache: {
  data: PreferenceCategory[] | null;
  lastFetch: number;
  isLoading: boolean;
  activeRequest: AbortController | null;
} = {
  data: null,
  lastFetch: 0,
  isLoading: false,
  activeRequest: null
};

const CACHE_DURATION = 30000; // 30 seconds
const DEBOUNCE_DELAY = 1000; // 1 second debounce

export const usePreferenceCategories = () => {
  const [categories, setCategories] = useState<PreferenceCategory[]>(globalCache.data || []);
  const [loading, setLoading] = useState(globalCache.isLoading);
  const debounceRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  const fetchCategories = useCallback(async (force = false) => {
    try {
      const now = Date.now();
      
      // Check cache validity
      if (!force && globalCache.data && (now - globalCache.lastFetch) < CACHE_DURATION) {
        if (mountedRef.current) {
          setCategories(globalCache.data);
          setLoading(false);
        }
        return;
      }

      // Prevent duplicate requests
      if (globalCache.isLoading && !force) {
        return;
      }

      // Abort previous request if still pending
      if (globalCache.activeRequest) {
        globalCache.activeRequest.abort();
      }

      globalCache.activeRequest = new AbortController();
      globalCache.isLoading = true;
      
      if (mountedRef.current) {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from('preference_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
        .abortSignal(globalCache.activeRequest.signal);

      if (error) {
        console.error('Error fetching preference categories:', error);
        toast.error('Failed to load categories');
        return;
      }
      
      globalCache.data = data || [];
      globalCache.lastFetch = now;
      globalCache.isLoading = false;
      globalCache.activeRequest = null;
      
      if (mountedRef.current) {
        setCategories(globalCache.data);
        setLoading(false);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // Request was aborted, ignore
      }
      
      console.error('Error fetching preference categories:', error);
      globalCache.isLoading = false;
      globalCache.activeRequest = null;
      
      if (mountedRef.current) {
        setLoading(false);
        toast.error('Failed to load categories');
      }
    }
  }, []);

  const debouncedFetch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      fetchCategories();
    }, DEBOUNCE_DELAY);
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: string, updates: Partial<PreferenceCategory>) => {
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
      await fetchCategories(true); // Force refresh after mutation
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      return false;
    }
  }, [fetchCategories]);

  const createCategory = useCallback(async (category: Omit<PreferenceCategory, 'id' | 'created_at' | 'updated_at'>) => {
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
      await fetchCategories(true); // Force refresh after mutation
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      return false;
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
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
      await fetchCategories(true); // Force refresh after mutation
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      return false;
    }
  }, [fetchCategories]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial fetch
    fetchCategories();

    // Minimal event listeners with proper debouncing
    const handleVisibilityChange = () => {
      if (!document.hidden && mountedRef.current) {
        debouncedFetch();
      }
    };

    const handleOnline = () => {
      if (mountedRef.current) {
        debouncedFetch();
      }
    };

    // Only essential events - removed all the problematic mobile sync events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      mountedRef.current = false;
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      if (globalCache.activeRequest) {
        globalCache.activeRequest.abort();
      }
    };
  }, []); // Empty dependency array to prevent re-registration

  return {
    categories,
    loading,
    fetchCategories: () => fetchCategories(true), // Always force when called manually
    updateCategory,
    createCategory,
    deleteCategory,
    refetch: () => fetchCategories(true)
  };
};