# Role-Based Access Control (RBAC) Permission Matrix

## Overview
This document defines the permission matrix for the three-tier role system: **Admin**, **Team**, and **Member**.

## Role Hierarchy
- **Admin**: Full system access and user management
- **Team**: Content management and moderation capabilities  
- **Member**: Basic user access with profile management

## Permission Matrix

### Admin Permissions
| Permission | Description | Category |
|------------|-------------|----------|
| `admin.users.manage` | Create, update, delete users | admin |
| `admin.roles.manage` | Assign and remove user roles | admin |
| `admin.system.configure` | Configure system settings | admin |
| `admin.audit.view` | View audit logs and security events | admin |
| `admin.content.manage` | Manage site content and blog posts | admin |
| `admin.models.manage` | Manage model profiles and applications | admin |

**Inherited**: All Team and Member permissions

### Team Permissions
| Permission | Description | Category |
|------------|-------------|----------|
| `team.models.view` | View model applications and profiles | team |
| `team.content.edit` | Edit content and blog posts | team |
| `team.reviews.moderate` | Moderate and approve reviews | team |
| `team.analytics.view` | View analytics and reports | team |

**Inherited**: All Member permissions

### Member Permissions  
| Permission | Description | Category |
|------------|-------------|----------|
| `member.profile.view` | View own profile | member |
| `member.profile.edit` | Edit own profile | member |
| `member.content.view` | View public content | member |
| `member.models.view` | View public model profiles | member |

## Frontend UI Access Control

### Admin Dashboard Access
- **Admin**: Full access to all admin panels and settings
- **Team**: Access denied - redirected to `/admin-access-denied`
- **Member**: Access denied - redirected to `/admin-access-denied`

### Content Management
- **Admin**: Create/edit/delete all content
- **Team**: Edit existing content, cannot delete
- **Member**: View only

### User Management
- **Admin**: Full CRUD operations on users and role assignment
- **Team**: View user list, cannot modify
- **Member**: No access

### Model Applications
- **Admin**: Full access to review, approve, reject applications
- **Team**: View applications, add notes, cannot change status
- **Member**: Submit own applications only

## Backend API Access Control

### Authentication Routes
- `/api/auth/*`: Public access
- All admin routes require `admin.users.manage` permission
- Content editing requires `team.content.edit` or higher
- Profile management requires `member.profile.edit` for own profile

### Database Access (RLS Policies)
- **User Management Audit**: Admin only (`admin.audit.view`)
- **Permissions/Role Permissions**: Authenticated users can view, admins can modify
- **Model Applications**: Admins can manage, authenticated users can submit
- **Content**: Role-based visibility and editing permissions

## Audit Logging

All role changes and administrative actions are logged in the `user_management_audit` table:

### Logged Events
- `role_change`: When an admin changes a user's role
- `login_admin`: When an admin user logs in
- `user_create`: When a new user is created via admin panel
- `user_delete`: When a user is deleted

### Audit Log Structure
```sql
{
  "admin_user_id": "uuid",
  "target_user_id": "uuid", 
  "action": "role_change|login_admin|user_create|user_delete",
  "old_values": {"role": "member"},
  "new_values": {"role": "team"},
  "timestamp": "2025-01-13T10:30:00Z"
}
```

## Test Accounts

### Admin Account
- **Email**: `admin@test.com`
- **Password**: `admin123!`
- **Role**: `admin`
- **Access**: Full system access

### Team Account  
- **Email**: `team@test.com`
- **Password**: `team123!`
- **Role**: `team`
- **Access**: Content management, model viewing, analytics

### Member Account
- **Email**: `member@test.com` 
- **Password**: `member123!`
- **Role**: `member`
- **Access**: Profile management, public content viewing

## Implementation Notes

### Least Privilege Principle
- Each role only receives the minimum permissions necessary
- Permission inheritance flows down (Admin > Team > Member)
- No role escalation allowed without admin intervention

### Security Considerations
- All permission checks use server-side functions
- RLS policies enforce database-level security
- Frontend UI hides/shows features based on permissions
- Audit trail maintains compliance and security monitoring

### Backend Functions
- `has_permission(user_id, permission_name)`: Check if user has specific permission
- `get_user_permissions(user_id)`: Get all permissions for a user  
- `update_user_role_with_audit()`: Change user role with audit logging
- `log_admin_login()`: Log administrative access attempts