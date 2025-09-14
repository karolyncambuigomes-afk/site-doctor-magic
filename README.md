# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/663c1bac-9cc5-4a23-a729-3955267df9ca

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/663c1bac-9cc5-4a23-a729-3955267df9ca) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/663c1bac-9cc5-4a23-a729-3955267df9ca) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Infrastructure & Backup Management

### Production Backup & Restore

This project includes comprehensive backup and restore procedures for production data.

#### Quick Backup Commands

```bash
# Create full production backup
./scripts/backup.sh

# Restore from backup to staging
./scripts/restore.sh backups/backup-prod-YYYYMMDD-HHMM.tar.gz.gpg staging

# Restore to production (DANGER - requires confirmation)
./scripts/restore.sh backups/backup-prod-YYYYMMDD-HHMM.tar.gz.gpg production
```

#### Backup Components

**Automated Backups Include:**
- ✅ Database schema and data (encrypted sensitive data)
- ✅ Complete code repository (git bundle)
- ✅ Package dependencies
- ✅ Backup manifest with checksums

**Manual Backup Required:**
- ⚠️ Supabase Storage buckets (model-images, model-applications, etc.)

#### Backup Storage & Retention

- **Encryption**: AES256 with GPG
- **Minimum Retention**: 30 days
- **Recommended**: 90 days for production
- **Annual Archive**: Keep yearly backups indefinitely
- **Storage Location**: Store in secure cloud storage (S3, etc.)

#### Prerequisites

```bash
# Install required tools
npm install -g supabase
# Install GPG for your OS
# Install git (usually pre-installed)

# Login to Supabase
supabase login

# Make scripts executable
chmod +x scripts/backup.sh scripts/restore.sh
```

#### Staging Environment Setup

**Manual Steps Required:**

1. **Create Supabase Staging Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project: `escort-agency-staging`
   - Note the project ID and API keys

2. **Deploy Code to Staging**
   - Connect GitHub repository to staging deployment
   - Set up environment variables for staging
   - Configure staging domain/URL

3. **Configure Staging Database**
   ```bash
   # Point to staging project
   export SUPABASE_PROJECT_ID="staging-project-id"
   
   # Run migrations on staging
   supabase db push --project-id staging-project-id
   ```

4. **Test Restore Process**
   ```bash
   # Create test backup
   ./scripts/backup.sh
   
   # Restore to staging
   ./scripts/restore.sh backups/backup-prod-YYYYMMDD-HHMM.tar.gz.gpg staging
   ```

#### Emergency Rollback Procedure

**One-Click Rollback (if backup exists):**

```bash
# 1. Restore from most recent backup
./scripts/restore.sh backups/backup-prod-YYYYMMDD-HHMM.tar.gz.gpg production

# 2. Verify restoration
npm run build && npm run preview

# 3. Check database connectivity
supabase projects list
```

**Git-based Rollback:**

```bash
# 1. Find the commit to rollback to
git log --oneline

# 2. Create rollback branch
git checkout -b rollback-$(date +%Y%m%d-%H%M)

# 3. Reset to previous commit
git reset --hard <commit-hash>

# 4. Force push (DANGER - only in emergencies)
git push --force-with-lease origin main
```

#### Backup Verification

**Verify backup integrity:**

```bash
# Check backup file checksum
sha256sum -c backups/backup-prod-YYYYMMDD-HHMM.tar.gz.gpg.sha256

# Test restore process on staging
./scripts/restore.sh backups/backup-prod-YYYYMMDD-HHMM.tar.gz.gpg staging
```

#### Production Environment Details

- **Supabase Project**: `jiegopvbwpyfohhfvmwo`
- **Production URL**: https://lovable.dev/projects/663c1bac-9cc5-4a23-a729-3955267df9ca
- **Database**: Supabase PostgreSQL with RLS policies
- **Storage**: Supabase Storage (4 buckets)
- **Authentication**: Supabase Auth

#### Staging Environment Credentials

> **Security Note**: Staging credentials should be stored in your password manager or secure notes.

```bash
# Staging Environment Variables (Example)
VITE_SUPABASE_PROJECT_ID="staging-project-id"
VITE_SUPABASE_URL="https://staging-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="staging-anon-key"
```

#### Disaster Recovery Plan

1. **Immediate Response** (< 5 minutes)
   - Assess impact and scope
   - Communicate to stakeholders
   - Enable maintenance mode if needed

2. **Database Recovery** (< 30 minutes)
   - Restore from most recent backup
   - Verify data integrity
   - Test critical functionality

3. **Full System Recovery** (< 2 hours)
   - Complete storage restoration
   - Full application testing
   - User acceptance testing

4. **Post-Recovery** (< 24 hours)
   - Root cause analysis
   - Update backup procedures
   - Documentation updates

#### Monitoring & Alerts

**Set up monitoring for:**
- Daily backup completion
- Backup file integrity
- Storage space for backups
- Database performance post-restore

**Recommended Tools:**
- Supabase Dashboard alerts
- GitHub Actions for automated backups
- Cloud storage monitoring
- Uptime monitoring for staging/production
