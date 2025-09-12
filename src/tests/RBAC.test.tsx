import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PermissionGuard } from '../components/PermissionGuard';
import { AuthProvider } from '../components/AuthProvider';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('RBAC System', () => {
  it('renders permission guard with access denied for unauthorized users', () => {
    render(
      <TestWrapper>
        <PermissionGuard permission="admin.users.manage">
          <div>Admin Content</div>
        </PermissionGuard>
      </TestWrapper>
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('shows fallback when permission is denied', () => {
    render(
      <TestWrapper>
        <PermissionGuard 
          permission="admin.users.manage"
          fallback={<div>Custom Fallback</div>}
        >
          <div>Admin Content</div>
        </PermissionGuard>
      </TestWrapper>
    );
    
    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
  });
});