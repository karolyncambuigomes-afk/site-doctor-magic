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
  
  // Location detail pages (27 total - synchronized with locations.ts)
  '/escorts-in-knightsbridge',
  '/escorts-in-mayfair',
  '/escorts-in-chelsea',
  '/escorts-in-belgravia',
  '/escorts-in-kensington',
  '/escorts-in-canary-wharf',
  '/escorts-in-notting-hill',
  '/escorts-in-covent-garden',
  '/escorts-in-shoreditch',
  '/escorts-in-marylebone',
  '/escorts-in-fitzrovia',
  '/escorts-in-south-kensington',
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
