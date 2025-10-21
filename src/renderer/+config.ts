import type { Config } from 'vike/types';

export default {
  // Enable SPA fallback for non-prerendered routes
  passToClient: ['pageContext', 'urlPathname'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  
  // Prerender configuration
  prerender: {
    parallel: 10, // Process 10 pages in parallel
  },
} satisfies Config;
