import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
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
      getRedirectPath: () => '/models',
    };
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'rejected' | 'error' | 'unauthenticated' | 'timeout' | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUserStatus = async (userId: string) => {
    if (!userId) {
      console.log('AuthProvider - No userId provided');
      return { approved: false, status: null };
    }
    
    try {
      // Get approval status from profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking user status:', profileError);
        return { approved: false, status: null, isAdmin: false };
      }

<<<<<<< HEAD
      if (!profile) {
        console.warn('No profile found for user:', userId);
        return { approved: false, status: 'unauthenticated', isAdmin: false };
      }

      // Check admin status using secure RPC function
      const { data: isAdminData, error: adminError } = await supabase
        .rpc('is_admin');

      const approved = profile?.status === 'approved';
      const isAdminResult = adminError ? false : (isAdminData || false);
      
      setIsApproved(approved);
      setUserStatus(profile?.status || null);
      setIsAdmin(isAdminResult);

      // Log admin logins
      if (isAdminResult && approved) {
        try {
          await supabase.rpc('log_admin_login');
        } catch (logError) {
          console.warn('Failed to log admin login:', logError);
        }
      }

      if (adminError) {
        console.error('Error checking admin status:', adminError);
      }

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

      // For regular users, check manual approval status only
      const approved = result.approved;
      console.log('AuthProvider - User approval status:', approved);
      
      setHasAccess(approved);
      return approved;
    } catch (error) {
      console.error('Error checking user access:', error);
      setHasAccess(false);
      setIsApproved(false);
      setUserStatus('error');
      setIsAdmin(false);
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

  const getRedirectPath = () => {
    // Always redirect to models for now, admin can navigate manually
    return '/models';
  };

  const signOut = async () => {
    try {
      console.log('🚪 Starting logout process...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error signing out:', error);
        // Still clear local state even if Supabase logout fails
      } else {
        console.log('✅ Successfully signed out from Supabase');
      }
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Still clear local state even if logout fails
    } finally {
      // Clear local state regardless of success/failure
      console.log('🧹 Clearing local state...');
      setUser(null);
      setSession(null);
      setHasAccess(false);
      setIsApproved(false);
      setUserStatus(null);
      setIsAdmin(false);
      
      // Clear any cached data
      localStorage.removeItem('user_preferences');
      localStorage.removeItem('mobile_optimization_cache');
      
      console.log('🏠 Redirecting to home page...');
      // Redirect to home page after logout
      navigate('/', { replace: true });
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
    getRedirectPath,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
=======
      // Check admin status using secure RPC function
      const { data: isAdminData, error: adminError } = await supabase
        .rpc('is_admin');

      console.log('AuthProvider - Admin check result:', { 
        isAdminData, 
        adminError: adminError?.message,
        userId 
      });

      const approved = profile?.status === 'approved';
      const isAdminResult = adminError ? false : (isAdminData || false);
      
      // Fallback: also check role directly from profile if RPC fails
      let fallbackAdminCheck = false;
      if (adminError) {
        console.warn('RPC is_admin failed, checking role directly:', adminError);
        try {
          const { data: profileWithRole } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();
          fallbackAdminCheck = profileWithRole?.role === 'admin';
        } catch (fallbackError) {
          console.error('Fallback admin check failed:', fallbackError);
        }
      }
      
      const finalAdminResult = isAdminResult || fallbackAdminCheck;
      
      setIsApproved(approved);
      setUserStatus(profile?.status || null);
      setIsAdmin(finalAdminResult);

      // Log admin logins
      if (finalAdminResult && approved) {
        try {
          await supabase.rpc('log_admin_login');
        } catch (logError) {
          console.warn('Failed to log admin login:', logError);
        }
      }

      if (adminError) {
        console.error('Error checking admin status:', adminError);
      }

      return { approved, status: profile?.status, isAdmin: finalAdminResult };
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

      // For regular users, check manual approval status only
      const approved = result.approved;
      console.log('AuthProvider - User approval status:', approved);
      
      setHasAccess(approved);
      return approved;
    } catch (error) {
      console.error('Error checking user access:', error);
      setHasAccess(false);
      setIsApproved(false);
      setUserStatus('error');
      setIsAdmin(false);
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

  const getRedirectPath = () => {
    // Redirect admins to admin dashboard, regular users to models
    return isAdmin ? '/admin' : '/models';
  };

  const signOut = async () => {
    try {
      console.log('🚪 Starting logout process...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error signing out:', error);
        // Still clear local state even if Supabase logout fails
      } else {
        console.log('✅ Successfully signed out from Supabase');
      }
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Still clear local state even if logout fails
    } finally {
      // Clear local state regardless of success/failure
      console.log('🧹 Clearing local state...');
      setUser(null);
      setSession(null);
      setHasAccess(false);
      setIsApproved(false);
      setUserStatus(null);
      setIsAdmin(false);
      
      // Clear any cached data
      localStorage.removeItem('user_preferences');
      localStorage.removeItem('mobile_optimization_cache');
      
      console.log('🏠 Redirecting to home page...');
      // Redirect to home page after logout
      navigate('/', { replace: true });
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
    getRedirectPath,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)
};