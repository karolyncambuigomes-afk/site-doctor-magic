#!/bin/bash

# Production Backup Script for Escort Agency Platform
# Creates encrypted backups of database, storage, and code
# Usage: ./scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d-%H%M")
BACKUP_NAME="backup-prod-${DATE}"
SUPABASE_PROJECT_ID="jiegopvbwpyfohhfvmwo"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check dependencies
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}Error: Supabase CLI not found. Install with: npm i -g supabase${NC}"
        exit 1
    fi
    
    if ! command -v gpg &> /dev/null; then
        echo -e "${RED}Error: GPG not found. Install GPG for encryption.${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}Error: Git not found.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}All dependencies found.${NC}"
}

# Create backup directory
create_backup_dir() {
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"
    echo -e "${GREEN}Created backup directory: ${BACKUP_DIR}/${BACKUP_NAME}${NC}"
}

# Backup database
backup_database() {
    echo -e "${YELLOW}Backing up database...${NC}"
    
    # Check if logged in to Supabase
    if ! supabase projects list &> /dev/null; then
        echo -e "${RED}Error: Not logged in to Supabase. Run: supabase login${NC}"
        exit 1
    fi
    
    # Export database schema and data
    supabase db dump --project-id ${SUPABASE_PROJECT_ID} \
        --data-only > "${BACKUP_DIR}/${BACKUP_NAME}/database_data.sql"
    
    supabase db dump --project-id ${SUPABASE_PROJECT_ID} \
        --schema-only > "${BACKUP_DIR}/${BACKUP_NAME}/database_schema.sql"
    
    echo -e "${GREEN}Database backup completed.${NC}"
}

# Backup storage buckets
backup_storage() {
    echo -e "${YELLOW}Backing up storage buckets...${NC}"
    
    # Create storage backup directory
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}/storage"
    
    # Note: This requires manual download via Supabase dashboard or API
    cat > "${BACKUP_DIR}/${BACKUP_NAME}/storage/README.md" << EOF
# Storage Backup Instructions

Due to Supabase limitations, storage buckets must be backed up manually:

## Manual Backup Steps:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/storage/buckets
2. For each bucket (model-images, model-applications, optimized-images, raw-uploads):
   - Download all files
   - Save to: ${BACKUP_DIR}/${BACKUP_NAME}/storage/[bucket-name]/

## Automated Backup (Alternative):

Use the Supabase API to download files programmatically:

\`\`\`bash
# Example for model-images bucket
curl -H "Authorization: Bearer \$SUPABASE_SERVICE_KEY" \\
     "https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/list/model-images" \\
     > storage_manifest.json
\`\`\`

## Bucket List:
- model-images (public)
- model-applications (private)
- optimized-images (public)
- raw-uploads (public)
EOF
    
    echo -e "${YELLOW}Storage backup instructions created. Manual download required.${NC}"
}

# Backup code repository
backup_code() {
    echo -e "${YELLOW}Backing up code repository...${NC}"
    
    # Create git bundle (complete repository backup)
    git bundle create "${BACKUP_DIR}/${BACKUP_NAME}/code_repository.bundle" --all
    
    # Save current commit hash
    git rev-parse HEAD > "${BACKUP_DIR}/${BACKUP_NAME}/commit_hash.txt"
    
    # Save package information
    cp package.json "${BACKUP_DIR}/${BACKUP_NAME}/"
    cp package-lock.json "${BACKUP_DIR}/${BACKUP_NAME}/" 2>/dev/null || true
    
    echo -e "${GREEN}Code repository backup completed.${NC}"
}

# Create backup manifest
create_manifest() {
    echo -e "${YELLOW}Creating backup manifest...${NC}"
    
    cat > "${BACKUP_DIR}/${BACKUP_NAME}/MANIFEST.md" << EOF
# Backup Manifest: ${BACKUP_NAME}

## Backup Information
- **Date**: $(date)
- **Project**: Escort Agency Platform
- **Supabase Project ID**: ${SUPABASE_PROJECT_ID}
- **Git Commit**: $(git rev-parse HEAD)
- **Git Branch**: $(git branch --show-current)

## Backup Contents

### Database
- \`database_schema.sql\`: Complete database schema
- \`database_data.sql\`: All table data with encrypted sensitive information

### Code Repository
- \`code_repository.bundle\`: Complete git repository bundle
- \`commit_hash.txt\`: Current commit hash
- \`package.json\`: Node.js dependencies

### Storage Buckets
- \`storage/README.md\`: Instructions for manual storage backup
- Storage buckets require manual download from Supabase dashboard

## Restoration Instructions

See the main README.md for complete restoration procedures.

## Encryption

This backup will be encrypted using GPG. Keep the encryption key secure.

## Retention Policy

- **Minimum Retention**: 30 days
- **Recommended**: 90 days for production backups
- **Annual Archive**: Keep yearly backups indefinitely

## Checksum
\`\`\`
$(find "${BACKUP_DIR}/${BACKUP_NAME}" -type f -exec sha256sum {} \; | sort)
\`\`\`
EOF
    
    echo -e "${GREEN}Backup manifest created.${NC}"
}

# Encrypt backup
encrypt_backup() {
    echo -e "${YELLOW}Encrypting backup...${NC}"
    
    # Check if GPG key exists
    if ! gpg --list-secret-keys | grep -q "escort-backup"; then
        echo -e "${YELLOW}Creating GPG key for backups...${NC}"
        cat > gpg_batch << EOF
%echo Generating backup encryption key
Key-Type: RSA
Key-Length: 4096
Subkey-Type: RSA
Subkey-Length: 4096
Name-Real: Escort Agency Backup
Name-Email: backup@escortagency.local
Expire-Date: 2y
Passphrase: $(openssl rand -base64 32)
%commit
%echo Done
EOF
        gpg --batch --generate-key gpg_batch
        rm gpg_batch
        echo -e "${GREEN}GPG key created. Save the passphrase securely!${NC}"
    fi
    
    # Create encrypted archive
    tar czf - -C "${BACKUP_DIR}" "${BACKUP_NAME}" | \
        gpg --cipher-algo AES256 --compress-algo 1 --symmetric \
            --output "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.gpg"
    
    # Generate checksum
    sha256sum "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.gpg" > "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.gpg.sha256"
    
    echo -e "${GREEN}Backup encrypted and checksummed.${NC}"
    echo -e "${GREEN}Encrypted backup: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.gpg${NC}"
    echo -e "${GREEN}Checksum: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.gpg.sha256${NC}"
}

# Cleanup temporary files
cleanup() {
    echo -e "${YELLOW}Cleaning up temporary files...${NC}"
    rm -rf "${BACKUP_DIR}/${BACKUP_NAME}"
    echo -e "${GREEN}Cleanup completed.${NC}"
}

# Main execution
main() {
    echo -e "${GREEN}=== Production Backup Script ===${NC}"
    echo -e "${GREEN}Starting backup: ${BACKUP_NAME}${NC}"
    
    check_dependencies
    create_backup_dir
    backup_database
    backup_storage
    backup_code
    create_manifest
    encrypt_backup
    cleanup
    
    echo -e "${GREEN}=== Backup Completed Successfully ===${NC}"
    echo -e "${GREEN}Encrypted backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.gpg${NC}"
    echo -e "${GREEN}Checksum file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.gpg.sha256${NC}"
    echo -e "${YELLOW}Remember to store this backup in a secure location (S3, cloud storage, etc.)${NC}"
}

# Run main function
main "$@"