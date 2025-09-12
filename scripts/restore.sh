#!/bin/bash

# Five London Production Restore Script
# Restores encrypted backups with verification

set -euo pipefail

# Configuration
BACKUP_FILE=""
TARGET_ENV=""
SUPABASE_PROJECT_ID="jiegopvbwpyfohhfvmwo"
TEMP_DIR="/tmp/five-london-restore-$$"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Usage
show_usage() {
    cat << EOF
Usage: $0 -f <backup_file> -e <environment> [options]

Options:
    -f, --file       Encrypted backup file (.tar.gz.gpg)
    -e, --env        Target environment (staging|production)
    -h, --help       Show this help message

Examples:
    $0 -f backups/20241213_143000.tar.gz.gpg -e staging
    $0 -f backups/20241213_143000.tar.gz.gpg -e production

EOF
}

# Validate arguments
validate_args() {
    if [[ -z "$BACKUP_FILE" ]]; then
        echo -e "${RED}Error: Backup file is required${NC}"
        show_usage
        exit 1
    fi
    
    if [[ ! -f "$BACKUP_FILE" ]]; then
        echo -e "${RED}Error: Backup file does not exist: $BACKUP_FILE${NC}"
        exit 1
    fi
    
    if [[ -z "$TARGET_ENV" ]]; then
        echo -e "${RED}Error: Target environment is required${NC}"
        show_usage
        exit 1
    fi
    
    if [[ "$TARGET_ENV" != "staging" && "$TARGET_ENV" != "production" ]]; then
        echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
        exit 1
    fi
    
    # Production safety check
    if [[ "$TARGET_ENV" == "production" ]]; then
        echo -e "${RED}⚠️  WARNING: You are about to restore to PRODUCTION!${NC}"
        echo -e "${YELLOW}This will overwrite all current data.${NC}"
        echo -e "${YELLOW}Type 'YES I UNDERSTAND' to continue:${NC}"
        read -r confirmation
        if [[ "$confirmation" != "YES I UNDERSTAND" ]]; then
            echo -e "${RED}Restore cancelled${NC}"
            exit 1
        fi
    fi
}

# Check dependencies
check_dependencies() {
    local deps=("supabase" "gpg" "git" "psql")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            echo -e "${RED}Error: $dep is not installed${NC}"
            exit 1
        fi
    done
    echo -e "${GREEN}Dependencies verified${NC}"
}

# Verify backup integrity
verify_backup() {
    echo -e "${YELLOW}Verifying backup integrity...${NC}"
    
    local checksum_file="${BACKUP_FILE}.sha256"
    if [[ -f "$checksum_file" ]]; then
        if sha256sum -c "$checksum_file"; then
            echo -e "${GREEN}Backup integrity verified${NC}"
        else
            echo -e "${RED}Backup integrity check failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}No checksum file found, skipping integrity check${NC}"
    fi
}

# Decrypt and extract backup
decrypt_backup() {
    echo -e "${YELLOW}Decrypting and extracting backup...${NC}"
    
    mkdir -p "$TEMP_DIR"
    
    # Decrypt and extract
    gpg --decrypt "$BACKUP_FILE" | tar -xzf - -C "$TEMP_DIR"
    
    # Find extracted directory
    local extracted_dir=$(find "$TEMP_DIR" -maxdepth 1 -type d -name "20*" | head -1)
    if [[ -z "$extracted_dir" ]]; then
        echo -e "${RED}Could not find extracted backup directory${NC}"
        exit 1
    fi
    
    echo "BACKUP_DIR=$extracted_dir" > "$TEMP_DIR/restore_vars"
    echo -e "${GREEN}Backup extracted to: $extracted_dir${NC}"
}

# Restore database
restore_database() {
    source "$TEMP_DIR/restore_vars"
    echo -e "${YELLOW}Restoring database...${NC}"
    
    # Reset database (WARNING: This destroys all data)
    echo -e "${YELLOW}Resetting database...${NC}"
    supabase db reset --project-id="$SUPABASE_PROJECT_ID" --no-confirm
    
    # Restore schema
    echo -e "${YELLOW}Restoring schema...${NC}"
    if [[ -f "$BACKUP_DIR/schema.sql" ]]; then
        supabase db push --project-id="$SUPABASE_PROJECT_ID" --file="$BACKUP_DIR/schema.sql"
    else
        echo -e "${RED}Schema file not found${NC}"
        exit 1
    fi
    
    # Restore data
    echo -e "${YELLOW}Restoring data...${NC}"
    if [[ -f "$BACKUP_DIR/data.sql" ]]; then
        # Get database connection details
        local db_url=$(supabase status --project-id="$SUPABASE_PROJECT_ID" --output json | jq -r '.db_url')
        psql "$db_url" < "$BACKUP_DIR/data.sql"
    else
        echo -e "${RED}Data file not found${NC}"
        exit 1
    fi
    
    # Restore roles if available
    if [[ -f "$BACKUP_DIR/roles.sql" ]]; then
        echo -e "${YELLOW}Restoring roles...${NC}"
        local db_url=$(supabase status --project-id="$SUPABASE_PROJECT_ID" --output json | jq -r '.db_url')
        psql "$db_url" < "$BACKUP_DIR/roles.sql"
    fi
    
    echo -e "${GREEN}Database restoration completed${NC}"
}

# Restore code
restore_code() {
    source "$TEMP_DIR/restore_vars"
    echo -e "${YELLOW}Restoring code repository...${NC}"
    
    if [[ -f "$BACKUP_DIR/repository.bundle" ]]; then
        local restore_dir="$TEMP_DIR/code-restore"
        git clone "$BACKUP_DIR/repository.bundle" "$restore_dir"
        
        # Create new branch for restore
        cd "$restore_dir"
        local branch_name="restore-$(date +%Y%m%d-%H%M%S)"
        git checkout -b "$branch_name"
        
        echo -e "${GREEN}Code restored to branch: $branch_name${NC}"
        echo -e "${GREEN}Repository location: $restore_dir${NC}"
        
        # Install dependencies if package.json exists
        if [[ -f "package.json" ]]; then
            echo -e "${YELLOW}Installing dependencies...${NC}"
            npm install
        fi
    else
        echo -e "${RED}Repository bundle not found${NC}"
        exit 1
    fi
}

# Show storage restoration instructions
show_storage_instructions() {
    source "$TEMP_DIR/restore_vars"
    echo -e "${YELLOW}Storage Restoration Instructions:${NC}"
    
    if [[ -f "$BACKUP_DIR/STORAGE_BACKUP.md" ]]; then
        cat "$BACKUP_DIR/STORAGE_BACKUP.md"
    else
        cat << EOF

# Manual Storage Restoration Required

1. Navigate to: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_ID/storage/buckets

2. Recreate storage buckets:
   - model-images (Public)
   - model-applications (Private)
   - optimized-images (Public)
   - raw-uploads (Public)
   - cms-images (Public)
   - cms-documents (Private)

3. Upload files from your backup to each bucket

EOF
    fi
}

# Create restore report
create_restore_report() {
    source "$TEMP_DIR/restore_vars"
    local report_file="$TEMP_DIR/RESTORE_REPORT_$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# Five London Restore Report

**Restore Date**: $(date)
**Environment**: $TARGET_ENV
**Backup File**: $BACKUP_FILE
**Restore Status**: SUCCESS

## Restored Components

### ✅ Database
- Schema restored
- Data imported
- Roles configured

### ✅ Code Repository
- Repository cloned from bundle
- Dependencies installed
- Branch created: restore-$(date +%Y%m%d-%H%M%S)

### ⚠️ Storage (Manual Action Required)
- Storage restoration requires manual action
- See storage instructions above

## Next Steps

1. **Verify Application**:
   \`\`\`bash
   npm run dev
   # Test key functionality
   \`\`\`

2. **Test Database Connection**:
   - Verify admin login works
   - Check model data loads
   - Confirm gallery functionality

3. **Restore Storage** (Manual):
   - Follow storage backup instructions
   - Upload files to appropriate buckets
   - Verify image loading

4. **Deploy** (if staging test successful):
   \`\`\`bash
   npm run build
   # Deploy to production
   \`\`\`

## Verification Checklist

- [ ] Application starts without errors
- [ ] Database connection successful
- [ ] Admin authentication works
- [ ] Model gallery displays
- [ ] User registration/login functional
- [ ] Storage buckets recreated
- [ ] Images load correctly

## Files Location

- **Code**: $TEMP_DIR/code-restore
- **Database**: Restored to project $SUPABASE_PROJECT_ID
- **Report**: $report_file

**Restored by**: $(whoami)@$(hostname)
EOF
    
    echo -e "${GREEN}Restore report created: $report_file${NC}"
    cat "$report_file"
}

# Cleanup
cleanup() {
    if [[ -d "$TEMP_DIR" ]]; then
        echo -e "${YELLOW}Cleaning up temporary files...${NC}"
        # Don't delete immediately in case user needs to inspect
        echo -e "${YELLOW}Temporary files preserved at: $TEMP_DIR${NC}"
        echo -e "${YELLOW}Clean up manually when no longer needed${NC}"
    fi
}

# Main execution
main() {
    echo -e "${GREEN}Starting Five London restore process...${NC}"
    
    check_dependencies
    verify_backup
    decrypt_backup
    
    # Create safety backup for production
    if [[ "$TARGET_ENV" == "production" ]]; then
        echo -e "${YELLOW}Creating safety backup before restore...${NC}"
        ./scripts/backup.sh || {
            echo -e "${RED}Safety backup failed. Aborting restore.${NC}"
            exit 1
        }
    fi
    
    restore_database
    restore_code
    show_storage_instructions
    create_restore_report
    
    echo -e "${GREEN}✅ Restore completed successfully!${NC}"
    echo -e "${YELLOW}⚠️  Don't forget to manually restore storage buckets!${NC}"
    echo -e "${YELLOW}⚠️  Test thoroughly before considering restore complete!${NC}"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--file)
            BACKUP_FILE="$2"
            shift 2
            ;;
        -e|--env)
            TARGET_ENV="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_usage
            exit 1
            ;;
    esac
done

# Validate and run
validate_args
trap cleanup EXIT
main "$@"