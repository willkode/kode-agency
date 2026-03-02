import React, { useState } from 'react';
import { ChevronDown, AlertCircle, Zap, Lock } from 'lucide-react';

const FAILURE_MODES = [
  {
    id: 'spa_404',
    title: 'SPA Refresh Returns 404',
    icon: AlertCircle,
    symptoms: [
      'Direct URL navigation works initially',
      'Page refresh returns 404 error',
      'Browser back button fails on non-root routes',
      'Bookmarked URLs return 404'
    ],
    cause: 'SPA routing rewrites not configured. Server is trying to serve physical files instead of falling back to /index.html.',
    fixSteps: [
      'Nginx: Add `try_files $uri $uri/ /index.html;` in location block',
      'Vercel: Add rewrite rule for `/((?!api/).*) → /index.html`',
      'Netlify: Add `[[redirects]]` rule `from = "/*"` to `to = "/index.html"` with `status = 200`',
      'Cloudflare Pages: Add `_redirects` file with `/* /index.html 200`',
      'Ensure static assets (.js, .css, images) are excluded from the rewrite'
    ],
    verify: [
      'Navigate to a route like /dashboard',
      'Refresh the page — should load successfully',
      'Check browser DevTools Network tab — initial request should return /index.html with 200 status',
      'Verify assets (.js, .css) are still loaded with correct 200 status'
    ]
  },
  {
    id: 'login_redirect_loop',
    title: 'Login Redirect Loop',
    icon: Zap,
    symptoms: [
      'Clicking login button redirects infinitely',
      'Browser stuck in redirect loop',
      'Console shows repeated 302/301 redirects',
      'User never reaches login page'
    ],
    cause: 'OAuth callback URL does not match configured redirect URI in auth provider (Base44, OAuth service). Server sends user back to login instead of app.',
    fixSteps: [
      'Get your frontend domain (e.g., https://app.yourdomain.com)',
      'In Base44 dashboard, update OAuth callback URL to: `https://app.yourdomain.com/auth/callback`',
      'Ensure protocol (https vs http) matches exactly',
      'Remove trailing slashes from callback URL',
      'If using multiple domains, register all callback URLs',
      'Clear browser cache and cookies before testing'
    ],
    verify: [
      'Open DevTools > Network tab',
      'Click login button',
      'Track redirect chain — should end at login page, not redirect again',
      'After login, should redirect to app (not repeat login flow)',
      'Console should show no CORS or redirect errors'
    ]
  },
  {
    id: 'cors_health_endpoint',
    title: 'CORS Blocked for Health Endpoint',
    icon: Lock,
    symptoms: [
      'Browser console: "Access to XMLHttpRequest blocked by CORS policy"',
      'Health check requests fail with 0 status',
      'Network tab shows CORS error, not 200/500',
      'Outage banner never appears (health check silently fails)'
    ],
    cause: 'Frontend calls health endpoint directly from browser. Backend does not allow cross-origin requests. Solution: use a proxy (worker or middleware).',
    fixSteps: [
      'Instead of direct frontend → health endpoint, use: frontend → edge worker/proxy → backend health',
      'Proxy adds CORS headers and forwards request securely',
      'In Cloudflare: Create worker that proxies request and adds `Access-Control-Allow-Origin: *`',
      'In Nginx: Add location block `/health-proxy` that proxies to backend and adds CORS headers',
      'Update frontend health hook to call proxy endpoint, not direct backend URL'
    ],
    verify: [
      'Frontend health polling request should return 200 from proxy',
      'Browser DevTools > Network: health request shows 200 status, no CORS error',
      'Response headers include `Access-Control-Allow-Origin`',
      'Outage banner appears when backend health is degraded'
    ]
  },
  {
    id: 'worker_double_injection',
    title: 'Worker Double-Injecting Scripts/HTML',
    icon: AlertCircle,
    symptoms: [
      'Outage banner appears twice on page',
      'Scripts load multiple times (console warns about duplicates)',
      'Page content is duplicated or malformed',
      'Browser console shows duplicate script execution'
    ],
    cause: 'Edge worker is missing injection marker. HTML body is rewritten multiple times, each adding the script again.',
    fixSteps: [
      'Add a marker comment before injection: `<!-- injected-marker -->`',
      'Check if marker exists before injecting:',
      '  `if (html.includes("<!-- injected-marker -->")) return response;`',
      'Place marker at the end of your injected HTML/script block',
      'Test worker in staging before deploying to production',
      'Use Wrangler tail to inspect actual HTML being modified'
    ],
    verify: [
      'View page source (Ctrl+U / Cmd+U)',
      'Search for injected script/banner — should appear exactly once',
      'Banner renders only once on page',
      'Browser console shows no duplicate script warnings'
    ]
  },
  {
    id: 'html_injection_format_break',
    title: 'HTML Injection Breaks Due to Unexpected Body Formatting',
    icon: AlertCircle,
    symptoms: [
      'Page renders but outage banner is malformed or hidden',
      'HTML structure is broken after injection',
      'Styles do not apply to injected banner',
      'Banner text appears but styling is missing'
    ],
    cause: 'Injected HTML assumes specific `<body>` structure (e.g., single root div, specific spacing). Real HTML varies (multiple root divs, frameworks like Next.js, custom structures).',
    fixSteps: [
      'Inject before closing `</body>` tag (safest location)',
      'Use robust regex: `html.replace(/<\\/body>/i, injected + "</body>")`',
      'Ensure injected styles are scoped (use unique class names like `__ka-outage-banner`)',
      'Avoid assuming `<div id="root">` exists — inject at body level',
      'Test on different build outputs (Vite, Webpack, Next.js)',
      'Include critical CSS inline in the injected script'
    ],
    verify: [
      'Inject on sample pages with different structures',
      'Banner appears with correct styles on Vite, Next.js, Webpack builds',
      'Page layout is not affected by injection',
      'DevTools Inspector shows injected HTML at correct location'
    ]
  },
  {
    id: 'cached_outage_state',
    title: 'Cached Outage State Not Updating',
    icon: Zap,
    symptoms: [
      'Outage banner stays visible after service recovers',
      'Browser is served stale health endpoint response',
      'Page requires hard refresh to update banner',
      'Service is up but banner shows "down"'
    ],
    cause: 'Browser or CDN cached the health endpoint response or injected HTML with long cache headers.',
    fixSteps: [
      'Health endpoint should return `Cache-Control: no-cache, no-store, must-revalidate`',
      'Set short max-age if caching needed: `Cache-Control: max-age=30` (30 seconds)',
      'Ensure edge worker does not cache health proxy response',
      'In Wrangler config: set `cache_ttl = 0` for health endpoints',
      'Nginx: Add `add_header Cache-Control "no-cache, no-store";` to health location',
      'Frontend polling should use `fetch(..., { cache: "no-store" })`'
    ],
    verify: [
      'Trigger a fake outage (stop backend temporarily)',
      'Banner appears within 30 seconds',
      'Recover the backend',
      'Banner disappears within 30 seconds (not longer)',
      'DevTools Network tab shows 200 response with no-cache headers'
    ]
  },
  {
    id: 'health_endpoint_timeout',
    title: 'Health Endpoint Timing Out',
    icon: AlertCircle,
    symptoms: [
      'Health checks hang indefinitely',
      'Outage banner only shows after very long delay',
      'Browser appears frozen during health check',
      'Network tab shows pending request that never completes'
    ],
    cause: 'Health endpoint timeout is too high (waiting forever) or too low (timing out prematurely). Backend health checks are slow or unresponsive.',
    fixSteps: [
      'Set frontend health check timeout to 5-10 seconds (catch hangs early)',
      'Set backend health endpoint timeout to 2-3 seconds (internal deadline)',
      'Use AbortController in frontend: `const controller = new AbortController(); setTimeout(() => controller.abort(), 10000);`',
      'In Nginx/Vercel: set upstream timeout to 5s: `proxy_read_timeout 5s;`',
      'Ensure backend health endpoint responds quickly (avoid deep DB queries)',
      'Log slow health checks to diagnose bottlenecks'
    ],
    verify: [
      'Simulate slow backend: add 2s delay to health endpoint',
      'Frontend should timeout after ~10s, show banner',
      'Banner disappears when backend recovers',
      'No browser freeze or UI hang during check',
      'Logs show health check roundtrip time < 5s'
    ]
  }
];

export default function FailureModesGuide() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-3">Common Failure Modes</h2>
        <p className="text-slate-400">
          Troubleshooting guide for deployment and health check issues. Each section includes symptoms, root causes, fix steps, and verification.
        </p>
      </div>

      <div className="space-y-3">
        {FAILURE_MODES.map((mode) => {
          const Icon = mode.icon;
          const isExpanded = expandedId === mode.id;

          return (
            <div
              key={mode.id}
              className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-colors hover:border-slate-700"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : mode.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left flex-1">
                  <Icon className="w-5 h-5 text-[#73e28a] flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-white">{mode.title}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-6 py-4 border-t border-slate-800 space-y-6 bg-slate-800/30">
                  {/* Symptoms */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#73e28a] mb-3 uppercase tracking-wider">
                      Symptoms
                    </h4>
                    <ul className="space-y-2">
                      {mode.symptoms.map((symptom, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-3">
                          <span className="text-[#73e28a] mt-0.5">•</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cause */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#73e28a] mb-3 uppercase tracking-wider">
                      Likely Cause
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{mode.cause}</p>
                  </div>

                  {/* Fix Steps */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#73e28a] mb-3 uppercase tracking-wider">
                      Fix Steps
                    </h4>
                    <ol className="space-y-2">
                      {mode.fixSteps.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-3">
                          <span className="text-[#73e28a] font-semibold flex-shrink-0">
                            {i + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Verification */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#73e28a] mb-3 uppercase tracking-wider">
                      How to Verify Fix
                    </h4>
                    <ul className="space-y-2">
                      {mode.verify.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-3">
                          <span className="text-[#73e28a] mt-0.5">✓</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#73e28a] flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Security Notes</h3>
            <div className="space-y-3">
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">
                  🔒 Never expose secrets in frontend code
                </p>
                <p className="text-slate-400 text-sm">
                  API keys, tokens, and database credentials should never be hardcoded in JavaScript or HTML. Use environment variables with secure backend proxies instead.
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">
                  🔒 Prefer server/worker for upstream calls
                </p>
                <p className="text-slate-400 text-sm">
                  Direct frontend-to-backend calls expose your infrastructure. Use edge workers, proxies, or API gateways to mask internal URLs and add authentication layers.
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">
                  🔒 Validate health endpoint responses
                </p>
                <p className="text-slate-400 text-sm">
                  Never trust health endpoint responses from untrusted sources. Validate response format, types, and signatures before updating UI state.
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">
                  🔒 Use HTTPS only
                </p>
                <p className="text-slate-400 text-sm">
                  All health checks, proxies, and API calls must use HTTPS. HTTP exposes credentials and state in transit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}