import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { generateHealthSystem } from './generator.js';

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
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}

// ── A) Backend Function Panel ────────────────────────────────────────────────

function BackendFunctionPanel({ outputs, deepEnabled, onToggleDeep }) {
  return (
    <Section title="A) Base44 Backend Function Templates">
      <p className="text-slate-400 text-sm">
        Deploy these as Base44 backend functions. Follow the inline instructions and adjust <span className="bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-amber-400">PLACEHOLDER</span> sections before deploying.
      </p>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            type="button"
            onClick={() => onToggleDeep(!deepEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative ${deepEnabled ? 'bg-[#73e28a]' : 'bg-slate-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${deepEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-slate-300 text-sm">Enable deep health check (DB connectivity)</span>
        </label>
      </div>
      {deepEnabled && (
        <p className="text-amber-400/80 text-xs bg-amber-400/5 border border-amber-400/20 rounded-lg px-3 py-2">
          Deep mode adds a DB connectivity check. You must replace the PLACEHOLDER block with your actual entity query before deploying.
        </p>
      )}
      <CodeBlock title="health_ping — Base44 Function" content={outputs.backendPing} lang="javascript" />
    </Section>
  );
}

// ── B) Platform Health Endpoint Panel ────────────────────────────────────────

const RUNTIMES = [
  { id: 'express', label: 'Express (Node)' },
  { id: 'nextjs', label: 'Next.js API Route' },
  { id: 'cloudflare', label: 'Cloudflare Worker' },
  { id: 'any', label: 'Any server (pseudo-code)' },
];

function PlatformHealthPanel({ outputs, runtime, onRuntimeChange, pingUrl, onPingUrlChange, timeoutMs, onTimeoutChange }) {
  return (
    <Section title="B) /api/platform-health Endpoint Template">
      <p className="text-slate-400 text-sm">
        Deploy this on your own server/edge. It calls your Base44 <code className="bg-slate-800 px-1 py-0.5 rounded text-xs">health_ping</code> function, measures latency, and returns a unified JSON response. Includes caching and rate-limiting guidance inline.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldInput
          label="health_ping URL (your deployed function URL)"
          value={pingUrl}
          onChange={onPingUrlChange}
          placeholder="https://api.base44.com/api/apps/YOUR_APP_ID/health_ping"
          hint="Find this in Base44 dashboard → Code → Functions → health_ping → URL"
        />
        <FieldInput
          label="Request timeout (ms)"
          value={String(timeoutMs)}
          onChange={v => onTimeoutChange(Number(v) || 2500)}
          placeholder="2500"
          type="number"
        />
      </div>
      <div>
        <label className="text-slate-300 text-xs font-medium block mb-2">Runtime</label>
        <div className="flex flex-wrap gap-2">
          {RUNTIMES.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRuntimeChange(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                runtime === r.id
                  ? 'bg-[#73e28a]/10 border-[#73e28a] text-[#73e28a]'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <CodeBlock title={`/api/platform-health — ${RUNTIMES.find(r => r.id === runtime)?.label}`} content={outputs.platformHealthEndpoint} lang="javascript" />
    </Section>
  );
}

// ── C) Polling Contract Panel ─────────────────────────────────────────────────

function PollingContractPanel({ outputs, failureThreshold, onFailureThresholdChange, successThreshold, onSuccessThresholdChange }) {
  return (
    <Section title="C) Frontend Polling Contract">
      <p className="text-slate-400 text-sm">
        Exact JSON schema your frontend polling logic must expect. Adjust the failure/success thresholds to tune banner sensitivity.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldInput
          label="Failure threshold (consecutive failures before showing banner)"
          value={String(failureThreshold)}
          onChange={v => onFailureThresholdChange(Number(v) || 3)}
          type="number"
          hint="Recommended: 3 (avoids false alarms on transient blips)"
        />
        <FieldInput
          label="Success threshold (consecutive successes before hiding banner)"
          value={String(successThreshold)}
          onChange={v => onSuccessThresholdChange(Number(v) || 2)}
          type="number"
          hint="Recommended: 2 (hysteresis — prevents banner flicker)"
        />
      </div>
      <CodeBlock title="Polling contract + banner logic (TypeScript / JS)" content={outputs.pollingContract} lang="typescript" />
    </Section>
  );
}

// ── Main Step ────────────────────────────────────────────────────────────────

export default function StepHealthSystem({ profile, onChange }) {
  const [deepEnabled, setDeepEnabled] = useState(profile.health_deep_enabled || false);
  const [runtime, setRuntime] = useState(profile.health_runtime || 'express');
  const [pingUrl, setPingUrl] = useState(profile.health_ping_url || '');
  const [timeoutMs, setTimeoutMs] = useState(profile.health_timeout_ms || 2500);
  const [failureThreshold, setFailureThreshold] = useState(profile.health_failure_threshold || 3);
  const [successThreshold, setSuccessThreshold] = useState(profile.health_success_threshold || 2);

  const sync = (patch) => {
    const next = { health_deep_enabled: deepEnabled, health_runtime: runtime, health_ping_url: pingUrl, health_timeout_ms: timeoutMs, health_failure_threshold: failureThreshold, health_success_threshold: successThreshold, ...patch };
    onChange(next);
  };

  const handleDeep = (v) => { setDeepEnabled(v); sync({ health_deep_enabled: v }); };
  const handleRuntime = (v) => { setRuntime(v); sync({ health_runtime: v }); };
  const handlePingUrl = (v) => { setPingUrl(v); sync({ health_ping_url: v }); };
  const handleTimeout = (v) => { setTimeoutMs(v); sync({ health_timeout_ms: v }); };
  const handleFailure = (v) => { setFailureThreshold(v); sync({ health_failure_threshold: v }); };
  const handleSuccess = (v) => { setSuccessThreshold(v); sync({ health_success_threshold: v }); };

  const enrichedProfile = { ...profile, health_deep_enabled: deepEnabled, health_runtime: runtime, health_ping_url: pingUrl, health_timeout_ms: timeoutMs, health_failure_threshold: failureThreshold, health_success_threshold: successThreshold };
  const outputs = generateHealthSystem(enrichedProfile);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Health System</h2>
        <p className="text-slate-400 text-sm mt-1">
          Generate backend ping functions, a platform health endpoint for your server, and a polling contract for your frontend banner logic.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {profile.hosting_target && (
          <span className="px-3 py-1 rounded-full bg-[#73e28a]/10 border border-[#73e28a]/30 text-[#73e28a] text-xs font-medium">
            {profile.hosting_target.toUpperCase()}
          </span>
        )}
        {profile.project_name && <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">{profile.project_name}</span>}
      </div>

      <BackendFunctionPanel outputs={outputs} deepEnabled={deepEnabled} onToggleDeep={handleDeep} />
      <PlatformHealthPanel
        outputs={outputs}
        runtime={runtime}
        onRuntimeChange={handleRuntime}
        pingUrl={pingUrl}
        onPingUrlChange={handlePingUrl}
        timeoutMs={timeoutMs}
        onTimeoutChange={handleTimeout}
      />
      <PollingContractPanel
        outputs={outputs}
        failureThreshold={failureThreshold}
        onFailureThresholdChange={handleFailure}
        successThreshold={successThreshold}
        onSuccessThresholdChange={handleSuccess}
      />
    </div>
  );
}