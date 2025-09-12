import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth } from '../pages/Auth';
import { AuthProvider } from '../components/AuthProvider';
import { supabase } from '../integrations/supabase/client';

// Mock the Supabase client
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
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
  useSafeNavigate: () => vi.fn(),
  useSafeLocation: () => ({ pathname: '/auth' }),
}));

// Mock the toast hook
vi.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('Admin Authentication', () => {
  let mockSignIn: any;
  let mockGetSession: any;
  let mockRpc: any;
  let mockFrom: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSignIn = vi.fn();
    mockGetSession = vi.fn();
    mockRpc = vi.fn();
    mockFrom = vi.fn();

    (supabase.auth.signInWithPassword as any) = mockSignIn;
    (supabase.auth.getSession as any) = mockGetSession;
    (supabase.rpc as any) = mockRpc;
    (supabase.from as any) = mockFrom;

    // Default mock implementations
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockRpc.mockResolvedValue({ data: false, error: null });
  });

  describe('Admin Login Component', () => {
    it('renders admin login form correctly', async () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      expect(screen.getByText('Administrator Access')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('admin@fivelondon.com')).toBeInTheDocument();
      expect(screen.getByText('Sign In as Administrator')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Sign In as Administrator');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('admin@fivelondon.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByText('Sign In as Administrator');

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('validates password length', async () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('admin@fivelondon.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByText('Sign In as Administrator');

      fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
      });
    });
  });

  describe('Admin Authentication Flow', () => {
    it('handles successful admin login', async () => {
      const mockUser = { id: 'user-123', email: 'admin@test.com' };
      const mockProfile = { role: 'admin', status: 'approved' };

      mockSignIn.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

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
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('admin@fivelondon.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByText('Sign In as Administrator');

      fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'admin@test.com',
          password: 'password123',
        });
      });
    });

    it('rejects non-admin users', async () => {
      const mockUser = { id: 'user-123', email: 'user@test.com' };
      const mockProfile = { role: 'user', status: 'approved' };

      mockSignIn.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

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
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('admin@fivelondon.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByText('Sign In as Administrator');

      fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Access denied. This page is for administrators only.')).toBeInTheDocument();
      });
    });

    it('handles authentication errors', async () => {
      mockSignIn.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('admin@fivelondon.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      const submitButton = screen.getByText('Sign In as Administrator');

      fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid admin credentials. Please check your email and password.')).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('toggles password visibility', async () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
      const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

      expect(passwordInput.type).toBe('password');

      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('text');

      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Security Features', () => {
    it('sanitizes input to prevent XSS', async () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('admin@fivelondon.com') as HTMLInputElement;
      
      fireEvent.change(emailInput, { target: { value: 'admin@test.com<script>alert("xss")</script>' } });
      
      expect(emailInput.value).toBe('admin@test.comscriptalert("xss")/script');
    });

    it('limits input length', async () => {
      const TestWrapper = createTestWrapper();
      
      render(
        <TestWrapper>
          <Auth />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('admin@fivelondon.com') as HTMLInputElement;
      const longString = 'a'.repeat(300) + '@test.com';
      
      fireEvent.change(emailInput, { target: { value: longString } });
      
      expect(emailInput.value.length).toBeLessThanOrEqual(255);
    });
  });
});