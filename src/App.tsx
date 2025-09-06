import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { BookNowButton } from "@/components/BookNowButton";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserApprovalStatus } from "@/components/UserApprovalStatus";
import { Auth } from "./pages/Auth";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import { Models } from "./pages/Models";
import { ModelProfile } from "./pages/ModelProfile";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Characteristics from "./pages/Characteristics";
import CharacteristicDetail from "./pages/CharacteristicDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Reviews from "./pages/Reviews";
import { Admin } from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Analytics />
          <Toaster />
          <Sonner />
          <CookieConsent />
          <BookNowButton />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/approval-status" element={<UserApprovalStatus />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/models" element={<Models />} />
              <Route path="/models/:id" element={<ModelProfile />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/locations/:locationSlug" element={<LocationDetail />} />
              <Route path="/characteristics" element={<Characteristics />} />
              <Route path="/characteristics/:characteristicSlug" element={<CharacteristicDetail />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
