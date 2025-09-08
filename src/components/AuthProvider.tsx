import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
    throw new Error('useAuth must be used within an AuthProvider');
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
      // First check if user is approved
      const userStatusResult = await checkUserStatus(userId);
      const { approved } = userStatusResult || { approved: false };
      if (!approved) {
        console.log('AuthProvider - User not approved');
        setHasAccess(false);
        return false;
      }

      // Check if user is admin directly from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error checking user profile:', profileError);
      } else if (profile?.role === 'admin') {
        console.log('AuthProvider - User is admin, granting access');
        setHasAccess(true);
        return true;
      }

      // Then check subscription for regular users
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
      setHasAccess(hasSubscription);
      return hasSubscription;
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
    user,
    session,
    loading,
    signOut,
    hasAccess,
    isApproved,
    userStatus,
    refreshAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};