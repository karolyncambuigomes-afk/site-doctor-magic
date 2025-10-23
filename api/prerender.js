// Prerender.io Middleware for Vercel
// Intercepts ALL requests and proxies bot traffic to Prerender.io

import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  const userAgent = req.headers["user-agent"] || "";
  const isBot = /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers\.google\.com/i.test(userAgent);

  // If not a bot, serve the regular SPA
  if (!isBot) {
    try {
      const html = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf-8');
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    } catch (err) {
      console.error("Error serving app:", err.message);
      return res.status(404).send("Not found");
    }
  }

  // Bot detected - use Prerender.io
  const PRERENDER_TOKEN = "fBgWp4mlMc6fTWbH2aTf";
  const targetUrl = `https://${req.headers.host}${req.url}`;
  const prerenderUrl = `https://service.prerender.io/${targetUrl}`;

  try {
    const response = await fetch(prerenderUrl, {
      headers: { 
        "X-Prerender-Token": PRERENDER_TOKEN,
        "User-Agent": userAgent
      },
    });
    const html = await response.text();
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return res.status(200).send(html);
  } catch (err) {
    console.error("Prerender error:", err.message);
    // Fallback to regular app if prerender fails
    try {
      const html = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf-8');
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    } catch {
      return res.status(500).send("Error");
    }
  }
}
