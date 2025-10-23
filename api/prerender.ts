// Prerender.io Middleware for Lovable
// Only intercepts HTML page requests, lets assets pass through

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers["user-agent"] || "";
  const isBot =
    /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers\.google\.com/i.test(
      userAgent,
    );

  // If not a bot, let the request continue to your React app
  if (!isBot) {
    // For Lovable, we should return a 404 to let the platform handle the request
    res.status(404).end();
    return;
  }

  // Bot detected - use Prerender.io
  const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN;
  if (!PRERENDER_TOKEN) {
    console.error("[Prerender] PRERENDER_TOKEN environment variable not configured");
    // Fallback: serve basic HTML for SEO
    return serveBasicSeoHtml(req, res);
  }

  const targetUrl = `https://${req.headers.host}${req.url}`;
  const prerenderUrl = `https://service.prerender.io/${targetUrl}`;

  console.log(`[Prerender] Bot detected: ${userAgent.substring(0, 50)}...`);
  console.log(`[Prerender] Fetching: ${prerenderUrl}`);

  try {
    const response = await fetch(prerenderUrl, {
      headers: {
        "X-Prerender-Token": PRERENDER_TOKEN,
        "User-Agent": userAgent,
        "X-Original-URL": targetUrl,
        "Referer": targetUrl,
      },
    });

    if (!response.ok) {
      throw new Error(`Prerender returned ${response.status}`);
    }

    const html = await response.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    console.log(`[Prerender] Success: ${html.length} bytes`);
    return res.status(200).send(html);
  } catch (err) {
    console.error("[Prerender] Error:", (err as Error).message);
    // Fallback: serve basic SEO HTML
    return serveBasicSeoHtml(req, res);
  }
}

function serveBasicSeoHtml(req: VercelRequest, res: VercelResponse) {
  const path = req.url || "/";
  const meta = getMetaTags(path);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://fivelondon.com${path}">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:image" content="https://fivelondon.com${meta.image}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://fivelondon.com${path}">
    <meta property="twitter:title" content="${meta.title}">
    <meta property="twitter:description" content="${meta.description}">
    <meta property="twitter:image" content="https://fivelondon.com${meta.image}">
    
    <link rel="canonical" href="https://fivelondon.com${path}">
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
            <h1>${meta.title}</h1>
            <p>${meta.description}</p>
            <p>Please enable JavaScript to view the full experience.</p>
        </div>
    </div>
</body>
</html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.send(html);
}

function getMetaTags(path: string) {
  const metaConfig: { [key: string]: { title: string; description: string; image: string } } = {
    "/": {
      title: "Five London - Premium Services in London",
      description:
        "Five London offers exclusive premium services and experiences in the heart of London. Discover our curated offerings.",
      image: "/og-image.jpg",
    },
    "/about": {
      title: "About Five London - Our Story",
      description: "Learn about Five London's mission to deliver exceptional services and experiences in London.",
      image: "/og-about.jpg",
    },
    "/services": {
      title: "Our Services - Five London",
      description: "Explore our range of premium services designed to elevate your London experience.",
      image: "/og-services.jpg",
    },
    "/contact": {
      title: "Contact Five London - Get in Touch",
      description: "Reach out to Five London for inquiries, bookings, and premium service consultations.",
      image: "/og-contact.jpg",
    },
  };

  return metaConfig[path] || metaConfig["/"];
}
