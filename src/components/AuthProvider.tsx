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

  const checkUserStatus = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error checking user status:', profileError);
        return { approved: false, status: null };
      }

      const approved = profile?.status === 'approved';
      setIsApproved(approved);
      setUserStatus(profile?.status || null);

      return { approved, status: profile?.status };
    } catch (error) {
      console.error('Error checking user status:', error);
      return { approved: false, status: null };
    }
  };

  const checkUserAccess = async (userId: string) => {
    try {
      // First check if user is approved
      const { approved } = await checkUserStatus(userId);
      if (!approved) {
        setHasAccess(false);
        return false;
      }

      // Then check subscription
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
      setHasAccess(hasSubscription);
      return hasSubscription;
    } catch (error) {
      console.error('Error checking user access:', error);
      return false;
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
            checkUserAccess(session.user.id);
          }, 0);
        } else {
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
          checkUserAccess(session.user.id);
        }, 0);
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