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
    spa_config: generateSpaConfig({ hosting_target, app_name, frontend_domain, auth_enabled }),
    env_vars: generateEnvVars({ app_name, base44_api_base_url, base44_app_id, stripe_used, frontend_domain }),
    health_endpoint: generateHealthEndpoint({ base44_api_base_url, cors_origins }),
    health_ping: generateHealthPing({ base44_app_id, frontend_domain }),
    worker_proxy: generateWorkerProxy({ base44_api_base_url, frontend_domain }),
    verification: generateVerification({ hosting_target, frontend_domain, base44_api_base_url }),
    failure_modes: generateFailureModes({ hosting_target, auth_enabled }),
  };
}

// ─── SPA Rewrite Config ─────────────────────────────────────────────────────

function generateSpaConfig({ hosting_target, app_name, frontend_domain, auth_enabled }) {
  switch (hosting_target) {
    case 'nginx':
      return `# Nginx SPA Config for: ${app_name}
# Place in /etc/nginx/sites-available/${app_name}

server {
    listen 80;
    listen [::]:80;
    server_name ${frontend_domain.replace(/https?:\/\//, '')};

    # Redirect HTTP → HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${frontend_domain.replace(/https?:\/\//, '')};

    # SSL — use Certbot or your certificate provider
    ssl_certificate     /etc/letsencrypt/live/${frontend_domain.replace(/https?:\/\//, '')}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${frontend_domain.replace(/https?:\/\//, '')}/privkey.pem;

    root /var/www/${app_name}/dist;
    index index.html;

    # SPA fallback — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy Base44 API calls to avoid CORS issues (optional)
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

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}`;

    case 'cloudflare':
      return `# Cloudflare Pages — _redirects file
# Place at: public/_redirects (or dist/_redirects in your build output)

/api/*  https://api.base44.com/api/:splat  200
/*      /index.html                         200

# ─── Cloudflare Pages — wrangler.toml ───────────────────────────────────────
# Place at root of your project

name = "${app_name}"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"

[vars]
VITE_BASE44_API_URL = "https://api.base44.com/api/apps/YOUR_APP_ID"
VITE_APP_NAME = "${app_name}"

# ─── Custom domain binding (Cloudflare Dashboard) ───────────────────────────
# Dashboard → Pages → ${app_name} → Custom Domains → Add domain${custom_domain ? `\n# Domain: ${custom_domain}` : ''}`;

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
  ],
  "env": {
    "VITE_BASE44_API_URL": "https://api.base44.com/api/apps/YOUR_APP_ID",
    "VITE_APP_NAME": "${app_name}"
  }
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
    Referrer-Policy = "strict-origin-when-cross-origin"

[context.production.environment]
  VITE_BASE44_API_URL = "https://api.base44.com/api/apps/YOUR_APP_ID"
  VITE_APP_NAME = "${app_name}"`;

    default:
      return '# Select a hosting target in Step 1 to generate this config.';
  }
}

// ─── Env Vars Checklist ──────────────────────────────────────────────────────

function generateEnvVars({ app_name, base44_api_base_url, base44_app_id, stripe_used, frontend_domain }) {
  return `# .env — Environment Variables for: ${app_name}
# DO NOT commit this file. Add each variable to your hosting platform's dashboard.

# ─── Required ─────────────────────────────────────────────────────────────────
VITE_BASE44_API_URL=${base44_api_base_url}
# ^ Paste your Base44 backend API URL from your Base44 dashboard → API settings

VITE_BASE44_APP_ID=${base44_app_id || 'YOUR_APP_ID'}
# ^ Your Base44 App ID

VITE_APP_URL=${frontend_domain}
# ^ The public URL of your self-hosted frontend

# ─── Optional ─────────────────────────────────────────────────────────────────
${stripe_used ? `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_KEY
# ^ Stripe publishable key — find this in Stripe Dashboard → Developers → API keys` : '# VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (add if you use Stripe)'}

# ─── Secure Secrets (never use VITE_ prefix — server-side only) ──────────────
# These must be set as secret environment variables in your hosting dashboard.
# NEVER expose them in your frontend bundle.

# STRIPE_SECRET_KEY=sk_live_...  (server-side only)
# BASE44_SERVICE_TOKEN=...       (if using Base44 backend functions)
`;
}

// ─── Platform Health Endpoint ────────────────────────────────────────────────

function generateHealthEndpoint({ base44_api_base_url, cors_origins }) {
  const origins = cors_origins || 'https://app.yourdomain.com';
  return `// /api/platform-health — Platform Health Endpoint
// Deploy this as a serverless function (Vercel /api/platform-health.js,
// Netlify functions/platform-health.js, or Cloudflare Worker route).

const ALLOWED_ORIGINS = [${origins.split(',').map(o => `'${o.trim()}'`).join(', ')}];
const BASE44_API = '${base44_api_base_url}';

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const results = {};

  // 1. Check Base44 backend reachability
  try {
    const start = Date.now();
    const r = await fetch(\`\${BASE44_API}/health\`, { signal: AbortSignal.timeout(5000) });
    results.base44 = { status: r.ok ? 'ok' : 'degraded', latency_ms: Date.now() - start };
  } catch (e) {
    results.base44 = { status: 'down', error: e.message };
  }

  // 2. Self check
  results.frontend = { status: 'ok', timestamp: new Date().toISOString() };

  const allOk = Object.values(results).every(r => r.status === 'ok');

  return res.status(allOk ? 200 : 503).json({
    ok: allOk,
    services: results,
  });
}`;
}

// ─── Base44 health_ping Function Template ────────────────────────────────────

function generateHealthPing({ base44_app_id, frontend_domain }) {
  return `// Base44 Backend Function: health_ping
// Create this as a backend function in your Base44 dashboard.
// Endpoint: POST /health_ping

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Optional: verify caller is authenticated
    // const user = await base44.auth.me();

    const result = {
      ok: true,
      app_id: '${base44_app_id || 'YOUR_APP_ID'}',
      frontend_origin: '${frontend_domain}',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    return Response.json(result, {
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

// ─── Cloudflare Worker DOM-Inject Proxy ──────────────────────────────────────

function generateWorkerProxy({ base44_api_base_url, frontend_domain }) {
  return `// Cloudflare Worker — DOM-Inject Proxy (SSR-safe)
// Deploy via Cloudflare Dashboard → Workers → Create Worker
// Route: ${frontend_domain.replace(/https?:\/\//, '')}/*

const BASE44_API = '${base44_api_base_url}';
const FRONTEND_ORIGIN = '${frontend_domain}';

// Environment variable to inject into the HTML shell
// Set BASE44_API_URL in Worker environment variables (Dashboard → Worker → Settings → Variables)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy /api/* to Base44 backend
    if (url.pathname.startsWith('/api/')) {
      const target = new URL(url.pathname.replace('/api', ''), BASE44_API);
      target.search = url.search;

      const proxied = new Request(target.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      const res = await fetch(proxied);
      const newHeaders = new Headers(res.headers);
      newHeaders.set('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
      return new Response(res.body, { status: res.status, headers: newHeaders });
    }

    // For all other routes — serve the SPA shell and inject env vars
    const response = await fetch(request);
    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('text/html')) {
      // Sanitized injection — only injects known safe values, not user input
      const injection = \`<script>
        window.__BASE44_CONFIG__ = {
          apiUrl: '\${env.BASE44_API_URL || BASE44_API}',
          appId: '\${env.BASE44_APP_ID || ''}',
        };
      </script>\`;

      const html = await response.text();
      const modified = html.replace('</head>', \`\${injection}</head>\`);
      return new Response(modified, {
        status: response.status,
        headers: response.headers,
      });
    }

    return response;
  },
};`;
}

// ─── Verification Plan ───────────────────────────────────────────────────────

function generateVerification({ hosting_target, frontend_domain, base44_api_base_url }) {
  return [
    {
      title: 'SPA routing works on direct URL access',
      detail: `Open ${frontend_domain}/some/deep/route directly. It should load your app, not a 404.`,
    },
    {
      title: 'Base44 API calls succeed from hosted domain',
      detail: `Open DevTools → Network. Perform a login or data fetch. Confirm requests to ${base44_api_base_url} return 200.`,
    },
    {
      title: 'CORS headers are correct',
      detail: `In DevTools → Network, inspect the response headers of any Base44 API call. Access-Control-Allow-Origin should match ${frontend_domain}.`,
    },
    {
      title: '/api/platform-health returns 200',
      detail: `Visit ${frontend_domain}/api/platform-health in your browser. You should see JSON with ok: true.`,
    },
    {
      title: 'Auth login/logout flow works',
      detail: 'Log in via Base44 auth. After redirect, confirm the session is active and you land on the correct page.',
    },
    {
      title: 'Static assets load correctly',
      detail: 'Open DevTools → Network → filter by "Img" and "Media". All assets should load from your domain, not Base44 CDN.',
    },
    {
      title: 'Simulate outage — toggle Base44 API offline',
      detail: `In DevTools → Network → block requests to api.base44.com. Your app should degrade gracefully (show an error state, not a white screen). The /api/platform-health endpoint should return 503.`,
    },
    {
      title: 'Environment variables are set in hosting dashboard',
      detail: `Verify VITE_BASE44_API_URL and VITE_BASE44_APP_ID are set in your ${hosting_target} environment variables dashboard — NOT in a committed .env file.`,
    },
  ];
}

// ─── Common Failure Modes ────────────────────────────────────────────────────

function generateFailureModes({ hosting_target, auth_enabled }) {
  const modes = [
    {
      title: 'White screen on deep link / page refresh',
      cause: 'SPA rewrite rule is missing. The server tries to serve a file at /your/route and gets a 404.',
      fix: `Add the SPA catch-all rule from the generated ${hosting_target} config. Every non-asset path must fall back to index.html.`,
    },
    {
      title: 'CORS error on Base44 API calls',
      cause: 'Your frontend domain is not in the allowed origins for the Base44 API or your proxy.',
      fix: 'Add your frontend domain to CORS headers in the health endpoint template and verify the Base44 app CORS settings in your Base44 dashboard.',
    },
    {
      title: 'Environment variables undefined at runtime',
      cause: 'Variables with VITE_ prefix must be present at build time, not just at runtime.',
      fix: 'Set all VITE_* variables in your hosting platform dashboard before triggering a new build. Never rely on runtime injection for Vite variables.',
    },
    {
      title: 'Auth redirect loops after login',
      cause: 'Base44 auth is redirecting to the wrong domain after login (still pointing at your old Base44 URL).',
      fix: 'Update your Base44 auth allowed redirect URLs in the Base44 dashboard to include your new frontend domain.',
    },
    {
      title: 'Cloudflare Worker throws "Cannot read from body"',
      cause: 'Request body was consumed before being forwarded to the proxy.',
      fix: 'Clone the request before reading the body: const cloned = request.clone(). Pass cloned to fetch().',
    },
    {
      title: 'Assets returning 404 after deployment',
      cause: 'Build output directory mismatch — platform is looking in the wrong folder.',
      fix: `Confirm your build output dir is set to "dist" in ${hosting_target} settings. Run "npm run build" locally and verify the dist/ folder is created.`,
    },
  ];

  if (auth_enabled) {
    modes.push({
      title: 'Session not persisting across routes',
      cause: 'Base44 auth cookie is scoped to the wrong domain or missing SameSite settings.',
      fix: 'Ensure your frontend domain matches the domain used during Base44 auth initialization. Check browser DevTools → Application → Cookies.',
    });
  }

  return modes;
}