import React, { useState, useEffect } from 'react';
import { SafeLink } from '@/components/ui/safe-link';

const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silent error handling
    }
  }
};

export const CookieConsent = () => null;
