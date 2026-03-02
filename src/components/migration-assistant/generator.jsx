// Generator engine — produces all copy-paste-ready outputs based on migration profile

// ── Host Presets (Step 2) ────────────────────────────────────────────────────

export function generateHostPresets(profile) {
  const {
    hosting_target,
    app_name = 'my-app',
    base44_api_base_url = 'https://api.base44.com/api/apps/YOUR_APP_ID',
    base44_app_id = 'YOUR_APP_ID',
    frontend_domain = 'https://app.yourdomain.com',
    stripe_used,
    auth_enabled,
  } = profile;

  return {
    spaConfigs: buildAllSpaConfigs({ hosting_target, app_name, frontend_domain }),
    envVars: buildEnvVarList({ base44_api_base_url, base44_app_id, frontend_domain, stripe_used, auth_enabled }),
  };
}

function buildAllSpaConfigs({ hosting_target, app_name, frontend_domain }) {
  const domain = frontend_domain.replace(/https?:\/\//, '');

  const configs = [
    {
      title: 'Nginx — server block',
      lang: 'nginx',
      content: `# /etc/nginx/sites-available/${app_name}
server {
    listen 80;
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

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`,
    },
    {
      title: 'Cloudflare Pages — public/_redirects',
      lang: 'text',
      content: `/api/*  https://api.base44.com/api/:splat  200
/*      /index.html                         200`,
    },
    {
      title: 'Netlify — _redirects (place in public/)',
      lang: 'text',
      content: `/api/*  https://api.base44.com/api/:splat  200
/*      /index.html                         200`,
    },
    {
      title: 'Vercel — vercel.json',
      lang: 'json',
      content: `{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.base44.com/api/:path*"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}`,
    },
  ];

  // If a specific host is selected, put its config first
  const order = { nginx: 0, cloudflare: 1, netlify: 2, vercel: 3 };
  if (hosting_target && order[hosting_target] !== undefined) {
    const idx = order[hosting_target];
    const [selected] = configs.splice(idx, 1);
    configs.unshift(selected);
  }

  return configs;
}

function buildEnvVarList({ base44_api_base_url, base44_app_id, frontend_domain, stripe_used, auth_enabled }) {
  const vars = [
    {
      key: 'VITE_BASE44_API_URL',
      example: base44_api_base_url || 'https://api.base44.com/api/apps/YOUR_APP_ID',
      required: true,
      note: 'Base44 backend API URL',
    },
    {
      key: 'VITE_BASE44_APP_ID',
      example: base44_app_id || 'YOUR_APP_ID',
      required: true,
      note: 'Base44 App ID from dashboard',
    },
    {
      key: 'VITE_APP_URL',
      example: frontend_domain || 'https://app.yourdomain.com',
      required: true,
      note: 'Your self-hosted frontend URL',
    },
  ];

  if (stripe_used) {
    vars.push({
      key: 'VITE_STRIPE_PUBLISHABLE_KEY',
      example: 'pk_live_YOUR_STRIPE_KEY',
      required: true,
      note: 'Stripe Dashboard → Developers → API keys',
    });
    vars.push({
      key: 'STRIPE_SECRET_KEY',
      example: 'sk_live_YOUR_STRIPE_SECRET',
      required: true,
      note: 'SERVER SIDE ONLY — never use VITE_ prefix',
    });
  }

  if (auth_enabled) {
    vars.push({
      key: 'VITE_AUTH_REDIRECT_URL',
      example: (frontend_domain || 'https://app.yourdomain.com') + '/auth/callback',
      required: false,
      note: 'Auth callback URL after login',
    });
  }

  return vars;
}

// ── Health System (Step 3) ────────────────────────────────────────────────────

export function generateHealthSystem(profile) {
  const {
    base44_api_base_url = 'https://api.base44.com/api/apps/YOUR_APP_ID',
    base44_app_id = 'YOUR_APP_ID',
    frontend_domain = 'https://app.yourdomain.com',
    cors_origins = '',
    health_ping_url = '',
    health_deep_enabled = false,
    health_runtime = 'express',
    health_timeout_ms = 2500,
    health_failure_threshold = 3,
    health_success_threshold = 2,
  } = profile;

  const pingUrl = health_ping_url || `${base44_api_base_url.replace(/\/$/, '')}/health_ping`;
  const origins = cors_origins || frontend_domain;

  return {
    backendPing: buildHealthPingFunction({ base44_app_id, frontend_domain, health_deep_enabled }),
    platformHealthEndpoint: buildPlatformHealthEndpoint({ pingUrl, frontend_domain, origins, health_runtime, health_timeout_ms }),
    pollingContract: buildPollingContract({ health_failure_threshold, health_success_threshold }),
  };
}

function buildHealthPingFunction({ base44_app_id, frontend_domain, health_deep_enabled }) {
  const deepChecks = health_deep_enabled ? `
    // ── Deep health check ─────────────────────────────────────────────────────
    // PLACEHOLDER: Replace this block with your actual DB connectivity check.
    // Example: query a lightweight entity or call base44.entities.YourEntity.list() with limit 1.
    let dbOk = false;
    try {
      // const rows = await base44.entities.YourEntity.list('created_date', 1);
      // dbOk = Array.isArray(rows);
      dbOk = true; // ← Remove this line once you wire in a real check
    } catch (_) {
      dbOk = false;
    }

    const checks = { db: dbOk ? 'pass' : 'fail' };
    const ok = dbOk;` : `
    const checks = undefined;
    const ok = true;`;

  return `// ─────────────────────────────────────────────────────────────────────────────
// Base44 Backend Function: health_ping
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO DEPLOY:
//   1. Go to your Base44 dashboard → Code → Functions
//   2. Click "New Function" and name it "health_ping"
//   3. Paste this template and adjust the PLACEHOLDER sections
//   4. Click Deploy
//
// IMPORTANT: This is an adaptable template. Sections marked PLACEHOLDER require
// manual adjustment to match your app's actual entities and data model.
// ─────────────────────────────────────────────────────────────────────────────

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  // Allow preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '${frontend_domain}',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }
${deepChecks}

  return Response.json(
    {
      ok,
      ts: new Date().toISOString(),
      ${health_deep_enabled ? 'checks,' : '// checks: undefined  ← enable deep mode to include this'}
    },
    {
      status: ok ? 200 : 503,
      headers: {
        'Access-Control-Allow-Origin': '${frontend_domain}',
        'Cache-Control': 'no-store',
      },
    }
  );
});`;
}

function buildPlatformHealthEndpoint({ pingUrl, frontend_domain, origins, health_runtime, health_timeout_ms }) {
  const originsArr = origins.split(',').map(o => `'${o.trim()}'`).join(', ');
  const timeout = Number(health_timeout_ms) || 2500;

  const body = `
  const ALLOWED_ORIGINS = [${originsArr}];
  // ── Caching guidance ─────────────────────────────────────────────────────────
  // Cache this response for 10 seconds on the CDN edge to avoid hammering
  // the upstream. Set 'Cache-Control: public, max-age=10, s-maxage=10'.
  // ── Rate limiting guidance ────────────────────────────────────────────────────
  // Limit callers to max 6 requests/minute per IP. If using Cloudflare, enable
  // the "Rate Limiting" rule targeting this path (/api/platform-health).

  const t0 = Date.now();
  let upstreamStatus = 0;
  let ok = false;

  try {
    const res = await fetch('${pingUrl}', {
      signal: AbortSignal.timeout(${timeout}),
    });
    upstreamStatus = res.status;
    ok = res.ok;
  } catch (_) {
    upstreamStatus = 0;
    ok = false;
  }

  const latencyMs = Date.now() - t0;
  const payload = { ok, upstreamStatus, latencyMs, ts: new Date().toISOString() };`;

  const templates = {
    express: `// /api/platform-health — Express (Node.js)
// Mount with: app.use('/api/platform-health', require('./platform-health'))

const express = require('express');
const router = express.Router();
${body}

  const origin = req.headers['origin'] || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=10');
  return res.status(ok ? 200 : 503).json(payload);
});

module.exports = router;`,

    nextjs: `// pages/api/platform-health.js  (or app/api/platform-health/route.js for App Router)
// Next.js API Route
${body}

  const origin = req.headers['origin'] || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=10');
  return res.status(ok ? 200 : 503).json(payload);
}`,

    cloudflare: `// Cloudflare Worker Route: /api/platform-health
// Attach to your existing Worker or create a new one.
// Add a route pattern: yourdomain.com/api/platform-health*

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/platform-health')) {
      return fetch(request);
    }

    ${body.trim().replace(/^/gm, '    ').trim()}

    const origin = request.headers.get('Origin') || '';
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=10, s-maxage=10',
    };
    if (ALLOWED_ORIGINS.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
    return new Response(JSON.stringify(payload), { status: ok ? 200 : 503, headers });
  },
};`,

    any: `// ── Pseudo-code: Any server runtime ──────────────────────────────────────────
// Adapt the logic below to your language/framework.

// 1. Receive GET /api/platform-health
// 2. Set CORS headers if origin is in allowed list
// 3. Set Cache-Control: public, max-age=10, s-maxage=10

const PING_URL = '${pingUrl}';
const TIMEOUT_MS = ${timeout};

// 4. Time a fetch call with timeout
const t0 = now();
const { status: upstreamStatus, ok } = await fetchWithTimeout(PING_URL, TIMEOUT_MS);
const latencyMs = now() - t0;

// 5. Return JSON matching the frontend polling contract:
return json({
  ok,             // boolean
  upstreamStatus, // number — HTTP status from upstream (0 = network error)
  latencyMs,      // number — round-trip ms
  ts,             // string — ISO 8601 timestamp
}, status: ok ? 200 : 503);`,
  };

  return templates[health_runtime] || templates['express'];
}

function buildPollingContract({ health_failure_threshold, health_success_threshold }) {
  const ft = Number(health_failure_threshold) || 3;
  const st = Number(health_success_threshold) || 2;

  return `// ─────────────────────────────────────────────────────────────────────────────
// Frontend Polling Contract
// ─────────────────────────────────────────────────────────────────────────────
// Your frontend polls GET /api/platform-health every N seconds.
// The endpoint must return JSON matching this exact schema:

// TypeScript interface:
interface PlatformHealthResponse {
  ok: boolean;           // true = system healthy, false = degraded / down
  upstreamStatus: number; // HTTP status from the upstream ping (0 = network error)
  latencyMs: number;     // round-trip latency in milliseconds
  ts: string;            // ISO 8601 timestamp of the check
}

// Example success response:
// { "ok": true, "upstreamStatus": 200, "latencyMs": 142, "ts": "2024-01-15T10:30:00.000Z" }

// Example failure response (status 503):
// { "ok": false, "upstreamStatus": 0, "latencyMs": ${Number(2500)}, "ts": "2024-01-15T10:30:00.000Z" }

// ── Banner display thresholds (editable) ────────────────────────────────────
const FAILURE_THRESHOLD = ${ft};
// Show "degraded" banner after this many CONSECUTIVE failed polls.

const SUCCESS_THRESHOLD = ${st};
// Remove banner only after this many CONSECUTIVE successful polls.
// (Hysteresis — prevents banner flicker on transient errors.)

// ── Suggested poll logic ─────────────────────────────────────────────────────
// let failCount = 0, successCount = 0;
//
// async function poll() {
//   try {
//     const data = await fetch('/api/platform-health').then(r => r.json());
//     if (data.ok) {
//       successCount++; failCount = 0;
//       if (successCount >= SUCCESS_THRESHOLD) hideBanner();
//     } else {
//       failCount++; successCount = 0;
//       if (failCount >= FAILURE_THRESHOLD) showBanner();
//     }
//   } catch (_) {
//     failCount++; successCount = 0;
//     if (failCount >= FAILURE_THRESHOLD) showBanner();
//   }
// }
//
// setInterval(poll, 30_000); // poll every 30 seconds`;
}

// ── Edge Worker (Step 4) ─────────────────────────────────────────────────────

export function generateEdgeWorker(profile) {
  const {
    ew_mode = 'html_inject',
    ew_origin_url = 'https://your-origin.pages.dev',
    ew_inject_banner = true,
    ew_inject_script = true,
    ew_security_headers = true,
    ew_cache_headers = true,
    ew_meta_tags = false,
    app_name = 'my-app',
  } = profile;

  return {
    workerScript: buildWorkerScript({ ew_mode, ew_origin_url, ew_inject_banner, ew_inject_script, ew_security_headers, ew_cache_headers, ew_meta_tags }),
    wranglerToml: buildWranglerToml({ app_name, ew_origin_url }),
  };
}

function buildWorkerScript({ ew_mode, ew_origin_url, ew_inject_banner, ew_inject_script, ew_security_headers, ew_cache_headers, ew_meta_tags }) {
  const origin = ew_origin_url || 'https://your-origin.pages.dev';

  const secHeadersCode = ew_security_headers ? `
    // Security headers
    newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    newHeaders.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.base44.com; frame-ancestors 'none';"
    );` : '';

  const cacheHeaderCode = ew_cache_headers ? `
    newHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');` : '';

  const bannerSnippet = (ew_mode === 'html_inject' && ew_inject_banner)
    ? `'<div id="b44-banner" hidden style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#f59e0b;color:#000;text-align:center;padding:8px 16px;font-size:14px;">Platform degraded – we are working on it.</div>\\n'`
    : "''";

  const scriptSnippet = (ew_mode === 'script_inject' && ew_inject_script)
    ? `\`<script id="b44-health-loader">
(function(){
  var FAIL=0,PASS=0,FAIL_T=3,PASS_T=2;
  function show(){var b=document.getElementById('b44-banner');if(b)b.hidden=false;}
  function hide(){var b=document.getElementById('b44-banner');if(b)b.hidden=true;}
  function poll(){
    fetch('/api/platform-health').then(function(r){return r.json();}).then(function(d){
      if(d.ok){PASS++;FAIL=0;if(PASS>=PASS_T)hide();}
      else{FAIL++;PASS=0;if(FAIL>=FAIL_T)show();}
    }).catch(function(){FAIL++;PASS=0;if(FAIL>=FAIL_T)show();});
  }
  poll();setInterval(poll,30000);
})();
</script>\``
    : "''";

  const metaSnippet = ew_meta_tags
    ? `
      // Inject meta tags if not present
      if (!html.includes('<meta name="description"')) {
        htmlToReturn = htmlToReturn.replace(
          '</head>',
          '<meta name="description" content="Your app description here">\\n</head>'
        );
      }
      if (!html.includes('<meta name="title"')) {
        htmlToReturn = htmlToReturn.replace(
          '</head>',
          '<meta name="title" content="Your App Title">\\n</head>'
        );
      }`
    : '';

  if (ew_mode === 'edge_fallback') {
    return `// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Worker — Edge Fallback (headers only, no HTML injection)
// ─────────────────────────────────────────────────────────────────────────────
// Configure ORIGIN_URL as a Worker env variable in your Cloudflare dashboard.

const ORIGIN_URL = '${origin}'; // fallback if env var not set

export default {
  async fetch(request, env) {
    const origin = env.ORIGIN_URL || ORIGIN_URL;
    const url = new URL(request.url);
    const targetUrl = new URL(url.pathname + url.search, origin);

    const originResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    const newHeaders = new Headers(originResponse.headers);
${secHeadersCode}${cacheHeaderCode}

    return new Response(originResponse.body, {
      status: originResponse.status,
      headers: newHeaders,
    });
  },
};`;
  }

  const injectVar = ew_mode === 'html_inject' ? `  const bannerHtml = ${bannerSnippet};` : `  const scriptHtml = ${scriptSnippet};`;
  const injectLogic = ew_mode === 'html_inject'
    ? `
      // Inject banner container after <body> (idempotent via marker)
      if (!html.includes('<!-- b44-injected -->')) {
        htmlToReturn = htmlToReturn.replace(
          /<body([^>]*)>/i,
          '<body$1>\\n<!-- b44-injected -->\\n' + bannerHtml
        );
      }`
    : `
      // Inject script loader before </body> (idempotent via marker)
      if (!html.includes('b44-health-loader')) {
        htmlToReturn = htmlToReturn.replace('</body>', scriptHtml + '\\n</body>');
      }`;

  return `// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Worker — ${ew_mode === 'html_inject' ? 'HTML Inject' : 'Script Inject'} Mode
// ─────────────────────────────────────────────────────────────────────────────
// ⚠ WARNING: Uses full HTML buffering. Not compatible with streaming/SSR origins.
// ⚠ For streaming origins, use Edge Fallback mode or inject at build time instead.
//
// Set ORIGIN_URL as a Worker environment variable in your Cloudflare dashboard.
// ─────────────────────────────────────────────────────────────────────────────

const ORIGIN_URL = '${origin}'; // fallback if env var not set

export default {
  async fetch(request, env) {
    const origin = env.ORIGIN_URL || ORIGIN_URL;
    const url = new URL(request.url);
    const targetUrl = new URL(url.pathname + url.search, origin);

    // Proxy request to origin
    const originResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    const contentType = originResponse.headers.get('Content-Type') || '';

    // Only modify text/html responses — pass everything else through untouched
    if (!contentType.includes('text/html')) {
      return originResponse;
    }

    // Buffer the HTML body
    const html = await originResponse.text();
    let htmlToReturn = html;

${injectVar}
${injectLogic}
${metaSnippet}

    const newHeaders = new Headers(originResponse.headers);
${secHeadersCode}${cacheHeaderCode}

    return new Response(htmlToReturn, {
      status: originResponse.status,
      headers: newHeaders,
    });
  },
};`;
}

function buildWranglerToml({ app_name, ew_origin_url }) {
  return `# wrangler.toml — Cloudflare Worker configuration
# Docs: https://developers.cloudflare.com/workers/wrangler/configuration/

name = "${(app_name || 'my-app').toLowerCase().replace(/\s+/g, '-')}-edge-worker"
main = "worker.js"
compatibility_date = "2024-01-01"

# ─── Environment variables ────────────────────────────────────────────────────
# Set secret values using: wrangler secret put ORIGIN_URL
# Or configure them in Cloudflare Dashboard → Workers → Settings → Variables

[vars]
ORIGIN_URL = "${ew_origin_url || 'https://your-origin.pages.dev'}"
# Add any other non-secret env vars here

# ─── Routes ──────────────────────────────────────────────────────────────────
# Uncomment and fill in your domain:
# [[routes]]
# pattern = "yourdomain.com/*"
# zone_name = "yourdomain.com"

# ─── Limits (optional) ───────────────────────────────────────────────────────
# [limits]
# cpu_ms = 50  # default is 10ms for free plan`;
}

// ── Outage Banner Kit (Step 5) ────────────────────────────────────────────────

export function generateOutageBanner(profile) {
  const {
    banner_interval_ms = 30000,
    banner_fail_threshold = 3,
    banner_success_threshold = 2,
    banner_text = 'We are currently experiencing platform issues. Some features may be unavailable.',
    banner_bg = '#f59e0b',
    banner_health_endpoint = '/api/platform-health',
  } = profile;

  const interval = Number(banner_interval_ms) || 30000;
  const failT = Number(banner_fail_threshold) || 3;
  const successT = Number(banner_success_threshold) || 2;

  return {
    reactHook: buildReactHook({ interval, failT, successT, banner_health_endpoint }),
    reactComponent: buildReactComponent({ banner_text, banner_bg }),
    vanillaJs: buildVanillaJs({ interval, failT, successT, banner_health_endpoint, banner_text, banner_bg }),
  };
}

function buildReactHook({ interval, failT, successT, banner_health_endpoint }) {
  return `// usePlatformHealth.js
// Place in: src/hooks/usePlatformHealth.js (or any hooks folder)
// Usage:    const { isDown } = usePlatformHealth();

import { useState, useEffect, useRef } from 'react';

const ENDPOINT = '${banner_health_endpoint}';
const INTERVAL_MS = ${interval};
const FAIL_THRESHOLD = ${failT};   // show banner after N consecutive failures
const SUCCESS_THRESHOLD = ${successT}; // hide banner after N consecutive successes

export function usePlatformHealth({
  intervalMs = INTERVAL_MS,
  failThreshold = FAIL_THRESHOLD,
  successThreshold = SUCCESS_THRESHOLD,
} = {}) {
  const [isDown, setIsDown] = useState(false);
  const failCount = useRef(0);
  const successCount = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(ENDPOINT, { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;

        if (data.ok) {
          failCount.current = 0;
          successCount.current += 1;
          if (successCount.current >= successThreshold) setIsDown(false);
        } else {
          successCount.current = 0;
          failCount.current += 1;
          if (failCount.current >= failThreshold) setIsDown(true);
        }
      } catch (_) {
        if (cancelled) return;
        successCount.current = 0;
        failCount.current += 1;
        if (failCount.current >= failThreshold) setIsDown(true);
      }
    }

    poll(); // immediate first check
    const id = setInterval(poll, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [intervalMs, failThreshold, successThreshold]);

  return { isDown };
}`;
}

function buildReactComponent({ banner_text, banner_bg }) {
  return `// OutageBanner.jsx
// Place this at the very top of your root layout or App shell.
// It renders nothing when the platform is healthy.
//
// Example usage in Layout.jsx:
//   import OutageBanner from './OutageBanner';
//   ...
//   return (
//     <>
//       <OutageBanner />
//       <nav>...</nav>
//       {children}
//     </>
//   );

import React from 'react';
import { usePlatformHealth } from './usePlatformHealth'; // adjust path as needed

const BANNER_TEXT = '${banner_text}';
const BANNER_BG = '${banner_bg}';

// Pass forceShow={true} during local testing to bypass polling
export default function OutageBanner({ forceShow = false }) {
  const { isDown } = usePlatformHealth();

  if (!isDown && !forceShow) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: BANNER_BG,
        color: '#000',
        textAlign: 'center',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.4',
      }}
    >
      {BANNER_TEXT}
    </div>
  );
}`;
}

function buildVanillaJs({ interval, failT, successT, banner_health_endpoint, banner_text, banner_bg }) {
  return `// outage-banner.js — Vanilla JS self-contained outage banner
// No build step required. Drop this before </body> or inject via Edge Worker.
//
// Debug override: set window.__b44_forceDown = true in DevTools console
// to immediately show the banner without waiting for poll cycles.

(function () {
  var ENDPOINT = '${banner_health_endpoint}';
  var INTERVAL_MS = ${interval};
  var FAIL_THRESHOLD = ${failT};
  var SUCCESS_THRESHOLD = ${successT};
  var BANNER_TEXT = '${banner_text}';
  var BANNER_BG = '${banner_bg}';
  var BANNER_ID = 'b44-outage-banner';

  var failCount = 0;
  var successCount = 0;

  function getBanner() {
    return document.getElementById(BANNER_ID);
  }

  function createBanner() {
    var existing = getBanner();
    if (existing) return existing;
    var el = document.createElement('div');
    el.id = BANNER_ID;
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'right:0',
      'z-index:9999',
      'background:' + BANNER_BG,
      'color:#000',
      'text-align:center',
      'padding:10px 16px',
      'font-size:14px',
      'font-weight:500',
      'line-height:1.4',
      'display:none',
    ].join(';');
    el.textContent = BANNER_TEXT;
    document.body.insertBefore(el, document.body.firstChild);
    return el;
  }

  function showBanner() {
    var el = createBanner();
    el.style.display = 'block';
  }

  function hideBanner() {
    var el = getBanner();
    if (el) el.style.display = 'none';
  }

  function poll() {
    // Debug override
    if (window.__b44_forceDown) { showBanner(); return; }

    fetch(ENDPOINT, { cache: 'no-store' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.ok) {
          failCount = 0;
          successCount++;
          if (successCount >= SUCCESS_THRESHOLD) hideBanner();
        } else {
          successCount = 0;
          failCount++;
          if (failCount >= FAIL_THRESHOLD) showBanner();
        }
      })
      .catch(function () {
        successCount = 0;
        failCount++;
        if (failCount >= FAIL_THRESHOLD) showBanner();
      });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { poll(); setInterval(poll, INTERVAL_MS); });
  } else {
    poll();
    setInterval(poll, INTERVAL_MS);
  }
})();`;
}

// ── Legacy full outputs (Step 6) ─────────────────────────────────────────────

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