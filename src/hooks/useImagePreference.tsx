import { useState, useEffect, useCallback } from 'react';

interface FeatureFlags {
  preferLocalImages: boolean;
}

export const useImagePreference = () => {
  const [preferLocalImages, setPreferLocalImages] = useState<boolean>(true);

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('featureFlags');
      if (saved) {
        const flags: FeatureFlags = JSON.parse(saved);
        setPreferLocalImages(flags.preferLocalImages !== false); // Default to true
      }
    } catch (error) {
      console.warn('Failed to load image preference:', error);
    }
  }, []);

  // Save preference to localStorage
  const updatePreference = useCallback((newValue: boolean) => {
    try {
      const flags: FeatureFlags = { preferLocalImages: newValue };
      localStorage.setItem('featureFlags', JSON.stringify(flags));
      setPreferLocalImages(newValue);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('imagePreferenceChanged', { 
        detail: { preferLocalImages: newValue } 
      }));
    } catch (error) {
      console.error('Failed to save image preference:', error);
    }
  }, []);

  return {
    preferLocalImages,
    updatePreference
  };
};