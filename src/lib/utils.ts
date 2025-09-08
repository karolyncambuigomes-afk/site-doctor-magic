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

// Safe storage utility with fallbacks
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        // Store in memory as last resort
        if (typeof window !== 'undefined') {
          (window as any).memoryStorage = (window as any).memoryStorage || {};
          (window as any).memoryStorage[key] = value;
        }
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
        if (typeof window !== 'undefined' && (window as any).memoryStorage) {
          delete (window as any).memoryStorage[key];
        }
      }
    }
  }
};
