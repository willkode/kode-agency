import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp, ClipboardCheck, Globe, Download } from 'lucide-react';
import { VerificationRepo } from './lib/repository';

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildChecks(profile) {
  return [
    {
      id: 'health_reachable',
      title: 'Health endpoint reachable',
      description: 'Your /api/platform-health (or equivalent) returns HTTP 200.',
      mode: 'live',         // supports live fetch attempt
      requiresEvidence: false,
    },
    {
      id: 'health_schema',
      title: 'Health JSON schema valid',
      description: 'Response body contains { ok: boolean } at minimum.',
      mode: 'live',
      requiresEvidence: false,
    },
    {
      id: 'rewrite_config',
      title: 'Host rewrite config in place',
      description: `Your ${profile.hosting_target || 'hosting'} SPA rewrite rule is deployed (all unknown routes → index.html).`,
      mode: 'manual',
      requiresEvidence: true,
      evidencePlaceholder: 'Paste your nginx location block, _redirects rule, vercel.json routes, etc.',
    },
    {
      id: 'auth_callbacks',
      title: 'Auth callback URLs prepared',
      description: 'Auth redirect URLs are configured in your identity provider / Base44 dashboard.',
      mode: 'manual',
      requiresEvidence: false,
    },
    {
      id: 'worker_generated',
      title: 'Edge Worker code generated',
      description: 'Cloudflare Worker script was generated in Step 4 (Edge Worker).',
      mode: 'auto',
      autoPass: !!(profile.worker_mode),   // passes automatically if user configured a worker
      autoNote: profile.worker_mode
        ? `Worker mode "${profile.worker_mode}" was configured.`
        : 'No worker configured — step skipped.',
    },
    {
      id: 'banner_generated',
      title: 'Outage banner code generated',
      description: 'Banner hook + component (or vanilla JS snippet) was generated in Step 5.',
      mode: 'auto',
      autoPass: true,
      autoNote: 'Outage banner step is always generated.',
    },
  ];
}

async function attemptLiveFetch(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch (_) {}
    return { ok: res.ok, status: res.status, json, text };
  } catch (e) {
    return { ok: false, status: 0, error: e.message, json: null, text: '' };
  }
}

function buildMarkdownReport(profile, checks, runId, timestamp) {
  const lines = [
    `# Migration Verification Report`,
    ``,
    `**Profile:** ${profile.app_name || profile.project_name || 'Unnamed'}`,
    `**Hosting Target:** ${profile.hosting_target || '—'}`,
    `**Run ID:** ${runId || 'local'}`,
    `**Timestamp:** ${timestamp}`,
    ``,
    `---`,
    ``,
    `## Checks`,
    ``,
  ];

  checks.forEach(c => {
    const icon = c.passed ? '✅' : '❌';
    lines.push(`### ${icon} ${c.title}`);
    lines.push(``);
    if (c.notes) lines.push(`> ${c.notes}`);
    if (c.evidence) {
      lines.push(``);
      lines.push(`**Evidence:**`);
      lines.push(`\`\`\``);
      lines.push(c.evidence);
      lines.push(`\`\`\``);
    }
    lines.push(``);
  });

  const passed = checks.filter(c => c.passed).length;
  const total = checks.length;
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(`**${passed} / ${total} checks passed.**`);
  lines.push(``);
  if (passed < total) {
    lines.push(`### Action Items`);
    lines.push(``);
    checks.filter(c => !c.passed).forEach(c => {
      lines.push(`- [ ] Fix: **${c.title}** — ${c.notes || c.description}`);
    });
  }

  return lines.join('\n');
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CheckRow({ check, state, onChange, liveUrl, onLiveUrlChange, onRunLive, liveFetching }) {
  const [open, setOpen] = useState(false);

  const statusIcon = state.passed === true
    ? <CheckCircle className="w-5 h-5 text-[#73e28a] flex-shrink-0" />
    : state.passed === false
    ? <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
    : <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex-shrink-0" />;

  const rowBg = state.passed === true
    ? 'border-[#73e28a]/30 bg-[#73e28a]/5'
    : state.passed === false
    ? 'border-red-500/30 bg-red-500/5'
    : 'border-slate-700 bg-slate-900/50';

  return (
    <div className={`border rounded-xl overflow-hidden ${rowBg}`}>
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        {statusIcon}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium">{check.title}</p>
          {state.notes && (
            <p className="text-slate-400 text-xs mt-0.5 truncate">{state.notes}</p>
          )}
        </div>
        <span className="text-slate-600 flex-shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-700/30 pt-3">
          <p className="text-slate-400 text-xs">{check.description}</p>

          {/* AUTO mode — no user input needed */}
          {check.mode === 'auto' && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ClipboardCheck className="w-4 h-4 text-slate-500" />
              <span>Auto-detected from your wizard configuration.</span>
            </div>
          )}

          {/* LIVE mode */}
          {check.mode === 'live' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-xs text-slate-400">Live fetch (CORS must allow browser)</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={liveUrl}
                  onChange={e => onLiveUrlChange(e.target.value)}
                  placeholder="https://yourdomain.com/api/platform-health"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#73e28a]/50"
                />
                <Button
                  size="sm"
                  onClick={() => onRunLive(check.id, liveUrl)}
                  disabled={!liveUrl || liveFetching}
                  className="bg-[#73e28a] text-black hover:bg-[#5dbb72] text-xs font-bold flex-shrink-0"
                >
                  {liveFetching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Fetch'}
                </Button>
              </div>
              {state.rawResponse && (
                <pre className="text-xs text-slate-400 bg-slate-950 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap max-h-32">{state.rawResponse}</pre>
              )}
              {/* Manual fallback */}
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={!!state.manualPass}
                  onChange={e => onChange({ manualPass: e.target.checked, passed: e.target.checked })}
                  className="accent-[#73e28a]"
                />
                <span className="text-xs text-slate-400">Mark as passed manually (if CORS blocks fetch)</span>
              </label>
            </div>
          )}

          {/* MANUAL mode */}
          {check.mode === 'manual' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!state.confirmed}
                  onChange={e => onChange({ confirmed: e.target.checked, passed: e.target.checked && (!check.requiresEvidence || !!state.evidence?.trim()) })}
                  className="accent-[#73e28a]"
                />
                <span className="text-xs text-slate-300 font-medium">I have completed this step</span>
              </label>
              {check.requiresEvidence && (
                <textarea
                  rows={3}
                  value={state.evidence || ''}
                  onChange={e => {
                    const evidence = e.target.value;
                    onChange({
                      evidence,
                      passed: !!state.confirmed && !!evidence.trim(),
                    });
                  }}
                  placeholder={check.evidencePlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#73e28a]/50 font-mono"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function VerificationRunner({ profile, profileId, projectId, onRunSaved }) {
  const checks = buildChecks(profile);

  // Per-check state: { passed, notes, confirmed, evidence, manualPass, rawResponse }
  const initState = () => {
    const s = {};
    checks.forEach(c => {
      if (c.mode === 'auto') {
        s[c.id] = { passed: c.autoPass, notes: c.autoNote };
      } else {
        s[c.id] = { passed: null, notes: '' };
      }
    });
    return s;
  };

  const [checkState, setCheckState] = useState(initState);
  const [liveUrls, setLiveUrls] = useState({
    health_reachable: profile.frontend_domain ? `${profile.frontend_domain.replace(/\/$/, '')}/api/platform-health` : '',
    health_schema: profile.frontend_domain ? `${profile.frontend_domain.replace(/\/$/, '')}/api/platform-health` : '',
  });
  const [liveFetching, setLiveFetching] = useState(null); // check id being fetched
  const [saving, setSaving] = useState(false);
  const [savedRun, setSavedRun] = useState(null);

  const updateCheck = (id, delta) => {
    setCheckState(prev => ({ ...prev, [id]: { ...prev[id], ...delta } }));
  };

  const handleLiveFetch = async (checkId, url) => {
    if (!url) return;
    setLiveFetching(checkId);
    const result = await attemptLiveFetch(url);
    const rawResponse = result.error
      ? `Error: ${result.error}`
      : `HTTP ${result.status}\n${JSON.stringify(result.json ?? result.text, null, 2).slice(0, 400)}`;

    if (checkId === 'health_reachable') {
      updateCheck(checkId, {
        passed: result.ok,
        notes: result.ok ? `HTTP ${result.status} OK` : `HTTP ${result.status || 'error'}: ${result.error || 'non-200'}`,
        rawResponse,
      });
    } else if (checkId === 'health_schema') {
      const valid = result.ok && result.json && typeof result.json.ok === 'boolean';
      updateCheck(checkId, {
        passed: valid,
        notes: valid
          ? `JSON valid — ok: ${result.json.ok}`
          : result.error
          ? `Fetch error: ${result.error}`
          : `Response missing { ok: boolean }. Got: ${JSON.stringify(result.json).slice(0, 80)}`,
        rawResponse,
      });
    }
    setLiveFetching(null);
  };

  const handleSaveRun = async () => {
    setSaving(true);
    const finalChecks = checks.map(c => ({
      title: c.title,
      passed: checkState[c.id]?.passed ?? false,
      notes: checkState[c.id]?.notes || checkState[c.id]?.autoNote || '',
      evidence: checkState[c.id]?.evidence || '',
    }));
    const passed = finalChecks.filter(c => c.passed).length;
    const failed = finalChecks.filter(c => !c.passed).length;
    const total = finalChecks.length;
    const status = failed === 0 ? 'passed' : passed === 0 ? 'failed' : 'partial';

    const runData = {
      profile_id: profileId || 'local',
      project_id: projectId || 'local',
      status,
      checks: finalChecks,
      passed_count: passed,
      failed_count: failed,
      total_checks: total,
      log: `Verification run at ${new Date().toISOString()}`,
    };

    try {
      const run = await VerificationRepo.create(runData);
      await VerificationRepo.update(run.id, { status }); // ensure status is set (create defaults to in_progress)
      setSavedRun({ ...runData, id: run.id, created_date: new Date().toISOString() });
      if (onRunSaved) onRunSaved(run);
    } catch (e) {
      // If offline/local, just store locally for report
      setSavedRun({ ...runData, id: 'local-' + Date.now(), created_date: new Date().toISOString() });
    }
    setSaving(false);
  };

  const handleDownloadReport = () => {
    const finalChecks = checks.map(c => ({
      title: c.title,
      passed: checkState[c.id]?.passed ?? false,
      notes: checkState[c.id]?.notes || checkState[c.id]?.autoNote || '',
      evidence: checkState[c.id]?.evidence || '',
      description: c.description,
    }));
    const timestamp = savedRun?.created_date
      ? new Date(savedRun.created_date).toLocaleString()
      : new Date().toLocaleString();
    const md = buildMarkdownReport(profile, finalChecks, savedRun?.id, timestamp);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verification-report-${profile.app_name || profile.project_name || 'app'}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const passed = checks.filter(c => checkState[c.id]?.passed === true).length;
  const total = checks.length;
  const allDone = checks.every(c => checkState[c.id]?.passed !== null);

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-300 text-sm font-medium">
            {passed} / {total} checks passing
          </p>
          <div className="mt-1 h-1.5 w-48 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#73e28a] rounded-full transition-all duration-500"
              style={{ width: `${(passed / total) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedRun && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadReport}
              className="border-slate-700 text-slate-300 hover:text-white gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Report
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSaveRun}
            disabled={saving || !!savedRun}
            className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-xs gap-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            {savedRun ? 'Run Saved' : 'Save Run'}
          </Button>
        </div>
      </div>

      {savedRun && (
        <div className="rounded-lg border border-[#73e28a]/30 bg-[#73e28a]/5 px-4 py-3 flex items-center gap-2 text-sm text-[#73e28a]">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Run saved — {savedRun.passed_count}/{savedRun.total_checks} passed · status: <strong>{savedRun.status}</strong>
          {savedRun.id !== 'local-' + Date.now() && (
            <span className="text-slate-500 text-xs ml-auto">ID #{savedRun.id?.slice(-6)}</span>
          )}
        </div>
      )}

      {/* Check rows */}
      <div className="space-y-2">
        {checks.map(c => (
          <CheckRow
            key={c.id}
            check={c}
            state={checkState[c.id] || {}}
            onChange={delta => updateCheck(c.id, delta)}
            liveUrl={liveUrls[c.id] || ''}
            onLiveUrlChange={url => setLiveUrls(prev => ({ ...prev, [c.id]: url }))}
            onRunLive={handleLiveFetch}
            liveFetching={liveFetching === c.id}
          />
        ))}
      </div>
    </div>
  );
}