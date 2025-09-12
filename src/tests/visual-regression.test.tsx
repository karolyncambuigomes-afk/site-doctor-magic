import { test, expect, Page } from '@playwright/test';
import { 
  generateTestMatrix, 
  STANDARD_VIEWPORTS, 
  PERFORMANCE_THRESHOLDS,
  CRITICAL_IMAGE_TESTS,
  validateResponsiveLayout
} from '@/utils/visualRegressionTesting';

// Configure test timeout
test.setTimeout(60000);

// Test responsive layouts across all pages and viewports
test.describe('Responsive Layout Tests', () => {
  const testMatrix = generateTestMatrix();
  
  testMatrix.forEach(({ url, name, viewport, delay, waitForSelector }) => {
    test(`${name} - Responsive Layout`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize(viewport);
      
      // Navigate to page
      await page.goto(url);
      
      // Wait for content to load
      if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { timeout: 10000 });
      }
      
      // Additional delay for images and animations
      await page.waitForTimeout(delay || 2000);
      
      // Validate responsive layout behavior
      const layoutRules = validateResponsiveLayout(viewport);
      
      if (layoutRules.shouldShowMobileNav) {
        await expect(page.locator('[data-mobile-nav]')).toBeVisible();
      }
      
      if (layoutRules.shouldStackElements) {
        const container = page.locator('[data-responsive-container]');
        if (await container.isVisible()) {
          await expect(container).toHaveClass(/flex-col/);
        }
      }
      
      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        threshold: 0.2, // Allow for minor differences
        animations: 'disabled'
      });
    });
  });
});

// Test critical image loading and fallbacks
test.describe('Image Loading Tests', () => {
  CRITICAL_IMAGE_TESTS.forEach(({ page: testPage, selector, description }) => {
    Object.entries(STANDARD_VIEWPORTS).forEach(([device, viewport]) => {
      test(`${description} - ${device}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(testPage);
        
        // Wait for images to load or show fallbacks
        await page.waitForTimeout(3000);
        
        const images = page.locator(selector);
        const imageCount = await images.count();
        
        if (imageCount > 0) {
          // Check each image loads or shows proper fallback
          for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            const isVisible = await img.isVisible();
            
            if (isVisible) {
              // Check if image loaded successfully or shows fallback
              const hasError = await img.evaluate((el) => {
                if (el.tagName === 'IMG') {
                  return (el as HTMLImageElement).naturalWidth === 0;
                }
                return false;
              });
              
              if (hasError) {
                // Verify fallback is shown
                const fallback = page.locator('[data-image-fallback]');
                await expect(fallback).toBeVisible();
              } else {
                // Verify image aspect ratio is maintained
                const boundingBox = await img.boundingBox();
                expect(boundingBox).toBeTruthy();
                expect(boundingBox!.width).toBeGreaterThan(0);
                expect(boundingBox!.height).toBeGreaterThan(0);
              }
            }
          }
        }
      });
    });
  });
});

// Test navigation and routing
test.describe('Navigation Tests', () => {
  test('Login redirect flow works correctly', async ({ page }) => {
    // Test login redirect bug specifically
    await page.goto('/auth');
    
    // Mock successful authentication
    await page.route('**/auth/v1/token**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          user: { id: 'test-user', role: 'user' }
        })
      });
    });
    
    // Fill and submit auth form
    await page.fill('[data-email-input]', 'test@example.com');
    await page.fill('[data-password-input]', 'testpassword');
    await page.click('[data-submit-button]');
    
    // Should redirect to models page, not admin
    await page.waitForURL('**/models');
    expect(page.url()).toContain('/models');
  });
  
  test('Admin login redirects correctly', async ({ page }) => {
    await page.goto('/auth');
    
    // Mock admin authentication
    await page.route('**/auth/v1/token**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-admin-token',
          user: { id: 'admin-user', role: 'admin' }
        })
      });
    });
    
    await page.fill('[data-email-input]', 'admin@example.com');
    await page.fill('[data-password-input]', 'adminpassword');
    await page.click('[data-submit-button]');
    
    // Should redirect to admin panel
    await page.waitForURL('**/admin');
    expect(page.url()).toContain('/admin');
  });
});

// Performance tests
test.describe('Performance Tests', () => {
  Object.entries(STANDARD_VIEWPORTS).forEach(([device, viewport]) => {
    test(`Core Web Vitals - ${device}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      
      // Enable performance metrics
      const thresholds = PERFORMANCE_THRESHOLDS[device as keyof typeof PERFORMANCE_THRESHOLDS];
      
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Measure Core Web Vitals
      const vitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals: Record<string, number> = {};
            
            entries.forEach((entry) => {
              if (entry.entryType === 'largest-contentful-paint') {
                vitals.lcp = entry.startTime;
              }
              if (entry.entryType === 'first-contentful-paint') {
                vitals.fcp = entry.startTime;
              }
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                vitals.cls = (vitals.cls || 0) + (entry as any).value;
              }
            });
            
            resolve(vitals);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-contentful-paint', 'layout-shift'] });
        });
      });
      
      const metrics = await vitals as Record<string, number>;
      
      // Validate against thresholds
      if (metrics.lcp) {
        expect(metrics.lcp).toBeLessThan(thresholds.lcp);
      }
      if (metrics.fcp) {
        expect(metrics.fcp).toBeLessThan(thresholds.fcp);
      }
      if (metrics.cls) {
        expect(metrics.cls).toBeLessThan(thresholds.cls);
      }
    });
  });
});

// Accessibility tests
test.describe('Accessibility Tests', () => {
  test('Skip links and navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test skip link
    const skipLink = page.locator('[data-skip-link]');
    if (await skipLink.isVisible()) {
      await skipLink.focus();
      await expect(skipLink).toBeVisible();
    }
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
  
  test('Images have alt attributes', async ({ page }) => {
    await page.goto('/models');
    await page.waitForTimeout(2000);
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt!.length).toBeGreaterThan(0);
    }
  });
});