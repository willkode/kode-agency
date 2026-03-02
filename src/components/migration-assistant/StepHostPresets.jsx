import React, { useState } from 'react';
import { Copy, Check, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { generateHostPresets } from './generator';

// ── Shared helpers ──────────────────────────────────────────────────────────

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

// ── A) SPA Config Panel ─────────────────────────────────────────────────────

function SPAConfigPanel({ outputs }) {
  return (
    <Section title="A) SPA Rewrite Config">
      <p className="text-slate-400 text-sm">All client-side routes must fall back to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs">/index.html</code>. Copy the snippet matching your host.</p>
      {outputs.map(o => (
        <CodeBlock key={o.title} title={o.title} content={o.content} lang={o.lang} />
      ))}
    </Section>
  );
}

// ── B) Env Vars Panel ───────────────────────────────────────────────────────

function EnvVarsPanel({ envVars, keyOverrides, onOverrideChange, profile }) {
  const resolvedKeys = envVars.map(v => ({ ...v, resolvedKey: keyOverrides[v.key] || v.key }));

  const dotEnvContent = resolvedKeys
    .map(v => `${v.resolvedKey}=${v.example}`)
    .join('\n');

  return (
    <Section title="B) Environment Variable Checklist">
      <p className="text-slate-400 text-sm">
        Set these in your hosting dashboard. Rename keys below to match your app's variable names. <strong className="text-slate-300">Never commit real values.</strong>
      </p>

      {/* Rename table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Default Key</th>
              <th className="text-left px-4 py-3 font-medium">Your Key Name</th>
              <th className="text-left px-4 py-3 font-medium">Example Value</th>
              <th className="text-left px-4 py-3 font-medium">Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {resolvedKeys.map(v => (
              <tr key={v.key} className="bg-slate-900 hover:bg-slate-800/40">
                <td className="px-4 py-3 font-mono text-xs text-slate-300">{v.key}</td>
                <td className="px-4 py-2">
                  <input
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a]"
                    value={keyOverrides[v.key] || v.key}
                    onChange={e => onOverrideChange(v.key, e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400 truncate max-w-xs">{v.example}</td>
                <td className="px-4 py-3">
                  {v.required
                    ? <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">Required</span>
                    : <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-xs font-medium">Optional</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* .env.example output */}
      <CodeBlock title=".env.example" content={dotEnvContent} lang="dotenv" />
    </Section>
  );
}

// ── C) Auth Callback Panel ──────────────────────────────────────────────────

function AuthCallbackPanel({ profile, domains, onDomainsChange }) {
  const domainList = domains.split('\n').map(d => d.trim()).filter(Boolean);

  const callbackList = domainList.flatMap(d => {
    const base = d.replace(/\/$/, '');
    return [
      `${base}/auth/callback`,
      `${base}/auth/login`,
      `${base}/auth/logout`,
    ];
  });

  const formattedList = callbackList.join('\n');

  return (
    <Section title="C) Auth Callback URLs">
      <p className="text-slate-400 text-sm">
        Enter each domain your app will run on (one per line). Copy the generated list into your Base44 dashboard under <strong className="text-slate-300">Auth → Allowed Redirect URLs</strong>.
      </p>

      <div>
        <label className="text-slate-300 text-xs font-medium block mb-1.5">Your domain(s) — one per line</label>
        <textarea
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a] resize-none"
          placeholder={`https://app.yourdomain.com\nhttps://yourdomain.com`}
          value={domains}
          onChange={e => onDomainsChange(e.target.value)}
        />
      </div>

      {callbackList.length > 0 && (
        <CodeBlock title="Paste into Auth Provider → Allowed Redirect URLs" content={formattedList} lang="text" />
      )}
    </Section>
  );
}

// ── Main Step ───────────────────────────────────────────────────────────────

export default function StepHostPresets({ profile, onChange }) {
  const [keyOverrides, setKeyOverrides] = useState({});
  const [authDomains, setAuthDomains] = useState(profile.frontend_domain || '');

  const presets = generateHostPresets(profile);

  const handleKeyOverride = (originalKey, newKey) => {
    setKeyOverrides(prev => ({ ...prev, [originalKey]: newKey }));
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-profile-${profile.project_name || profile.app_name || 'app'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Host Presets</h2>
          <p className="text-slate-400 text-sm mt-1">
            Platform-specific SPA configs, env var checklist, and auth callback URLs — all copy-paste ready.
          </p>
        </div>
        <button
          onClick={handleDownloadJSON}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-[#73e28a] text-[#73e28a] hover:bg-[#73e28a]/10 text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Profile JSON
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-[#73e28a]/10 border border-[#73e28a]/30 text-[#73e28a] text-xs font-medium">
          {profile.hosting_target?.toUpperCase() || 'NO HOST SELECTED'}
        </span>
        {profile.project_name && <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">{profile.project_name}</span>}
        {profile.framework && <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">{profile.framework}</span>}
      </div>

      <SPAConfigPanel outputs={presets.spaConfigs} />
      <EnvVarsPanel
        envVars={presets.envVars}
        keyOverrides={keyOverrides}
        onOverrideChange={handleKeyOverride}
        profile={profile}
      />
      <AuthCallbackPanel
        profile={profile}
        domains={authDomains}
        onDomainsChange={setAuthDomains}
      />
    </div>
  );
}