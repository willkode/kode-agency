import React, { useState } from 'react';
import { getAllTemplates, renderTemplate, validateInputs } from './templateEngine';
import { CheckCircle, XCircle, Play, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// INLINE TEST RUNNER
// ─────────────────────────────────────────────────────────────────

const runTests = () => {
  let testsPassed = 0;
  let testsFailed = 0;

  const assert = (condition, message) => {
    if (condition) {
      testsPassed++;
      console.log(`✅ ${message}`);
    } else {
      testsFailed++;
      console.error(`❌ ${message}`);
    }
  };

  const group = (name) => {
    console.log(`\n📋 ${name}`);
  };

  // validateInputs tests
  group('validateInputs');
  try {
    validateInputs('nginx-spa-config', { server_name: 'example.com', api_proxy_url: 'https://api.com' });
    assert(true, 'Valid inputs accepted');
  } catch {
    assert(false, 'Valid inputs rejected');
  }

  try {
    validateInputs('nginx-spa-config', { server_name: 'example.com' });
    assert(false, 'Missing required field not caught');
  } catch {
    assert(true, 'Missing required field caught');
  }

  try {
    validateInputs('nginx-spa-config', { server_name: 123, api_proxy_url: 'https://api.com' });
    assert(false, 'Type mismatch not caught');
  } catch {
    assert(true, 'Type mismatch caught');
  }

  // nginx-spa-config tests
  group('nginx-spa-config');
  const nginxResult = renderTemplate('nginx-spa-config', {
    server_name: 'app.example.com',
    api_proxy_url: 'https://api.example.com',
  });
  assert(nginxResult.language === 'nginx', 'Language is nginx');
  assert(nginxResult.content.includes('try_files $uri $uri/ /index.html'), 'SPA fallback included');
  assert(nginxResult.content.includes('proxy_pass https://api.example.com'), 'API proxy included');
  assert(Array.isArray(nginxResult.warnings), 'Warnings is array');

  // vercel-config tests
  group('vercel-config');
  const vercelResult = renderTemplate('vercel-config', {
    project_name: 'my-app',
    api_base_url: 'https://api.vercel.com',
  });
  assert(vercelResult.language === 'json', 'Language is json');
  try {
    JSON.parse(vercelResult.content);
    assert(true, 'Output is valid JSON');
  } catch {
    assert(false, 'Output is invalid JSON');
  }
  const vercelJson = JSON.parse(vercelResult.content);
  assert(vercelJson.rewrites?.length > 0, 'Rewrites included');

  // env-vars tests
  group('env-vars');
  const envResult = renderTemplate('env-vars', {
    app_id: 'my-app-id',
    api_url: 'https://api.example.com',
    stripe_enabled: true,
  });
  assert(envResult.language === 'shell', 'Language is shell');
  assert(envResult.content.includes('VITE_BASE44_APP_ID=my-app-id'), 'App ID included');
  assert(envResult.content.includes('STRIPE_SECRET_KEY'), 'Stripe vars included when enabled');

  const envNoStripe = renderTemplate('env-vars', {
    app_id: 'my-app-id',
    api_url: 'https://api.example.com',
    stripe_enabled: false,
  });
  assert(!envNoStripe.content.includes('STRIPE_SECRET_KEY'), 'Stripe vars excluded when disabled');

  // health-ping-function tests
  group('health-ping-function');
  const healthResult = renderTemplate('health-ping-function', {
    deep_check: true,
  });
  assert(healthResult.language === 'javascript', 'Language is javascript');
  assert(healthResult.content.includes('Deno.serve'), 'Deno.serve included');
  assert(healthResult.warnings?.length > 0, 'Warnings generated');

  // cloudflare-worker tests
  group('cloudflare-worker');
  const workerResult = renderTemplate('cloudflare-worker', {
    origin_url: 'https://example.com',
    mode: 'html_inject',
  });
  assert(workerResult.language === 'javascript', 'Language is javascript');
  assert(workerResult.content.includes('export default'), 'Export statement included');
  assert(workerResult.warnings?.length > 0, 'Warnings for html_inject mode');

  // outage-banner-hook tests
  group('outage-banner-hook');
  const bannerResult = renderTemplate('outage-banner-hook', {
    health_endpoint_url: 'https://api.example.com/health',
    poll_interval_ms: '30000',
  });
  assert(bannerResult.language === 'javascript', 'Language is javascript');
  assert(bannerResult.content.includes('usePlatformHealth'), 'Hook exported');
  assert(bannerResult.content.includes('OutageBanner'), 'Component exported');

  // outage-banner-vanilla tests
  group('outage-banner-vanilla');
  const vanillaResult = renderTemplate('outage-banner-vanilla', {
    health_endpoint_url: 'https://api.example.com/health',
  });
  assert(vanillaResult.language === 'javascript', 'Language is javascript');
  assert(vanillaResult.content.includes('(function()'), 'IIFE included');
  assert(vanillaResult.content.includes('__PLATFORM_HEALTH_DEBUG'), 'Debug override included');

  // wrangler-toml tests
  group('wrangler-toml');
  const wranglerResult = renderTemplate('wrangler-toml', {
    app_name: 'My App',
  });
  assert(wranglerResult.language === 'toml', 'Language is toml');
  assert(wranglerResult.content.includes('name = "my-app"'), 'App name slugified');

  // Registry integrity tests
  group('Registry integrity');
  const templates = getAllTemplates();
  assert(templates.length >= 10, 'At least 10 templates registered');
  assert(templates.every(t => t.id && t.version), 'All templates have id and version');
  assert(new Set(templates.map(t => t.id)).size === templates.length, 'All template IDs unique');
  assert(templates.every(t => t.inputsSchema?.properties), 'All templates have schema');

  // Summary
  const total = testsPassed + testsFailed;
  const passRate = Math.round((testsPassed / total) * 100);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`${testsPassed} / ${total} tests passed (${passRate}%)`);
  if (testsFailed > 0) {
    console.log(`${testsFailed} test(s) FAILED`);
  }

  return {
    passed: testsPassed,
    failed: testsFailed,
  };
};

// ── Single template sandbox ───────────────────────────────────────────────────

function TemplateSandbox({ template }) {
  const [inputs, setInputs] = useState('{}');
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);

  const handleRun = () => {
    try {
      const parsed = JSON.parse(inputs);
      const r = renderTemplate(template.id, parsed);
      setResult(r);
    } catch (e) {
      setResult({ error: e.message, content: '', language: 'text', warnings: [] });
    }
  };

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-800 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">{template.id}</span>
          <span className="text-white text-sm">{template.name}</span>
          <span className="text-slate-600 text-xs">v{template.version}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>

      {open && (
        <div className="p-4 bg-slate-900 space-y-3 border-t border-slate-700/50">
          {/* Schema reference */}
          <div>
            <p className="text-slate-400 text-xs font-medium mb-1">Input Schema</p>
            <pre className="text-xs text-slate-400 bg-slate-950 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(template.inputsSchema, null, 2)}
            </pre>
          </div>

          {/* Input editor */}
          <div>
            <p className="text-slate-400 text-xs font-medium mb-1">Test Inputs (JSON)</p>
            <textarea
              rows={4}
              value={inputs}
              onChange={e => setInputs(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#73e28a] resize-y"
            />
          </div>

          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#73e28a] text-black text-xs font-bold hover:bg-[#5dbb72] transition-colors"
          >
            <Play className="w-3 h-3" /> Run Renderer
          </button>

          {result && (
            <div className="space-y-2">
              {result.error && (
                <div className="flex items-center gap-2 text-red-400 text-xs">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{result.error}</span>
                </div>
              )}
              {result.warnings?.length > 0 && (
                <div className="space-y-1">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-yellow-400 text-xs">
                      <span>⚠</span><span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
              {result.content && (
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-1">
                    Output — <span className="font-mono">{result.language}</span>
                    {result.templateVersion && <span className="ml-2 text-slate-600">· v{result.templateVersion}</span>}
                  </p>
                  <pre className="text-xs text-slate-300 bg-slate-950 rounded-lg p-3 overflow-x-auto whitespace-pre max-h-64 font-mono">{result.content}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Test runner panel ─────────────────────────────────────────────────────────

function TestRunnerPanel() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setResults(null);
    // Small delay to allow UI to update
    await new Promise(r => setTimeout(r, 50));
    const r = runTests();
    setResults(r);
    setRunning(false);
  };

  return (
    <div className="border border-slate-700 rounded-xl p-5 bg-slate-900 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#73e28a]" /> Unit Tests
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">Runs all renderer assertions in browser console + shows summary here.</p>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#73e28a] text-black text-xs font-bold hover:bg-[#5dbb72] transition-colors disabled:opacity-50"
        >
          <Play className="w-3 h-3" /> {running ? 'Running…' : 'Run All Tests'}
        </button>
      </div>

      {results && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
          results.failed === 0
            ? 'border-[#73e28a]/30 bg-[#73e28a]/5 text-[#73e28a]'
            : 'border-red-500/30 bg-red-500/5 text-red-400'
        }`}>
          {results.failed === 0
            ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
            : <XCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">
            {results.passed} / {results.passed + results.failed} tests passed
            {results.failed > 0 && ` — ${results.failed} failed (see console for details)`}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main exported component ───────────────────────────────────────────────────

export default function TemplateTestRunner() {
  const templates = getAllTemplates();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Template Engine</h2>
        <p className="text-slate-400 text-sm">
          {templates.length} registered templates · Each has an id, version, inputs schema, and typed renderer.
        </p>
      </div>

      <TestRunnerPanel />

      <div>
        <h3 className="text-slate-300 text-sm font-medium mb-3">Template Sandbox</h3>
        <div className="space-y-2">
          {templates.map(t => <TemplateSandbox key={t.id} template={t} />)}
        </div>
      </div>
    </div>
  );
}