import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jiegopvbwpyfohhfvmwo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZWdvcHZid3B5Zm9oaGZ2bXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjUxNzMsImV4cCI6MjA3MjYwMTE3M30.WJQz8B9y5IEHQMtWtH_Xpmg9_1cym4xEMW_rhqCtIcs";

// Simplified storage with better error handling
const robustStorage = {
  getItem: (key: string): string | null => {
    try {
      // Try localStorage first
      const value = localStorage.getItem(key);
      if (value) {
        // Validate JSON before returning
        try {
          JSON.parse(value);
          return value;
        } catch {
          // If not valid JSON, return as-is
          return value;
        }
      }
      return null;
    } catch {
      try {
        // Fallback to sessionStorage
        return sessionStorage.getItem(key);
      } catch {
        console.warn(`Storage access failed for key: ${key}`);
        return null;
      }
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      // Validate that we can parse the value if it looks like JSON
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          JSON.parse(value);
        } catch {
          console.warn(`Invalid JSON data for key ${key}, not storing`);
          return;
        }
      }
      localStorage.setItem(key, value);
    } catch {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        console.warn(`Failed to store data for key: ${key}`);
      }
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      try {
        sessionStorage.removeItem(key);
      } catch {
        console.warn(`Failed to remove key: ${key}`);
      }
    }
  }
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: robustStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});