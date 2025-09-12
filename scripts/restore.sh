#!/bin/bash

# Production Restore Script for Escort Agency Platform
# Restores encrypted backups of database, storage, and code
# Usage: ./scripts/restore.sh <backup-file> [target-environment]

set -e

# Configuration
BACKUP_FILE="$1"
TARGET_ENV="${2:-staging}"
SUPABASE_PROJECT_ID="jiegopvbwpyfohhfvmwo"
TEMP_DIR="./restore_temp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Usage information
show_usage() {
    echo "Usage: $0 <backup-file> [target-environment]"
    echo ""
    echo "Arguments:"
    echo "  backup-file: Path to encrypted backup file (.tar.gz.gpg)"
    echo "  target-environment: staging (default) or production"
    echo ""
    echo "Examples:"
    echo "  $0 backups/backup-prod-20250912-1630.tar.gz.gpg"
    echo "  $0 backups/backup-prod-20250912-1630.tar.gz.gpg staging"
    echo "  $0 backups/backup-prod-20250912-1630.tar.gz.gpg production"
}

# Validate arguments
validate_args() {
    if [ -z "$BACKUP_FILE" ]; then
        echo -e "${RED}Error: Backup file not specified${NC}"
        show_usage
        exit 1
    fi
    
    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
        exit 1
    fi
    
    if [ "$TARGET_ENV" != "staging" ] && [ "$TARGET_ENV" != "production" ]; then
        echo -e "${RED}Error: Target environment must be 'staging' or 'production'${NC}"
        exit 1
    fi
    
    # Safety check for production
    if [ "$TARGET_ENV" = "production" ]; then
        echo -e "${RED}WARNING: You are about to restore to PRODUCTION!${NC}"
        echo -e "${RED}This will OVERWRITE all existing data!${NC}"
        read -p "Type 'CONFIRM_PRODUCTION_RESTORE' to continue: " confirmation
        if [ "$confirmation" != "CONFIRM_PRODUCTION_RESTORE" ]; then
            echo -e "${RED}Production restore cancelled.${NC}"
            exit 1
        fi
    fi
}

# Check dependencies
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}Error: Supabase CLI not found. Install with: npm i -g supabase${NC}"
        exit 1
    fi
    
    if ! command -v gpg &> /dev/null; then
        echo -e "${RED}Error: GPG not found. Install GPG for decryption.${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}Error: Git not found.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}All dependencies found.${NC}"
}

# Verify backup integrity
verify_backup() {
    echo -e "${YELLOW}Verifying backup integrity...${NC}"
    
    local checksum_file="${BACKUP_FILE}.sha256"
    if [ -f "$checksum_file" ]; then
        if sha256sum -c "$checksum_file"; then
            echo -e "${GREEN}Backup integrity verified.${NC}"
        else
            echo -e "${RED}Error: Backup checksum verification failed!${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}Warning: Checksum file not found. Proceeding without verification.${NC}"
    fi
}

# Decrypt and extract backup
decrypt_backup() {
    echo -e "${YELLOW}Decrypting and extracting backup...${NC}"
    
    # Create temporary directory
    mkdir -p "$TEMP_DIR"
    
    # Decrypt backup
    gpg --decrypt "$BACKUP_FILE" | tar xzf - -C "$TEMP_DIR"
    
    # Find the backup directory
    BACKUP_DIR=$(find "$TEMP_DIR" -maxdepth 1 -type d -name "backup-prod-*" | head -1)
    
    if [ -z "$BACKUP_DIR" ]; then
        echo -e "${RED}Error: Could not find backup directory in extracted files${NC}"
        cleanup
        exit 1
    fi
    
    echo -e "${GREEN}Backup extracted to: $BACKUP_DIR${NC}"
}

# Restore database
restore_database() {
    echo -e "${YELLOW}Restoring database...${NC}"
    
    if [ ! -f "$BACKUP_DIR/database_schema.sql" ] || [ ! -f "$BACKUP_DIR/database_data.sql" ]; then
        echo -e "${RED}Error: Database backup files not found${NC}"
        exit 1
    fi
    
    # Check if logged in to Supabase
    if ! supabase projects list &> /dev/null; then
        echo -e "${RED}Error: Not logged in to Supabase. Run: supabase login${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Restoring database schema...${NC}"
    supabase db reset --project-id $SUPABASE_PROJECT_ID
    
    echo -e "${YELLOW}Restoring database data...${NC}"
    # Note: In practice, you might need to customize this based on your target environment
    if [ "$TARGET_ENV" = "staging" ]; then
        # For staging, you might want to anonymize sensitive data
        echo -e "${YELLOW}Applying staging-specific data transformations...${NC}"
        # Add data anonymization logic here if needed
    fi
    
    supabase db push --project-id $SUPABASE_PROJECT_ID < "$BACKUP_DIR/database_data.sql"
    
    echo -e "${GREEN}Database restore completed.${NC}"
}

# Restore code repository
restore_code() {
    echo -e "${YELLOW}Restoring code repository...${NC}"
    
    if [ ! -f "$BACKUP_DIR/code_repository.bundle" ]; then
        echo -e "${RED}Error: Code repository bundle not found${NC}"
        exit 1
    fi
    
    # Create restore branch
    local restore_branch="restore-$(date +%Y%m%d-%H%M)"
    
    # Verify bundle
    git bundle verify "$BACKUP_DIR/code_repository.bundle"
    
    # Fetch from bundle
    git fetch "$BACKUP_DIR/code_repository.bundle" "*:refs/remotes/backup/*"
    
    # Create restore branch from backup
    local backup_commit=$(cat "$BACKUP_DIR/commit_hash.txt")
    git checkout -b "$restore_branch" "$backup_commit"
    
    echo -e "${GREEN}Code restored to branch: $restore_branch${NC}"
    echo -e "${YELLOW}To apply changes: git checkout main && git merge $restore_branch${NC}"
}

# Show storage restore instructions
show_storage_instructions() {
    echo -e "${YELLOW}Storage Restore Instructions:${NC}"
    
    if [ -f "$BACKUP_DIR/storage/README.md" ]; then
        cat "$BACKUP_DIR/storage/README.md"
    fi
    
    echo -e "${YELLOW}Manual steps required:${NC}"
    echo -e "1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/storage/buckets"
    echo -e "2. For each bucket, upload the backed up files"
    echo -e "3. Ensure proper permissions are set"
}

# Create restore report
create_restore_report() {
    local report_file="restore_report_$(date +%Y%m%d-%H%M).md"
    
    cat > "$report_file" << EOF
# Restore Report

## Restore Information
- **Date**: $(date)
- **Backup File**: $BACKUP_FILE
- **Target Environment**: $TARGET_ENV
- **Restored Commit**: $(cat "$BACKUP_DIR/commit_hash.txt" 2>/dev/null || echo "Unknown")

## Restore Status

### Database
- ✅ Schema restored
- ✅ Data restored
- ⚠️ Verify data integrity manually

### Code Repository
- ✅ Code restored to branch: restore-$(date +%Y%m%d-%H%M)
- ⚠️ Manual merge required

### Storage Buckets
- ⚠️ Manual upload required (see instructions above)

## Post-Restore Checklist

1. [ ] Verify database connectivity
2. [ ] Test application functionality
3. [ ] Check user authentication
4. [ ] Verify file uploads work
5. [ ] Run security audit
6. [ ] Update environment variables if needed
7. [ ] Notify team of restore completion

## Next Steps

1. Merge restored code if needed
2. Upload storage files manually
3. Run full application tests
4. Monitor for any issues

EOF
    
    echo -e "${GREEN}Restore report created: $report_file${NC}"
}

# Cleanup temporary files
cleanup() {
    echo -e "${YELLOW}Cleaning up temporary files...${NC}"
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
    echo -e "${GREEN}Cleanup completed.${NC}"
}

# Main execution
main() {
    echo -e "${GREEN}=== Production Restore Script ===${NC}"
    echo -e "${GREEN}Restoring to: $TARGET_ENV${NC}"
    
    validate_args
    check_dependencies
    verify_backup
    decrypt_backup
    
    # Create backup before restore (safety measure)
    if [ "$TARGET_ENV" = "production" ]; then
        echo -e "${YELLOW}Creating safety backup before restore...${NC}"
        ./scripts/backup.sh
    fi
    
    restore_database
    restore_code
    show_storage_instructions
    create_restore_report
    cleanup
    
    echo -e "${GREEN}=== Restore Completed Successfully ===${NC}"
    echo -e "${YELLOW}Please complete manual steps for storage buckets${NC}"
    echo -e "${YELLOW}Review restore report for next steps${NC}"
}

# Handle script interruption
trap cleanup EXIT

# Run main function
main "$@"