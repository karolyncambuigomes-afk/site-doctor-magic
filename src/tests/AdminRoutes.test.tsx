import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminProtectedRoute } from '../components/AdminProtectedRoute';
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
        })),
      })),
    })),
    rpc: vi.fn(),
  },
}));

// Mock the router hooks
vi.mock('../hooks/useSafeRouter', () => ({
  useSafeLocation: () => ({ pathname: '/admin' }),
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

describe('Admin Protected Routes', () => {
  let mockGetSession: any;
  let mockRpc: any;
  let mockFrom: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockGetSession = vi.fn();
    mockRpc = vi.fn();
    mockFrom = vi.fn();

    (supabase.auth.getSession as any) = mockGetSession;
    (supabase.rpc as any) = mockRpc;
    (supabase.from as any) = mockFrom;

    // Default mock implementations
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockRpc.mockResolvedValue({ data: false, error: null });
  });

  describe('AdminProtectedRoute Component', () => {
    it('shows loading state while checking authentication', () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <AdminProtectedRoute>
            <div>Admin Dashboard Content</div>
          </AdminProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('redirects unauthenticated users to auth page', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } });

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <AdminProtectedRoute>
            <div>Admin Dashboard Content</div>
          </AdminProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        // Should redirect to auth page - component will be unmounted
        expect(screen.queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
      });
    });

    it('redirects non-admin users to access denied page', async () => {
      const mockUser = { id: 'user-123', email: 'user@test.com' };
      const mockSession = { user: mockUser };
      const mockProfile = { role: 'user', status: 'approved' };

      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockRpc.mockResolvedValue({ data: false, error: null }); // Not admin
      
      mockFrom.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: mockProfile, error: null }),
              }),
            }),
          };
        }
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) };
      });

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <AdminProtectedRoute>
            <div>Admin Dashboard Content</div>
          </AdminProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        // Should redirect to access denied page - component will be unmounted
        expect(screen.queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
      });
    });

    it('renders protected content for admin users', async () => {
      const mockUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockSession = { user: mockUser };
      const mockProfile = { role: 'admin', status: 'approved' };

      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockRpc.mockResolvedValue({ data: true, error: null }); // Is admin
      
      mockFrom.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: mockProfile, error: null }),
              }),
            }),
          };
        }
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) };
      });

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <AdminProtectedRoute>
            <div>Admin Dashboard Content</div>
          </AdminProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard Content')).toBeInTheDocument();
      });
    });
  });

  describe('Route Error Handling', () => {
    it('handles database connection errors gracefully', async () => {
      const mockUser = { id: 'user-123', email: 'user@test.com' };
      const mockSession = { user: mockUser };

      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockRpc.mockRejectedValue(new Error('Database connection failed'));
      
      mockFrom.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.reject(new Error('Database connection failed')),
          }),
        }),
      }));

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <AdminProtectedRoute>
            <div>Admin Dashboard Content</div>
          </AdminProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        // Should handle error gracefully and not render protected content
        expect(screen.queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
      });
    });

    it('handles profile lookup failures', async () => {
      const mockUser = { id: 'user-123', email: 'user@test.com' };
      const mockSession = { user: mockUser };

      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockRpc.mockResolvedValue({ data: false, error: null });
      
      mockFrom.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Profile not found' } }),
          }),
        }),
      }));

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <AdminProtectedRoute>
            <div>Admin Dashboard Content</div>
          </AdminProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        // Should handle error and not render protected content
        expect(screen.queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Admin Role Verification', () => {
    it('verifies admin role using RPC function', async () => {
      const mockUser = { id: 'admin-123', email: 'admin@test.com' };
      const mockSession = { user: mockUser };
      const mockProfile = { role: 'admin', status: 'approved' };

      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockRpc.mockResolvedValue({ data: true, error: null });
      
      mockFrom.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null }),
          }),
        }),
      }));

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <AdminProtectedRoute>
            <div>Admin Dashboard Content</div>
          </AdminProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockRpc).toHaveBeenCalledWith('is_admin');
      });
    });

    it('handles RPC function errors', async () => {
      const mockUser = { id: 'user-123', email: 'user@test.com' };
      const mockSession = { user: mockUser };
      const mockProfile = { role: 'user', status: 'approved' };

      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockRpc.mockResolvedValue({ data: false, error: { message: 'RPC error' } });
      
      mockFrom.mockImplementation(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null }),
          }),
        }),
      }));

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <AdminProtectedRoute>
            <div>Admin Dashboard Content</div>
          </AdminProtectedRoute>
        </TestWrapper>
      );

      await waitFor(() => {
        // Should handle RPC error and not grant admin access
        expect(screen.queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
      });
    });
  });
});