import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthTest: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('TestPassword123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSignUp = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('Testing sign up with:', { email, password });
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/membership`,
          data: {
            role: 'user'
          }
        }
      });

      console.log('Sign up result:', { data, error });
      setResult({ data, error });

      if (error) {
        console.error('Sign up error:', error);
      } else if (data.user) {
        console.log('User created:', data.user);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('Testing sign in with:', { email, password });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log('Sign in result:', { data, error });
      setResult({ data, error });
    } catch (err) {
      console.error('Unexpected error:', err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      setResult({ user });
    } catch (err) {
      console.error('Error getting user:', err);
      setResult({ error: err });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log('Sign out result:', { error });
      setResult({ error });
    } catch (err) {
      console.error('Error signing out:', err);
      setResult({ error: err });
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Auth Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="TestPassword123"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testSignUp} disabled={loading}>
                Test Sign Up
              </Button>
              <Button onClick={testSignIn} disabled={loading}>
                Test Sign In
              </Button>
              <Button onClick={checkUser} disabled={loading}>
                Check User
              </Button>
              <Button onClick={signOut} disabled={loading}>
                Sign Out
              </Button>
            </div>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-medium mb-2">Result:</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
