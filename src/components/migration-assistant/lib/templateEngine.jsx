/**
 * Template Engine — Core rendering system for migration configs
 * 
 * Manages template registry, input validation, and output generation.
 */

// ─────────────────────────────────────────────────────────────────
// INPUT VALIDATION SCHEMA
// ─────────────────────────────────────────────────────────────────

export const validateInputs = (templateId, inputs) => {
  const template = REGISTRY.find(t => t.id === templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);

  const schema = template.inputsSchema;
  const errors = [];

  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in inputs)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Validate types and enums
  for (const [key, fieldSchema] of Object.entries(schema.properties || {})) {
    if (!(key in inputs)) continue;
    const value = inputs[key];

    if (fieldSchema.type === 'string' && typeof value !== 'string') {
      errors.push(`Field '${key}' must be a string, got ${typeof value}`);
    }
    if (fieldSchema.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`Field '${key}' must be a boolean, got ${typeof value}`);
    }
    if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
      errors.push(`Field '${key}' must be one of: ${fieldSchema.enum.join(', ')}, got ${value}`);
    }
  }

  if (errors.length > 0) {
    throw new Error('Input validation failed: ' + errors.join('; '));
  }
};

// ─────────────────────────────────────────────────────────────────
// TEMPLATE REGISTRY
// ─────────────────────────────────────────────────────────────────

export const REGISTRY = [
  {
    id: 'nginx-spa-config',
    name: 'Nginx SPA Config',
    version: '1.0.0',
    host: 'nginx',
    inputsSchema: {
      type: 'object',
      properties: {
        server_name: { type: 'string' },
        api_proxy_url: { type: 'string' },
        ssl_cert_path: { type: 'string' },
        ssl_key_path: { type: 'string' },
      },
      required: ['server_name', 'api_proxy_url'],
    },
    render: (inputs) => {
      const config = `server {
    listen 80;
    server_name ${inputs.server_name};

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${inputs.server_name};

    ssl_certificate ${inputs.ssl_cert_path || '/etc/ssl/certs/cert.pem'};
    ssl_certificate_key ${inputs.ssl_key_path || '/etc/ssl/private/key.pem'};

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # SPA fallback
    location / {
        root /app/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass ${inputs.api_proxy_url};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
}`;

      const warnings = [];
      if (!inputs.api_proxy_url.startsWith('https://')) {
        warnings.push('⚠ API URL does not use HTTPS — consider using a secure endpoint');
      }

      return {
        content: config,
        language: 'nginx',
        warnings,
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'vercel-config',
    name: 'Vercel Config',
    version: '1.0.0',
    host: 'vercel',
    inputsSchema: {
      type: 'object',
      properties: {
        project_name: { type: 'string' },
        api_base_url: { type: 'string' },
      },
      required: ['project_name'],
    },
    render: (inputs) => {
      const config = {
        name: inputs.project_name,
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        env: {
          VITE_API_BASE_URL: inputs.api_base_url || 'https://api.example.com',
        },
        rewrites: [
          {
            source: '/(.*)',
            destination: '/index.html',
          },
        ],
      };

      return {
        content: JSON.stringify(config, null, 2),
        language: 'json',
        warnings: [],
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'env-vars',
    name: 'Environment Variables',
    version: '1.0.0',
    host: 'generic',
    inputsSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string' },
        api_url: { type: 'string' },
        stripe_enabled: { type: 'boolean' },
      },
      required: ['app_id', 'api_url'],
    },
    render: (inputs) => {
      let content = `# Base44 Configuration
VITE_BASE44_APP_ID=${inputs.app_id}
VITE_BASE44_API_URL=${inputs.api_url}

# Example: Replace with your actual values`;

      if (inputs.stripe_enabled) {
        content += `\n\n# Stripe (if using payments)
VITE_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PK
STRIPE_SECRET_KEY=YOUR_STRIPE_SK`;
      }

      const warnings = [];
      if (inputs.app_id === 'YOUR_APP_ID') {
        warnings.push('⚠ Placeholder app ID detected — replace with actual value');
      }

      return {
        content,
        language: 'shell',
        warnings,
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'health-ping-function',
    name: 'Health Ping Function',
    version: '1.0.0',
    host: 'base44',
    inputsSchema: {
      type: 'object',
      properties: {
        deep_check: { type: 'boolean' },
      },
      required: [],
    },
    render: (inputs) => {
      const code = `// Health ping function for Base44
// PLACEHOLDER: Implement actual health logic for your backend

Deno.serve(async (req) => {
  try {
    // EXAMPLE: Check database connectivity (if deep_check enabled)
    ${inputs.deep_check ? `
    // await db.query("SELECT 1");
    ` : `
    // Simple health check — just respond
    `}

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      ${inputs.deep_check ? `database: 'connected',` : ''}
    });
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
});`;

      const warnings = [];
      if (inputs.deep_check) {
        warnings.push('⚠ Deep health check requires database connection logic — implement per your backend');
      }
      warnings.push('ℹ This is an example template. Adapt to your actual backend health requirements.');

      return {
        content: code,
        language: 'javascript',
        warnings,
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'cloudflare-worker',
    name: 'Cloudflare Worker',
    version: '1.0.0',
    host: 'cloudflare',
    inputsSchema: {
      type: 'object',
      properties: {
        origin_url: { type: 'string' },
        mode: { type: 'string', enum: ['html_inject', 'script_inject', 'edge_fallback'] },
      },
      required: ['origin_url', 'mode'],
    },
    render: (inputs) => {
      let code = `export default {
  async fetch(request, env) {
    const response = await fetch(new Request('${inputs.origin_url}', request));

    if (request.method !== 'GET') return response;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;`;

      if (inputs.mode === 'html_inject') {
        code += `

    // WARNING: HTML injection requires buffering entire response
    let html = await response.text();
    const injectionMarker = '<!-- HEALTH_BANNER_INJECTED -->';
    if (!html.includes(injectionMarker)) {
      const bannerScript = \`<script src="https://your-domain.com/health-banner.js"></script>\${injectionMarker}\`;
      html = html.replace('</head>', bannerScript + '</head>');
    }
    return new Response(html, response);`;
      } else if (inputs.mode === 'script_inject') {
        code += `

    // Script injection (lighter weight)
    let html = await response.text();
    const script = '<script src="https://your-domain.com/health-banner.js"></script>';
    html = html.replace('</body>', script + '</body>');
    return new Response(html, response);`;
      } else {
        code += `

    // Edge fallback: serve cached/fallback page on origin error
    return response;`;
      }

      code += `
  }
};`;

      const warnings = [];
      if (inputs.mode === 'html_inject') {
        warnings.push('⚠ HTML injection mode buffers entire response — can impact performance');
      }
      if (!inputs.origin_url.startsWith('https://')) {
        warnings.push('⚠ Origin URL should use HTTPS');
      }

      return {
        content: code,
        language: 'javascript',
        warnings,
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'outage-banner-hook',
    name: 'Outage Banner Hook',
    version: '1.0.0',
    host: 'generic',
    inputsSchema: {
      type: 'object',
      properties: {
        health_endpoint_url: { type: 'string' },
        poll_interval_ms: { type: 'string' },
      },
      required: ['health_endpoint_url'],
    },
    render: (inputs) => {
      const code = `import { useState, useEffect } from 'react';

export const usePlatformHealth = (options = {}) => {
  const [isHealthy, setIsHealthy] = useState(true);
  const endpoint = options.endpoint || '${inputs.health_endpoint_url}';
  const interval = options.interval || ${inputs.poll_interval_ms || 30000};

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(endpoint, { timeout: 5000 });
        setIsHealthy(response.ok);
      } catch (error) {
        setIsHealthy(false);
      }
    };

    checkHealth();
    const timer = setInterval(checkHealth, interval);
    return () => clearInterval(timer);
  }, [endpoint, interval]);

  return { isHealthy };
};

export const OutageBanner = ({ isHealthy }) => {
  if (isHealthy) return null;

  return (
    <div className="bg-red-100 text-red-800 p-4 text-center font-semibold">
      We're experiencing platform issues. Please try again soon.
    </div>
  );
};`;

      const warnings = [];
      if (parseInt(inputs.poll_interval_ms || 30000) < 10000) {
        warnings.push('ℹ Poll interval < 10s may cause excessive requests');
      }

      return {
        content: code,
        language: 'javascript',
        warnings,
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'outage-banner-vanilla',
    name: 'Outage Banner (Vanilla JS)',
    version: '1.0.0',
    host: 'generic',
    inputsSchema: {
      type: 'object',
      properties: {
        health_endpoint_url: { type: 'string' },
      },
      required: ['health_endpoint_url'],
    },
    render: (inputs) => {
      const code = `(function() {
  const HEALTH_ENDPOINT = '${inputs.health_endpoint_url}';
  const POLL_INTERVAL = 30000;
  
  // Allow override for testing
  if (window.__PLATFORM_HEALTH_DEBUG) {
    console.log('Health banner debug mode enabled');
  }

  async function checkHealth() {
    try {
      const response = await fetch(HEALTH_ENDPOINT, { timeout: 5000 });
      return response.ok;
    } catch {
      return false;
    }
  }

  async function renderBanner() {
    const isHealthy = await checkHealth();
    const existing = document.getElementById('platform-health-banner');
    
    if (!isHealthy && !existing) {
      const banner = document.createElement('div');
      banner.id = 'platform-health-banner';
      banner.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #fef2f2; color: #7f1d1d; padding: 1rem; text-align: center; font-weight: bold; z-index: 9999;';
      banner.textContent = 'We\\'re experiencing issues. Please try again soon.';
      document.body.insertBefore(banner, document.body.firstChild);
    } else if (isHealthy && existing) {
      existing.remove();
    }
  }

  renderBanner();
  setInterval(renderBanner, POLL_INTERVAL);
})();`;

      return {
        content: code,
        language: 'javascript',
        warnings: [],
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'wrangler-toml',
    name: 'Wrangler Config',
    version: '1.0.0',
    host: 'cloudflare',
    inputsSchema: {
      type: 'object',
      properties: {
        app_name: { type: 'string' },
      },
      required: ['app_name'],
    },
    render: (inputs) => {
      const slugName = inputs.app_name.toLowerCase().replace(/\s+/g, '-');
      const config = `name = "${slugName}"
type = "javascript"
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
workers_dev = true

[env.production]
route = "example.com/*"
zone_id = "YOUR_ZONE_ID"

[build]
command = "npm install && npm run build"
cwd = "./dist"`;

      return {
        content: config,
        language: 'toml',
        warnings: [],
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'netlify-config',
    name: 'Netlify Config',
    version: '1.0.0',
    host: 'netlify',
    inputsSchema: {
      type: 'object',
      properties: {
        api_base_url: { type: 'string' },
      },
      required: [],
    },
    render: (inputs) => {
      const config = `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_BASE_URL = "${inputs.api_base_url || 'https://api.example.com'}"`;

      return {
        content: config,
        language: 'toml',
        warnings: [],
        templateVersion: '1.0.0',
      };
    },
  },
  {
    id: 'cloudflare-pages-config',
    name: 'Cloudflare Pages Config',
    version: '1.0.0',
    host: 'cloudflare',
    inputsSchema: {
      type: 'object',
      properties: {
        api_base_url: { type: 'string' },
      },
      required: [],
    },
    render: (inputs) => {
      const config = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "${inputs.api_base_url || 'https://api.example.com'}"
  }
}`;

      return {
        content: config,
        language: 'json',
        warnings: [],
        templateVersion: '1.0.0',
      };
    },
  },
];

// ─────────────────────────────────────────────────────────────────
// CORE FUNCTIONS
// ─────────────────────────────────────────────────────────────────

export const getAllTemplates = () => {
  return REGISTRY.map(t => ({
    id: t.id,
    name: t.name,
    version: t.version,
    host: t.host,
    inputsSchema: t.inputsSchema,
  }));
};

export const renderTemplate = (templateId, inputs) => {
  const template = REGISTRY.find(t => t.id === templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);

  validateInputs(templateId, inputs);
  return template.render(inputs);
};

export const getTemplate = (templateId) => {
  return REGISTRY.find(t => t.id === templateId);
};