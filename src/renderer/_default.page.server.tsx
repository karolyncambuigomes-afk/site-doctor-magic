import ReactDOMServer from 'react-dom/server';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

export { render };
export { prerender };

async function render(pageContext: any) {
  const { urlPathname } = pageContext;
  const helmetContext: any = {};
  
  // Create a fresh QueryClient for SSR
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });
  
  const pageHtml = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={urlPathname}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
  
  const { helmet } = helmetContext;
  
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(helmet?.htmlAttributes?.toString() || 'lang="en"')}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dangerouslySkipEscape(helmet?.title?.toString() || '<title>Five London</title>')}
        ${dangerouslySkipEscape(helmet?.meta?.toString() || '')}
        ${dangerouslySkipEscape(helmet?.link?.toString() || '')}
        ${dangerouslySkipEscape(helmet?.script?.toString() || '')}
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // Pass any additional context needed for client-side hydration
    },
  };
}

// Define which routes to prerender
const prerender = [
  '/',
  '/about',
  '/services',
  '/models',
  '/locations',
  '/characteristics',
  '/blog',
  '/faq',
  '/contact',
  '/reviews',
  '/membership',
  '/join-us',
  '/privacy-policy',
  '/terms',
  '/london-escort-guide',
  
  // Location pages
  '/locations/escorts-in-knightsbridge',
  '/locations/escorts-in-mayfair',
  '/locations/escorts-in-chelsea',
  '/locations/escorts-in-belgravia',
  '/locations/escorts-in-kensington',
  '/locations/escorts-in-canary-wharf',
  '/locations/escorts-in-notting-hill',
  '/locations/escorts-in-paddington',
  '/locations/escorts-in-st-johns-wood',
  '/locations/escorts-in-westminster',
  '/locations/escorts-in-city-of-london',
  '/locations/escorts-in-kings-cross',
  '/locations/escorts-in-islington',
  '/locations/escorts-in-hammersmith',
  '/locations/escorts-in-fulham',
  '/locations/escorts-in-clapham',
  '/locations/escorts-in-greenwich',
  '/locations/escorts-in-richmond',
  '/locations/escorts-in-wimbledon',
  '/locations/escorts-in-battersea',
  '/locations/escorts-in-bermondsey',
  '/locations/escorts-in-blackfriars',
  
  // SEO Location routes
  '/escorts-in-mayfair',
  '/escorts-in-knightsbridge',
  '/escorts-in-chelsea',
  '/escorts-in-belgravia',
  '/escorts-in-kensington',
  '/escorts-in-canary-wharf',
  '/escorts-in-notting-hill',
  '/escorts-in-paddington',
  '/escorts-in-st-johns-wood',
  '/escorts-in-westminster',
  '/escorts-in-city-of-london',
  '/escorts-in-kings-cross',
  '/escorts-in-islington',
  '/escorts-in-hammersmith',
  '/escorts-in-fulham',
  '/escorts-in-clapham',
  '/escorts-in-greenwich',
  '/escorts-in-richmond',
  '/escorts-in-wimbledon',
  '/escorts-in-battersea',
  '/escorts-in-bermondsey',
  '/escorts-in-blackfriars',
  
  // Characteristic pages
  '/characteristics/blonde-escorts',
  '/characteristics/brunette-escorts',
  '/characteristics/busty-escorts',
  '/characteristics/petite-escorts',
  '/characteristics/curvy-escorts',
  '/characteristics/slim-escorts',
  '/characteristics/english-escorts',
  '/characteristics/international-escorts',
  '/characteristics/young-escorts',
  '/characteristics/mature-escorts',
  '/characteristics/vip-escorts',
  '/characteristics/gfe-escorts',
  '/characteristics/redhead-escorts',
  '/characteristics/asian-escorts',
  '/characteristics/european-escorts',
  '/characteristics/ebony-escorts',
  '/characteristics/tall-escorts',
  '/characteristics/natural-escorts',
  '/characteristics/brazilian-escorts',
  '/characteristics/russian-escorts',
  '/characteristics/middle-eastern-escorts',
  '/characteristics/latina-escorts',
  '/characteristics/iranian-escorts',
  '/characteristics/vip-elite-escorts',
  '/characteristics/party-escorts',
  '/characteristics/adventurous-escorts',
  '/characteristics/open-minded-escorts',
  '/characteristics/exclusive-escorts',
  '/characteristics/high-class-escorts',
  '/characteristics/dinner-date-escorts',
  '/characteristics/domination-fetish-escorts',
  '/characteristics/bisexual-escorts',
  '/characteristics/couples-escorts',
  '/characteristics/outcalls-escorts',
  
  // SEO Characteristic routes
  '/blonde-escorts-london',
  '/brunette-escorts-london',
  '/busty-escorts-london',
  '/petite-escorts-london',
  '/curvy-escorts-london',
  '/slim-escorts-london',
  '/english-escorts-london',
  '/international-escorts-london',
  '/young-escorts-london',
  '/mature-escorts-london',
  '/vip-escorts-london',
  '/gfe-escorts-london',
  '/redhead-escorts-london',
  '/asian-escorts-london',
  '/european-escorts-london',
  '/ebony-escorts-london',
  '/tall-escorts-london',
  '/natural-escorts-london',
  '/brazilian-escorts-london',
  '/russian-escorts-london',
  '/middle-eastern-escorts-london',
  '/latina-escorts-london',
  '/iranian-escorts-london',
  '/vip-elite-escorts-london',
  '/party-escorts-london',
  '/adventurous-escorts-london',
  '/open-minded-escorts-london',
  '/exclusive-escorts-london',
  '/high-class-escorts-london',
  '/dinner-date-escorts-london',
  '/domination-fetish-escorts-london',
  '/bisexual-escorts-london',
  '/couples-escorts-london',
  '/outcalls-escorts-london',
  
  // Blog posts
  '/blog/best-restaurants-london-dinner-dates',
  '/blog/luxury-hotels-london-sophisticated-stays',
  '/blog/london-annual-events-luxury-experiences',
  '/blog/exclusive-experiences-london-luxury',
  '/blog/london-entertainment-culture-guide',
];
