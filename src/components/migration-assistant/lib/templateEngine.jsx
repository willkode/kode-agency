// ─────────────────────────────────────────────────────────────────────────────
// Template Engine — Unit Tests
// Run in browser console: import { runTests } from './templateEngine.test.js'; runTests();
// Or paste the output in any JS REPL.
// ─────────────────────────────────────────────────────────────────────────────
import { renderTemplate, validateInputs, getAllTemplates } from './templateEngine.js';

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ ${description}`);
    return true;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    return false;
  }
}

function describe(suiteName, fn) {
  console.group(`\n📦 ${suiteName}`);
  fn();
  console.groupEnd();
}

export function runTests() {
  const results = { passed: 0, failed: 0 };

  function test(desc, condition) {
    if (assert(desc, condition)) results.passed++;
    else results.failed++;
  }

  // ── validateInputs ──────────────────────────────────────────────────────────

  describe('validateInputs', () => {
    const schema = {
      name:   { type: 'string', required: true, minLength: 2 },
      mode:   { type: 'string', enum: ['a', 'b'] },
      count:  { type: 'number' },
      active: { type: 'boolean' },
    };

    test('passes with valid inputs', () => {
      const { valid } = validateInputs(schema, { name: 'foo', mode: 'a', count: 5, active: true });
      return valid === true;
    });

    test('fails when required field missing', () => {
      const { valid, errors } = validateInputs(schema, { mode: 'a' });
      return valid === false && errors.some(e => e.includes('"name" is required'));
    });

    test('fails when enum value invalid', () => {
      const { valid, errors } = validateInputs(schema, { name: 'foo', mode: 'z' });
      return valid === false && errors.some(e => e.includes('"mode" must be one of'));
    });

    test('fails when string too short', () => {
      const { valid, errors } = validateInputs(schema, { name: 'x' });
      return valid === false && errors.some(e => e.includes('minLength'));
    });

    test('fails when wrong type (number for boolean)', () => {
      const { valid, errors } = validateInputs(schema, { name: 'foo', active: 42 });
      return valid === false && errors.some(e => e.includes('"active" must be a boolean'));
    });

    test('optional field can be omitted', () => {
      const { valid } = validateInputs(schema, { name: 'foo' });
      return valid === true;
    });
  });

  // ── nginx-spa-config ────────────────────────────────────────────────────────

  describe('nginx-spa-config', () => {
    const inputs = { app_name: 'my-app', frontend_domain: 'https://app.example.com' };

    test('renders without error', () => {
      const r = renderTemplate('nginx-spa-config', inputs);
      return !r.error;
    });

    test('language is nginx', () => {
      return renderTemplate('nginx-spa-config', inputs).language === 'nginx';
    });

    test('contains server_name', () => {
      const r = renderTemplate('nginx-spa-config', inputs);
      return r.content.includes('server_name app.example.com');
    });

    test('contains try_files SPA fallback', () => {
      return renderTemplate('nginx-spa-config', inputs).content.includes('try_files $uri $uri/ /index.html');
    });

    test('warns when HTTP used instead of HTTPS', () => {
      const r = renderTemplate('nginx-spa-config', { app_name: 'x', frontend_domain: 'http://insecure.com' });
      return r.warnings.some(w => w.includes('HTTPS'));
    });

    test('fails validation if app_name missing', () => {
      const r = renderTemplate('nginx-spa-config', { frontend_domain: 'https://example.com' });
      return !!r.error;
    });

    test('templateId and templateVersion present', () => {
      const r = renderTemplate('nginx-spa-config', inputs);
      return r.templateId === 'nginx-spa-config' && r.templateVersion === '1.0.0';
    });
  });

  // ── vercel-config ───────────────────────────────────────────────────────────

  describe('vercel-config', () => {
    test('renders valid JSON', () => {
      const r = renderTemplate('vercel-config', {});
      try { JSON.parse(r.content); return true; } catch (_) { return false; }
    });

    test('includes SPA rewrite', () => {
      const r = renderTemplate('vercel-config', {});
      return r.content.includes('index.html');
    });

    test('language is json', () => {
      return renderTemplate('vercel-config', {}).language === 'json';
    });
  });

  // ── env-vars ────────────────────────────────────────────────────────────────

  describe('env-vars', () => {
    const base = { app_name: 'TestApp', base44_api_base_url: 'https://api.base44.com', base44_app_id: 'abc123', frontend_domain: 'https://app.test.com' };

    test('renders without error', () => {
      return !renderTemplate('env-vars', base).error;
    });

    test('includes VITE_BASE44_API_URL', () => {
      return renderTemplate('env-vars', base).content.includes('VITE_BASE44_API_URL');
    });

    test('includes stripe vars when stripe_used=true', () => {
      const r = renderTemplate('env-vars', { ...base, stripe_used: true });
      return r.content.includes('VITE_STRIPE_PUBLISHABLE_KEY');
    });

    test('does NOT include stripe vars when stripe_used=false', () => {
      const r = renderTemplate('env-vars', { ...base, stripe_used: false });
      return !r.content.includes('VITE_STRIPE_PUBLISHABLE_KEY');
    });

    test('warns when app_id is placeholder', () => {
      const r = renderTemplate('env-vars', { ...base, base44_app_id: 'YOUR_APP_ID' });
      return r.warnings.some(w => w.includes('placeholder'));
    });
  });

  // ── health-ping-function ────────────────────────────────────────────────────

  describe('health-ping-function', () => {
    const base = { frontend_domain: 'https://app.test.com', base44_app_id: 'abc123' };

    test('renders without error', () => {
      return !renderTemplate('health-ping-function', base).error;
    });

    test('contains Deno.serve', () => {
      return renderTemplate('health-ping-function', base).content.includes('Deno.serve');
    });

    test('deep mode adds PLACEHOLDER comment', () => {
      const r = renderTemplate('health-ping-function', { ...base, health_deep_enabled: true });
      return r.content.includes('PLACEHOLDER');
    });

    test('deep mode adds warning', () => {
      const r = renderTemplate('health-ping-function', { ...base, health_deep_enabled: true });
      return r.warnings.length > 0;
    });

    test('language is javascript', () => {
      return renderTemplate('health-ping-function', base).language === 'javascript';
    });
  });

  // ── cloudflare-worker ───────────────────────────────────────────────────────

  describe('cloudflare-worker', () => {
    const base = { ew_mode: 'html_inject', ew_origin_url: 'https://origin.pages.dev', app_name: 'my-app' };

    test('renders without error', () => {
      return !renderTemplate('cloudflare-worker', base).error;
    });

    test('warns about HTML buffering in inject modes', () => {
      const r = renderTemplate('cloudflare-worker', base);
      return r.warnings.some(w => w.includes('buffering'));
    });

    test('edge_fallback mode has no buffering warning', () => {
      const r = renderTemplate('cloudflare-worker', { ...base, ew_mode: 'edge_fallback' });
      return !r.warnings.some(w => w.includes('buffering'));
    });

    test('fails validation when ew_mode is invalid', () => {
      const r = renderTemplate('cloudflare-worker', { ...base, ew_mode: 'invalid_mode' });
      return !!r.error;
    });

    test('fails validation when origin URL missing https', () => {
      const r = renderTemplate('cloudflare-worker', { ...base, ew_origin_url: 'http://not-secure.com' });
      return !!r.error;
    });
  });

  // ── outage-banner-hook ──────────────────────────────────────────────────────

  describe('outage-banner-hook', () => {
    const base = { banner_health_endpoint: '/api/platform-health' };

    test('renders without error', () => {
      return !renderTemplate('outage-banner-hook', base).error;
    });

    test('contains usePlatformHealth export', () => {
      return renderTemplate('outage-banner-hook', base).content.includes('usePlatformHealth');
    });

    test('uses provided endpoint', () => {
      return renderTemplate('outage-banner-hook', base).content.includes('/api/platform-health');
    });

    test('warns when interval < 10s', () => {
      const r = renderTemplate('outage-banner-hook', { ...base, banner_interval_ms: 5000 });
      return r.warnings.some(w => w.includes('10 s'));
    });
  });

  // ── outage-banner-vanilla ───────────────────────────────────────────────────

  describe('outage-banner-vanilla', () => {
    const base = {
      banner_health_endpoint: '/api/platform-health',
      banner_text: 'Outage in progress',
      banner_bg: '#f59e0b',
    };

    test('renders without error', () => {
      return !renderTemplate('outage-banner-vanilla', base).error;
    });

    test('is IIFE (starts with (function)', () => {
      return renderTemplate('outage-banner-vanilla', base).content.startsWith('(function');
    });

    test('contains debug override', () => {
      return renderTemplate('outage-banner-vanilla', base).content.includes('__b44_forceDown');
    });
  });

  // ── wrangler-toml ───────────────────────────────────────────────────────────

  describe('wrangler-toml', () => {
    test('language is toml', () => {
      return renderTemplate('wrangler-toml', { app_name: 'test', ew_origin_url: 'https://x.pages.dev' }).language === 'toml';
    });

    test('slugifies app_name', () => {
      const r = renderTemplate('wrangler-toml', { app_name: 'My App', ew_origin_url: 'https://x.pages.dev' });
      return r.content.includes('my-app-edge-worker');
    });
  });

  // ── Registry integrity ──────────────────────────────────────────────────────

  describe('Registry integrity', () => {
    const templates = getAllTemplates();

    test('at least 12 templates registered', () => templates.length >= 12);

    test('every template has id, name, version', () => {
      return templates.every(t => t.id && t.name && t.version);
    });

    test('every template has a render function', () => {
      return templates.every(t => typeof t.render === 'function');
    });

    test('all template ids are unique', () => {
      const ids = templates.map(t => t.id);
      return new Set(ids).size === ids.length;
    });

    test('all versions follow semver x.y.z', () => {
      return templates.every(t => /^\d+\.\d+\.\d+$/.test(t.version));
    });
  });

  // ── Summary ─────────────────────────────────────────────────────────────────

  const total = results.passed + results.failed;
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Template Engine Tests: ${results.passed}/${total} passed${results.failed > 0 ? ` (${results.failed} FAILED)` : ' ✅'}`);
  console.log('─'.repeat(50));
  return results;
}