import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jiegopvbwpyfohhfvmwo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZWdvcHZid3B5Zm9oaGZ2bXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjUxNzMsImV4cCI6MjA3MjYwMTE3M30.WJQz8B9y5IEHQMtWtH_Xpmg9_1cym4xEMW_rhqCtIcs";

// Enhanced mobile-compatible storage with better error handling
const mobileOptimizedStorage = {
  getItem: (key: string): string | null => {
    try {
      // Detect mobile environment
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Try localStorage first
      const value = localStorage.getItem(key);
      
      if (value) {
        // Enhanced validation for mobile
        if (value.trim() === '' || value === 'undefined' || value === 'null') {
          console.warn(`[MobileAuth] Empty/invalid value for key: ${key}, removing`);
          localStorage.removeItem(key);
          return null;
        }
        
        // Special handling for auth tokens on mobile
        if (key.includes('supabase.auth.token') && isMobile) {
          try {
            const parsed = JSON.parse(value);
            // Validate auth token structure
            if (parsed && typeof parsed === 'object' && (parsed.access_token || parsed.refresh_token)) {
              return value;
            } else {
              console.warn(`[MobileAuth] Invalid auth token structure, clearing: ${key}`);
              localStorage.removeItem(key);
              return null;
            }
          } catch (e) {
            console.warn(`[MobileAuth] Failed to parse auth token on mobile: ${key}`, e);
            localStorage.removeItem(key);
            return null;
          }
        }
        
        // General JSON validation
        if (value.startsWith('{') || value.startsWith('[')) {
          try {
            JSON.parse(value);
            return value;
          } catch (e) {
            console.warn(`[MobileAuth] Invalid JSON for key: ${key}, removing corrupted data`);
            localStorage.removeItem(key);
            return null;
          }
        }
        
        return value;
      }
      
      return null;
    } catch (error) {
      console.warn(`[MobileAuth] Storage access failed for key: ${key}`, error);
      try {
        // Fallback to sessionStorage with mobile optimization
        const sessionValue = sessionStorage.getItem(key);
        if (sessionValue && sessionValue.trim() !== '' && sessionValue !== 'undefined') {
          return sessionValue;
        }
      } catch (sessionError) {
        console.warn(`[MobileAuth] SessionStorage also failed for key: ${key}`, sessionError);
      }
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      // Mobile-specific validation
      if (!value || value.trim() === '' || value === 'undefined' || value === 'null') {
        console.warn(`[MobileAuth] Refusing to store empty/invalid value for key: ${key}`);
        return;
      }
      
      // Enhanced JSON validation for mobile
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          const parsed = JSON.parse(value);
          
          // Special handling for auth tokens
          if (key.includes('supabase.auth.token')) {
            if (!parsed || typeof parsed !== 'object') {
              console.warn(`[MobileAuth] Invalid auth token structure for key: ${key}, not storing`);
              return;
            }
            // Ensure auth token has required fields
            if (!parsed.access_token && !parsed.refresh_token) {
              console.warn(`[MobileAuth] Auth token missing required fields for key: ${key}, not storing`);
              return;
            }
          }
          
          // Store valid JSON
          localStorage.setItem(key, value);
          console.log(`[MobileAuth] Successfully stored ${key}`);
        } catch (parseError) {
          console.warn(`[MobileAuth] Invalid JSON data for key ${key}, not storing:`, parseError);
          return;
        }
      } else {
        // Store non-JSON values directly
        localStorage.setItem(key, value);
      }
    } catch (storageError) {
      console.warn(`[MobileAuth] LocalStorage failed for key: ${key}`, storageError);
      try {
        // Fallback to sessionStorage
        sessionStorage.setItem(key, value);
        console.log(`[MobileAuth] Fallback: stored ${key} in sessionStorage`);
      } catch (sessionError) {
        console.error(`[MobileAuth] All storage methods failed for key: ${key}`, sessionError);
      }
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
      console.log(`[MobileAuth] Removed ${key} from localStorage`);
    } catch (localError) {
      console.warn(`[MobileAuth] Failed to remove from localStorage: ${key}`, localError);
    }
    
    try {
      sessionStorage.removeItem(key);
      console.log(`[MobileAuth] Removed ${key} from sessionStorage`);
    } catch (sessionError) {
      console.warn(`[MobileAuth] Failed to remove from sessionStorage: ${key}`, sessionError);
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
    // Enhanced mobile configuration
    flowType: 'pkce',
    debug: true, // Enable debug mode to track auth issues
  }
});