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
import { Check, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { MobileAuthDebugger } from '@/components/MobileAuthDebugger';
export const Membership: React.FC = () => {
  const auth = useAuth();
  const { user, hasAccess } = auth || {};
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

    // Enhanced password validation for signup
    if (isSignUp) {
      const hasUppercase = /[A-Z]/.test(formData.password);
      const hasLowercase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);

      if (!hasUppercase || !hasLowercase || !hasNumbers) {
        setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setLoading(true);
    setError('');

    try {
      console.log('Attempting member sign in with:', { email: formData.email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        console.error('Sign in error:', error);
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
        console.log('Member sign in successful for user:', data.user.id);
        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });
      }
    } catch (err: any) {
      console.error('Unexpected sign-in error:', err);
      setError('Unexpected error. Please reload the page.');
    } finally {
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
                    Sign in to your membership account (created by administrator)
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

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
              
              {/* Contact Information */}
              <div className="mt-8">
                <Card className="border border-border/50 bg-gray-50/50">
                  <CardContent className="p-6 text-center">
                    <Mail className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-medium mb-2 text-foreground">Need Support?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Only accounts created by our administration team can access this area.
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
                   {/* Temporarily hidden for debugging */}
                   {false && hasAccess && <Button onClick={() => navigate('/models')} className="mt-4 px-6 py-2 font-light tracking-widest">
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
        <MobileAuthDebugger />
      </div>
    </>;
};