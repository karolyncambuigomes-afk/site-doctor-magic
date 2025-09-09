import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Enhanced private mode detection utility
export function isPrivateMode(): Promise<boolean> {
  return new Promise((resolve) => {
    // Multiple detection methods for better reliability
    try {
      // Test 1: localStorage availability
      const test = 'privateModeTest';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      
      // Test 2: indexedDB availability
      if (!window.indexedDB) {
        resolve(true);
        return;
      }
      
      // Test 3: storage quota
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          if (estimate.quota && estimate.quota < 120000000) { // Less than ~120MB indicates private mode
            resolve(true);
          } else {
            resolve(false);
          }
        }).catch(() => resolve(true));
      } else {
        resolve(false);
      }
    } catch (e) {
      resolve(true);
    }
  });
}

// Synchronous private mode detection for immediate use
export function isPrivateModeSync(): boolean {
  try {
    const test = 'privateModeTest';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return false;
  } catch (e) {
    return true;
  }
}

// Simplified and robust storage utility
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      const value = localStorage.getItem(key);
      // Validate JSON if it looks like JSON
      if (value && (value.startsWith('{') || value.startsWith('['))) {
        try {
          JSON.parse(value);
          return value;
        } catch {
          console.warn(`Invalid JSON in storage for key: ${key}`);
          localStorage.removeItem(key);
          return null;
        }
      }
      return value;
    } catch {
      try {
        return sessionStorage.getItem(key);
      } catch {
        console.warn(`Storage access failed for key: ${key}`);
        return null;
      }
    }
  },
  
  setItem: (key: string, value: string): void => {
    // Validate JSON before storing
    if (value && (value.startsWith('{') || value.startsWith('['))) {
      try {
        JSON.parse(value);
      } catch {
        console.error(`Attempted to store invalid JSON for key: ${key}`);
        return;
      }
    }
    
    try {
      localStorage.setItem(key, value);
    } catch {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        console.warn(`Failed to store value for key: ${key}`);
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
