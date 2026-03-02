import React, { useEffect, useState } from 'react';
import AppShell from '@/components/migration-assistant/layout/AppShell';
import { ToastProvider } from '@/components/migration-assistant/lib/toast';
import { ProjectRepo, VerificationRepo } from '@/components/migration-assistant/lib/repository';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { FolderOpen, ShieldCheck, ArrowRight, Plus } from 'lucide-react';

export default function MADashboard() {
  const [user, setUser] = useState(null);
  const [localMode, setLocalMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const u = await base44.auth.me();
          setUser(u);
        } else {
          setLocalMode(true);
        }
      } catch {
        setLocalMode(true);
      }
      try {
        const [p, r] = await Promise.all([ProjectRepo.list(), VerificationRepo.listByProject && []]);
        setProjects(p.slice(0, 5));
      } catch {}
      setLoading(false);
    };
    init();
  }, []);

  const stats = [
    { label: 'Projects', value: projects.length, icon: FolderOpen, color: 'text-[#73e28a]', page: 'MAProjects' },
    { label: 'Verification Runs', value: runs.length, icon: ShieldCheck, color: 'text-blue-400', page: 'MAVerification' },
  ];

  return (
    <ToastProvider>
      <AppShell user={user} localMode={localMode}>
        <div className="p-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Overview of your migration projects and activity.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map(s => (
              <Link key={s.label} to={createPageUrl(s.page)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
              >
                <s.icon className={`w-6 h-6 mb-3 ${s.color}`} />
                <p className="text-3xl font-bold text-white">{loading ? '—' : s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </Link>
            ))}
          </div>

          {/* Recent Projects */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Recent Projects</h2>
              <Link to={createPageUrl('MAProjects')} className="text-[#73e28a] text-sm flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {loading ? (
              <p className="text-slate-500 text-sm">Loading…</p>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm mb-3">No projects yet.</p>
                <Link to={createPageUrl('MAProjects')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#73e28a] text-black text-sm font-bold rounded-lg"
                >
                  <Plus className="w-4 h-4" /> Create your first project
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {projects.map(p => (
                  <Link key={p.id} to={`${createPageUrl('MAProjectDetail')}?id=${p.id}`}
                    className="flex items-center justify-between py-3 hover:text-[#73e28a] transition-colors group"
                  >
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-[#73e28a]">{p.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{p.status}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#73e28a]" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </ToastProvider>
  );
}