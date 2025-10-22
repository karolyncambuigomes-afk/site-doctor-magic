import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PageContextServer } from 'vike/types';

export { render };
export { passToClient };

const passToClient = ['pageProps', 'routeParams', 'urlPathname'] as const;

async function render(pageContext: PageContextServer) {
  const { Page, pageProps, urlPathname } = pageContext as any;
  
  const helmetContext = {};
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
      }
    }
  });

  const pageHtml = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <StaticRouter location={urlPathname || '/'}>
            <Page {...(pageProps || {})} />
          </StaticRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );

  const documentHtml = `<!DOCTYPE html>
<html lang="en-GB" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#171717" />
    <title>${pageProps?.title || 'Five London - Premier Luxury Companion Services'}</title>
    <meta name="description" content="${pageProps?.description || 'Finest High Class Escorts in London'}" />
  </head>
  <body>
    <div id="root">${pageHtml}</div>
  </body>
</html>`;

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true
    }
  };
}
