/**
 * Template Engine Unit Tests
 * 
 * Tests core functionality: input validation, template rendering, schema integrity.
 */

import { validateInputs, renderTemplate, getAllTemplates, REGISTRY } from './templateEngine.js';

// ─────────────────────────────────────────────────────────────────
// TEST UTILITIES
// ─────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────
// TEST SUITES
// ─────────────────────────────────────────────────────────────────

export const runTests = () => {
  testsPassed = 0;
  testsFailed = 0;

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
  assert(() => JSON.parse(vercelResult.content), 'Output is valid JSON');
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