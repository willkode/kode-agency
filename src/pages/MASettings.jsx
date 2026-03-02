import React, { useEffect, useState } from 'react';
import AppShell from '@/components/migration-assistant/layout/AppShell';
import { ToastProvider, useToast } from '@/components/migration-assistant/lib/toast';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { User, LogOut, Info } from 'lucide-react';

function SettingsInner() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [localMode, setLocalMode] = useState(false);

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

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  return (
    <AppShell user={user} localMode={localMode}>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Account and app preferences.</p>
        </div>

        {/* Account */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-slate-400" /> Account
          </h2>
          {localMode ? (
            <div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm mb-4">
                <Info className="w-4 h-4 flex-shrink-0" />
                You are in Local Mode. Sign in to save projects to the cloud.
              </div>
              <Button onClick={handleLogin} className="bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold">
                Sign In
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Name</span>
                <span className="text-white text-sm">{user?.full_name || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Email</span>
                <span className="text-white text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Role</span>
                <span className="text-white text-sm">{user?.role || 'user'}</span>
              </div>
              <div className="pt-2">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500/50 gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-slate-400" /> About
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Product</span><span className="text-white">Frontend Migration Assistant</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Version</span><span className="text-white">1.0.0</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Platform</span><span className="text-white">Base44</span></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function MASettings() {
  return <ToastProvider><SettingsInner /></ToastProvider>;
}