import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load heavy admin components
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const GlobalSEO = lazy(() => import('../pages/admin/seo/GlobalSEO').then(m => ({ default: m.GlobalSEO })));
const MetaTagsManager = lazy(() => import('../pages/admin/seo/MetaTagsManager').then(m => ({ default: m.MetaTagsManager })));
const StructuredDataManager = lazy(() => import('../pages/admin/seo/StructuredDataManager').then(m => ({ default: m.StructuredDataManager })));
const TechnicalSEO = lazy(() => import('../pages/admin/seo/TechnicalSEO').then(m => ({ default: m.TechnicalSEO })));
const PerformanceAnalytics = lazy(() => import('../pages/admin/seo/PerformanceAnalytics').then(m => ({ default: m.PerformanceAnalytics })));
const ContentManager = lazy(() => import('../pages/admin/content/ContentManager').then(m => ({ default: m.ContentManager })));
const BlogManager = lazy(() => import('../pages/admin/content/BlogManager').then(m => ({ default: m.BlogManager })));
const HomepageManagerPage = lazy(() => import('../pages/admin/content/HomepageManagerPage').then(m => ({ default: m.HomepageManagerPage })));
const SiteContentManagerPage = lazy(() => import('../pages/admin/content/SiteContentManagerPage').then(m => ({ default: m.SiteContentManagerPage })));
const FAQManagerPage = lazy(() => import('../pages/admin/content/FAQManagerPage').then(m => ({ default: m.FAQManagerPage })));
const ModelsManager = lazy(() => import('../pages/admin/models/ModelsManager').then(m => ({ default: m.ModelsManager })));
const ModelsListManager = lazy(() => import('../pages/admin/models/ModelsListManager').then(m => ({ default: m.ModelsListManager })));
const ModelFormPage = lazy(() => import('../pages/admin/models/ModelFormPage').then(m => ({ default: m.ModelFormPage })));
const ApplicationsManager = lazy(() => import('../pages/admin/models/ApplicationsManager').then(m => ({ default: m.ApplicationsManager })));
const CharacteristicsManagerPage = lazy(() => import('../pages/admin/models/CharacteristicsManagerPage').then(m => ({ default: m.CharacteristicsManagerPage })));
const ServicesManagerPage = lazy(() => import('../pages/admin/models/ServicesManagerPage').then(m => ({ default: m.ServicesManagerPage })));
const ReviewsManagerPage = lazy(() => import('../pages/admin/models/ReviewsManagerPage').then(m => ({ default: m.ReviewsManagerPage })));
const LocationsManagerPage = lazy(() => import('../pages/admin/locations/LocationsManager').then(m => ({ default: m.LocationsManager })));
const LocalSEOManagerPage = lazy(() => import('../pages/admin/locations/LocalSEOManagerPage').then(m => ({ default: m.LocalSEOManagerPage })));
const UsersManager = lazy(() => import('../pages/admin/users/UsersManager').then(m => ({ default: m.UsersManager })));
const PermissionsManagerPage = lazy(() => import('../pages/admin/users/PermissionsManagerPage').then(m => ({ default: m.PermissionsManagerPage })));
const SystemSettings = lazy(() => import('../pages/admin/system/SystemSettings').then(m => ({ default: m.SystemSettings })));
const ThemeManagerPage = lazy(() => import('../pages/admin/system/ThemeManagerPage').then(m => ({ default: m.ThemeManagerPage })));
const CategoriesManagerPage = lazy(() => import('../pages/admin/system/CategoriesManagerPage').then(m => ({ default: m.CategoriesManagerPage })));
const LegalPagesManagerPage = lazy(() => import('../pages/admin/system/LegalPagesManagerPage').then(m => ({ default: m.LegalPagesManagerPage })));

// Lazy load mobile-specific components
const MobileOptimizer = lazy(() => import('../components/MobileOptimizer').then(m => ({ default: m.MobileOptimizer })));
const MobileForceRefresh = lazy(() => import('../components/MobileForceRefresh').then(m => ({ default: m.MobileForceRefresh })));
const MobileDebugPanel = lazy(() => import('../components/MobileDebugPanel').then(m => ({ default: m.MobileDebugPanel })));
const MobileRefreshButton = lazy(() => import('../components/MobileRefreshButton').then(m => ({ default: m.MobileRefreshButton })));

// Lazy load analytics and tracking
const Analytics = lazy(() => import('../components/Analytics').then(m => ({ default: m.Analytics })));
const CookieConsent = lazy(() => import('../components/CookieConsent').then(m => ({ default: m.CookieConsent })));
const ServiceWorkerManager = lazy(() => import('../components/ServiceWorkerManager').then(m => ({ default: m.ServiceWorkerManager })));

// Lazy load less critical pages
const Blog = lazy(() => import('../pages/Blog'));
const BlogPost = lazy(() => import('../pages/BlogPost'));
const Models = lazy(() => import('../pages/Models').then(m => ({ default: m.Models })));
const ModelProfile = lazy(() => import('../pages/ModelProfile').then(m => ({ default: m.ModelProfile })));
const Membership = lazy(() => import('../pages/Membership').then(m => ({ default: m.Membership })));
const Members = lazy(() => import('../pages/Members').then(m => ({ default: m.Members })));
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess').then(m => ({ default: m.PaymentSuccess })));
const Locations = lazy(() => import('../pages/Locations'));
const LocationDetail = lazy(() => import('../pages/LocationDetail'));
const Characteristics = lazy(() => import('../pages/Characteristics'));
const CharacteristicDetail = lazy(() => import('../pages/CharacteristicDetail'));
const LondonEscortGuide = lazy(() => import('../pages/LondonEscortGuide'));
const Reviews = lazy(() => import('../pages/Reviews'));
const JoinUs = lazy(() => import('../pages/JoinUs'));

interface LazyPageProps {
  children: React.ReactNode;
}

const LazyPageWrapper: React.FC<LazyPageProps> = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  }>
    {children}
  </Suspense>
);

interface LazyAdminPageProps {
  children: React.ReactNode;
}

const LazyAdminWrapper: React.FC<LazyAdminPageProps> = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center space-y-4">
        <LoadingSpinner />
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    </div>
  }>
    {children}
  </Suspense>
);

export {
  AdminDashboard,
  GlobalSEO,
  MetaTagsManager,
  StructuredDataManager,
  TechnicalSEO,
  PerformanceAnalytics,
  ContentManager,
  BlogManager,
  HomepageManagerPage,
  SiteContentManagerPage,
  FAQManagerPage,
  ModelsManager,
  ModelsListManager,
  ModelFormPage,
  ApplicationsManager,
  CharacteristicsManagerPage,
  ServicesManagerPage,
  ReviewsManagerPage,
  LocationsManagerPage,
  LocalSEOManagerPage,
  UsersManager,
  PermissionsManagerPage,
  SystemSettings,
  ThemeManagerPage,
  CategoriesManagerPage,
  LegalPagesManagerPage,
  MobileOptimizer,
  MobileForceRefresh,
  MobileDebugPanel,
  MobileRefreshButton,
  Analytics,
  CookieConsent,
  ServiceWorkerManager,
  Blog,
  BlogPost,
  Models,
  ModelProfile,
  Membership,
  Members,
  PaymentSuccess,
  Locations,
  LocationDetail,
  Characteristics,
  CharacteristicDetail,
  LondonEscortGuide,
  Reviews,
  JoinUs,
  LazyPageWrapper,
  LazyAdminWrapper
};