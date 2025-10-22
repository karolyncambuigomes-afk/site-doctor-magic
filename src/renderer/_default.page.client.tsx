import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PageContextClient } from 'vike/types';

import '../index.css';
import '../styles/utilities.css';

export { render };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000,
      gcTime: 15 * 60 * 1000
    }
  }
});

async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext as any;
  const container = document.getElementById('root')!;

  hydrateRoot(
    container,
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Page {...(pageProps || {})} />
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
}
