import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jiegopvbwpyfohhfvmwo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZWdvcHZid3B5Zm9oaGZ2bXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjUxNzMsImV4cCI6MjA3MjYwMTE3M30.WJQz8B9y5IEHQMtWtH_Xpmg9_1cym4xEMW_rhqCtIcs";

// Simplified mobile-compatible storage to prevent auth issues
// This is for coomit
const mobileOptimizedStorage = {
  getItem: (key: string): string | null => {
    try {
      const value = localStorage.getItem(key);
      if (value && value !== 'undefined' && value !== 'null' && value.trim() !== '') {
        return value;
      }
      return null;
    } catch (error) {
      console.warn(`[Auth] localStorage failed for ${key}, trying sessionStorage`);
      try {
        return sessionStorage.getItem(key);
      } catch (sessionError) {
        console.warn(`[Auth] All storage failed for ${key}`);
        return null;
      }
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!value || value === 'undefined' || value === 'null') {
      return;
    }
    
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`[Auth] localStorage setItem failed for ${key}, using sessionStorage`);
      try {
        sessionStorage.setItem(key, value);
      } catch (sessionError) {
        console.error(`[Auth] All storage setItem failed for ${key}`);
      }
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[Auth] localStorage removeItem failed for ${key}`);
    }
    
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`[Auth] sessionStorage removeItem failed for ${key}`);
    }
  }
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: mobileOptimizedStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development'
  }
});