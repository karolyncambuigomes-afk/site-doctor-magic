import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Remove duplicate storage logic - using the one from supabase client now

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasAccess: boolean;
  isApproved: boolean;
  userStatus: 'pending' | 'approved' | 'rejected' | 'error' | 'unauthenticated' | 'timeout' | null;
  refreshAccess: () => Promise<void>;
  isAdmin: boolean;
  authReady: boolean;
  getRedirectPath: () => string;
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
      isAdmin: false,
      authReady: false,
      getRedirectPath: () => '/models',
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const checkUserStatus = async (userId: string) => {
    if (!userId) {
      console.log('AuthProvider - No userId provided');
      return { approved: false, status: null };
    }
    
    try {
      // Get profile data including role and status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status, role, email')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error checking user status:', profileError);
        return { approved: false, status: null, isAdmin: false };
      }

      const approved = profile?.status === 'approved';
      const isAdminResult = profile?.role === 'admin';
      
      setIsApproved(approved);
      setUserStatus(profile?.status || null);
      setIsAdmin(isAdminResult);
      setAuthReady(true);

      return { approved, status: profile?.status, isAdmin: isAdminResult };
    } catch (error) {
      console.error('Error checking user status:', error);
      return { approved: false, status: null, isAdmin: false };
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
      const result = await checkUserStatus(userId);
      
      if (result.isAdmin) {
        console.log('AuthProvider - User is admin, granting access');
        setHasAccess(true);
        return true;
      }

      // All authenticated users have access now (since only admin creates accounts)
      console.log('AuthProvider - Authenticated user, granting access');
      setHasAccess(true);
      return true;
    } catch (error) {
      console.error('Error checking user access:', error);
      setHasAccess(false);
      setIsApproved(false);
      setUserStatus('error');
      setIsAdmin(false);
      setAuthReady(true);
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
        // Ensure we start in loading state
        setLoading(true);

        // First, check existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('AuthProvider - Session error:', error);
          setSession(null);
          setUser(null);
          setHasAccess(false);
          setIsApproved(false);
          setUserStatus('error');
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            await checkUserAccess(session.user.id);
          } catch (error) {
            console.error('AuthProvider - Access check failed:', error);
            setHasAccess(false);
            setIsApproved(false);
            setUserStatus('error');
            setIsAdmin(false);
          } finally {
            if (mounted) setLoading(false);
          }
        } else {
          // No active session
          setHasAccess(false);
          setIsApproved(false);
          setUserStatus('unauthenticated');
          setIsAdmin(false);
          setAuthReady(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider - Setup error:', error);
        console.error('AuthProvider - Setup error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setHasAccess(false);
          setIsApproved(false);
          setUserStatus('error');
          setIsAdmin(false);
          setAuthReady(true);
          setLoading(false);
        }
      }
    };

    // Auth state listener - keep callback sync and defer Supabase calls
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setLoading(true);
          setCheckingAccess(true);
          // Defer Supabase calls to avoid deadlocks in the callback
          setTimeout(() => {
            checkUserAccess(session.user!.id)
              .catch(error => {
                console.error('AuthProvider - State change access check failed:', error);
                setHasAccess(false);
                setIsApproved(false);
                setUserStatus('error');
                setIsAdmin(false);
                setAuthReady(true);
              })
              .finally(() => {
                if (!mounted) return;
                setCheckingAccess(false);
                setLoading(false);
              });
          }, 0);
        } else {
          setHasAccess(false);
          setIsApproved(false);
          setUserStatus('unauthenticated');
          setIsAdmin(false);
          setAuthReady(true);
          setLoading(false);
        }
      }
    );

    setupAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getRedirectPath = () => {
    // Always redirect to models for now, admin can navigate manually
    return '/models';
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Clear local state regardless of success/failure
      setUser(null);
      setSession(null);
      setHasAccess(false);
      setIsApproved(false);
      setUserStatus(null);
      setIsAdmin(false);
      
      // Redirect to home page after logout
      window.location.href = '/';
    }
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
    isAdmin: Boolean(isAdmin),
    authReady: Boolean(authReady),
    getRedirectPath,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};