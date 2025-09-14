# CDN and Cache Configuration Guide

## CDN Configuration

### 1. CloudFlare Setup (Recommended)

#### DNS Configuration:
```
Type: CNAME
Name: @
Target: five-london.pages.dev
Proxy: Enabled (Orange Cloud)
```

#### Page Rules:
```
# Static Assets - Maximum Cache
URL Pattern: *.fivelondon.com/assets/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 year
  - Browser Cache TTL: 1 year
  - Security Level: Medium

# Images - Optimized Cache
URL Pattern: *.fivelondon.com/images/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 week
  - Image Optimization: Enabled
  - Polish: Lossless

# Admin Pages - No Cache
URL Pattern: *.fivelondon.com/admin*
Settings:
  - Cache Level: Bypass
  - Disable Apps
  - Disable Security
```

#### Cache Purge API:
```bash
# Purge entire cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Purge specific files
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://fivelondon.com/assets/css/main-abc123.css"]}'

# Purge by cache tags
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"tags":["static","v2.0.0"]}'
```

### 2. Alternative CDN Providers

#### AWS CloudFront:
```json
{
  "Origins": [
    {
      "DomainName": "fivelondon.com",
      "OriginPath": "",
      "CustomOriginConfig": {
        "HTTPPort": 443,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "https-only"
      }
    }
  ],
  "DefaultCacheBehavior": {
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
    "CachedMethods": ["GET", "HEAD"],
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CacheBehaviors": [
    {
      "PathPattern": "/assets/*",
      "DefaultTTL": 31536000,
      "MaxTTL": 31536000,
      "MinTTL": 31536000
    },
    {
      "PathPattern": "/admin*",
      "DefaultTTL": 0,
      "MaxTTL": 0,
      "MinTTL": 0
    }
  ]
}
```

## Cache Invalidation Strategy

### 1. Deploy-Time Invalidation

#### GitHub Actions Workflow:
```yaml
name: Deploy and Invalidate Cache
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        run: |
          npm ci
          npm run build
          
      - name: Deploy
        run: |
          # Deploy to hosting platform
          
      - name: Invalidate CloudFlare Cache
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'
            
      - name: Warm Critical Pages
        run: |
          curl -s "https://fivelondon.com/"
          curl -s "https://fivelondon.com/models"
          curl -s "https://fivelondon.com/services"
```

#### Selective Invalidation Script:
```bash
#!/bin/bash
# invalidate-cache.sh

BUILD_HASH=$(git rev-parse --short HEAD)
API_TOKEN="${CLOUDFLARE_API_TOKEN}"
ZONE_ID="${CLOUDFLARE_ZONE_ID}"

# Invalidate static assets with new hash
FILES_TO_PURGE=(
  "https://fivelondon.com/assets/js/main-${BUILD_HASH}.js"
  "https://fivelondon.com/assets/css/main-${BUILD_HASH}.css"
  "https://fivelondon.com/manifest.json"
  "https://fivelondon.com/"
)

for file in "${FILES_TO_PURGE[@]}"; do
  echo "Purging: $file"
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{\"files\":[\"$file\"]}"
done

# Notify service worker of deployment
curl -s -X POST "https://fivelondon.com/api/notify-deployment" \
  -H "Content-Type: application/json" \
  --data "{\"build_hash\":\"$BUILD_HASH\"}"

echo "Cache invalidation completed for build: $BUILD_HASH"
```

### 2. Service Worker Cache Management

#### Deployment Hook:
```javascript
// Add to service worker
self.addEventListener('message', event => {
  if (event.data.type === 'DEPLOYMENT_NOTIFICATION') {
    const { buildHash, timestamp } = event.data;
    
    // Clear runtime cache for fresh content
    caches.delete(RUNTIME_CACHE);
    
    // Update version tracking
    self.registration.update();
    
    console.log(`SW: Deployment ${buildHash} processed`);
  }
});
```

## Cache Monitoring and Alerts

### 1. CloudFlare Analytics API

#### Cache Hit Rate Monitoring:
```javascript
// Monitor cache performance
async function getCacheAnalytics() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/analytics/dashboard?since=-1h`,
    {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  
  return {
    cacheHitRate: data.result.totals.requests.cached / data.result.totals.requests.all,
    bandwidthSaved: data.result.totals.bandwidth.cached,
    totalRequests: data.result.totals.requests.all
  };
}
```

### 2. Custom Monitoring Dashboard

#### Key Metrics to Track:
- Cache hit rate (target: >80%)
- Average response time
- Bandwidth savings
- Cache invalidation frequency
- Service worker activation rate

#### Alerting Thresholds:
```javascript
const ALERT_THRESHOLDS = {
  CACHE_HIT_RATE_LOW: 0.7,    // Alert if <70%
  RESPONSE_TIME_HIGH: 2000,   // Alert if >2s
  ERROR_RATE_HIGH: 0.05,      // Alert if >5%
  SW_ACTIVATION_LOW: 0.8      // Alert if <80%
};
```

## Security Considerations

### 1. Admin Page Protection

#### Never Cache Patterns:
```javascript
const NEVER_CACHE_PATTERNS = [
  '/admin*',
  '/dashboard*',
  '/api/auth*',
  '/login*',
  '/logout*',
  '*?token=*',
  '*?session=*'
];
```

#### Cache Headers for Admin:
```apache
# Admin pages - force no cache
<LocationMatch "^/(admin|dashboard|auth)">
  Header always set Cache-Control "no-cache, no-store, must-revalidate, private"
  Header always set Pragma "no-cache"
  Header always set Expires "0"
</LocationMatch>
```

### 2. Cache Validation

#### Security Audit Function:
```javascript
async function auditCacheSecurity() {
  const cacheNames = await caches.keys();
  const violations = [];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const url = new URL(request.url);
      
      // Check for sensitive paths
      if (NEVER_CACHE_PATTERNS.some(pattern => 
           minimatch(url.pathname, pattern))) {
        violations.push({
          cache: cacheName,
          url: url.href,
          violation: 'Sensitive path cached'
        });
      }
    }
  }
  
  return violations;
}
```

## Performance Testing Commands

### 1. Cache Performance Test

#### Test Cache Headers:
```bash
# Test static asset caching
curl -I "https://fivelondon.com/assets/css/main.css"

# Test admin page (should not cache)
curl -I "https://fivelondon.com/admin"

# Test with cache-busting
curl -I "https://fivelondon.com/?v=$(date +%s)"
```

#### Lighthouse CI Configuration:
```json
{
  "ci": {
    "collect": {
      "url": [
        "https://fivelondon.com/",
        "https://fivelondon.com/models",
        "https://fivelondon.com/services"
      ],
      "settings": {
        "chromeFlags": "--no-sandbox --disable-dev-shm-usage"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}]
      }
    }
  }
}
```

### 2. GTMetrix API Integration

#### Automated Performance Testing:
```bash
#!/bin/bash
# Run GTMetrix test after deployment

curl -X POST "https://gtmetrix.com/api/2.0/test" \
  -u "$GTMETRIX_API_KEY:" \
  -d "url=https://fivelondon.com" \
  -d "location=1" \
  -d "browser=1"
```

## Deployment Checklist

### Pre-Deploy:
- [ ] Build assets with cache-busting hashes
- [ ] Verify admin pages have no-cache headers
- [ ] Test service worker update mechanism
- [ ] Prepare CDN purge commands

### Deploy:
- [ ] Deploy application
- [ ] Purge CDN cache
- [ ] Notify service workers
- [ ] Run performance tests
- [ ] Monitor cache hit rates

### Post-Deploy:
- [ ] Verify admin pages not cached
- [ ] Check service worker activation
- [ ] Monitor error rates
- [ ] Validate cache performance

---

**Last Updated**: January 2025  
**Cache Version**: 2.0.0  
**Target Cache Hit Rate**: >80%