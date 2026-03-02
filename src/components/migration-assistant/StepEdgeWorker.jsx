import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { generateEdgeWorker } from './generator';

// ── Shared helpers ───────────────────────────────────────────────────────────

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#73e28a]" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ title, content, lang }) {
  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700">
        <span className="text-slate-300 text-xs font-medium">{title}</span>
        <div className="flex items-center gap-2">
          {lang && <span className="text-slate-500 text-xs">{lang}</span>}
          <CopyBtn text={content} />
        </div>
      </div>
      <pre className="p-4 text-sm text-slate-200 overflow-x-auto leading-relaxed bg-slate-900 font-mono whitespace-pre">{content}</pre>
    </div>
  );
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-800/60 hover:bg-slate-800 transition-colors"
      >
        <span className="text-white font-semibold text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 py-5 bg-slate-900 space-y-4">{children}</div>}
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, hint }) {
  return (
    <div>
      <label className="text-slate-300 text-xs font-medium block mb-1.5">{label}</label>
      <input
        type="text"
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a]"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ label, enabled, onToggle, hint }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className={`mt-0.5 w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${enabled ? 'bg-[#73e28a]' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      <div>
        <span className="text-slate-300 text-sm">{label}</span>
        {hint && <p className="text-slate-500 text-xs mt-0.5">{hint}</p>}
      </div>
    </label>
  );
}

const MODES = [
  { id: 'html_inject', label: 'HTML Inject', desc: 'Inject banner container <div> immediately after <body>' },
  { id: 'script_inject', label: 'Script Inject', desc: 'Inject <script> that polls /api/platform-health and toggles banner' },
  { id: 'edge_fallback', label: 'Edge Fallback', desc: 'Proxy with security/cache headers only — no HTML injection' },
];

const SETUP_STEPS = [
  { step: 1, text: 'Go to Cloudflare Dashboard → Workers & Pages → Create application → Worker' },
  { step: 2, text: 'Paste the generated Worker script and click Save & Deploy' },
  { step: 3, text: 'Add your ORIGIN_URL as a Worker environment variable (Settings → Variables)' },
  { step: 4, text: 'Add a Route under Workers → Routes: yourdomain.com/* → assign this Worker' },
  { step: 5, text: 'Confirm your DNS A/CNAME record is proxied (orange cloud) in Cloudflare' },
  { step: 6, text: 'Test: curl -I https://yourdomain.com and inspect response headers' },
  { step: 7, text: 'Optionally set a custom domain in Workers → Triggers → Custom Domains' },
];

// ── Main Step ────────────────────────────────────────────────────────────────

export default function StepEdgeWorker({ profile, onChange }) {
  const [mode, setMode] = useState(profile.ew_mode || 'html_inject');
  const [originUrl, setOriginUrl] = useState(profile.ew_origin_url || profile.frontend_domain || '');
  const [injectBanner, setInjectBanner] = useState(profile.ew_inject_banner !== false);
  const [injectScript, setInjectScript] = useState(profile.ew_inject_script !== false);
  const [securityHeaders, setSecurityHeaders] = useState(profile.ew_security_headers !== false);
  const [cacheHeaders, setCacheHeaders] = useState(profile.ew_cache_headers !== false);
  const [metaTags, setMetaTags] = useState(profile.ew_meta_tags || false);

  const sync = (patch) => {
    onChange({
      ew_mode: mode,
      ew_origin_url: originUrl,
      ew_inject_banner: injectBanner,
      ew_inject_script: injectScript,
      ew_security_headers: securityHeaders,
      ew_cache_headers: cacheHeaders,
      ew_meta_tags: metaTags,
      ...patch,
    });
  };

  const handle = (setter, key) => (v) => { setter(v); sync({ [key]: v }); };

  const ewProfile = {
    ...profile,
    ew_mode: mode,
    ew_origin_url: originUrl,
    ew_inject_banner: injectBanner,
    ew_inject_script: injectScript,
    ew_security_headers: securityHeaders,
    ew_cache_headers: cacheHeaders,
    ew_meta_tags: metaTags,
  };

  const outputs = generateEdgeWorker(ewProfile);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Edge Worker</h2>
        <p className="text-slate-400 text-sm mt-1">
          Generate a Cloudflare Worker that proxies your origin, optionally injects a banner/script into HTML responses, and adds security headers. Non-HTML responses are always passed through untouched.
        </p>
      </div>

      {/* Config */}
      <Section title="A) Configuration">
        <FieldInput
          label="Origin URL (your existing frontend or CDN URL)"
          value={originUrl}
          onChange={v => { setOriginUrl(v); sync({ ew_origin_url: v }); }}
          placeholder="https://your-origin.pages.dev"
          hint="The Worker will proxy all requests to this URL. Must be accessible from Cloudflare's edge."
        />

        <div>
          <label className="text-slate-300 text-xs font-medium block mb-2">Inject Mode</label>
          <div className="space-y-2">
            {MODES.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => { setMode(m.id); sync({ ew_mode: m.id }); }}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  mode === m.id
                    ? 'border-[#73e28a] bg-[#73e28a]/5 text-white'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <span className={`text-sm font-medium block ${mode === m.id ? 'text-[#73e28a]' : ''}`}>{m.label}</span>
                <span className="text-xs text-slate-500 mt-0.5 block">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Feature toggles</p>
          {mode === 'html_inject' && (
            <Toggle
              label="Outage banner container"
              enabled={injectBanner}
              onToggle={handle(setInjectBanner, 'ew_inject_banner')}
              hint='Injects <div id="b44-banner" hidden> immediately after <body>. Banner is shown/hidden by your JS.'
            />
          )}
          {mode === 'script_inject' && (
            <Toggle
              label="Inject script loader"
              enabled={injectScript}
              onToggle={handle(setInjectScript, 'ew_inject_script')}
              hint="Injects a self-contained <script> that polls /api/platform-health and shows/hides the banner."
            />
          )}
          <Toggle
            label="Security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)"
            enabled={securityHeaders}
            onToggle={handle(setSecurityHeaders, 'ew_security_headers')}
            hint="Safe, non-breaking defaults. Review CSP carefully for your app's external resources."
          />
          <Toggle
            label="Cache-Control headers"
            enabled={cacheHeaders}
            onToggle={handle(setCacheHeaders, 'ew_cache_headers')}
            hint="Sets Cache-Control: public, max-age=3600, s-maxage=3600 on HTML. Adjust as needed."
          />
          <Toggle
            label="Meta tag placeholders (title + description)"
            enabled={metaTags}
            onToggle={handle(setMetaTags, 'ew_meta_tags')}
            hint="Injects placeholder <meta> tags if none are present. Useful for SEO baseline."
          />
        </div>
      </Section>

      {/* Worker script */}
      <Section title="B) Generated Cloudflare Worker Script">
        <CodeBlock title="worker.js — Cloudflare Worker" content={outputs.workerScript} lang="javascript" />
      </Section>

      {/* wrangler.toml */}
      <Section title="C) wrangler.toml Example" defaultOpen={false}>
        <p className="text-slate-400 text-sm">Paste this at the root of your Worker project. Fill in the placeholders.</p>
        <CodeBlock title="wrangler.toml" content={outputs.wranglerToml} lang="toml" />
      </Section>

      {/* Setup checklist */}
      <Section title="D) Setup Checklist" defaultOpen={false}>
        <ol className="space-y-2">
          {SETUP_STEPS.map(s => (
            <li key={s.step} className="flex items-start gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs flex items-center justify-center font-bold">{s.step}</span>
              <span className="text-slate-300 pt-0.5">{s.text}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Warnings */}
      <Section title="⚠ Edge Cases & Warnings" defaultOpen={false}>
        <div className="space-y-3">
          {[
            {
              title: 'Streaming / SSR responses',
              body: 'If your origin streams a response (chunked transfer encoding), buffering the entire body via response.text() will break streaming. This Worker uses full buffering — only suitable for non-streaming origins. If you use SSR with streaming (e.g. React 18 streaming), use Edge Fallback mode or inject at the build step instead.',
            },
            {
              title: 'Double-injection prevention',
              body: 'The Worker checks for the marker string <!-- b44-injected --> before injecting. If the marker is already present, no injection occurs. This prevents double-injection on hot-reload or cached responses.',
            },
            {
              title: 'Large HTML responses',
              body: 'Cloudflare Workers have a 128 MB memory limit. For very large HTML pages, buffering may approach this limit. Consider using HTMLRewriter (Cloudflare-specific) for production use — it streams without full buffering.',
            },
            {
              title: 'CSP (Content-Security-Policy)',
              body: "The generated CSP is a safe starting point but may block resources your app loads (e.g. external fonts, analytics, Stripe). Test in Report-Only mode first. Open DevTools → Console and look for CSP violation errors.",
            },
            {
              title: 'Origin authentication / signed requests',
              body: 'If your origin requires auth headers or secret tokens, add them to the Worker env vars and forward them in the proxied request headers — do not hardcode secrets in the Worker script.',
            },
          ].map(w => (
            <div key={w.title} className="bg-amber-400/5 border border-amber-400/20 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-amber-400 text-xs font-semibold">{w.title}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{w.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}