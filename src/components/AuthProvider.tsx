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
  userStatus: 'pending' | 'approved' | 'rejected' | 'error' | 'unauthenticated' | 'timeout' | null;
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
  const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'rejected' | 'error' | 'unauthenticated' | 'timeout' | null>(null);
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

      // For regular users, check manual approval status only
      const approved = profile?.status === 'approved';
      console.log('AuthProvider - User approval status:', approved);
      
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
    // Simplified auth setup - avoid concurrent Supabase calls
    let mounted = true;
    
    const setupAuth = async () => {
      try {
        // First, check existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('AuthProvider - Session error:', error);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          try {
            await checkUserAccess(session.user.id);
          } catch (error) {
            console.error('AuthProvider - Access check failed:', error);
            setHasAccess(false);
            setIsApproved(false);
            setUserStatus('error');
          }
        }
      } catch (error) {
        console.error('AuthProvider - Setup error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setHasAccess(false);
          setIsApproved(false);
          setUserStatus('error');
          setLoading(false);
        }
      }
    };

    // Simplified auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          if (session?.user) {
            setCheckingAccess(true);
            checkUserAccess(session.user.id)
              .catch(error => {
                console.error('AuthProvider - State change access check failed:', error);
                setHasAccess(false);
                setIsApproved(false);
                setUserStatus('error');
              })
              .finally(() => {
                if (mounted) setCheckingAccess(false);
              });
          } else {
            setHasAccess(false);
            setIsApproved(false);
            setUserStatus('unauthenticated');
          }
        } catch (error) {
          console.error('AuthProvider - Error in auth state change:', error);
          if (mounted) {
            setLoading(false);
            setCheckingAccess(false);
          }
        }
      }
    );

    setupAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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