// Generator engine — produces all copy-paste-ready outputs based on migration profile

export function generateOutputs(profile) {
  const {
    hosting_target,
    app_name = 'my-app',
    base44_api_base_url = 'https://api.base44.com/api/apps/YOUR_APP_ID',
    frontend_domain = 'https://app.yourdomain.com',
    base44_app_id = 'YOUR_APP_ID',
    cors_origins = frontend_domain,
    auth_enabled,
    stripe_used,
    custom_domain,
  } = profile;

  return {
    spa_config: generateSpaConfig({ hosting_target, app_name, frontend_domain, auth_enabled, custom_domain }),
    env_vars: generateEnvVars({ app_name, base44_api_base_url, base44_app_id, stripe_used, frontend_domain }),
    health_endpoint: generateHealthEndpoint({ base44_api_base_url, cors_origins }),
    health_ping: generateHealthPing({ base44_app_id, frontend_domain }),
    worker_proxy: generateWorkerProxy({ base44_api_base_url, frontend_domain }),
    verification: generateVerification({ hosting_target, frontend_domain, base44_api_base_url }),
    failure_modes: generateFailureModes({ hosting_target, auth_enabled }),
  };
}

function generateSpaConfig({ hosting_target, app_name, frontend_domain, auth_enabled, custom_domain }) {
  const domain = frontend_domain.replace(/https?:\/\//, '');
  switch (hosting_target) {
    case 'nginx':
      return `# Nginx SPA Config for: ${app_name}
# Place in /etc/nginx/sites-available/${app_name}

server {
    listen 80;
    listen [::]:80;
    server_name ${domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${domain};

    ssl_certificate     /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;

    root /var/www/${app_name}/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy Base44 API calls
    location /api/ {
        proxy_pass https://api.base44.com/;
        proxy_set_header Host api.base44.com;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}`;

    case 'cloudflare':
      return `# Cloudflare Pages — _redirects file
# Place at: public/_redirects (or dist/_redirects)

/api/*  https://api.base44.com/api/:splat  200
/*      /index.html                         200

# ─── wrangler.toml ────────────────────────────────────────────────────────────
name = "${app_name}"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"

[vars]
VITE_BASE44_API_URL = "https://api.base44.com/api/apps/YOUR_APP_ID"
VITE_APP_NAME = "${app_name}"
${custom_domain ? `\n# Custom domain: add ${custom_domain} in Cloudflare Dashboard → Pages → ${app_name} → Custom Domains` : ''}`;

    case 'vercel':
      return `// vercel.json — place at project root
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.base44.com/api/:path*"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}`;

    case 'netlify':
      return `# netlify.toml — place at project root

[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/api/*"
  to = "https://api.base44.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"`;

    default:
      return '# Select a hosting target in Step 1 to generate this config.';
  }
}

function generateEnvVars({ app_name, base44_api_base_url, base44_app_id, stripe_used, frontend_domain }) {
  return `# Environment Variables for: ${app_name}
# DO NOT commit this file. Set these in your hosting platform dashboard.

# ─── Required ─────────────────────────────────────────────────────────────────
VITE_BASE44_API_URL=${base44_api_base_url}
VITE_BASE44_APP_ID=${base44_app_id || 'YOUR_APP_ID'}
VITE_APP_URL=${frontend_domain}

# ─── Optional ─────────────────────────────────────────────────────────────────
${stripe_used
  ? 'VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_KEY\n# ^ Find in Stripe Dashboard → Developers → API keys'
  : '# VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (add if you use Stripe)'}

# ─── Server-side secrets (NEVER use VITE_ prefix) ────────────────────────────
# Set these as secret env vars in your hosting dashboard only.
# STRIPE_SECRET_KEY=sk_live_...
# BASE44_SERVICE_TOKEN=...`;
}

function generateHealthEndpoint({ base44_api_base_url, cors_origins }) {
  const origins = cors_origins || 'https://app.yourdomain.com';
  const originsArr = origins.split(',').map(o => `'${o.trim()}'`).join(', ');
  return `// /api/platform-health
// Deploy as serverless function: Vercel → /api/platform-health.js
// or Netlify → functions/platform-health.js

const ALLOWED_ORIGINS = [${originsArr}];
const BASE44_API = '${base44_api_base_url}';

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const results = {};

  try {
    const start = Date.now();
    const r = await fetch(BASE44_API + '/health', { signal: AbortSignal.timeout(5000) });
    results.base44 = { status: r.ok ? 'ok' : 'degraded', latency_ms: Date.now() - start };
  } catch (e) {
    results.base44 = { status: 'down', error: e.message };
  }

  results.frontend = { status: 'ok', timestamp: new Date().toISOString() };

  const allOk = Object.values(results).every(r => r.status === 'ok');
  return res.status(allOk ? 200 : 503).json({ ok: allOk, services: results });
}`;
}

function generateHealthPing({ base44_app_id, frontend_domain }) {
  return `// Base44 Backend Function: health_ping
// Create in your Base44 dashboard → Functions → New Function

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    return Response.json({
      ok: true,
      app_id: '${base44_app_id || 'YOUR_APP_ID'}',
      frontend_origin: '${frontend_domain}',
      timestamp: new Date().toISOString(),
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '${frontend_domain}',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
});`;
}

function generateWorkerProxy({ base44_api_base_url, frontend_domain }) {
  return `// Cloudflare Worker — DOM-Inject Proxy (SSR-safe)
// Dashboard → Workers & Pages → Create Worker
// Set BASE44_API_URL and BASE44_APP_ID as Worker environment variables.

const BASE44_API = '${base44_api_base_url}';
const FRONTEND_ORIGIN = '${frontend_domain}';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy /api/* to Base44 backend
    if (url.pathname.startsWith('/api/')) {
      const target = new URL(url.pathname.replace('/api', ''), BASE44_API);
      target.search = url.search;
      const cloned = request.clone();
      const proxied = new Request(target.toString(), {
        method: cloned.method,
        headers: cloned.headers,
        body: cloned.method !== 'GET' && cloned.method !== 'HEAD' ? cloned.body : undefined,
      });
      const res = await fetch(proxied);
      const newHeaders = new Headers(res.headers);
      newHeaders.set('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
      return new Response(res.body, { status: res.status, headers: newHeaders });
    }

    // Serve SPA and inject config via <head>
    const response = await fetch(request);
    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('text/html')) {
      const injection = '<script>window.__BASE44_CONFIG__={apiUrl:"' +
        (env.BASE44_API_URL || BASE44_API) + '",appId:"' +
        (env.BASE44_APP_ID || '') + '"};</script>';
      const html = await response.text();
      const modified = html.replace('</head>', injection + '</head>');
      return new Response(modified, { status: response.status, headers: response.headers });
    }

    return response;
  },
};`;
}

function generateVerification({ hosting_target, frontend_domain, base44_api_base_url }) {
  return [
    { title: 'SPA routing works on direct URL access', detail: `Open ${frontend_domain}/some/deep/route directly. It should load your app, not a 404.` },
    { title: 'Base44 API calls succeed from hosted domain', detail: `DevTools → Network. Confirm requests to ${base44_api_base_url} return 200.` },
    { title: 'CORS headers are correct', detail: `Check response headers on any API call. Access-Control-Allow-Origin should match ${frontend_domain}.` },
    { title: '/api/platform-health returns 200', detail: `Visit ${frontend_domain}/api/platform-health. You should see JSON with ok: true.` },
    { title: 'Auth login/logout flow works', detail: 'Log in via Base44 auth. Confirm session persists and redirect lands on the right page.' },
    { title: 'Static assets load correctly', detail: 'DevTools → Network → Img/Media. All assets load from your domain.' },
    { title: 'Simulate outage — block Base44 API', detail: `DevTools → Network → Block requests to api.base44.com. App should degrade gracefully. /api/platform-health should return 503.` },
    { title: 'Environment variables set in hosting dashboard', detail: `Verify VITE_BASE44_API_URL and VITE_BASE44_APP_ID are in your ${hosting_target} env vars — NOT in a committed .env file.` },
  ];
}

function generateFailureModes({ hosting_target, auth_enabled }) {
  const modes = [
    { title: 'White screen on deep link / page refresh', cause: 'SPA rewrite rule is missing. Server tries to serve a file at /your/route and returns 404.', fix: `Add the SPA catch-all rule from the generated ${hosting_target} config.` },
    { title: 'CORS error on Base44 API calls', cause: 'Your frontend domain is not in the allowed origins.', fix: 'Add your frontend domain to CORS headers in the health endpoint and your Base44 dashboard.' },
    { title: 'Environment variables undefined at runtime', cause: 'VITE_* variables must exist at build time, not just runtime.', fix: 'Set all VITE_* variables in your hosting dashboard before triggering a new build.' },
    { title: 'Auth redirect loops after login', cause: 'Base44 auth redirecting to wrong domain.', fix: 'Update Base44 allowed redirect URLs in your Base44 dashboard to include your new frontend domain.' },
    { title: 'Cloudflare Worker "Cannot read from body"', cause: 'Request body was consumed before forwarding.', fix: 'Clone the request first: const cloned = request.clone() — already handled in the generated Worker.' },
    { title: 'Assets returning 404 after deployment', cause: 'Build output directory mismatch.', fix: `Confirm build output dir is "dist" in ${hosting_target} settings. Run "npm run build" locally to verify.` },
  ];

  if (auth_enabled) {
    modes.push({
      title: 'Session not persisting across routes',
      cause: 'Base44 auth cookie scoped to wrong domain.',
      fix: 'Ensure your frontend domain matches the domain used in Base44 auth init. Check DevTools → Application → Cookies.',
    });
  }

  return modes;
}