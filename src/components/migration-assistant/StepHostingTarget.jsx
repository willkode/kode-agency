import React from 'react';
import { Server, Globe, Zap, Cloud } from 'lucide-react';

const TARGETS = [
  { id: 'nginx', label: 'Nginx', icon: Server, desc: 'Self-hosted VPS. Full control over server config, ideal for custom domains and SSL.' },
  { id: 'cloudflare', label: 'Cloudflare Pages', icon: Globe, desc: 'Edge-deployed SPA with built-in CI/CD from GitHub. Includes Cloudflare Worker support.' },
  { id: 'vercel', label: 'Vercel', icon: Zap, desc: 'Instant deploys from GitHub. Best for React SPAs with optional serverless functions.' },
  { id: 'netlify', label: 'Netlify', icon: Cloud, desc: 'Simple drag-and-drop or Git-based deploys. Built-in redirect rules and env var management.' },
];

export default function StepHostingTarget({ profile, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Select Your Hosting Target</h2>
      <p className="text-slate-400 mb-8">Where will you host your exported Base44 frontend? We'll generate platform-specific configs.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {TARGETS.map((t) => {
          const Icon = t.icon;
          const selected = profile.hosting_target === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange({ hosting_target: t.id })}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                selected ? 'border-[#73e28a] bg-[#73e28a]/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selected ? 'bg-[#73e28a]/20 text-[#73e28a]' : 'bg-slate-700 text-slate-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className={`font-bold mb-1 ${selected ? 'text-[#73e28a]' : 'text-white'}`}>{t.label}</p>
              <p className="text-slate-400 text-sm">{t.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}