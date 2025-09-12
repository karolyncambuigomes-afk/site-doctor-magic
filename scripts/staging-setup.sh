#!/bin/bash

# Staging Environment Setup Script
# Creates and configures a staging environment that mirrors production
# Usage: ./scripts/staging-setup.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROD_PROJECT_ID="jiegopvbwpyfohhfvmwo"
STAGING_PROJECT_NAME="escort-agency-staging"

echo -e "${GREEN}=== Staging Environment Setup ===${NC}"

# Check if Supabase CLI is installed
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}Error: Supabase CLI not found. Install with: npm i -g supabase${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Dependencies verified.${NC}"
}

# Login to Supabase
ensure_supabase_login() {
    echo -e "${YELLOW}Checking Supabase authentication...${NC}"
    
    if ! supabase projects list &> /dev/null; then
        echo -e "${YELLOW}Please login to Supabase...${NC}"
        supabase login
    fi
    
    echo -e "${GREEN}Supabase authentication confirmed.${NC}"
}

# Create staging project instructions
create_staging_project() {
    echo -e "${YELLOW}=== Staging Project Creation ===${NC}"
    echo -e "${YELLOW}Manual steps required (Supabase CLI cannot create projects automatically):${NC}"
    echo ""
    echo -e "${GREEN}1. Go to Supabase Dashboard:${NC}"
    echo "   https://supabase.com/dashboard"
    echo ""
    echo -e "${GREEN}2. Click 'New Project' and configure:${NC}"
    echo "   - Name: ${STAGING_PROJECT_NAME}"
    echo "   - Organization: Same as production"
    echo "   - Database Password: Generate strong password"
    echo "   - Region: Same as production (for consistency)"
    echo ""
    echo -e "${GREEN}3. Save the following information:${NC}"
    echo "   - Project ID"
    echo "   - API URL"
    echo "   - Anon Key"
    echo "   - Service Role Key"
    echo ""
    
    read -p "Press Enter when staging project is created and you have the credentials..."
    
    echo ""
    read -p "Enter staging project ID: " STAGING_PROJECT_ID
    
    if [ -z "$STAGING_PROJECT_ID" ]; then
        echo -e "${RED}Error: Staging project ID is required${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Staging project ID saved: $STAGING_PROJECT_ID${NC}"
}

# Set up local development for staging
setup_local_staging() {
    echo -e "${YELLOW}Setting up local staging configuration...${NC}"
    
    # Create staging environment file
    cat > .env.staging << EOF
# Staging Environment Configuration
VITE_SUPABASE_PROJECT_ID="${STAGING_PROJECT_ID}"
VITE_SUPABASE_URL="https://${STAGING_PROJECT_ID}.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="[ENTER_STAGING_ANON_KEY]"

# Development settings
NODE_ENV=staging
VITE_ENV=staging
EOF
    
    echo -e "${GREEN}Created .env.staging file${NC}"
    echo -e "${YELLOW}Please update .env.staging with your staging credentials${NC}"
}

# Initialize staging database
init_staging_database() {
    echo -e "${YELLOW}Initializing staging database...${NC}"
    
    # Initialize Supabase in project
    if [ ! -f "supabase/config.toml" ]; then
        supabase init
    fi
    
    # Link to staging project
    supabase link --project-ref "$STAGING_PROJECT_ID"
    
    # Push database schema to staging
    echo -e "${YELLOW}Pushing database migrations to staging...${NC}"
    supabase db push
    
    echo -e "${GREEN}Staging database initialized${NC}"
}

# Create staging deployment script
create_staging_deploy_script() {
    echo -e "${YELLOW}Creating staging deployment script...${NC}"
    
    cat > scripts/deploy-staging.sh << 'EOF'
#!/bin/bash

# Deploy to Staging Environment
# Usage: ./scripts/deploy-staging.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Deploying to Staging ===${NC}"

# Load staging environment
if [ -f ".env.staging" ]; then
    export $(cat .env.staging | grep -v '^#' | xargs)
    echo -e "${GREEN}Loaded staging environment${NC}"
else
    echo -e "${RED}Error: .env.staging file not found${NC}"
    exit 1
fi

# Build for staging
echo -e "${YELLOW}Building application for staging...${NC}"
npm run build

# Deploy database changes
echo -e "${YELLOW}Deploying database changes...${NC}"
supabase db push

# Deploy edge functions
echo -e "${YELLOW}Deploying edge functions...${NC}"
supabase functions deploy

echo -e "${GREEN}Staging deployment completed!${NC}"
echo -e "${GREEN}Staging URL: https://${VITE_SUPABASE_PROJECT_ID}.supabase.co${NC}"
EOF
    
    chmod +x scripts/deploy-staging.sh
    echo -e "${GREEN}Created staging deployment script${NC}"
}

# Create staging test script
create_staging_test_script() {
    echo -e "${YELLOW}Creating staging test script...${NC}"
    
    cat > scripts/test-staging.sh << 'EOF'
#!/bin/bash

# Test Staging Environment
# Usage: ./scripts/test-staging.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Testing Staging Environment ===${NC}"

# Load staging environment
if [ -f ".env.staging" ]; then
    export $(cat .env.staging | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: .env.staging file not found${NC}"
    exit 1
fi

# Test database connectivity
echo -e "${YELLOW}Testing database connectivity...${NC}"
if supabase projects list | grep -q "$VITE_SUPABASE_PROJECT_ID"; then
    echo -e "${GREEN}✅ Database connectivity OK${NC}"
else
    echo -e "${RED}❌ Database connectivity failed${NC}"
    exit 1
fi

# Test API endpoints
echo -e "${YELLOW}Testing API endpoints...${NC}"
API_URL="https://${VITE_SUPABASE_PROJECT_ID}.supabase.co"

# Test public endpoints
if curl -s "$API_URL/rest/v1/models?select=name" -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" > /dev/null; then
    echo -e "${GREEN}✅ API endpoints OK${NC}"
else
    echo -e "${RED}❌ API endpoints failed${NC}"
    exit 1
fi

# Test storage buckets
echo -e "${YELLOW}Testing storage buckets...${NC}"
if curl -s "$API_URL/storage/v1/bucket" -H "Authorization: Bearer $VITE_SUPABASE_PUBLISHABLE_KEY" > /dev/null; then
    echo -e "${GREEN}✅ Storage buckets OK${NC}"
else
    echo -e "${RED}❌ Storage buckets failed${NC}"
    exit 1
fi

# Run application tests
echo -e "${YELLOW}Running application tests...${NC}"
npm test

echo -e "${GREEN}=== All staging tests passed! ===${NC}"
EOF
    
    chmod +x scripts/test-staging.sh
    echo -e "${GREEN}Created staging test script${NC}"
}

# Create staging documentation
create_staging_docs() {
    echo -e "${YELLOW}Creating staging documentation...${NC}"
    
    cat > STAGING.md << EOF
# Staging Environment Documentation

## Overview

The staging environment is a complete mirror of production that allows for:
- Testing new features before production deployment
- Backup/restore testing
- Data migration testing
- Performance testing

## Staging Environment Details

- **Project ID**: ${STAGING_PROJECT_ID}
- **URL**: https://${STAGING_PROJECT_ID}.supabase.co
- **Environment File**: \`.env.staging\`

## Quick Commands

\`\`\`bash
# Deploy to staging
./scripts/deploy-staging.sh

# Test staging environment
./scripts/test-staging.sh

# Restore backup to staging
./scripts/restore.sh backups/backup-prod-YYYYMMDD-HHMM.tar.gz.gpg staging
\`\`\`

## Environment Variables

Update \`.env.staging\` with your staging credentials:

\`\`\`bash
VITE_SUPABASE_PROJECT_ID="${STAGING_PROJECT_ID}"
VITE_SUPABASE_URL="https://${STAGING_PROJECT_ID}.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="[YOUR_STAGING_ANON_KEY]"
\`\`\`

## Staging Workflow

1. **Development**
   - Create feature branch
   - Develop and test locally
   - Push to GitHub

2. **Staging Deployment**
   - Deploy to staging: \`./scripts/deploy-staging.sh\`
   - Run tests: \`./scripts/test-staging.sh\`
   - Manual QA testing

3. **Production Deployment**
   - Merge to main branch
   - Deploy to production
   - Monitor and verify

## Data Management

### Refreshing Staging Data

\`\`\`bash
# Option 1: Restore from production backup
./scripts/backup.sh
./scripts/restore.sh backups/backup-prod-YYYYMMDD-HHMM.tar.gz.gpg staging

# Option 2: Copy from production (manual process)
# Use Supabase dashboard to export/import data
\`\`\`

### Staging Data Considerations

- Use anonymized/test data for sensitive information
- Regularly refresh from production (weekly recommended)
- Clean up test data regularly
- Don't use real email addresses for testing

## Security

- Staging credentials should be stored securely
- Limit access to staging environment
- Use different API keys than production
- Monitor staging for unauthorized access

## Monitoring

Set up monitoring for:
- Application uptime
- Database performance
- Storage usage
- Error rates

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check project ID in .env.staging
   - Verify API keys are correct
   - Ensure Supabase CLI is linked to staging project

2. **Storage Upload Failed**
   - Check storage bucket policies
   - Verify RLS policies are correctly applied
   - Check file size limits

3. **Authentication Issues**
   - Verify auth providers are configured
   - Check redirect URLs for staging domain
   - Ensure user policies are applied

### Getting Help

1. Check Supabase logs in dashboard
2. Review application console logs
3. Test individual components
4. Compare with production configuration
EOF
    
    echo -e "${GREEN}Created staging documentation: STAGING.md${NC}"
}

# Main execution
main() {
    check_dependencies
    ensure_supabase_login
    create_staging_project
    setup_local_staging
    init_staging_database
    create_staging_deploy_script
    create_staging_test_script
    create_staging_docs
    
    echo -e "${GREEN}=== Staging Environment Setup Complete ===${NC}"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Update .env.staging with your staging credentials"
    echo "2. Run: ./scripts/deploy-staging.sh"
    echo "3. Run: ./scripts/test-staging.sh"
    echo "4. Test backup/restore: ./scripts/restore.sh [backup-file] staging"
    echo ""
    echo -e "${GREEN}Documentation created: STAGING.md${NC}"
}

# Run main function
main "$@"