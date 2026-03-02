import React, { useState, useEffect } from 'react';
import AppShell from '@/components/migration-assistant/layout/AppShell';
import { ToastProvider } from '@/components/migration-assistant/lib/toast';
import { base44 } from '@/api/base44Client';
import OutputBlock from '@/components/migration-assistant/OutputBlock.jsx';
import TemplateTestRunner from '@/components/migration-assistant/TemplateTestRunner.jsx';
import { Server, Globe, Zap, Cloud, FlaskConical } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'nginx_spa',
    label: 'Nginx SPA Config',
    host: 'nginx',
    icon: Server,
    desc: 'Full Nginx server block with SSL, SPA fallback, static asset caching, and security headers.',
    content: `# Nginx SPA Config Template
# Place in /etc/nginx/sites-available/YOUR_APP

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    root /var/www/YOUR_APP/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass https://api.base44.com/;
        proxy_set_header Host api.base44.com;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location ~* \\.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
}`,
    format: 'nginx',
  },
  {
    id: 'cloudflare_redirects',
    label: 'Cloudflare Pages _redirects',
    host: 'cloudflare',
    icon: Globe,
    desc: 'Cloudflare Pages _redirects file with API proxy and SPA fallback, plus wrangler.toml.',
    content: `# public/_redirects — Cloudflare Pages

/api/*  https://api.base44.com/api/:splat  200
/*      /index.html                         200

# ─── wrangler.toml ───────────────────────────────────────
name = "YOUR_APP"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"

[vars]
VITE_BASE44_API_URL = "https://api.base44.com/api/apps/YOUR_APP_ID"`,
    format: 'toml',
  },
  {
    id: 'vercel_json',
    label: 'Vercel Config (vercel.json)',
    host: 'vercel',
    icon: Zap,
    desc: 'vercel.json with API proxy rewrites, SPA fallback, and security headers.',
    content: `// vercel.json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.base44.com/api/:path*" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}`,
    format: 'json',
  },
  {
    id: 'netlify_toml',
    label: 'Netlify Config (netlify.toml)',
    host: 'netlify',
    icon: Cloud,
    desc: 'netlify.toml with build settings, API proxy, SPA redirect, and headers.',
    content: `# netlify.toml

[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/api/*"
  to = "https://api.base44.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"`,
    format: 'toml',
  },
];

function TemplatesInner() {
  const [user, setUser] = useState(null);
  const [localMode, setLocalMode] = useState(false);
  const [selected, setSelected] = useState(TEMPLATES[0]);
  const [showEngine, setShowEngine] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) { const u = await base44.auth.me(); setUser(u); }
        else setLocalMode(true);
      } catch { setLocalMode(true); }
    };
    init();
  }, []);

  return (
    <AppShell user={user} localMode={localMode}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Templates Library</h1>
            <p className="text-slate-400 mt-1">Reusable starter templates for each hosting platform. Use them as a base before running the wizard.</p>
          </div>
          <button
            onClick={() => setShowEngine(e => !e)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${showEngine ? 'border-[#73e28a] bg-[#73e28a]/10 text-[#73e28a]' : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}
          >
            <FlaskConical className="w-4 h-4" /> Template Engine
          </button>
        </div>

        {showEngine && (
          <div className="mb-8">
            <TemplateTestRunner />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Template picker */}
          <div className="space-y-2">
            {TEMPLATES.map(t => {
              const Icon = t.icon;
              const active = selected.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${active ? 'border-[#73e28a] bg-[#73e28a]/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-[#73e28a]' : 'text-slate-500'}`} />
                    <div>
                      <p className={`text-sm font-medium ${active ? 'text-[#73e28a]' : 'text-white'}`}>{t.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{t.host}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <p className="text-slate-400 text-sm mb-3">{selected.desc}</p>
            <OutputBlock title={selected.label} content={selected.content} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function MATemplates() {
  return <ToastProvider><TemplatesInner /></ToastProvider>;
}