import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const Auth: React.FC = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to models page
        if (session?.user) {
          setTimeout(() => {
            navigate('/models');
          }, 100);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/models');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Sanitize input to prevent XSS attacks
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .slice(0, 255); // Limit length
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    setError('');
  };

  const validateForm = (isSignUp: boolean) => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    // Enhanced password validation
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);

    if (!hasUppercase || !hasLowercase || !hasNumbers) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError(error.message);
        }
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setLoading(true);
    setError('');

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(error.message);
        }
        return;
      }

      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link. Please check your email and click the link to activate your account.",
      });

      // Clear form
      setFormData({
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">Welcome back!</h2>
          <p className="text-muted-foreground mb-6">Redirecting you to your account...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Sign In - Five London"
        description="Access your Five London account to browse our exclusive companion services."
        keywords="login, sign in, five london, account access"
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container-width">
          <div className="max-w-md mx-auto">
            {/* Back link */}
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>

            <Card className="border border-border/50 shadow-luxury">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-light tracking-wide">
                  Welcome to Five London
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Access your account to browse our exclusive companions
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="signin" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <TabsContent value="signin" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={loading}
                          className="transition-luxury"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            disabled={loading}
                            className="pr-10 transition-luxury"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full five-london-button"
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={loading}
                          className="transition-luxury"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            disabled={loading}
                            className="pr-10 transition-luxury"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Minimum 8 characters with uppercase, lowercase, and numbers
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          disabled={loading}
                          className="transition-luxury"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full five-london-button"
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};