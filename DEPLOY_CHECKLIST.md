# Five London - Pre-Deploy Checklist

## 🚀 Deployment Date: [DATE]
## 📋 Pre-Deploy Validation

### 1. Backup & Recovery
- [ ] **Database Backup Created** - Full Supabase backup with timestamp
- [ ] **Media Assets Backup** - All images, videos backed up to S3/GCS
- [ ] **Code Repository** - Tagged release version in Git
- [ ] **Environment Variables** - Production secrets documented and verified
- [ ] **Rollback Plan** - Previous stable version identified and tested

### 2. Testing & Quality Assurance
- [ ] **Unit Tests Pass** - All Vitest tests passing (run `npm run test`)
- [ ] **Integration Tests** - Supabase functions and API endpoints verified
- [ ] **Visual Regression Tests** - Playwright screenshots compared
- [ ] **Cross-Browser Testing** - Chrome, Firefox, Safari, Mobile browsers
- [ ] **Security Scan** - RLS policies, admin access, data exposure checks
- [ ] **Performance Baseline** - Lighthouse scores captured (see PERFORMANCE_BASELINE.md)

### 3. Performance & Optimization
- [ ] **Image Optimization** - WebP conversion, responsive sizes validated
- [ ] **Bundle Analysis** - JS/CSS chunks optimized, no unused dependencies
- [ ] **CDN Configuration** - Cache headers, compression settings verified
- [ ] **Service Worker** - Caching strategy updated for new assets
- [ ] **Critical CSS** - Above-fold styles inlined

### 4. Security & Compliance
- [ ] **SSL Certificate** - Valid and expires > 30 days
- [ ] **Security Headers** - CSP, HSTS, X-Frame-Options configured
- [ ] **Admin Access** - 2FA enabled, audit logging active
- [ ] **Data Privacy** - GDPR compliance, cookie consent functional
- [ ] **API Rate Limiting** - Protection against abuse enabled

### 5. Content & SEO
- [ ] **Meta Tags** - Title, description, OG tags for all pages
- [ ] **Structured Data** - JSON-LD markup validated
- [ ] **Sitemap** - Updated with new pages/content
- [ ] **Robots.txt** - Production-ready configuration
- [ ] **Analytics** - Tracking codes active and verified

## 🌐 CDN Cache Purge Plan

### Cloudflare/CDN Purge Strategy
1. **Pre-Deploy** - Purge static assets cache (CSS, JS, images)
2. **Post-Deploy** - Purge HTML pages cache
3. **Selective Purge** - Target specific changed files only
4. **Verification** - Check cache headers and asset versions

### Cache Invalidation Commands
```bash
# Purge all static assets
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["*.css","*.js","*.jpg","*.png","*.webp"]}'

# Purge HTML pages
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## 🔄 Rollback Steps

### Immediate Rollback (< 5 minutes)
1. **DNS Rollback** - Point domain to previous stable deployment
2. **CDN Rollback** - Revert CDN configuration to previous version
3. **Database Rollback** - Restore from pre-deploy backup if needed
4. **Monitoring** - Verify all systems operational

### Full Rollback Procedure
1. **Stop Current Deployment** - Cancel any ongoing processes
2. **Restore Previous Version** - Deploy last known good version
3. **Database Restoration** - Execute backup restore if schema changed
4. **Cache Purge** - Clear all caches to serve old content
5. **Verification** - Run smoke tests on rolled-back version
6. **Incident Report** - Document rollback reason and timeline

## 📊 Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 1.5s
- **FID** (First Input Delay): < 100ms  
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.2s

### Lighthouse Scores (Mobile/Desktop)
- **Performance**: 90+ / 95+
- **Accessibility**: 95+ / 95+
- **Best Practices**: 95+ / 95+
- **SEO**: 100 / 100

### GTMetrix Targets
- **Grade**: A
- **Page Load Time**: < 2s
- **Page Size**: < 2MB
- **Requests**: < 50

## ✅ Final Sign-Off

### Technical Lead Approval
- [ ] Code review completed and approved
- [ ] Security review passed
- [ ] Performance benchmarks met
- [ ] Documentation updated

### Business Stakeholder Approval  
- [ ] Content review completed
- [ ] User acceptance testing passed
- [ ] Compliance requirements met
- [ ] Go-live authorization granted

### Deployment Authority
- [ ] All checklist items verified ✓
- [ ] Rollback plan tested and ready ✓
- [ ] Monitoring and alerting active ✓
- [ ] **APPROVED FOR DEPLOYMENT** ✓

---

**Deployment Executed By**: [NAME]  
**Deployment Time**: [TIMESTAMP]  
**Git Commit**: [COMMIT_SHA]  
**Rollback Contact**: [PHONE/EMAIL]