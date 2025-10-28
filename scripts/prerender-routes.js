import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const templatePath = path.join(distPath, 'index.html');

// Static routes to pre-render
const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/faq',
  '/contact',
  '/locations',
  '/reviews',
  '/membership',
  '/privacy-policy',
  '/terms',
  '/join-us',
  '/blog',
  
  // Location detail pages
  '/escorts-in-mayfair',
  '/escorts-in-knightsbridge',
  '/escorts-in-belgravia',
  '/escorts-in-chelsea',
  '/escorts-in-kensington',
  '/escorts-in-marylebone',
  '/escorts-in-soho',
  '/escorts-in-covent-garden',
  '/escorts-in-notting-hill',
  '/escorts-in-south-kensington',
  '/escorts-in-bayswater',
  '/escorts-in-paddington',
  '/escorts-in-fitzrovia',
  '/escorts-in-pimlico',
  '/escorts-in-victoria',
  '/escorts-in-westminster',
  '/escorts-in-st-james',
  '/escorts-in-bloomsbury',
  '/escorts-in-strand',
  '/escorts-in-holborn',
  '/escorts-in-canary-wharf',
  '/escorts-in-shoreditch',
  
  // Characteristic pages
  '/blonde-escorts-london',
  '/brunette-escorts-london',
  '/english-escorts-london',
  '/european-escorts-london',
  '/busty-escorts-london',
  '/slim-escorts-london',
  '/petite-escorts-london',
  '/tall-escorts-london',
  '/mature-escorts-london',
  '/young-escorts-london',
  '/brazilian-escorts-london',
  '/spanish-escorts-london',
  '/italian-escorts-london',
  '/french-escorts-london',
  '/russian-escorts-london',
  '/asian-escorts-london',
  '/latin-escorts-london',
  '/ebony-escorts-london',
  '/redhead-escorts-london',
  '/athletic-escorts-london',
  '/curvy-escorts-london',
  '/tattooed-escorts-london',
  '/natural-escorts-london',
  '/luxury-escorts-london',
  '/elite-escorts-london',
  '/high-class-escorts-london',
  '/duo-escorts-london',
  '/gfe-escorts-london',
  '/pse-escorts-london',
  '/travel-escorts-london',
  '/dinner-date-escorts-london',
  '/overnight-escorts-london',
  '/massage-escorts-london',
  '/party-escorts-london',
];

async function prerenderRoutes() {
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Template file not found. Run "npm run build" first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Import the server entry point (compiled from TypeScript)
  const { render } = await import('../dist-server/entry-server.mjs');

  console.log(`🔄 Pre-rendering ${staticRoutes.length} static routes...`);

  for (const route of staticRoutes) {
    try {
      const { html, helmet } = render(route);
      
      // Replace placeholders in template
      let renderedHtml = template
        .replace('<!--app-html-->', html)
        .replace('<html>', `<html ${helmet.htmlAttributes}>`)
        .replace('<body>', `<body ${helmet.bodyAttributes}>`)
        .replace('</head>', `${helmet.title}${helmet.priority}${helmet.meta}${helmet.link}${helmet.script}${helmet.style}</head>`);

      // Create directory structure
      const routePath = route === '/' ? '/index' : route;
      const filePath = path.join(distPath, routePath, 'index.html');
      const dirPath = path.dirname(filePath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write pre-rendered HTML
      fs.writeFileSync(filePath, renderedHtml);
      console.log(`✅ Pre-rendered: ${route}`);
    } catch (error) {
      console.error(`❌ Failed to pre-render ${route}:`, error.message);
    }
  }

  console.log(`\n✨ Pre-rendering complete! ${staticRoutes.length} pages generated.`);
}

prerenderRoutes().catch((error) => {
  console.error('❌ Pre-rendering failed:', error);
  process.exit(1);
});
