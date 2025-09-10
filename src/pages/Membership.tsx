import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Lock, Mail } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';
import { MobileAuthDebugger } from '@/components/MobileAuthDebugger';
export const Membership: React.FC = () => {
  const auth = useAuth();
  const {
    user,
    hasAccess
  } = auth || {};
  const [loginLoading, setLoginLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });
      
      if (error) throw error;
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoginLoading(false);
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

        {/* Login Section for Non-Logged In Users */}
        {!user && <section className="py-16 bg-white">
            <div className="max-w-md mx-auto">
              <Card className="border border-border shadow-elegant">
                <CardHeader className="text-center pb-6 bg-black">
                  <CardTitle className="luxury-heading-lg text-foreground">Member Login</CardTitle>
                  <CardDescription className="luxury-body-base text-muted-foreground">
                    Access your membership area
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-8 pb-8 bg-black">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="luxury-body-sm text-foreground">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={loginForm.email} 
                        onChange={e => setLoginForm({
                          ...loginForm,
                          email: e.target.value
                        })} 
                        required 
                        className="luxury-body-base" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="luxury-body-sm text-foreground">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={loginForm.password} 
                        onChange={e => setLoginForm({
                          ...loginForm,
                          password: e.target.value
                        })} 
                        required 
                        className="luxury-body-base" 
                      />
                    </div>
                    
                    <Button type="submit" disabled={loginLoading} className="w-full py-3 text-base font-light tracking-widest">
                      {loginLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Logging in...
                        </div>
                      ) : "Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Access Request Information */}
              <div className="mt-8">
                <Card className="border border-border/50 bg-gray-50/50">
                  <CardContent className="p-6 text-center">
                    <Mail className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-medium mb-2 text-foreground">Request Membership Access</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Membership is by invitation or approval only. To request access, please contact our team.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/contact" className="inline-flex items-center justify-center text-white">
                        Contact for Access
                      </a>
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
        <MobileAuthDebugger />
      </div>
    </>;
};