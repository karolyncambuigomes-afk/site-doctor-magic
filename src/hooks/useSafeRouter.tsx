import React, { useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Safe wrapper hooks to prevent destructuring errors
export const useSafeLocation = () => {
  try {
    // Check if we're in a router context first
    const location = useLocation();
    return location || { pathname: '/', search: '', hash: '', state: null, key: 'default' };
  } catch (error) {
    console.warn('useSafeLocation: Error getting location, likely outside Router context', error);
    return { pathname: '/', search: '', hash: '', state: null, key: 'default' };
  }
};

export const useSafeNavigate = () => {
  try {
    const navigate = useNavigate();
    return navigate || (() => console.warn('Navigation not available'));
  } catch (error) {
    console.warn('useSafeNavigate: Error getting navigate', error);
    return () => console.warn('Navigation not available');
  }
};

export const useSafeParams = () => {
  try {
    const params = useParams();
    return params || {};
  } catch (error) {
    console.warn('useSafeParams: Error getting params', error);
    return {};
  }
};