// AppShell — sidebar nav + top header wrapper for the Migration Assistant app
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard, FolderOpen, Layers, ShieldCheck, Settings, Menu, X, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', page: 'MADashboard', icon: LayoutDashboard },
  { label: 'Projects', page: 'MAProjects', icon: FolderOpen },
  { label: 'Templates', page: 'MATemplates', icon: Layers },
  { label: 'Verification Runs', page: 'MAVerification', icon: ShieldCheck },
  { label: 'Settings', page: 'MASettings', icon: Settings },
];

export default function AppShell({ children, user, localMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300',
          sidebarOpen ? 'w-60' : 'w-16',
          'lg:relative lg:w-60 lg:flex'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-[#73e28a] flex items-center justify-center flex-shrink-0">
            <ChevronRight className="w-4 h-4 text-black font-black" />
          </div>
          <span className={cn('text-white font-bold text-sm whitespace-nowrap transition-all', !sidebarOpen && 'lg:block hidden')}>
            Migration<br /><span className="text-[#73e28a]">Assistant</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {NAV.map(({ label, page, icon: Icon }) => {
            const active = location.pathname.includes(page);
            return (
              <Link
                key={page}
                to={createPageUrl(page)}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#73e28a] text-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={cn('whitespace-nowrap', !sidebarOpen && 'lg:block hidden')}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className={cn('flex items-center gap-2', !sidebarOpen && 'lg:flex hidden')}>
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 flex-shrink-0">
              {user?.full_name?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-slate-400 text-xs truncate">{user?.email || 'Local Mode'}</span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center gap-4 px-6 border-b border-slate-800 bg-slate-900 flex-shrink-0">
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {localMode && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Local Mode — changes will not be saved to the cloud
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            {user && (
              <span className="text-slate-400 text-sm hidden sm:block">{user.full_name || user.email}</span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}