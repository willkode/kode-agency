import React, { useState } from 'react';
import { AlertTriangle, Terminal, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const FRAMEWORKS = [
  { id: 'vite_react', label: 'Vite / React' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'other', label: 'Other' },
];

const HOSTING_TARGETS = [
  { id: 'nginx', label: 'Nginx Server' },
  { id: 'cloudflare', label: 'Cloudflare Pages' },
  { id: 'vercel', label: 'Vercel' },
  { id: 'netlify', label: 'Netlify' },
];

const PROVISION_METHODS = [
  { id: 'cli_local', label: 'I will run CLI export locally' },
  { id: 'existing_repo', label: 'I already have a repo' },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-slate-400 hover:text-[#73e28a] transition-colors ml-2 flex-shrink-0"
      title="Copy"
    >
      {copied ? <Check className="w-4 h-4 text-[#73e28a]" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function FieldGroup({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-slate-500 text-xs mt-1.5">{hint}</p>}
    </div>
  );
}

function OptionGrid({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map(opt => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
              active
                ? 'border-[#73e28a] bg-[#73e28a]/10 text-[#73e28a]'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function CLIInstructionsPanel({ profile, onChange }) {
  const [open, setOpen] = useState(true);

  const buildOutputPath = profile.build_output_path || '';
  const baseUrl = profile.base_url_assumption || '/';
  const routeType = profile.route_type || 'spa';

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-800/60 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
          <Terminal className="w-4 h-4 text-[#73e28a]" />
          CLI Export Instructions
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="px-5 py-5 bg-slate-900 space-y-5">
          <p className="text-slate-400 text-sm">
            Follow these steps to export your Base44 frontend locally.
          </p>

          {/* Steps */}
          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">1</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Install the Base44 CLI</span>
                <div className="mt-2 flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-2 font-mono text-xs">
                  <code className="text-[#73e28a] flex-1">npm install -g @base44/cli</code>
                  <CopyButton text="npm install -g @base44/cli" />
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">2</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Log in to your Base44 account</span>
                <div className="mt-2 flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-2 font-mono text-xs">
                  <code className="text-[#73e28a] flex-1">base44 login</code>
                  <CopyButton text="base44 login" />
                </div>
                <p className="text-slate-500 text-xs mt-1">This will open a browser window for authentication.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">3</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Export your app's frontend</span>
                <div className="mt-2 flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-2 font-mono text-xs">
                  <code className="text-[#73e28a] flex-1">base44 export --app {profile.base44_app_id || '<APP_ID>'}</code>
                  <CopyButton text={`base44 export --app ${profile.base44_app_id || '<APP_ID>'}`} />
                </div>
                <p className="text-slate-500 text-xs mt-1">This creates a folder with your frontend source code.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">4</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Navigate to the exported folder and install dependencies</span>
                <div className="mt-2 flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-2 font-mono text-xs">
                  <code className="text-[#73e28a] flex-1">cd my-app && npm install</code>
                  <CopyButton text="cd my-app && npm install" />
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">5</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Create your .env file with required variables</span>
                <p className="text-slate-500 text-xs mt-1">Copy the environment variables from the "Host Presets" step later in this wizard.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">6</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Build the production bundle</span>
                <div className="mt-2 flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-2 font-mono text-xs">
                  <code className="text-[#73e28a] flex-1">npm run build</code>
                  <CopyButton text="npm run build" />
                </div>
                <p className="text-slate-500 text-xs mt-1">Output will be in the <code className="bg-slate-800 px-1 rounded">dist/</code> folder (Vite) or <code className="bg-slate-800 px-1 rounded">out/</code> folder (Next.js).</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">7</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Deploy to your hosting platform</span>
                <p className="text-slate-500 text-xs mt-1">Upload the build output to your chosen host (Vercel, Netlify, Cloudflare, or Nginx).</p>
              </div>
            </li>
          </ol>

          <div className="border-t border-slate-700 pt-5 space-y-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Optional: Provide your values</p>

            {/* Build output path */}
            <div>
              <label className="text-slate-300 text-xs font-medium block mb-1">
                Build output path <span className="text-slate-500">(e.g. ./dist, ./out)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a] font-mono"
                  placeholder="./dist"
                  value={buildOutputPath}
                  onChange={e => onChange({ build_output_path: e.target.value })}
                />
                <CopyButton text={buildOutputPath} />
              </div>
            </div>

            {/* Base URL */}
            <div>
              <label className="text-slate-300 text-xs font-medium block mb-1">
                Base URL assumption <span className="text-slate-500">(e.g. / or /app)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a] font-mono"
                  placeholder="/"
                  value={baseUrl}
                  onChange={e => onChange({ base_url_assumption: e.target.value })}
                />
                <CopyButton text={baseUrl} />
              </div>
            </div>

            {/* Route type */}
            <div>
              <label className="text-slate-300 text-xs font-medium block mb-1.5">Route type</label>
              <div className="flex gap-3">
                {[
                  { id: 'spa', label: 'SPA (client-side routing)' },
                  { id: 'ssr', label: 'SSR (server-side rendering)' },
                ].map(opt => {
                  const active = routeType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChange({ route_type: opt.id })}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        active
                          ? 'border-[#73e28a] bg-[#73e28a]/10 text-[#73e28a]'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExistingRepoInstructionsPanel({ profile, onChange }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-800/60 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
          <Terminal className="w-4 h-4 text-[#73e28a]" />
          Make Your Repo Public for Scanning
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="px-5 py-5 bg-slate-900 space-y-5">
          <p className="text-slate-400 text-sm">
            To scan your repository, it needs to be publicly accessible on GitHub. Follow these steps to make it public:
          </p>

          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">1</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Go to your GitHub repository</span>
                <p className="text-slate-500 text-xs mt-1">Navigate to <code className="bg-slate-800 px-1 rounded">github.com/your-username/your-repo</code></p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">2</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Click "Settings" in the repository menu</span>
                <p className="text-slate-500 text-xs mt-1">It's in the top navigation bar of your repo (you need admin access).</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">3</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Scroll down to the "Danger Zone" section</span>
                <p className="text-slate-500 text-xs mt-1">At the bottom of the General settings page.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">4</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Click "Change repository visibility"</span>
                <p className="text-slate-500 text-xs mt-1">Then select "Make public" and confirm.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73e28a]/20 text-[#73e28a] text-xs flex items-center justify-center font-bold">5</span>
              <div className="flex-1">
                <span className="text-slate-200 font-medium">Copy your public repo URL</span>
                <p className="text-slate-500 text-xs mt-1">Example: <code className="bg-slate-800 px-1 rounded">https://github.com/username/repo-name</code></p>
              </div>
            </li>
          </ol>

          <div className="border-t border-slate-700 pt-5 space-y-4">
            <div className="flex gap-3 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-yellow-300 text-sm">
                <span className="font-semibold">Security Note:</span> Making your repo public means anyone can view your code. Ensure you don't have any secrets, API keys, or sensitive data committed to the repository. Use environment variables for sensitive values.
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs font-medium block mb-1">
                GitHub Repository URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a] font-mono"
                  placeholder="https://github.com/username/repo-name"
                  value={profile.github_repo_url || ''}
                  onChange={e => onChange({ github_repo_url: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepProjectIntake({ profile, onChange }) {
  const isNextJs = profile.framework === 'nextjs';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Project Intake</h2>
        <p className="text-slate-400 text-sm mt-1">Tell us about your project so we can generate the right configs.</p>
      </div>

      {/* Project name */}
      <FieldGroup label="Project Name" required>
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a]"
          placeholder="My App"
          value={profile.project_name || ''}
          onChange={e => onChange({ project_name: e.target.value })}
        />
      </FieldGroup>

      {/* Base44 App ID */}
      <FieldGroup label="Base44 App ID" hint="Found in your Base44 dashboard under App Settings → App ID.">
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a] font-mono"
          placeholder="app_xxxxxxxxxxxxxxxx"
          value={profile.base44_app_id || ''}
          onChange={e => onChange({ base44_app_id: e.target.value })}
        />
      </FieldGroup>

      {/* Frontend framework */}
      <FieldGroup label="Frontend Framework" required>
        <OptionGrid
          options={FRAMEWORKS}
          value={profile.framework || ''}
          onChange={val => onChange({ framework: val })}
        />
      </FieldGroup>

      {/* Next.js warning */}
      {isNextJs && (
        <div className="flex gap-3 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-300 text-sm">
            <span className="font-semibold">Next.js detected.</span> SSR behavior differs from a standard SPA — server-side routes won't resolve via a plain static file server. Worker injection will default to <code className="bg-yellow-500/20 px-1 rounded">script inject</code> mode. Ensure your hosting target supports Node.js or edge runtimes, or consider exporting as a fully static site (<code className="bg-yellow-500/20 px-1 rounded">next export</code>).
          </p>
        </div>
      )}

      {/* Hosting intent */}
      <FieldGroup label="Hosting Intent" required>
        <OptionGrid
          options={HOSTING_TARGETS}
          value={profile.hosting_target || ''}
          onChange={val => onChange({ hosting_target: val })}
        />
      </FieldGroup>

      {/* How you will provide the frontend */}
      <FieldGroup label="How will you provide the frontend?" required>
        <OptionGrid
          options={PROVISION_METHODS}
          value={profile.provision_method || ''}
          onChange={val => onChange({ provision_method: val })}
        />
      </FieldGroup>

      {/* CLI panel — shown when cli_local selected */}
      {profile.provision_method === 'cli_local' && (
        <CLIInstructionsPanel profile={profile} onChange={onChange} />
      )}

      {/* Existing repo panel — shown when existing_repo selected */}
      {profile.provision_method === 'existing_repo' && (
        <ExistingRepoInstructionsPanel profile={profile} onChange={onChange} />
      )}
    </div>
  );
}