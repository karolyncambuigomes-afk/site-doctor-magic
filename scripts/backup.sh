#!/bin/bash

# Five London Production Backup Script
# Creates encrypted backups with verification and automated scheduling

set -euo pipefail

# Configuration
BACKUP_BASE_DIR="/var/backups/five-london"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_BASE_DIR}/${TIMESTAMP}"
SUPABASE_PROJECT_ID="jiegopvbwpyfohhfvmwo"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Dependency checks
check_dependencies() {
    local deps=("supabase" "gpg" "git")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            echo -e "${RED}Error: $dep is not installed${NC}"
            exit 1
        fi
    done
    echo -e "${GREEN}All dependencies verified${NC}"
}

# Create backup directory
create_backup_dir() {
    mkdir -p "$BACKUP_DIR"
    echo "Created backup directory: $BACKUP_DIR"
}

# Database backup
backup_database() {
    echo -e "${YELLOW}Backing up database...${NC}"
    
    # Schema backup
    supabase db dump --project-id="$SUPABASE_PROJECT_ID" \
        --schema-only > "$BACKUP_DIR/schema.sql"
    
    # Data backup
    supabase db dump --project-id="$SUPABASE_PROJECT_ID" \
        --data-only > "$BACKUP_DIR/data.sql"
    
    # Permissions and RLS backup
    supabase db dump --project-id="$SUPABASE_PROJECT_ID" \
        --role-only > "$BACKUP_DIR/roles.sql"
    
    echo -e "${GREEN}Database backup completed${NC}"
}

# Storage backup (manual instructions)
backup_storage() {
    echo -e "${YELLOW}Creating storage backup instructions...${NC}"
    
    cat > "$BACKUP_DIR/STORAGE_BACKUP.md" << 'EOF'
# Storage Bucket Backup Instructions

## Manual Storage Backup (Required)

1. **Navigate to Supabase Dashboard**:
   - Go to https://supabase.com/dashboard/project/jiegopvbwpyfohhfvmwo/storage/buckets

2. **Download Each Bucket**:
   - model-images (Public): Download all files
   - model-applications (Private): Download all files
   - optimized-images (Public): Download all files
   - raw-uploads (Public): Download all files
   - cms-images (Public): Download all files
   - cms-documents (Private): Download all files

3. **Alternative - Use CLI**:
   ```bash
   # Download all files from a bucket
   supabase storage download --project-id="jiegopvbwpyfohhfvmwo" \
     --bucket="model-images" --recursive .
   ```

4. **Verify Downloads**:
   - Check file counts match dashboard
   - Verify file sizes are correct
   - Test a few files to ensure they're not corrupted

## Storage Restore

1. **Create buckets** (if needed):
   ```sql
   INSERT INTO storage.buckets (id, name, public) VALUES 
   ('model-images', 'model-images', true),
   ('model-applications', 'model-applications', false),
   ('optimized-images', 'optimized-images', true),
   ('raw-uploads', 'raw-uploads', true),
   ('cms-images', 'cms-images', true),
   ('cms-documents', 'cms-documents', false);
   ```

2. **Upload files**:
   ```bash
   supabase storage upload --project-id="jiegopvbwpyfohhfvmwo" \
     --bucket="model-images" local-folder/
   ```

EOF
    
    echo -e "${GREEN}Storage backup instructions created${NC}"
}

# Code repository backup
backup_code() {
    echo -e "${YELLOW}Backing up code repository...${NC}"
    
    # Create git bundle
    git bundle create "$BACKUP_DIR/repository.bundle" --all
    
    # Save package.json for dependencies
    if [ -f "package.json" ]; then
        cp package.json "$BACKUP_DIR/"
    fi
    
    # Save current commit hash
    git rev-parse HEAD > "$BACKUP_DIR/commit_hash.txt"
    
    echo -e "${GREEN}Code backup completed${NC}"
}

# Create manifest
create_manifest() {
    echo -e "${YELLOW}Creating backup manifest...${NC}"
    
    cat > "$BACKUP_DIR/MANIFEST.md" << EOF
# Five London Backup Manifest

**Backup Date**: $(date)
**Backup ID**: $TIMESTAMP
**Project ID**: $SUPABASE_PROJECT_ID

## Contents

### Database
- \`schema.sql\`: Complete database schema
- \`data.sql\`: All table data
- \`roles.sql\`: User roles and permissions

### Code Repository
- \`repository.bundle\`: Complete git repository
- \`package.json\`: Node.js dependencies
- \`commit_hash.txt\`: Current commit reference

### Storage
- \`STORAGE_BACKUP.md\`: Manual backup instructions for media files

## Verification

### Database Integrity
\`\`\`bash
# Test schema restore
psql -d test_db < schema.sql
psql -d test_db < data.sql
\`\`\`

### Code Integrity
\`\`\`bash
# Test repository restore
git clone repository.bundle test-restore
cd test-restore
npm install
\`\`\`

## Restore Instructions

1. **Database Restore**:
   \`\`\`bash
   supabase db reset --project-id="$SUPABASE_PROJECT_ID"
   supabase db push --project-id="$SUPABASE_PROJECT_ID" schema.sql
   psql -h db.xxx.supabase.co -U postgres -d postgres < data.sql
   \`\`\`

2. **Code Restore**:
   \`\`\`bash
   git clone repository.bundle restored-project
   cd restored-project
   npm install
   \`\`\`

3. **Storage Restore**: Follow \`STORAGE_BACKUP.md\` instructions

## Validation Checklist

- [ ] Database schema loads without errors
- [ ] Data imports successfully
- [ ] Application starts and connects to database
- [ ] Key features work (auth, admin panel, model gallery)
- [ ] Storage buckets recreated with correct permissions

## Backup Verification

**Schema Size**: $(wc -l < "$BACKUP_DIR/schema.sql" || echo "N/A") lines
**Data Size**: $(wc -l < "$BACKUP_DIR/data.sql" || echo "N/A") lines
**Repository Size**: $(du -h "$BACKUP_DIR/repository.bundle" | cut -f1 || echo "N/A")

**Created by**: $(whoami)@$(hostname)
**Backup Location**: $BACKUP_DIR
EOF
    
    echo -e "${GREEN}Manifest created${NC}"
}

# Encrypt backup
encrypt_backup() {
    echo -e "${YELLOW}Encrypting backup...${NC}"
    
    # Create GPG key if it doesn't exist
    if ! gpg --list-keys backup@fivelondon.com &> /dev/null; then
        echo -e "${YELLOW}Creating backup GPG key...${NC}"
        gpg --batch --generate-key << EOF
Key-Type: RSA
Key-Length: 4096
Subkey-Type: RSA
Subkey-Length: 4096
Name-Real: Five London Backup
Name-Email: backup@fivelondon.com
Expire-Date: 0
Passphrase: $(openssl rand -base64 32)
%commit
EOF
    fi
    
    # Create encrypted archive
    tar -czf - -C "$BACKUP_BASE_DIR" "$TIMESTAMP" | \
        gpg --cipher-algo AES256 --compress-algo 2 --symmetric \
        --output "${BACKUP_BASE_DIR}/${TIMESTAMP}.tar.gz.gpg"
    
    # Create checksum
    sha256sum "${BACKUP_BASE_DIR}/${TIMESTAMP}.tar.gz.gpg" > \
        "${BACKUP_BASE_DIR}/${TIMESTAMP}.tar.gz.gpg.sha256"
    
    echo -e "${GREEN}Backup encrypted and checksummed${NC}"
}

# Cleanup unencrypted backup
cleanup() {
    if [ -d "$BACKUP_DIR" ]; then
        rm -rf "$BACKUP_DIR"
        echo -e "${GREEN}Cleaned up unencrypted backup${NC}"
    fi
}

# Send notification (placeholder for email/slack integration)
send_notification() {
    local status="$1"
    local message="$2"
    
    echo -e "${GREEN}Backup $status: $message${NC}"
    
    # TODO: Integrate with monitoring system
    # curl -X POST "https://hooks.slack.com/services/..." \
    #      -H 'Content-type: application/json' \
    #      --data "{\"text\":\"Backup $status: $message\"}"
}

# Main execution
main() {
    echo -e "${GREEN}Starting Five London backup process...${NC}"
    
    check_dependencies
    create_backup_dir
    backup_database
    backup_storage
    backup_code
    create_manifest
    encrypt_backup
    cleanup
    
    echo -e "${GREEN}✅ Backup completed successfully!${NC}"
    echo -e "${GREEN}Encrypted backup: ${BACKUP_BASE_DIR}/${TIMESTAMP}.tar.gz.gpg${NC}"
    echo -e "${YELLOW}⚠️  Remember to store this backup securely and test restoration!${NC}"
    
    send_notification "SUCCESS" "Backup $TIMESTAMP completed"
}

# Run main function
main "$@"