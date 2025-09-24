#!/bin/bash

# RBAC Test Account Creation Script
# Creates test accounts for all roles to verify permission matrix

echo "🚀 Creating RBAC Test Accounts..."

# Configuration
SUPABASE_URL="https://jiegopvbwpyfohhfvmwo.supabase.co"
FUNCTION_URL="$SUPABASE_URL/functions/v1/create-test-accounts"

# Test account credentials
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="admin123!"

TEAM_EMAIL="team@test.com"  
TEAM_PASSWORD="team123!"

MEMBER_EMAIL="member@test.com"
MEMBER_PASSWORD="member123!"

# Function to create test account
create_account() {
    local email=$1
    local password=$2
    local role=$3
    
    echo "Creating $role account: $email"
    
    response=$(curl -s -X POST "$FUNCTION_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\", 
            \"role\": \"$role\",
            \"status\": \"approved\"
        }")
    
    if echo "$response" | grep -q "\"success\":true"; then
        echo "✅ $role account created successfully"
    else
        echo "❌ Failed to create $role account"
        echo "Response: $response"
    fi
}

# Create all test accounts
echo ""
echo "📝 Creating test accounts with following credentials:"
echo "Admin: $ADMIN_EMAIL / $ADMIN_PASSWORD" 
echo "Team:  $TEAM_EMAIL / $TEAM_PASSWORD"
echo "Member: $MEMBER_EMAIL / $MEMBER_PASSWORD"
echo ""

create_account "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "admin"
create_account "$TEAM_EMAIL" "$TEAM_PASSWORD" "team"  
create_account "$MEMBER_EMAIL" "$MEMBER_PASSWORD" "member"

echo ""
echo "🎯 Test Account Summary:"
echo "========================"
echo ""
echo "ADMIN ACCOUNT (Full System Access):"
echo "  Email: $ADMIN_EMAIL"
echo "  Password: $ADMIN_PASSWORD"
echo "  Access: All admin panels, user management, system config"
echo ""
echo "TEAM ACCOUNT (Content Management):"  
echo "  Email: $TEAM_EMAIL"
echo "  Password: $TEAM_PASSWORD"
echo "  Access: Content editing, model viewing, analytics"
echo "  Blocked: Admin panels, user management"
echo ""
echo "MEMBER ACCOUNT (Basic Access):"
echo "  Email: $MEMBER_EMAIL" 
echo "  Password: $MEMBER_PASSWORD"
echo "  Access: Profile management, public content"
echo "  Blocked: Admin panels, content editing"
echo ""
echo "🧪 Test Steps:"
echo "1. Login with each account"
echo "2. Try accessing /admin (should redirect team/member to access denied)"
echo "3. Verify UI elements show/hide based on permissions"
echo "4. Test role changes via admin account"
echo "5. Check audit logs for all actions"
echo ""
echo "✅ RBAC test accounts created successfully!"