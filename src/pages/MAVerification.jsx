import React, { useEffect, useState } from 'react';
import AppShell from '@/components/migration-assistant/layout/AppShell';
import { ToastProvider, useToast } from '@/components/migration-assistant/lib/toast';
import { VerificationRepo } from '@/components/migration-assistant/lib/repository';
import { base44 } from '@/api/base44Client';
import { CheckCircle, XCircle, Clock, ShieldCheck, Download } from 'lucide-react';

const STATUS_CONFIG = {
  passed:      { icon: CheckCircle, color: 'text-[#73e28a]', bg: 'bg-[#73e28a]/10 border-[#73e28a]/30' },
  failed:      { icon: XCircle,     color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30' },
  partial:     { icon: Clock,       color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  in_progress: { icon: Clock,       color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30' },
};

function VerificationInner() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [localMode, setLocalMode] = useState(false);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) { const u = await base44.auth.me(); setUser(u); }
        else setLocalMode(true);
      } catch { setLocalMode(true); }
      try {
        // list all runs (no project filter at top level)
        const r = await base44.entities.VerificationRun.filter({ deleted_at: null }, '-created_date', 50);
        setRuns(r);
      } catch { toast.error('Failed to load verification runs.'); }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AppShell user={user} localMode={localMode}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Verification Runs</h1>
          <p className="text-slate-400 mt-1">History of all verification runs across your migration profiles.</p>
        </div>

        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : runs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
            <ShieldCheck className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No verification runs yet.</p>
            <p className="text-slate-600 text-xs mt-1">Complete a migration profile wizard to start a verification run.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {runs.map(run => {
              const cfg = STATUS_CONFIG[run.status] || STATUS_CONFIG.in_progress;
              const Icon = cfg.icon;
              const isOpen = expanded === run.id;
              return (
                <div key={run.id} className={`border rounded-xl overflow-hidden ${cfg.bg}`}>
                  <button
                    className="w-full flex items-center justify-between px-5 py-4"
                    onClick={() => setExpanded(isOpen ? null : run.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">Run #{run.id?.slice(-6)}</p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {run.passed_count ?? 0} passed · {run.failed_count ?? 0} failed · {run.total_checks ?? 0} total
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${cfg.color}`}>{run.status}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-700/30">
                      {Array.isArray(run.checks) && run.checks.length > 0 ? (
                        <div className="mt-4 space-y-2">
                          {run.checks.map((c, i) => (
                            <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-0">
                              {c.passed
                                ? <CheckCircle className="w-4 h-4 text-[#73e28a] mt-0.5 flex-shrink-0" />
                                : <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                              <div className="min-w-0">
                                <p className="text-slate-200 text-sm">{c.title}</p>
                                {c.notes && <p className="text-slate-500 text-xs mt-0.5">{c.notes}</p>}
                                {c.evidence && (
                                  <pre className="mt-1 text-xs text-slate-400 bg-slate-950 rounded p-2 overflow-x-auto whitespace-pre-wrap max-h-20">{c.evidence}</pre>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-slate-500 text-sm mt-4">No checks recorded.</p>}
                      {run.log && (
                        <p className="text-slate-600 text-xs mt-3">{run.log}</p>
                      )}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => downloadReport(run)}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#73e28a] transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Export Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function MAVerification() {
  return <ToastProvider><VerificationInner /></ToastProvider>;
}