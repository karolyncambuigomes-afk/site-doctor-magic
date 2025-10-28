import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSafeNavigate } from '@/hooks/useSafeRouter';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Lock, Mail, Eye, EyeOff, ArrowLeft, LogOut, User } from 'lucide-react';
import { SEOOptimized } from '@/components/SEOOptimized';
import { useToast } from '@/hooks/use-toast';

export const Membership: React.FC = () => {
  const auth = useAuth();
  const { user, hasAccess, signOut } = auth || {};
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useSafeNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length === 0) {
      setError('Please enter your password');
      return false;
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email before signing in.');
        } else {
          setError(`Error: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });
        
        // Clear form
        setFormData({
          email: '',
          password: ''
        });
      }
    } catch (err: any) {
      setError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOOptimized 
        title="Members Area - Exclusive Access | Five London" 
        description="Exclusive membership area for Five London. Access requires approval from our team." 
        keywords="members area, exclusive access, VIP membership, Five London" 
        canonicalUrl="/membership" 
      />
      
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
                    className="inline-flex items-center luxury-body-sm text-gray-600 hover:text-black mb-8 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to home
                  </Link>

                  <Card className="border border-border/50 shadow-luxury">
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="luxury-heading-md text-black">
                        Welcome Back!
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        You are currently signed in as {user.email}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="text-center space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            <Check className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Successfully Signed In
                            </span>
                          </div>
                          <p className="luxury-body-xs text-green-700 dark:text-green-300">
                            You have access to our exclusive content
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Link to="/models">
                            <Button className="w-full bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm">
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
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800"
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
            {!user && (
              <section className="py-16 bg-white">
                <div className="max-w-md mx-auto">
                  {/* Back link */}
                  <Link 
                    to="/" 
                    className="inline-flex items-center luxury-body-sm text-gray-600 hover:text-black mb-8 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to home
                  </Link>

                  <Card className="border border-border/50 shadow-luxury">
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="luxury-heading-md text-black">
                        Member Access
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Sign in to your membership account
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-6">
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        <form onSubmit={handleSignIn} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signin-email">Email Address</Label>
                            <Input
                              id="signin-email"
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              disabled={loading}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signin-password">Password</Label>
                            <div className="relative">
                              <Input
                                id="signin-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                disabled={loading}
                                className="pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm disabled:opacity-50"
                            disabled={loading}
                          >
                            {loading ? 'Signing In...' : 'Sign In'}
                          </Button>
                        </form>
                        
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="text-center">
                            <p className="luxury-body-xs text-gray-600 mb-4">
                              Need help accessing your account?
                            </p>
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800 hover:text-white border-none" asChild>
                              <Link to="/contact">Contact Support</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}

            {/* VIP Membership Benefits */}
            <section className="py-16 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                  <h2 className="luxury-heading-lg mb-4 text-black">VIP Membership Benefits</h2>
                  <p className="luxury-body-lg text-gray-700">
                    Discover the exclusive advantages of Five London membership
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="luxury-heading-md text-black">Premium Access</h3>
                    <p className="luxury-body-md text-gray-700 leading-relaxed">
                      VIP membership provides exclusive access to our most sophisticated companions and premium services. 
                      Members enjoy priority booking, extended availability, and access to our elite model gallery.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-black">Exclusive Gallery Access</h4>
                          <p className="text-sm text-gray-600">Private viewing of our premium model portfolio</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-black">Priority Booking</h4>
                          <p className="text-sm text-gray-600">24/7 concierge service with priority scheduling</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-black">Exclusive Events</h4>
                          <p className="text-sm text-gray-600">Access to special events and experiences</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="luxury-heading-md text-black">Membership Process</h3>
                    <p className="luxury-body-md text-gray-700 leading-relaxed">
                      Our membership approval process ensures the highest standards of discretion and quality for all members.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">1</div>
                        <span className="text-sm text-black">Contact us for membership inquiry</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">2</div>
                        <span className="text-sm text-black">Account review and verification process</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">3</div>
                        <span className="text-sm text-black">Membership approval and full access granted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <ContactBar showOnScroll={false} />
        <Footer />
      </div>
    </>
  );
};