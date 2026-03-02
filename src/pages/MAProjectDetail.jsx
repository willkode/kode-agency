import React, { useEffect, useState } from 'react';
import AppShell from '@/components/migration-assistant/layout/AppShell';
import { ToastProvider, useToast } from '@/components/migration-assistant/lib/toast';
import { ProjectRepo, ProfileRepo } from '@/components/migration-assistant/lib/repository';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Lock, Unlock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MigrationWizard from '@/components/migration-assistant/MigrationWizard.jsx';

function ProjectDetailInner() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [localMode, setLocalMode] = useState(false);
  const [project, setProject] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  const projectId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) { const u = await base44.auth.me(); setUser(u); }
        else setLocalMode(true);
      } catch { setLocalMode(true); }
      if (projectId) await load();
      else setLoading(false);
    };
    init();
  }, [projectId]);

  const load = async () => {
    setLoading(true);
    try {
      const [proj, profs] = await Promise.all([
        ProjectRepo.get(projectId),
        ProfileRepo.listByProject(projectId),
      ]);
      setProject(proj);
      setProfiles(profs);
    } catch { toast.error('Failed to load project.'); }
    setLoading(false);
  };

  const handleDeleteProfile = async (id, label) => {
    if (!window.confirm(`Delete profile "${label}"?`)) return;
    try {
      await ProfileRepo.softDelete(id);
      toast.success('Profile deleted.');
      await load();
    } catch { toast.error('Failed to delete profile.'); }
  };

  const handleSnapshot = async (id) => {
    try {
      await ProfileRepo.snapshot(id);
      toast.success('Profile locked as snapshot.');
      await load();
    } catch { toast.error('Failed to lock profile.'); }
  };

  if (!projectId) return (
    <AppShell user={user} localMode={localMode}>
      <div className="p-6">
        <p className="text-slate-400">No project ID provided.</p>
        <Link to={createPageUrl('MAProjects')} className="text-[#73e28a] text-sm mt-2 inline-block">← Back to Projects</Link>
      </div>
    </AppShell>
  );

  return (
    <AppShell user={user} localMode={localMode}>
      <div className="p-6 max-w-5xl mx-auto">
        <Link to={createPageUrl('MAProjects')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {loading ? <p className="text-slate-500">Loading…</p> : !project ? (
          <p className="text-slate-400">Project not found.</p>
        ) : (
          <>
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                {project.description && <p className="text-slate-400 mt-1 text-sm">{project.description}</p>}
              </div>
              <Button onClick={() => setShowWizard(true)} className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold gap-2">
                <Plus className="w-4 h-4" /> New Profile
              </Button>
            </div>

            {/* Wizard overlay */}
            {showWizard && (
              <div className="mb-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
                <MigrationWizard onReset={() => { setShowWizard(false); load(); }} projectId={projectId} />
              </div>
            )}

            {/* Profiles */}
            <h2 className="text-white font-semibold mb-3">Migration Profiles</h2>
            {profiles.length === 0 ? (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm">No profiles yet. Click "New Profile" to create one via the wizard.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {profiles.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-white text-sm font-medium">{p.label || p.app_name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{p.hosting_target} · {p.frontend_domain}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.is_snapshot ? (
                        <span className="flex items-center gap-1 text-xs text-yellow-400"><Lock className="w-3 h-3" /> Snapshot</span>
                      ) : (
                        <button onClick={() => handleSnapshot(p.id)} className="text-slate-500 hover:text-yellow-400 transition-colors" title="Lock as snapshot">
                          <Unlock className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDeleteProfile(p.id, p.label || p.app_name)} className="text-slate-600 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function MAProjectDetail() {
  return <ToastProvider><ProjectDetailInner /></ToastProvider>;
}