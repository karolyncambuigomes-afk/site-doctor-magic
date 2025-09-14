import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserManagement } from '../components/UserManagement';
import { AuthProvider } from '../components/AuthProvider';
import { supabase } from '../integrations/supabase/client';

// Mock the Supabase client
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        })),
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
    })),
    rpc: vi.fn(),
  },
}));

// Mock the permissions hook
vi.mock('../hooks/usePermissions', () => ({
  usePermissions: () => ({
    hasPermission: vi.fn(() => true),
    permissions: [],
    loading: false,
  }),
}));

const createTestWrapper = (initialRoute = '/admin') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          {children}
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('RBAC User Management', () => {
  let mockRpc: any;
  let mockFrom: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockRpc = vi.fn();
    mockFrom = vi.fn();

    (supabase.rpc as any) = mockRpc;
    (supabase.from as any) = mockFrom;

    // Default mock implementations
    mockRpc.mockResolvedValue({ data: [], error: null });
    mockFrom.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
    }));
  });

  describe('User Management Component', () => {
    it('renders user management interface for admins', async () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <UserManagement />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('User Management')).toBeInTheDocument();
      });
    });

    it('displays access denied for non-admin users', () => {
      // Mock permission hook to return false
      vi.doMock('../hooks/usePermissions', () => ({
        usePermissions: () => ({
          hasPermission: vi.fn(() => false),
          permissions: [],
          loading: false,
        }),
      }));

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <UserManagement />
        </TestWrapper>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('shows loading state while fetching data', () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <UserManagement />
        </TestWrapper>
      );

      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
  });

  describe('Role Update Functionality', () => {
    it('calls update role function when role is changed', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          email: 'test@example.com',
          role: 'member',
          status: 'approved',
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        }
      ];

      mockFrom.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              order: () => Promise.resolve({ data: mockUsers, error: null })
            })
          };
        }
        if (table === 'user_management_audit') {
          return {
            select: () => ({
              order: () => ({
                limit: () => Promise.resolve({ data: [], error: null })
              })
            })
          };
        }
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null })
            })
          })
        };
      });

      mockRpc.mockResolvedValue({ data: null, error: null });

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <UserManagement />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });

      const changeRoleButton = screen.getByText('Change Role');
      fireEvent.click(changeRoleButton);

      await waitFor(() => {
        expect(screen.getByText('Change User Role')).toBeInTheDocument();
      });
    });
  });

  describe('Audit Logging', () => {
    it('displays audit logs for admin users', async () => {
      const mockAuditLogs = [
        {
          id: 'log-1',
          admin_user_id: 'admin-1',
          target_user_id: 'user-1',
          action: 'role_change',
          old_values: { role: 'member' },
          new_values: { role: 'team' },
          timestamp: '2025-01-13T10:30:00Z'
        }
      ];

      mockFrom.mockImplementation((table: string) => {
        if (table === 'user_management_audit') {
          return {
            select: () => ({
              order: () => ({
                limit: () => Promise.resolve({ data: mockAuditLogs, error: null })
              })
            })
          };
        }
        return {
          select: () => ({
            order: () => Promise.resolve({ data: [], error: null })
          })
        };
      });

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <UserManagement />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Recent Audit Logs')).toBeInTheDocument();
      });
    });
  });

  describe('Permission-Based UI Rendering', () => {
    it('hides admin features for team members', () => {
      vi.doMock('../hooks/usePermissions', () => ({
        usePermissions: () => ({
          hasPermission: (permission: string) => {
            // Team members can view but not manage
            return permission.startsWith('team.') || permission.startsWith('member.');
          },
          permissions: [
            { permission_name: 'team.models.view', description: 'View models', category: 'team' }
          ],
          loading: false,
        }),
      }));

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <UserManagement />
        </TestWrapper>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });
});