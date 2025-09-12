// Visual regression testing utilities for automated UI testing

export interface ScreenshotConfig {
  url: string;
  name: string;
  viewport: { width: number; height: number };
  fullPage?: boolean;
  delay?: number;
  waitForSelector?: string;
}

export const STANDARD_VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  largeDesktop: { width: 1920, height: 1080 }
} as const;

export const TEST_PAGES = [
  '/',
  '/models',
  '/about',
  '/services',
  '/blog',
  '/locations',
  '/faq',
  '/contact'
] as const;

// Generate test matrix for all pages and viewports
export const generateTestMatrix = (): ScreenshotConfig[] => {
  const configs: ScreenshotConfig[] = [];
  
  TEST_PAGES.forEach(page => {
    Object.entries(STANDARD_VIEWPORTS).forEach(([device, viewport]) => {
      configs.push({
        url: page,
        name: `${page.replace('/', '') || 'home'}-${device}`,
        viewport,
        fullPage: true,
        delay: 2000,
        waitForSelector: device === 'mobile' ? '[data-mobile-ready]' : '[data-desktop-ready]'
      });
    });
  });
  
  return configs;
};

// Performance thresholds for different viewport sizes
export const PERFORMANCE_THRESHOLDS = {
  mobile: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800
  },
  tablet: {
    lcp: 2000,
    fid: 100,
    cls: 0.1,
    fcp: 1500
  },
  desktop: {
    lcp: 1500,
    fid: 100,
    cls: 0.1,
    fcp: 1200
  }
} as const;

// Critical image loading test cases
export const CRITICAL_IMAGE_TESTS = [
  {
    page: '/',
    selector: '[data-hero-image]',
    description: 'Hero section background image'
  },
  {
    page: '/models',
    selector: '[data-model-image]',
    description: 'Model gallery images'
  },
  {
    page: '/about',
    selector: '[data-about-image]',
    description: 'About page images'
  }
] as const;

// Layout validation selectors
export const LAYOUT_SELECTORS = {
  navigation: '[data-navigation]',
  footer: '[data-footer]',
  content: 'main',
  sidebar: '[data-sidebar]',
  modal: '[data-modal]',
  carousel: '[data-carousel]'
} as const;

// Responsive breakpoint validation
export const validateResponsiveLayout = (viewport: { width: number; height: number }) => {
  const { width } = viewport;
  
  return {
    shouldShowMobileNav: width < 768,
    shouldShowTabletLayout: width >= 768 && width < 1024,
    shouldShowDesktopLayout: width >= 1024,
    shouldStackElements: width < 640,
    shouldUseFlexLayout: width >= 640
  };
};

// Accessibility test configuration
export const ACCESSIBILITY_TESTS = {
  skipLinks: '[data-skip-link]',
  headingOrder: 'h1, h2, h3, h4, h5, h6',
  altAttributes: 'img[alt]',
  ariaLabels: '[aria-label], [aria-labelledby]',
  focusableElements: 'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
} as const;

// Export for use in test files
export const getTestConfig = () => ({
  viewports: STANDARD_VIEWPORTS,
  pages: TEST_PAGES,
  matrix: generateTestMatrix(),
  thresholds: PERFORMANCE_THRESHOLDS,
  imageTests: CRITICAL_IMAGE_TESTS,
  layoutSelectors: LAYOUT_SELECTORS,
  accessibility: ACCESSIBILITY_TESTS
});