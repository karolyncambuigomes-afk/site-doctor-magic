import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Private mode detection utility
export function isPrivateMode(): Promise<boolean> {
  return new Promise((resolve) => {
    // Test localStorage availability
    try {
      const test = 'privateModeTest';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      resolve(false);
    } catch (e) {
      resolve(true);
    }
  });
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
