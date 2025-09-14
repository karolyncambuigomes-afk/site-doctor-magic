import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSafeNavigate } from '@/hooks/useSafeRouter';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Lock, Mail, Eye, EyeOff, ArrowLeft, LogOut, User } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
export const Membership: React.FC = () => {
  const auth = useAuth();
  const { user, hasAccess, signOut } = auth || {};
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useSafeNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Test Supabase connection
    console.log('🔧 Testing Supabase connection...');
    console.log('🔧 Supabase client:', supabase);
    console.log('🔧 Supabase URL:', supabase.supabaseUrl);
    console.log('🔧 Supabase Key:', supabase.supabaseKey ? 'Present' : 'Missing');
    
    // Test auth methods
    console.log('🔧 Supabase auth methods:', Object.keys(supabase.auth));
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', { event, session: session ? 'Session exists' : 'No session' });
        // Redirect authenticated users to models page
        if (session?.user && navigate) {
          setTimeout(() => {
            navigate('/models');
          }, 100);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Existing session check:', session ? 'Session exists' : 'No session');
      if (session?.user && navigate) {
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
    console.log('🔍 Validating form:', { isSignUp, formData });
    
    if (!formData.email || !formData.password) {
      console.log('❌ Missing required fields:', { 
        email: !!formData.email, 
        password: !!formData.password 
      });
      setError('Please fill in all required fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      console.log('❌ Invalid email format:', formData.email);
      setError('Please enter a valid email address');
      return false;
    }

    // For sign in, only check minimum password length
    if (isSignUp) {
      if (formData.password.length < 8) {
        console.log('❌ Password too short:', formData.password.length);
        setError('Password must be at least 8 characters long');
        return false;
      }

      // Enhanced password validation for signup only
      const hasUppercase = /[A-Z]/.test(formData.password);
      const hasLowercase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);

      console.log('🔍 Password validation:', {
        hasUppercase,
        hasLowercase,
        hasNumbers,
        password: formData.password
      });

      if (!hasUppercase || !hasLowercase || !hasNumbers) {
        console.log('❌ Password complexity failed');
        setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        console.log('❌ Passwords do not match:', {
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        setError('Passwords do not match');
        return false;
      }
    } else {
      // For sign in, just check password is not empty
      if (formData.password.length === 0) {
        console.log('❌ Password is empty');
        setError('Please enter your password');
        return false;
      }
    }

    console.log('✅ Form validation passed');
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Sign in form submitted');
    console.log('📝 Form data:', formData);
    
    // Check if form validation passes
    const isValid = validateForm(false);
    console.log('✅ Form validation result:', isValid);
    
    if (!isValid) {
      console.log('❌ Form validation failed');
      return;
    }

    console.log('🔄 Setting loading state to true');
    setLoading(true);
    setError('');

    try {
      console.log('📧 Attempting member sign in with:', { 
        email: formData.email,
        passwordLength: formData.password.length
      });
      
      // Check Supabase client
      console.log('🔧 Supabase client:', supabase);
      console.log('🔧 Supabase auth:', supabase.auth);
      
      const signInOptions = {
        email: formData.email.trim(),
        password: formData.password,
      };
      
      console.log('📤 Sign in options:', signInOptions);
      
      const { data, error } = await supabase.auth.signInWithPassword(signInOptions);

      console.log('📥 Supabase response:', { 
        data: data ? {
          user: data.user ? {
            id: data.user.id,
            email: data.user.email,
            email_confirmed_at: data.user.email_confirmed_at,
            created_at: data.user.created_at
          } : null,
          session: data.session ? 'Session exists' : 'No session'
        } : null,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email before signing in.');
        } else if (error.message.includes('JSON')) {
          setError('Connection error. Please reload the page.');
        } else {
          setError(`Error: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        console.log('✅ Member sign in successful for user:', data.user.id);
        console.log('📧 User email confirmed:', data.user.email_confirmed_at);
        
        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });
      } else {
        console.log('❌ No user data returned from sign in');
        setError('Sign in failed. Please try again.');
      }
    } catch (err: any) {
      console.error('💥 Unexpected sign-in error:', err);
      console.error('💥 Error stack:', err.stack);
      setError('Unexpected error. Please reload the page.');
    } finally {
      console.log('🔄 Setting loading state to false');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Sign up form submitted');
    console.log('📝 Form data:', formData);
    
    // Check if form validation passes
    const isValid = validateForm(true);
    console.log('✅ Form validation result:', isValid);
    
    if (!isValid) {
      console.log('❌ Form validation failed');
      return;
    }

    console.log('🔄 Setting loading state to true');
    setLoading(true);
    setError('');

    try {
      console.log('📧 Attempting member sign up with:', { 
        email: formData.email,
        passwordLength: formData.password.length,
        confirmPasswordLength: formData.confirmPassword.length
      });
      
      const redirectUrl = `${window.location.origin}/membership`;
      console.log('🔗 Redirect URL:', redirectUrl);
      
      // Check Supabase client
      console.log('🔧 Supabase client:', supabase);
      console.log('🔧 Supabase auth:', supabase.auth);
      
      const signUpOptions = {
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: 'user'
          }
        }
      };
      
      console.log('📤 Sign up options:', signUpOptions);
      
      const { data, error } = await supabase.auth.signUp(signUpOptions);

      console.log('📥 Supabase response:', { 
        data: data ? {
          user: data.user ? {
            id: data.user.id,
            email: data.user.email,
            email_confirmed_at: data.user.email_confirmed_at,
            created_at: data.user.created_at
          } : null,
          session: data.session ? 'Session exists' : 'No session'
        } : null,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        if (error.message.includes('User already registered')) {
          setError('This email is already registered. Please try signing in.');
        } else if (error.message.includes('JSON')) {
          setError('Connection error. Please reload the page.');
        } else {
          setError(`Error: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        console.log('✅ Member sign up successful for user:', data.user.id);
        console.log('📧 User email confirmed:', data.user.email_confirmed_at);
        
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
      } else {
        console.log('❌ No user data returned from signup');
        setError('Sign up failed. Please try again.');
      }
    } catch (err: any) {
      console.error('💥 Unexpected sign-up error:', err);
      console.error('💥 Error stack:', err.stack);
      setError('Unexpected error. Please reload the page.');
    } finally {
      console.log('🔄 Setting loading state to false');
      setLoading(false);
    }
  };
  return <>
      <SEO title="Members Area - Exclusive Access | Five London" description="Exclusive membership area for Five London. Access requires approval from our team." keywords="members area, exclusive access, VIP membership, Five London" canonicalUrl="/membership" />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-0">
          {/* Hero Section */}
          <section className="pt-20 pb-16 md:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                  Members Area
                </h1>
                <p className="luxury-body-lg text-black mb-12 md:mb-12">
                  Exclusive access to our sophisticated companion collection. Membership is by invitation or approval only.
                </p>
              </div>
            </div>
            {/* Elegant separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
          </section>

          <div className="container-width px-6">

        {/* Logged In User Section */}
        {user && (
          <section className="py-16 bg-white">
            <div className="max-w-md mx-auto">
              {/* Back link */}
              <Link 
                to="/" 
                className="inline-flex items-center luxury-body-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>

              <Card className="border border-border/50 shadow-luxury">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="luxury-heading-md">
                    Welcome Back!
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    You are currently signed in as {user.email}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">
                          Successfully Signed In
                        </span>
                      </div>
                      <p className="text-xs text-green-700">
                        You have access to our exclusive content
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Link to="/models">
                        <Button className="w-full five-london-button">
                          <User className="w-4 h-4 mr-2" />
                          Browse Models
                        </Button>
                      </Link>
                      
                      <Button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to sign out?')) {
                            signOut();
                          }
                        }}
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Authentication Section for Non-Logged In Users */}
        {!user && <section className="py-16 bg-white">
            <div className="max-w-md mx-auto">
              {/* Back link */}
              <Link 
                to="/" 
                className="inline-flex items-center luxury-body-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>

              <Card className="border border-border/50 shadow-luxury">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="luxury-heading-md">
                    Member Access
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Sign in to your membership account or create a new one
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
                      <form 
                        onSubmit={(e) => {
                          console.log('📝 Sign in form onSubmit triggered');
                          console.log('📝 Event:', e);
                          console.log('📝 Event target:', e.target);
                          handleSignIn(e);
                        }} 
                        className="space-y-4"
                      >
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
                          onClick={(e) => {
                            console.log('🖱️ Sign In button clicked');
                            console.log('🖱️ Event:', e);
                            console.log('🖱️ Loading state:', loading);
                            console.log('🖱️ Form data at click:', formData);
                          }}
                        >
                          {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                      <form 
                        onSubmit={(e) => {
                          console.log('📝 Form onSubmit triggered');
                          console.log('📝 Event:', e);
                          console.log('📝 Event target:', e.target);
                          handleSignUp(e);
                        }} 
                        className="space-y-4"
                      >
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
                          <p className="caption text-muted-foreground">
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
                          onClick={(e) => {
                            console.log('🖱️ Create Account button clicked');
                            console.log('🖱️ Event:', e);
                            console.log('🖱️ Loading state:', loading);
                            console.log('🖱️ Form data at click:', formData);
                          }}
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 text-center space-y-4">
                    
                    <div className="flex justify-center">
                      <div className="text-center space-y-2">
                        <Link 
                          to="/auth" 
                          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Administrator Access
                        </Link>
                        <p className="text-xs text-muted-foreground/70">
                          For administrators only
                        </p>
                      </div>
                    </div>
                    <p className="caption text-muted-foreground leading-relaxed">
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
              
              {/* Access Request Information */}
              <div className="mt-8">
                <Card className="border border-border/50 bg-gray-50/50">
                  <CardContent className="p-6 text-center">
                    <Mail className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-medium mb-2 text-foreground">Need Membership Access?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Membership approval may be required for full access. Contact our team for assistance.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/contact" className="inline-flex items-center justify-center">
                        Contact for Support
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>}

        {/* Welcome Message for Logged In Users */}
        {user && <section className="py-16 bg-white">
            <div className="max-w-md mx-auto">
              {/* Welcome Message */}
              <Card className="border border-primary/20 bg-primary/5 shadow-elegant mb-6">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-primary/10">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-light text-lg text-foreground">
                      Welcome, Five London Member
                    </span>
                  </div>
                  <p className="luxury-body-base text-muted-foreground">
                    You are successfully logged in. Enjoy your special benefits as a Five London member.
                  </p>
                </CardContent>
              </Card>

              {/* Current Status */}
              <Card className={`border shadow-elegant ${hasAccess ? 'border-green-500/30 bg-green-50/5 dark:bg-green-950/5' : 'border-border'}`}>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${hasAccess ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                      {hasAccess ? <Check className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <span className="font-light text-lg">
                      {hasAccess ? 'Active Access' : 'Guest Access'}
                    </span>
                  </div>
                   {hasAccess && <Button onClick={() => window.location.href = '/models'} className="mt-4 px-6 py-2 font-light tracking-widest">
                      View All Models
                    </Button>}
                </CardContent>
              </Card>
            </div>
          </section>}

        {/* Access Status for Users Without Access */}
        {user && !hasAccess && <section className="py-16 bg-white">
            <div className="max-w-md mx-auto">
              <Card className="border border-orange-200 bg-orange-50/30">
                <CardContent className="p-6 text-center">
                  <Lock className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-medium mb-2 text-foreground">Access Pending</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your membership request is being reviewed. You will be notified once approved.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/contact" className="inline-flex items-center justify-center">
                      Contact Support
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>}

        {/* About VIP Membership Benefits - Collapsible Rich Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <details className="mb-8">
              <summary className="cursor-pointer luxury-heading-lg text-center mb-6 text-gray-800 hover:text-muted-foreground transition-colors">
                <h2>About VIP Membership Benefits</h2>
              </summary>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Premium Access to Elite Companions</h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    VIP membership provides exclusive access to our most sophisticated companions and premium services. Members enjoy priority booking, extended availability, and access to our elite model gallery featuring international companions who are exclusively available to our premium clientele.
                  </p>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Experience unparalleled discretion and personalized service with dedicated account management, flexible arrangements, and exclusive access to special events and experiences throughout London's most prestigious venues.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Members-Only Services and Privileges</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Exclusive Gallery Access</h4>
                      <p className="luxury-body-xs text-muted-foreground">Private viewing of our premium model portfolio with detailed profiles and extended photo galleries.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Priority Booking</h4>
                      <p className="luxury-body-xs text-muted-foreground">24/7 concierge service with priority scheduling and same-day availability for last-minute arrangements.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Special Events</h4>
                      <p className="luxury-body-xs text-muted-foreground">Invitations to exclusive social events, private parties, and member-only experiences at luxury venues.</p>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* Information Section */}
        
          </div>
        </main>
        
        <Footer />
      </div>
    </>;
};