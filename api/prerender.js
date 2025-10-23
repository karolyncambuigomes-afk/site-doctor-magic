// Prerender.io Proxy Handler
// This proxies requests to Prerender.io service for bot crawlers

const PRERENDER_TOKEN = 'fBgWp4mlMc6fTWbH2aTf';
const PRERENDER_SERVICE_URL = 'https://service.prerender.io';

// Bot user agents to detect
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest/0.',
  'pinterestbot',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'whatsapp',
  'duckduckbot'
];

export default async function handler(req, res) {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
  const hasEscapedFragment = req.url.includes('_escaped_fragment_');

  // If not a bot and no escaped fragment, pass through
  if (!isBot && !hasEscapedFragment) {
    return res.status(200).json({ prerender: false, reason: 'Not a bot' });
  }

  // Build the URL to prerender
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'];
  const path = req.url.replace('/api/prerender', '');
  const fullUrl = `${protocol}://${host}${path}`;

  try {
    // Fetch prerendered content from Prerender.io
    const prerenderUrl = `${PRERENDER_SERVICE_URL}/${fullUrl}`;
    const response = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': PRERENDER_TOKEN,
        'User-Agent': userAgent
      }
    });

    if (!response.ok) {
      throw new Error(`Prerender.io returned ${response.status}`);
    }

    const content = await response.text();

    // Set appropriate headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    return res.status(200).send(content);
  } catch (error) {
    console.error('Prerender.io error:', error);
    return res.status(500).json({ 
      error: 'Prerender failed', 
      message: error.message 
    });
  }
}
