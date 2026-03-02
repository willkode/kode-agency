import React, { useState } from 'react';
import { generateOutputs } from './generator.js';
import OutputBlock from './OutputBlock.jsx';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const TABS = [
  { id: 'spa_config', label: 'SPA Config' },
  { id: 'env_vars', label: 'Env Vars' },
  { id: 'health_endpoint', label: 'Health Endpoint' },
  { id: 'health_ping', label: 'Base44 health_ping' },
  { id: 'worker_proxy', label: 'CF Worker Proxy' },
  { id: 'verification', label: 'Verification Plan' },
  { id: 'failure_modes', label: 'Failure Modes' },
];

export default function StepOutputs({ profile }) {
  const [activeTab, setActiveTab] = useState('spa_config');
  const outputs = generateOutputs(profile);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Generated Outputs</h2>
      <p className="text-slate-400 mb-6">All outputs are copy-paste ready. Use the tabs to navigate between sections.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <span className="px-3 py-1 rounded-full bg-[#73e28a]/10 border border-[#73e28a]/30 text-[#73e28a] text-xs font-medium">
          {profile.hosting_target?.toUpperCase()}
        </span>
        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">{profile.app_name}</span>
        {profile.auth_enabled && <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">Auth enabled</span>}
        {profile.stripe_used && <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">Stripe</span>}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-[#73e28a] text-black' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'verification' ? (
        <VerificationPanel items={outputs.verification} />
      ) : activeTab === 'failure_modes' ? (
        <FailureModesPanel items={outputs.failure_modes} />
      ) : (
        <OutputBlock title={TABS.find(t => t.id === activeTab)?.label} content={outputs[activeTab]} />
      )}
    </div>
  );
}

function VerificationPanel({ items }) {
  const [checked, setChecked] = useState({});
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm mb-4">Check off each step as you complete it.</p>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
          className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${
            checked[i] ? 'border-[#73e28a]/50 bg-[#73e28a]/5' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${checked[i] ? 'text-[#73e28a]' : 'text-slate-600'}`} />
          <div>
            <p className={`font-medium text-sm ${checked[i] ? 'text-[#73e28a] line-through' : 'text-white'}`}>{item.title}</p>
            <p className="text-slate-400 text-sm mt-0.5">{item.detail}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function FailureModesPanel({ items }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm mb-4">Most common issues when self-hosting. Review before going live.</p>
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-white text-sm">{item.title}</p>
              <p className="text-slate-400 text-sm mt-1">{item.cause}</p>
              <p className="text-[#73e28a] text-sm mt-2 font-medium">Fix: {item.fix}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}