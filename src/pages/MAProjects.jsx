import React, { useEffect, useState } from 'react';
import AppShell from '@/components/migration-assistant/layout/AppShell';
import { ToastProvider, useToast } from '@/components/migration-assistant/lib/toast';
import { ProjectRepo } from '@/components/migration-assistant/lib/repository';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ProjectsInner() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [localMode, setLocalMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) { const u = await base44.auth.me(); setUser(u); }
        else setLocalMode(true);
      } catch { setLocalMode(true); }
      await load();
    };
    init();
  }, []);

  const load = async () => {
    setLoading(true);
    try { setProjects(await ProjectRepo.list()); }
    catch { toast.error('Failed to load projects.'); }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) { toast.warn('Project name is required.'); return; }
    setSaving(true);
    try {
      await ProjectRepo.create({ name: newName.trim(), description: newDesc.trim(), owner_email: user?.email || 'local' });
      toast.success('Project created.');
      setShowNew(false); setNewName(''); setNewDesc('');
      await load();
    } catch { toast.error('Failed to create project.'); }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete project "${name}"? This cannot be undone.`)) return;
    try {
      await ProjectRepo.softDelete(id);
      toast.success('Project deleted.');
      await load();
    } catch { toast.error('Failed to delete project.'); }
  };

  const STATUS_COLOR = { active: 'text-[#73e28a]', archived: 'text-slate-400', completed: 'text-blue-400' };

  return (
    <AppShell user={user} localMode={localMode}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-slate-400 mt-1">Each project contains migration profiles and verification runs.</p>
          </div>
          <Button onClick={() => setShowNew(true)} className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>

        {/* New project form */}
        {showNew && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">New Project</h3>
            <div className="space-y-3">
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a]"
                placeholder="Project name *"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <textarea
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#73e28a] h-20 resize-none"
                placeholder="Description (optional)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
              <div className="flex gap-3">
                <Button onClick={handleCreate} disabled={saving} className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold">
                  {saving ? 'Saving…' : 'Create'}
                </Button>
                <Button variant="outline" onClick={() => { setShowNew(false); setNewName(''); setNewDesc(''); }}
                  className="border-slate-700 text-slate-300 hover:text-white">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Project list */}
        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
            <FolderOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 mb-1">No projects yet.</p>
            <p className="text-slate-600 text-sm">Click "New Project" to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {projects.map(p => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link to={`${createPageUrl('MAProjectDetail')}?id=${p.id}`}
                    className="text-white font-medium hover:text-[#73e28a] transition-colors block truncate"
                  >
                    {p.name}
                  </Link>
                  {p.description && <p className="text-slate-500 text-xs mt-0.5 truncate">{p.description}</p>}
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className={`text-xs font-medium ${STATUS_COLOR[p.status] || 'text-slate-400'}`}>
                    {p.status}
                  </span>
                  <button onClick={() => handleDelete(p.id, p.name)} className="text-slate-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link to={`${createPageUrl('MAProjectDetail')}?id=${p.id}`} className="text-slate-600 hover:text-[#73e28a]">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function MAProjects() {
  return <ToastProvider><ProjectsInner /></ToastProvider>;
}