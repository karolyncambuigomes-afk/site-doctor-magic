// Prerender.io Middleware for Vercel
// Only intercepts HTML page requests, lets assets pass through

export default async function handler(req, res) {
  const userAgent = req.headers["user-agent"] || "";
  const isBot = /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers\.google\.com/i.test(userAgent);

  // If not a bot, redirect to index.html and let Vercel's SPA handling take over
  if (!isBot) {
    // Return a redirect to let Vercel serve the SPA normally
    res.setHeader("Location", "/index.html");
    return res.status(200).redirect("/index.html");
  }

  // Bot detected - use Prerender.io
  const PRERENDER_TOKEN = "fBgWp4mlMc6fTWbH2aTf";
  const targetUrl = `https://${req.headers.host}${req.url}`;
  const prerenderUrl = `https://service.prerender.io/${targetUrl}`;

  console.log(`[Prerender] Bot detected: ${userAgent.substring(0, 50)}...`);
  console.log(`[Prerender] Fetching: ${prerenderUrl}`);

  try {
    const response = await fetch(prerenderUrl, {
      headers: { 
        "X-Prerender-Token": PRERENDER_TOKEN,
        "User-Agent": userAgent
      },
    });
    
    if (!response.ok) {
      throw new Error(`Prerender returned ${response.status}`);
    }
    
    const html = await response.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    console.log(`[Prerender] Success: ${html.length} bytes`);
    return res.status(200).send(html);
  } catch (err) {
    console.error("[Prerender] Error:", err.message);
    // Fallback: redirect to normal page
    res.setHeader("Location", "/index.html");
    return res.status(302).redirect("/index.html");
  }
}
