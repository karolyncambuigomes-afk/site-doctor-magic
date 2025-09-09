import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { ServiceWorkerManager } from "@/components/ServiceWorkerManager";
import { VersionManager } from "@/components/VersionManager";
import { MobileOptimizer } from "@/components/MobileOptimizer";
import { MobileForceRefresh } from "@/components/MobileForceRefresh";
import { MobileDebugPanel } from "@/components/MobileDebugPanel";
import { MobileRefreshButton } from "@/components/MobileRefreshButton";
import { useMobileSyncManager } from "@/hooks/useMobileSyncManager";
import { BookNowButton } from "@/components/BookNowButton";
import { SkipToContent } from "@/components/SkipToContent";
import { DegradedModeProvider, useDegradedMode } from "@/components/DegradedModeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserApprovalStatus } from "@/components/UserApprovalStatus";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
import { Membership } from "./pages/Membership";
import { Members } from "./pages/Members";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Characteristics from "./pages/Characteristics";
import CharacteristicDetail from "./pages/CharacteristicDetail";
import LondonEscortGuide from "./pages/LondonEscortGuide";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Reviews from "./pages/Reviews";
import { Admin } from "./pages/Admin";
import JoinUs from "./pages/JoinUs";
import NotFound from "./pages/NotFound";

// New Admin Panel Components
import { AdminDashboard } from "./pages/admin/Dashboard";
import { GlobalSEO } from "./pages/admin/seo/GlobalSEO";
import { MetaTagsManager } from "./pages/admin/seo/MetaTagsManager";
import { StructuredDataManager } from "./pages/admin/seo/StructuredDataManager";
import { TechnicalSEO } from "./pages/admin/seo/TechnicalSEO";
import { PerformanceAnalytics } from "./pages/admin/seo/PerformanceAnalytics";
import { ContentManager } from "./pages/admin/content/ContentManager";
import { BlogManager } from "./pages/admin/content/BlogManager";
import { HomepageManagerPage } from "./pages/admin/content/HomepageManagerPage";
import { SiteContentManagerPage } from "./pages/admin/content/SiteContentManagerPage";
import { FAQManagerPage } from "./pages/admin/content/FAQManagerPage";
import { GalleryManagerPage } from "./pages/admin/content/GalleryManagerPage";
import { ModelsManager } from "./pages/admin/models/ModelsManager";
import { ModelsListManager } from "./pages/admin/models/ModelsListManager";
import { ApplicationsManager } from "./pages/admin/models/ApplicationsManager";
import { CharacteristicsManagerPage } from "./pages/admin/models/CharacteristicsManagerPage";
import { ServicesManagerPage } from "./pages/admin/models/ServicesManagerPage";
import { ReviewsManagerPage } from "./pages/admin/models/ReviewsManagerPage";
import { LocationsManager as LocationsManagerPage } from "./pages/admin/locations/LocationsManager";
import { LocalSEOManagerPage } from "./pages/admin/locations/LocalSEOManagerPage";
import { UsersManager } from "./pages/admin/users/UsersManager";
import { PermissionsManagerPage } from "./pages/admin/users/PermissionsManagerPage";
import { SystemSettings } from "./pages/admin/system/SystemSettings";
import { ThemeManagerPage } from "./pages/admin/system/ThemeManagerPage";
import { CategoriesManagerPage } from "./pages/admin/system/CategoriesManagerPage";
import { LegalPagesManagerPage } from "./pages/admin/system/LegalPagesManagerPage";
import { GalleryAdmin } from "./pages/GalleryAdmin";

const queryClient = new QueryClient();

// Component to conditionally render features based on degraded mode
const ConditionalFeatures = () => {
  const { isDegradedMode, isPrivateMode } = useDegradedMode();
  
  return (
    <>
      {!isPrivateMode && <Analytics />}
      <ServiceWorkerManager />
      <VersionManager />
      {!isDegradedMode && <CookieConsent />}
    </>
  );
};

import { useDataSyncManager } from '@/hooks/useDataSyncManager';

// Mobile Sync Component to initialize the sync manager
const DataSyncInitializer = () => {
  useDataSyncManager();
  return null;
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DegradedModeProvider>
            <AuthProvider>
              <BrowserRouter>
                <ConditionalFeatures />
                <DataSyncInitializer />
                <MobileOptimizer />
                <MobileForceRefresh />
                <MobileDebugPanel />
                <MobileRefreshButton />
                <Toaster />
                <Sonner />
                <BookNowButton />
                <SkipToContent />
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
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/locations/:locationSlug" element={<LocationDetail />} />
                  {/* Specific location routes for SEO */}
                  <Route path="/escorts-in-mayfair" element={<LocationDetail />} />
                  <Route path="/escorts-in-knightsbridge" element={<LocationDetail />} />
                  <Route path="/escorts-in-chelsea" element={<LocationDetail />} />
                  <Route path="/escorts-in-belgravia" element={<LocationDetail />} />
                  <Route path="/escorts-in-kensington" element={<LocationDetail />} />
                  <Route path="/escorts-in-canary-wharf" element={<LocationDetail />} />
                  <Route path="/escorts-in-notting-hill" element={<LocationDetail />} />
                  <Route path="/escorts-in-paddington" element={<LocationDetail />} />
                  <Route path="/escorts-in-st-johns-wood" element={<LocationDetail />} />
                  <Route path="/escorts-in-westminster" element={<LocationDetail />} />
                  <Route path="/escorts-in-city-of-london" element={<LocationDetail />} />
                  <Route path="/escorts-in-kings-cross" element={<LocationDetail />} />
                  <Route path="/escorts-in-islington" element={<LocationDetail />} />
                  <Route path="/escorts-in-hammersmith" element={<LocationDetail />} />
                  <Route path="/escorts-in-fulham" element={<LocationDetail />} />
                  <Route path="/escorts-in-clapham" element={<LocationDetail />} />
                  <Route path="/escorts-in-greenwich" element={<LocationDetail />} />
                  <Route path="/escorts-in-richmond" element={<LocationDetail />} />
                  <Route path="/escorts-in-wimbledon" element={<LocationDetail />} />
                  <Route path="/escorts-in-battersea" element={<LocationDetail />} />
                  <Route path="/escorts-in-bermondsey" element={<LocationDetail />} />
                  <Route path="/escorts-in-blackfriars" element={<LocationDetail />} />
                  <Route path="/characteristics" element={<Characteristics />} />
                  <Route path="/characteristics/:characteristicSlug" element={<CharacteristicDetail />} />
                  {/* Specific characteristic routes for SEO */}
                  <Route path="/blonde-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/brunette-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/busty-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/petite-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/curvy-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/slim-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/english-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/international-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/young-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/mature-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/vip-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/gfe-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/redhead-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/asian-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/european-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/ebony-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/tall-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/natural-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/brazilian-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/russian-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/middle-eastern-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/latina-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/iranian-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/vip-elite-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/party-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/adventurous-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/open-minded-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/exclusive-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/high-class-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/dinner-date-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/domination-fetish-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/bisexual-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/couples-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/outcalls-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/london-escort-guide" element={<LondonEscortGuide />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/join-us" element={<JoinUs />} />
          {/* New Admin Panel Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiresAccess={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiresAccess={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* SEO Management */}
          <Route path="/admin/seo/global" element={
            <ProtectedRoute requiresAccess={true}>
              <GlobalSEO />
            </ProtectedRoute>
          } />
          <Route path="/admin/seo/meta-tags" element={
            <ProtectedRoute requiresAccess={true}>
              <MetaTagsManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/seo/structured-data" element={
            <ProtectedRoute requiresAccess={true}>
              <StructuredDataManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/seo/technical" element={
            <ProtectedRoute requiresAccess={true}>
              <TechnicalSEO />
            </ProtectedRoute>
          } />
          <Route path="/admin/seo/performance" element={
            <ProtectedRoute requiresAccess={true}>
              <PerformanceAnalytics />
            </ProtectedRoute>
          } />
          
          {/* Content Management */}
          <Route path="/admin/content" element={
            <ProtectedRoute requiresAccess={true}>
              <ContentManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/content/homepage" element={
            <ProtectedRoute requiresAccess={true}>
              <ContentManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/content/blog" element={
            <ProtectedRoute requiresAccess={true}>
              <ContentManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/content/site" element={
            <ProtectedRoute requiresAccess={true}>
              <ContentManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/content/faq" element={
            <ProtectedRoute requiresAccess={true}>
              <ContentManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/content/gallery" element={
            <ProtectedRoute requiresAccess={true}>
              <ContentManager />
            </ProtectedRoute>
          } />
          
          {/* Models & Services */}
          <Route path="/admin/models" element={<Navigate to="/admin/models/list" replace />} />
          <Route path="/admin/models/list" element={
            <ProtectedRoute requiresAccess={true}>
              <ModelsListManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/models/applications" element={
            <ProtectedRoute requiresAccess={true}>
              <ApplicationsManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/models/characteristics" element={
            <ProtectedRoute requiresAccess={true}>
              <CharacteristicsManagerPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/models/services" element={
            <ProtectedRoute requiresAccess={true}>
              <ServicesManagerPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/models/reviews" element={
            <ProtectedRoute requiresAccess={true}>
              <ReviewsManagerPage />
            </ProtectedRoute>
          } />
          
          {/* Locations & Geo */}
          <Route path="/admin/locations/list" element={
            <ProtectedRoute requiresAccess={true}>
              <LocationsManagerPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/locations/seo" element={
            <ProtectedRoute requiresAccess={true}>
              <LocalSEOManagerPage />
            </ProtectedRoute>
          } />
          
          {/* System Settings */}
          <Route path="/admin/settings/theme" element={
            <ProtectedRoute requiresAccess={true}>
              <ThemeManagerPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings/categories" element={
            <ProtectedRoute requiresAccess={true}>
              <CategoriesManagerPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings/legal" element={
            <ProtectedRoute requiresAccess={true}>
              <LegalPagesManagerPage />
            </ProtectedRoute>
          } />
          
          {/* User Management */}
          <Route path="/admin/users/list" element={
            <ProtectedRoute requiresAccess={true}>
              <UsersManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/permissions" element={
            <ProtectedRoute requiresAccess={true}>
              <PermissionsManagerPage />
            </ProtectedRoute>
          } />
          
          {/* System Settings */}
          <Route path="/admin/system" element={
            <ProtectedRoute requiresAccess={true}>
              <SystemSettings />
            </ProtectedRoute>
          } />
          
          {/* Legacy Admin Routes */}
          <Route path="/admin-old" element={
            <ProtectedRoute requiresAccess={true}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/gallery-admin" element={
            <ProtectedRoute requiresAccess={true}>
              <GalleryAdmin />
            </ProtectedRoute>
          } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </DegradedModeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
