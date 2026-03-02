import React, { useState, useEffect } from 'react';
import { ArtifactRepo } from './lib/repository';
import { getAllTemplates } from './lib/templateEngine';
import { Copy, Check, ChevronDown, ChevronUp, Clock, AlertTriangle } from 'lucide-react';

const LANG_LABELS = {
  nginx: 'nginx', javascript: 'js', toml: 'toml', json: 'json',
  shell: 'sh', text: 'txt', typescript: 'ts',
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-[#73e28a]" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function ArtifactRow({ artifact }) {
  const [open, setOpen] = useState(false);

  const langLabel = LANG_LABELS[artifact.content_format] || artifact.content_format || '—';
  const template = getAllTemplates().find(t => t.id === artifact.artifact_type || t.name === artifact.artifact_type);

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-800 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-700 text-slate-300 flex-shrink-0">{langLabel}</span>
          <span className="text-white text-sm font-medium truncate">
            {template?.name || artifact.artifact_type}
          </span>
          {artifact.generator_version && (
            <span className="text-slate-600 text-xs flex-shrink-0">v{artifact.generator_version}</span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          <span className="text-slate-500 text-xs hidden sm:block">
            {artifact.created_date ? new Date(artifact.created_date).toLocaleDateString() : '—'}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="bg-slate-900 border-t border-slate-700/50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {artifact.created_date ? new Date(artifact.created_date).toLocaleString() : 'Unknown'}
              {artifact.generator_version && <span>· engine v{artifact.generator_version}</span>}
            </div>
            <CopyBtn text={artifact.content} />
          </div>
          <pre className="p-4 text-xs text-slate-300 overflow-x-auto leading-relaxed font-mono whitespace-pre max-h-80">{artifact.content}</pre>
        </div>
      )}
    </div>
  );
}

export default function ArtifactsHistory({ profileId }) {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!profileId) { setLoading(false); return; }
    ArtifactRepo.listByProfile(profileId)
      .then(setArtifacts)
      .finally(() => setLoading(false));
  }, [profileId]);

  const formats = ['all', ...new Set(artifacts.map(a => a.content_format).filter(Boolean))];

  const filtered = filter === 'all'
    ? artifacts
    : artifacts.filter(a => a.content_format === filter);

  if (!profileId) return (
    <div className="text-center py-10 text-slate-500 text-sm">
      Save a profile draft first to track generated artifacts.
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-white font-semibold text-sm">Generated Artifacts</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            {artifacts.length} artifact{artifacts.length !== 1 ? 's' : ''} saved for this profile
          </p>
        </div>
        {formats.length > 1 && (
          <div className="flex gap-1.5 flex-wrap">
            {formats.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filter === f ? 'bg-[#73e28a] text-black' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 border border-slate-800 rounded-xl">
          <AlertTriangle className="w-6 h-6 text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No artifacts yet.</p>
          <p className="text-slate-600 text-xs mt-1">Navigate through the wizard steps to generate artifacts.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(a => <ArtifactRow key={a.id} artifact={a} />)}
        </div>
      )}
    </div>
  );
}