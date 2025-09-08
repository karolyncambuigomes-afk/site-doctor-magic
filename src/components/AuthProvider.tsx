import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Helper function to check if localStorage is available (for private browsing)
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Safe storage wrapper that uses sessionStorage as fallback
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      } else {
        return sessionStorage.getItem(key);
      }
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        sessionStorage.setItem(key, value);
      }
    } catch {
      // Fail silently if storage is not available
    }
  },
  removeItem: (key: string): void => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
    } catch {
      // Fail silently if storage is not available
    }
  }
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasAccess: boolean;
  isApproved: boolean;
  userStatus: 'pending' | 'approved' | 'rejected' | null;
  refreshAccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.warn('useAuth must be used within an AuthProvider');
    // Return a safe default instead of throwing
    return {
      user: null,
      session: null,
      loading: true,
      signOut: async () => {},
      hasAccess: false,
      isApproved: false,
      userStatus: null,
      refreshAccess: async () => {},
    };
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(false);

  const checkUserStatus = async (userId: string) => {
    if (!userId) {
      console.log('AuthProvider - No userId provided');
      return { approved: false, status: null };
    }
    
    try {
      // Use the security definer function to avoid recursion
      const { data: status, error } = await supabase
        .rpc('get_current_user_status');

      if (error) {
        console.error('Error checking user status:', error);
        return { approved: false, status: null };
      }

      const approved = status === 'approved';
      setIsApproved(approved);
      setUserStatus(status || null);

      return { approved, status };
    } catch (error) {
      console.error('Error checking user status:', error);
      return { approved: false, status: null };
    }
  };

  const checkUserAccess = async (userId: string) => {
    if (checkingAccess) {
      console.log('AuthProvider - Already checking access, skipping...');
      return hasAccess;
    }
    
    setCheckingAccess(true);
    console.log('AuthProvider - Checking user access for:', userId);
    
    try {
      // Check if user is admin directly from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error checking user profile:', profileError);
      } else {
        setUserStatus(profile?.status || null);
        setIsApproved(profile?.status === 'approved');
        
        if (profile?.role === 'admin') {
          console.log('AuthProvider - User is admin, granting access');
          setHasAccess(true);
          return true;
        }
      }

      // Check subscription for regular users - grant access if active subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking subscription:', error);
        return false;
      }

      const hasSubscription = !!data;
      console.log('AuthProvider - User subscription status:', hasSubscription);
      
      // Grant access if user has active subscription (automatic approval)
      if (hasSubscription) {
        setHasAccess(true);
        return true;
      }

      // For non-paying users, check approval status
      const approved = profile?.status === 'approved';
      if (!approved) {
        console.log('AuthProvider - User not approved and no active subscription');
        setHasAccess(false);
        return false;
      }

      setHasAccess(approved);
      return approved;
    } catch (error) {
      console.error('Error checking user access:', error);
      return false;
    } finally {
      setCheckingAccess(false);
    }
  };

  const refreshAccess = async () => {
    if (user) {
      await checkUserAccess(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          if (session?.user) {
            // Defer Supabase calls to prevent deadlock using setTimeout
            setTimeout(() => {
              console.log('AuthProvider - Auth state changed, checking access for:', session.user.email);
              checkUserAccess(session.user.id);
            }, 100);
          } else {
            console.log('AuthProvider - No session, clearing access');
            setHasAccess(false);
            setIsApproved(false);
            setUserStatus(null);
          }
        } catch (error) {
          console.error('AuthProvider - Error in auth state change:', error);
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        // Defer Supabase calls to prevent deadlock using setTimeout
        setTimeout(() => {
          console.log('AuthProvider - Initial session found, checking access for:', session.user.email);
          checkUserAccess(session.user.id);
        }, 200);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setHasAccess(false);
    setIsApproved(false);
    setUserStatus(null);
  };

  const value = {
    user: user || null,
    session: session || null,
    loading: Boolean(loading),
    signOut,
    hasAccess: Boolean(hasAccess),
    isApproved: Boolean(isApproved),
    userStatus: userStatus || null,
    refreshAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};