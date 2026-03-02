import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, AlertTriangle, Eye } from 'lucide-react';
import { generateOutageBanner } from './generator';

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

function FieldInput({ label, value, onChange, placeholder, type = 'text', hint }) {
  return (
    <div>
      <label className="text-slate-300 text-xs font-medium block mb-1.5">{label}</label>
      <input
        type={type}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a]"
        value={value}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
      />
      {hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}

// ── Banner Preview ────────────────────────────────────────────────────────────

function BannerPreview({ bannerText, bannerBg }) {
  const [visible, setVisible] = useState(true);
  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-300 text-xs font-medium">Banner Preview</span>
        </div>
        <button
          onClick={() => setVisible(v => !v)}
          className="text-xs px-2.5 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="bg-slate-950 p-6 min-h-[80px] flex items-center justify-center">
        {visible ? (
          <div
            className="w-full text-center py-2.5 px-4 rounded text-sm font-medium"
            style={{ backgroundColor: bannerBg || '#f59e0b', color: '#000' }}
          >
            {bannerText || 'We are currently experiencing platform issues. Some features may be unavailable.'}
          </div>
        ) : (
          <span className="text-slate-600 text-xs italic">Banner hidden (ok=true state)</span>
        )}
      </div>
    </div>
  );
}

// ── Main Step ────────────────────────────────────────────────────────────────

export default function StepOutageBanner({ profile, onChange }) {
  const [intervalMs, setIntervalMs] = useState(profile.banner_interval_ms || 30000);
  const [failThreshold, setFailThreshold] = useState(profile.banner_fail_threshold || 3);
  const [successThreshold, setSuccessThreshold] = useState(profile.banner_success_threshold || 2);
  const [bannerText, setBannerText] = useState(profile.banner_text || 'We are currently experiencing platform issues. Some features may be unavailable.');
  const [bannerBg, setBannerBg] = useState(profile.banner_bg || '#f59e0b');
  const [healthEndpoint, setHealthEndpoint] = useState(profile.banner_health_endpoint || '/api/platform-health');

  const sync = (patch) => {
    onChange({
      banner_interval_ms: intervalMs,
      banner_fail_threshold: failThreshold,
      banner_success_threshold: successThreshold,
      banner_text: bannerText,
      banner_bg: bannerBg,
      banner_health_endpoint: healthEndpoint,
      ...patch,
    });
  };

  const enriched = {
    ...profile,
    banner_interval_ms: intervalMs,
    banner_fail_threshold: failThreshold,
    banner_success_threshold: successThreshold,
    banner_text: bannerText,
    banner_bg: bannerBg,
    banner_health_endpoint: healthEndpoint,
  };

  const outputs = generateOutageBanner(enriched);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Outage Banner Kit</h2>
        <p className="text-slate-400 text-sm mt-1">
          Generate a React hook + component and a Vanilla JS snippet that poll your health endpoint and automatically show/hide a banner based on consecutive failure/success thresholds.
        </p>
      </div>

      {/* Config */}
      <Section title="A) Configuration">
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldInput
            label="Health endpoint"
            value={healthEndpoint}
            onChange={v => { setHealthEndpoint(v); sync({ banner_health_endpoint: v }); }}
            placeholder="/api/platform-health"
            hint="Relative path recommended — avoids CORS issues"
          />
          <FieldInput
            label="Poll interval (ms)"
            value={String(intervalMs)}
            onChange={v => { setIntervalMs(v); sync({ banner_interval_ms: v }); }}
            type="number"
            hint="30000 = poll every 30 seconds"
          />
          <FieldInput
            label="Failure threshold (consecutive failures to show banner)"
            value={String(failThreshold)}
            onChange={v => { setFailThreshold(v); sync({ banner_fail_threshold: v }); }}
            type="number"
            hint="Recommended: 3"
          />
          <FieldInput
            label="Success threshold (consecutive successes to hide banner)"
            value={String(successThreshold)}
            onChange={v => { setSuccessThreshold(v); sync({ banner_success_threshold: v }); }}
            type="number"
            hint="Recommended: 2 (prevents flicker)"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldInput
            label="Banner message"
            value={bannerText}
            onChange={v => { setBannerText(v); sync({ banner_text: v }); }}
            placeholder="We are currently experiencing platform issues..."
          />
          <div>
            <label className="text-slate-300 text-xs font-medium block mb-1.5">Banner background color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bannerBg}
                onChange={e => { setBannerBg(e.target.value); sync({ banner_bg: e.target.value }); }}
                className="w-10 h-10 rounded border border-slate-700 bg-slate-800 cursor-pointer"
              />
              <input
                type="text"
                value={bannerBg}
                onChange={e => { setBannerBg(e.target.value); sync({ banner_bg: e.target.value }); }}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#73e28a]"
              />
            </div>
          </div>
        </div>
        <BannerPreview bannerText={bannerText} bannerBg={bannerBg} />
      </Section>

      {/* React version */}
      <Section title="B) React: usePlatformHealth hook + OutageBanner component">
        <p className="text-slate-400 text-sm">
          Place <code className="bg-slate-800 px-1 py-0.5 rounded text-xs font-mono text-[#73e28a]">&lt;OutageBanner /&gt;</code> at the top of your root layout or App shell — above all other content so it always renders regardless of route.
        </p>
        <CodeBlock title="usePlatformHealth.js — React hook" content={outputs.reactHook} lang="javascript" />
        <CodeBlock title="OutageBanner.jsx — React component" content={outputs.reactComponent} lang="jsx" />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-400 space-y-1">
          <p className="font-medium text-slate-300">Where to place it:</p>
          <p>• In a layout wrapper: <span className="font-mono text-slate-300">Layout.jsx</span> → top of the returned JSX, before any nav or children</p>
          <p>• In an App shell: <span className="font-mono text-slate-300">AppShell.jsx</span> → first child inside the outer container div</p>
          <p>• In your root <span className="font-mono text-slate-300">App.jsx</span> → immediately inside the router provider, before route definitions</p>
        </div>
      </Section>

      {/* Vanilla JS version */}
      <Section title="C) Vanilla JS: self-contained snippet" defaultOpen={false}>
        <p className="text-slate-400 text-sm">
          Drop this into a <code className="bg-slate-800 px-1 py-0.5 rounded text-xs font-mono text-[#73e28a]">&lt;script&gt;</code> tag at the end of your <code className="bg-slate-800 px-1 py-0.5 rounded text-xs font-mono">&lt;body&gt;</code>, or inject it via the Edge Worker from Step 4.
        </p>
        <CodeBlock title="outage-banner.js — Vanilla JS" content={outputs.vanillaJs} lang="javascript" />
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-400 space-y-1">
          <p className="font-medium text-slate-300">Where to place it:</p>
          <p>• As a <span className="font-mono text-slate-300">&lt;script src="outage-banner.js"&gt;</span> just before <span className="font-mono">&lt;/body&gt;</span> in index.html</p>
          <p>• Or paste inline in a <span className="font-mono text-slate-300">&lt;script&gt;</span> block (no build step needed)</p>
          <p>• Or use the Edge Worker Script Inject mode from Step 4 to inject it automatically</p>
        </div>
      </Section>

      {/* Test outage guide */}
      <Section title="D) Test Outage Guide" defaultOpen={false}>
        <p className="text-slate-400 text-sm mb-2">
          Use one of these approaches to force <code className="bg-slate-800 px-1 py-0.5 rounded text-xs font-mono">/api/platform-health</code> to return <code className="bg-slate-800 px-1 py-0.5 rounded text-xs font-mono">ok: false</code> temporarily so you can verify the banner appears.
        </p>
        <div className="space-y-3">
          {[
            {
              title: 'Option 1 — Browser DevTools (easiest, no code changes)',
              steps: [
                'Open DevTools → Network tab',
                'Click the filter icon → "Block request URL"',
                `Add: ${healthEndpoint}`,
                `Wait for ${failThreshold} poll cycles (${Math.ceil(failThreshold * intervalMs / 1000)}s) — banner should appear`,
                'Remove the block to restore — banner hides after success threshold',
              ],
            },
            {
              title: 'Option 2 — Temporarily return ok: false from your endpoint',
              steps: [
                'Edit your /api/platform-health handler',
                'Force: return res.json({ ok: false, upstreamStatus: 503, latencyMs: 0, ts: new Date().toISOString() })',
                'Deploy and reload your app',
                `Wait ${failThreshold} poll cycles — banner appears`,
                'Revert the change and redeploy to restore',
              ],
            },
            {
              title: 'Option 3 — Console override (React / Vanilla, no deploy needed)',
              steps: [
                'Open DevTools → Console',
                'Run: window.__b44_forceDown = true (Vanilla JS snippet checks this)',
                'Or for React: add a debug prop <OutageBanner forceShow={true} /> temporarily',
                'Observe banner immediately — no polling needed',
                'Reload page to reset',
              ],
            },
          ].map(g => (
            <div key={g.title} className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-4">
              <p className="text-slate-200 text-sm font-medium mb-2">{g.title}</p>
              <ol className="space-y-1">
                {g.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-slate-600 font-mono w-4 flex-shrink-0">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-amber-400 text-xs font-semibold">Never merge forced-down state to production</span>
          </div>
          <p className="text-slate-400 text-xs">Always test in a local or staging environment. If you deploy Option 2 to production by mistake, all users will see the outage banner immediately.</p>
        </div>
      </Section>
    </div>
  );
}