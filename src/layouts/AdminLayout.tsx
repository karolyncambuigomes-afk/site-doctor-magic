import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundaryWrapper';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundaryWrapper context="AdminLayout">
      <SidebarProvider>
        <div className="min-h-screen w-full bg-background">
          {/* Header with navigation and sidebar trigger */}
          <ErrorBoundaryWrapper 
            context="AdminHeader"
            fallback={({ error }) => (
              <div className="h-16 bg-destructive/10 border-b flex items-center px-4">
                <p className="text-destructive">Header Error: {error?.message}</p>
              </div>
            )}
          >
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="h-8 w-8" />
                  <h1 className="font-luxury-heading text-xl font-medium">Admin Panel</h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Five London</span>
                </div>
              </div>
            </header>
          </ErrorBoundaryWrapper>

          <div className="flex w-full">
            <ErrorBoundaryWrapper 
              context="AdminSidebar"
              fallback={({ error }) => (
                <div className="w-64 bg-muted p-4">
                  <p className="text-destructive font-medium">Sidebar Error</p>
                  <p className="text-sm text-muted-foreground">{error?.message}</p>
                </div>
              )}
            >
              <AdminSidebar />
            </ErrorBoundaryWrapper>
            
            <main className="flex-1 overflow-auto">
              <ErrorBoundaryWrapper 
                context="AdminMainContent"
                fallback={({ error }) => (
                  <div className="p-8">
                    <p className="text-destructive font-medium">Main Content Error</p>
                    <p className="text-sm text-muted-foreground">{error?.message}</p>
                  </div>
                )}
              >
                <div className="container-width py-6">
                  {children}
                </div>
              </ErrorBoundaryWrapper>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundaryWrapper>
  );
};