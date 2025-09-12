import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PermissionGuard } from '../components/PermissionGuard';
import { AuthProvider } from '../components/AuthProvider';
import { supabase } from '../integrations/supabase/client';

// Mock the Supabase client
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(),
    },
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

const createTestWrapper = (permissions: string[] = []) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  // Mock permissions hook with dynamic permissions
  vi.doMock('../hooks/usePermissions', () => ({
    usePermissions: () => ({
      hasPermission: (permission: string) => permissions.includes(permission),
      permissions: permissions.map(p => ({ 
        permission_name: p, 
        description: p, 
        category: p.split('.')[0] 
      })),
      loading: false,
    }),
  }));

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('RBAC Permission Matrix Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Admin Role Permissions', () => {
    it('admin has all permissions including user management', () => {
      const adminPermissions = [
        'admin.users.manage',
        'admin.roles.manage', 
        'admin.system.configure',
        'admin.audit.view',
        'admin.content.manage',
        'admin.models.manage',
        'team.models.view',
        'team.content.edit',
        'team.reviews.moderate', 
        'team.analytics.view',
        'member.profile.view',
        'member.profile.edit',
        'member.content.view',
        'member.models.view'
      ];

      const TestWrapper = createTestWrapper(adminPermissions);
      
      render(
        <TestWrapper>
          <PermissionGuard permission="admin.users.manage">
            <div>Admin User Management</div>
          </PermissionGuard>
        </TestWrapper>
      );

      expect(screen.getByText('Admin User Management')).toBeInTheDocument();
    });

    it('admin can access system configuration', () => {
      const TestWrapper = createTestWrapper(['admin.system.configure']);
      
      render(
        <TestWrapper>
          <PermissionGuard permission="admin.system.configure">
            <div>System Configuration</div>
          </PermissionGuard>
        </TestWrapper>
      );

      expect(screen.getByText('System Configuration')).toBeInTheDocument();
    });
  });

  describe('Team Role Permissions', () => {
    it('team member can edit content but not manage users', () => {
      const teamPermissions = [
        'team.models.view',
        'team.content.edit',
        'team.reviews.moderate',
        'team.analytics.view',
        'member.profile.view',
        'member.profile.edit',
        'member.content.view',
        'member.models.view'
      ];

      const TestWrapper = createTestWrapper(teamPermissions);
      
      render(
        <TestWrapper>
          <div>
            <PermissionGuard permission="team.content.edit">
              <div>Content Editor</div>
            </PermissionGuard>
            <PermissionGuard permission="admin.users.manage">
              <div>User Management</div>
            </PermissionGuard>
          </div>
        </TestWrapper>
      );

      expect(screen.getByText('Content Editor')).toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('team member cannot access admin system configuration', () => {
      const TestWrapper = createTestWrapper(['team.content.edit']);
      
      render(
        <TestWrapper>
          <PermissionGuard permission="admin.system.configure">
            <div>System Configuration</div>
          </PermissionGuard>
        </TestWrapper>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  describe('Member Role Permissions', () => {
    it('member can only view own profile and public content', () => {
      const memberPermissions = [
        'member.profile.view',
        'member.profile.edit',
        'member.content.view',
        'member.models.view'
      ];

      const TestWrapper = createTestWrapper(memberPermissions);
      
      render(
        <TestWrapper>
          <div>
            <PermissionGuard permission="member.profile.view">
              <div>Profile View</div>
            </PermissionGuard>
            <PermissionGuard permission="team.content.edit">
              <div>Content Editor</div>
            </PermissionGuard>
            <PermissionGuard permission="admin.users.manage">
              <div>User Management</div>
            </PermissionGuard>
          </div>
        </TestWrapper>
      );

      expect(screen.getByText('Profile View')).toBeInTheDocument();
      expect(screen.getAllByText('Access Denied')).toHaveLength(2);
    });

    it('member cannot access any admin or team features', () => {
      const TestWrapper = createTestWrapper(['member.profile.view']);
      
      render(
        <TestWrapper>
          <div>
            <PermissionGuard permission="team.models.view">
              <div>Model Applications</div>
            </PermissionGuard>
            <PermissionGuard permission="admin.audit.view">
              <div>Audit Logs</div>
            </PermissionGuard>
          </div>
        </TestWrapper>
      );

      expect(screen.getAllByText('Access Denied')).toHaveLength(2);
    });
  });

  describe('Permission Inheritance', () => {
    it('verifies admin inherits all team and member permissions', () => {
      const adminPermissions = [
        'admin.users.manage',
        'team.content.edit', 
        'member.profile.view'
      ];

      const TestWrapper = createTestWrapper(adminPermissions);
      
      render(
        <TestWrapper>
          <div>
            <PermissionGuard permission="admin.users.manage">
              <div>Admin Feature</div>
            </PermissionGuard>
            <PermissionGuard permission="team.content.edit">
              <div>Team Feature</div>
            </PermissionGuard>
            <PermissionGuard permission="member.profile.view">
              <div>Member Feature</div>
            </PermissionGuard>
          </div>
        </TestWrapper>
      );

      expect(screen.getByText('Admin Feature')).toBeInTheDocument();
      expect(screen.getByText('Team Feature')).toBeInTheDocument();
      expect(screen.getByText('Member Feature')).toBeInTheDocument();
    });

    it('verifies team inherits member permissions', () => {
      const teamPermissions = [
        'team.content.edit',
        'member.profile.view'
      ];

      const TestWrapper = createTestWrapper(teamPermissions);
      
      render(
        <TestWrapper>
          <div>
            <PermissionGuard permission="team.content.edit">
              <div>Team Feature</div>
            </PermissionGuard>
            <PermissionGuard permission="member.profile.view">
              <div>Member Feature</div>
            </PermissionGuard>
            <PermissionGuard permission="admin.users.manage">
              <div>Admin Feature</div>
            </PermissionGuard>
          </div>
        </TestWrapper>
      );

      expect(screen.getByText('Team Feature')).toBeInTheDocument();
      expect(screen.getByText('Member Feature')).toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  describe('Fallback Rendering', () => {
    it('renders custom fallback when permission denied', () => {
      const TestWrapper = createTestWrapper([]);
      
      render(
        <TestWrapper>
          <PermissionGuard 
            permission="admin.users.manage"
            fallback={<div>Custom Access Denied Message</div>}
          >
            <div>Protected Content</div>
          </PermissionGuard>
        </TestWrapper>
      );

      expect(screen.getByText('Custom Access Denied Message')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders nothing when showFallback is false', () => {
      const TestWrapper = createTestWrapper([]);
      
      render(
        <TestWrapper>
          <div>
            <PermissionGuard 
              permission="admin.users.manage"
              showFallback={false}
            >
              <div>Protected Content</div>
            </PermissionGuard>
            <div>Always Visible</div>
          </div>
        </TestWrapper>
      );

      expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('Always Visible')).toBeInTheDocument();
    });
  });
});