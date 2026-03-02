import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepAppConfig({ profile, onChange }) {
  const field = (label, key, placeholder, helpText, required = false) => (
    <div>
      <Label className="text-slate-300 font-medium mb-1 block">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Input
        value={profile[key] || ''}
        onChange={(e) => onChange({ [key]: e.target.value })}
        placeholder={placeholder}
        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#73e28a]"
      />
      {helpText && <p className="text-slate-500 text-xs mt-1">{helpText}</p>}
    </div>
  );

  const toggle = (label, key, helpText) => (
    <div className="flex items-start gap-4">
      <button
        onClick={() => onChange({ [key]: !profile[key] })}
        className={`mt-1 w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
          profile[key] ? 'bg-[#73e28a]' : 'bg-slate-600'
        }`}
      >
        <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${profile[key] ? 'translate-x-4' : ''}`} />
      </button>
      <div>
        <p className="text-slate-300 font-medium text-sm">{label}</p>
        {helpText && <p className="text-slate-500 text-xs mt-0.5">{helpText}</p>}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">App Configuration</h2>
      <p className="text-slate-400 mb-8">Tell us about your Base44 app. These values will be injected into your generated configs.</p>

      <div className="space-y-5">
        {field('App Name', 'app_name', 'my-app', 'Used for file names and comments in generated configs.', true)}
        {field(
          'Base44 API Base URL',
          'base44_api_base_url',
          'https://api.base44.com/api/apps/YOUR_APP_ID',
          'Paste your Base44 backend API URL. Found in your Base44 dashboard under API settings.',
          true
        )}
        {field(
          'Frontend Domain (after migration)',
          'frontend_domain',
          'https://app.yourdomain.com',
          'The domain where your self-hosted frontend will live.',
          true
        )}
        {field(
          'Base44 App ID',
          'base44_app_id',
          'abc123xyz',
          'Optional. Used in health_ping function template and Worker proxy.'
        )}
        {field(
          'Allowed CORS Origins (comma-separated)',
          'cors_origins',
          'https://app.yourdomain.com, https://yourdomain.com',
          'These will be added to CORS headers in your health endpoint template.'
        )}
        {field(
          'Custom Domain (if any)',
          'custom_domain',
          'yourdomain.com',
          'Used to generate Cloudflare / Vercel domain binding config.'
        )}

        <div className="pt-2 space-y-4">
          {toggle('App uses Base44 authentication', 'auth_enabled', 'Adds auth redirect config to your SPA rewrite rules.')}
          {toggle('App uses Stripe', 'stripe_used', 'Adds STRIPE_PUBLISHABLE_KEY to your env var checklist.')}
        </div>
      </div>
    </div>
  );
}