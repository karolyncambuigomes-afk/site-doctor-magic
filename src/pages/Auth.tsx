import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSafeNavigate } from "@/hooks/useSafeRouter";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactBar } from "@/components/ContactBar";
import { SEOOptimized } from "@/components/SEOOptimized";
import { Eye, EyeOff, ArrowLeft, Settings } from "lucide-react";

export const Auth: React.FC = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useSafeNavigate();
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Redirect authenticated admin users to admin panel
      if (session?.user && navigate) {
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .maybeSingle();

            if (profile?.role === "admin") {
              navigate("/admin", { replace: true });
            } else {
              // Non-admin users should go to membership page
              navigate("/membership", { replace: true });
            }
          } catch (error) {
            console.error("Profile check failed:", error);
            navigate("/membership", { replace: true });
          }
        }, 100);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user && navigate) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .maybeSingle();

          if (profile?.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/membership", { replace: true });
          }
        } catch (error) {
          console.error("Profile check failed:", error);
          navigate("/membership", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Sanitize input to prevent XSS attacks
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .trim()
      .slice(0, 255); // Limit length
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    setError("");
  };

  const validateForm = (isSignUp: boolean = false) => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setLoading(true);
    setError("");

    try {
      console.log("Attempting admin sign in with:", { email: formData.email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        console.error("Sign in error:", error);
        if (error.message.includes("Invalid login credentials")) {
          setError(
            "Invalid admin credentials. Please check your email and password."
          );
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please confirm your email before signing in.");
        } else if (error.message.includes("JSON")) {
          setError("Connection error. Please reload the page.");
        } else {
          setError(`Error: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        // Verify user is admin before allowing access
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .maybeSingle();

          if (profile?.role !== "admin") {
            setError("Access denied. This page is for administrators only.");
            await supabase.auth.signOut();
            return;
          }

          console.log("Admin sign in successful for user:", data.user.id);
          toast({
            title: "Welcome back, Administrator!",
            description: "Login successful.",
          });
        } catch (profileError) {
          setError("Unable to verify admin status. Please try again.");
          await supabase.auth.signOut();
          return;
        }
      }
    } catch (err: any) {
      console.error("Unexpected sign-in error:", err);
      setError("Unexpected error. Please reload the page.");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="luxury-heading-md mb-4">Welcome back!</h2>
          <p className="text-muted-foreground mb-6">
            Redirecting you to your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOOptimized
        title="Administrator Login - Five London"
        description="Administrator access only. Login to manage Five London's exclusive companion services."
        keywords="admin login, administrator, five london management"
      />

      <Navigation />

      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container-width">
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
                  Administrator Access
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Restricted access for authorized administrators only
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Administrator Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="admin@fivelondon.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={loading}
                      className="transition-luxury"
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
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        disabled={loading}
                        className="pr-10 transition-luxury"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full five-london-button"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In as Administrator"}
                  </Button>
                </form>

                <div className="mt-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="text-center space-y-2">
                      <Link
                        to="/membership"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Member Login
                      </Link>
                      <p className="luxury-body-xs text-muted-foreground/70">
                        Not an administrator? Use the member login page instead.
                      </p>
                    </div>
                  </div>
                  <Alert className="text-left">
                    <AlertDescription className="luxury-body-xs">
                      <strong>Security Notice:</strong> This page is monitored
                      and restricted to authorized personnel only. Unauthorized
                      access attempts will be logged and may result in legal
                      action.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ContactBar showOnScroll={false} />
      <Footer />
    </>
  );
};
